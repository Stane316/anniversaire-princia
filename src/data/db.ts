/**
 * Couche IndexedDB minimale, typée et sans dépendance externe (doc 03 §8).
 *
 * Responsabilités :
 * - ouvrir la base locale `princia-chapter-18` ;
 * - créer et migrer proprement les stores (`books`, `tasks`, `wins`, `proposals`)
 *   sans jamais détruire les données existantes lors d'une montée de version ;
 * - demander au navigateur une persistance durable (`navigator.storage.persist`)
 *   lorsqu'elle est disponible afin de limiter le risque d'éviction automatique ;
 * - fournir un repli automatique en `localStorage` si IndexedDB est indisponible
 *   ou bloqué (ex. certains contextes de navigation privée ou WebView restreints) ;
 * - détecter explicitement les dépassements de quota (`QuotaExceededError`) ;
 * - exposer des opérations CRUD génériques par store et une classe `StorageError`.
 */

export const DB_NAME = "princia-chapter-18";
export const DB_VERSION = 2;

export const STORES = {
  books: "books",
  tasks: "tasks",
  wins: "wins",
  proposals: "proposals",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

const FALLBACK_PREFIX = "princia.chapter18.fallback.";

export class StorageError extends Error {
  readonly code: "QUOTA_EXCEEDED" | "INVALID_KEY" | "UNAVAILABLE" | "IO_ERROR";

  constructor(
    message: string,
    cause?: unknown,
    code: "QUOTA_EXCEEDED" | "INVALID_KEY" | "UNAVAILABLE" | "IO_ERROR" = "IO_ERROR",
  ) {
    super(message);
    this.name = "StorageError";
    this.cause = cause;
    this.code = code;
  }
}

export function isQuotaExceededError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const name = (err as { name?: string }).name ?? "";
  const code = (err as { code?: number }).code;
  return (
    name === "QuotaExceededError" ||
    name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    code === 22 ||
    code === 1014
  );
}

let dbPromise: Promise<IDBDatabase> | null = null;
let persistenceRequested = false;

/**
 * Applique les migrations de schéma IndexedDB de manière non destructive :
 * seuls les objectStores absents sont créés, de sorte que les données déjà
 * enregistrées par Princia sont intégralement préservées lors d'une mise à jour.
 */
export function applySchemaUpgrade(
  db: IDBDatabase,
  _oldVersion: number,
  _newVersion: number | null,
): void {
  for (const storeName of Object.values(STORES)) {
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: "id" });
    }
  }
}

/**
 * Demande de persistance durable au navigateur (non bloquante, silencieuse).
 */
export async function requestDurableStorage(): Promise<boolean> {
  if (persistenceRequested) return false;
  persistenceRequested = true;
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.storage &&
      typeof navigator.storage.persist === "function"
    ) {
      const alreadyPersisted =
        typeof navigator.storage.persisted === "function"
          ? await navigator.storage.persisted()
          : false;
      if (alreadyPersisted) return true;
      return await navigator.storage.persist();
    }
  } catch {
    /* certains navigateurs refusent ou restreignent l'API : jamais bloquant */
  }
  return false;
}

function readFallbackStore<T extends { id: string }>(store: StoreName): T[] {
  try {
    if (typeof window === "undefined" || !window.localStorage) return [];
    const raw = window.localStorage.getItem(`${FALLBACK_PREFIX}${store}`);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is T =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { id?: unknown }).id === "string",
    );
  } catch {
    return [];
  }
}

function writeFallbackStore<T extends { id: string }>(
  store: StoreName,
  items: T[],
): void {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      throw new StorageError(
        "Le stockage local de ce navigateur est indisponible.",
        undefined,
        "UNAVAILABLE",
      );
    }
    window.localStorage.setItem(
      `${FALLBACK_PREFIX}${store}`,
      JSON.stringify(items),
    );
  } catch (err) {
    if (err instanceof StorageError) throw err;
    if (isQuotaExceededError(err)) {
      throw new StorageError(
        "L'espace de stockage local de ton navigateur est plein. Supprime un fichier lourd ou libère de l'espace sur ton appareil.",
        err,
        "QUOTA_EXCEEDED",
      );
    }
    throw new StorageError(
      "Impossible d'enregistrer dans le stockage local de cet appareil.",
      err,
      "IO_ERROR",
    );
  }
}

function isIndexedDbSupported(): boolean {
  try {
    return typeof indexedDB !== "undefined" && indexedDB !== null;
  } catch {
    return false;
  }
}

function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  if (!isIndexedDbSupported()) {
    return Promise.reject(
      new StorageError(
        "Le stockage local (IndexedDB) n'est pas disponible dans ce navigateur.",
        undefined,
        "UNAVAILABLE",
      ),
    );
  }

  void requestDurableStorage();

  dbPromise = new Promise((resolve, reject) => {
    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      dbPromise = null;
      reject(
        new StorageError(
          "Impossible d'initialiser la base locale.",
          err,
          "UNAVAILABLE",
        ),
      );
      return;
    }

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const oldVersion = event.oldVersion ?? 0;
      const newVersion = event.newVersion ?? DB_VERSION;
      applySchemaUpgrade(db, oldVersion, newVersion);
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };

    request.onerror = () => {
      dbPromise = null;
      reject(
        new StorageError(
          "Impossible d'ouvrir la base locale.",
          request.error,
          "UNAVAILABLE",
        ),
      );
    };

    request.onblocked = () => {
      dbPromise = null;
      reject(
        new StorageError(
          "La base locale est temporairement occupée par un autre onglet.",
          undefined,
          "IO_ERROR",
        ),
      );
    };
  });

  return dbPromise;
}

export function resetDbConnectionForTests(): void {
  dbPromise = null;
}

export const localStore = {
  async getAll<T extends { id: string }>(store: StoreName): Promise<T[]> {
    if (!isIndexedDbSupported()) {
      return readFallbackStore<T>(store);
    }
    try {
      const db = await openDatabase();
      return await new Promise<T[]>((resolve, reject) => {
        const tx = db.transaction(store, "readonly");
        const req = tx.objectStore(store).getAll();
        req.onsuccess = () => resolve((req.result as T[]) ?? []);
        req.onerror = () =>
          reject(
            new StorageError(
              `Lecture impossible (${store}).`,
              req.error,
              "IO_ERROR",
            ),
          );
      });
    } catch {
      return readFallbackStore<T>(store);
    }
  },

  async put<T extends { id: string }>(store: StoreName, value: T): Promise<T> {
    if (!value || typeof value.id !== "string" || value.id.trim() === "") {
      throw new StorageError(
        "Identifiant d'enregistrement manquant ou invalide.",
        undefined,
        "INVALID_KEY",
      );
    }
    if (!isIndexedDbSupported()) {
      const existing = readFallbackStore<T>(store);
      const next = [
        value,
        ...existing.filter((item) => item.id !== value.id),
      ];
      writeFallbackStore(store, next);
      return value;
    }
    try {
      const db = await openDatabase();
      return await new Promise<T>((resolve, reject) => {
        const tx = db.transaction(store, "readwrite");
        tx.objectStore(store).put(value);
        tx.oncomplete = () => resolve(value);
        tx.onerror = () => {
          if (isQuotaExceededError(tx.error)) {
            reject(
              new StorageError(
                "Quota de stockage local dépassé. Libère de l'espace ou réduis la taille des pièces jointes.",
                tx.error,
                "QUOTA_EXCEEDED",
              ),
            );
            return;
          }
          reject(
            new StorageError(
              `Enregistrement impossible (${store}).`,
              tx.error,
              "IO_ERROR",
            ),
          );
        };
      });
    } catch (err) {
      if (err instanceof StorageError && err.code === "QUOTA_EXCEEDED") {
        throw err;
      }
      const existing = readFallbackStore<T>(store);
      const next = [
        value,
        ...existing.filter((item) => item.id !== value.id),
      ];
      writeFallbackStore(store, next);
      return value;
    }
  },

  async remove(store: StoreName, id: string): Promise<void> {
    if (!id || typeof id !== "string") {
      throw new StorageError(
        "Identifiant de suppression manquant.",
        undefined,
        "INVALID_KEY",
      );
    }
    if (!isIndexedDbSupported()) {
      const existing = readFallbackStore<{ id: string }>(store);
      writeFallbackStore(
        store,
        existing.filter((item) => item.id !== id),
      );
      return;
    }
    try {
      const db = await openDatabase();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(store, "readwrite");
        tx.objectStore(store).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () =>
          reject(
            new StorageError(
              `Suppression impossible (${store}).`,
              tx.error,
              "IO_ERROR",
            ),
          );
      });
    } catch {
      const existing = readFallbackStore<{ id: string }>(store);
      writeFallbackStore(
        store,
        existing.filter((item) => item.id !== id),
      );
    }
  },

  delete(store: StoreName, id: string): Promise<void> {
    return this.remove(store, id);
  },
};
