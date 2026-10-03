/**
 * Accès IndexedDB — couche de données (doc 03 §9.4, §9.7).
 * Les composants React n'accèdent jamais directement à IndexedDB :
 * ils passent par les dépôts de `repositories.ts`.
 *
 * Règles :
 * - les erreurs sont transformées en `StorageError` avec un message
 *   compréhensible pour l'utilisatrice (doc 03 §18.4) ;
 * - aucun écran blanc en cas d'échec : les appelants gèrent l'erreur.
 */

const DB_NAME = "princia-chapter-18";
const DB_VERSION = 1;

export const STORES = {
  books: "books",
  tasks: "tasks",
  wins: "wins",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

export class StorageError extends Error {
  constructor(cause?: unknown) {
    super(
      "Les données n'ont pas pu être enregistrées sur cet appareil. Réessaie dans un instant.",
    );
    this.name = "StorageError";
    if (cause instanceof Error) this.cause = cause;
  }
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new StorageError());
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of Object.values(STORES)) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: "id" });
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
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
        const tx = db.transaction(store, mode);
        const request = op(tx.objectStore(store));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new StorageError(request.error));
        tx.onerror = () => reject(new StorageError(tx.error));
      }),
  );
}

export const localStore = {
  getAll<T>(store: StoreName): Promise<T[]> {
    return run(store, "readonly", (s) => s.getAll()) as Promise<T[]>;
  },
  put<T>(store: StoreName, value: T): Promise<void> {
    return run(store, "readwrite", (s) => s.put(value)).then(() => undefined);
  },
  delete(store: StoreName, id: string): Promise<void> {
    return run(store, "readwrite", (s) => s.delete(id)).then(() => undefined);
  },
  clear(store: StoreName): Promise<void> {
    return run(store, "readwrite", (s) => s.clear()).then(() => undefined);
  },
};
