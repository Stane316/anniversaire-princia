/**
 * Accès IndexedDB — couche de données (doc 03 §9.4, §9.7).
 * Les composants React n'accèdent jamais directement à IndexedDB :
 * ils passent par les dépôts de `repositories.ts`.
 *
 * Garanties :
 * - schéma versionné explicite (`DB_NAME`, `DB_VERSION`) avec migration
 *   non destructive (`applySchemaUpgrade`) qui ne supprime jamais les
 *   objectStores existants lors d'une montée de version ;
 * - demande discrète de persistance durable (`navigator.storage.persist`)
 *   lorsque le navigateur le supporte ;
 * - repli automatique contrôlé sur `localStorage` (`princia.chapter18.fallback.*`)
 *   si IndexedDB est absent ou désactivé par le navigateur ;
 * - si aucun stockage n'est accessible ou si l'écriture échoue (quota,
 *   stockage verrouillé), levée d'une `StorageError` explicite pour que
 *   l'interface informe l'utilisatrice sans fausse confirmation.
 */

export const DB_NAME = "princia-chapter-18";
export const DB_VERSION = 1;

export const STORES = {
  books: "books",
  tasks: "tasks",
  wins: "wins",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

const FALLBACK_PREFIX = "princia.chapter18.fallback.";

export class StorageError extends Error {
  constructor(cause?: unknown) {
    super(
      "Les données n'ont pas pu être enregistrées sur cet appareil. Réessaie dans un instant.",
    );
    this.name = "StorageError";
    if (cause instanceof Error) this.cause = cause;
  }
}

/**
 * Applique les migrations de schéma IndexedDB de manière additive et
 * non destructive : une mise à jour de version ne vide jamais les
 * données déjà enregistrées par Princia.
 */
export function applySchemaUpgrade(
  db: IDBDatabase,
  oldVersion: number,
  _newVersion: number | null = DB_VERSION,
): void {
  if (oldVersion < 1) {
    for (const name of Object.values(STORES)) {
      if (!db.objectStoreNames.contains(name)) {
        db.createObjectStore(name, { keyPath: "id" });
      }
    }
  } else {
    // Sécurité supplémentaire : même si oldVersion >= 1, s'assurer que
    // les trois magasins existent sans toucher à leur contenu.
    for (const name of Object.values(STORES)) {
      if (!db.objectStoreNames.contains(name)) {
        db.createObjectStore(name, { keyPath: "id" });
      }
    }
  }
}

let dbPromise: Promise<IDBDatabase> | null = null;
let persistenceRequested = false;

function requestDurableStorage(): void {
  if (persistenceRequested) return;
  persistenceRequested = true;
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.storage &&
      typeof navigator.storage.persist === "function"
    ) {
      void navigator.storage.persist().catch(() => {
        /* non bloquant */
      });
    }
  } catch {
    /* non bloquant */
  }
}

function getStorageFallback(): Storage | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

function readFallbackList<T extends { id: string }>(store: StoreName): T[] {
  const storage = getStorageFallback();
  if (!storage) {
    throw new StorageError();
  }
  try {
    const raw = storage.getItem(`${FALLBACK_PREFIX}${store}`);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is T =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { id?: unknown }).id === "string",
    );
  } catch (err) {
    throw new StorageError(err);
  }
}

function writeFallbackList<T extends { id: string }>(
  store: StoreName,
  items: T[],
): void {
  const storage = getStorageFallback();
  if (!storage) {
    throw new StorageError();
  }
  try {
    storage.setItem(`${FALLBACK_PREFIX}${store}`, JSON.stringify(items));
  } catch (err) {
    throw new StorageError(err);
  }
}

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  requestDurableStorage();
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined" || indexedDB === null) {
      reject(new StorageError());
      return;
    }
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      reject(new StorageError(err));
      return;
    }
    request.onupgradeneeded = (event) => {
      const db = request.result;
      applySchemaUpgrade(db, event.oldVersion, event.newVersion);
    };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    request.onerror = () => reject(new StorageError(request.error));
    request.onblocked = () => reject(new StorageError());
  });
  // En cas d'échec, autoriser une nouvelle tentative au prochain appel.
  dbPromise.catch(() => {
    dbPromise = null;
  });
  return dbPromise;
}

function run<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  op: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        let tx: IDBTransaction;
        try {
          tx = db.transaction(store, mode);
        } catch (err) {
          dbPromise = null;
          reject(new StorageError(err));
          return;
        }
        const request = op(tx.objectStore(store));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new StorageError(request.error));
        tx.onerror = () => reject(new StorageError(tx.error));
        tx.onabort = () => reject(new StorageError(tx.error));
      }),
  );
}

export const localStore = {
  async getAll<T extends { id: string }>(store: StoreName): Promise<T[]> {
    try {
      return await (run(store, "readonly", (s) => s.getAll()) as Promise<T[]>);
    } catch (err) {
      if (getStorageFallback()) {
        return readFallbackList<T>(store);
      }
      throw err instanceof StorageError ? err : new StorageError(err);
    }
  },
  async put<T extends { id: string }>(
    store: StoreName,
    value: T,
  ): Promise<void> {
    if (!value || typeof value.id !== "string" || value.id.trim().length === 0) {
      throw new StorageError(new Error("Identifiant d'élément invalide."));
    }
    try {
      await run(store, "readwrite", (s) => s.put(value));
    } catch (err) {
      if (getStorageFallback()) {
        const current = readFallbackList<T>(store);
        const idx = current.findIndex((item) => item.id === value.id);
        if (idx >= 0) {
          current[idx] = value;
        } else {
          current.push(value);
        }
        writeFallbackList(store, current);
        return;
      }
      throw err instanceof StorageError ? err : new StorageError(err);
    }
  },
  async delete(store: StoreName, id: string): Promise<void> {
    try {
      await run(store, "readwrite", (s) => s.delete(id));
    } catch (err) {
      if (getStorageFallback()) {
        const current = readFallbackList<{ id: string }>(store);
        writeFallbackList(
          store,
          current.filter((item) => item.id !== id),
        );
        return;
      }
      throw err instanceof StorageError ? err : new StorageError(err);
    }
  },
  async clear(store: StoreName): Promise<void> {
    try {
      await run(store, "readwrite", (s) => s.clear());
    } catch (err) {
      if (getStorageFallback()) {
        writeFallbackList(store, []);
        return;
      }
      throw err instanceof StorageError ? err : new StorageError(err);
    }
  },
};

/** Réinitialise la connexion en cache (utile pour les tests unitaires). */
export function resetDbConnectionForTests(): void {
  dbPromise = null;
  persistenceRequested = false;
}
