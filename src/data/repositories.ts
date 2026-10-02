/**
 * Dépôts de données (doc 03 §9.6) : interface stable entre la couche
 * présentation et IndexedDB. Regroupe aussi les préférences localStorage
 * (simples, non sensibles — doc 03 §9.3) et la mémorisation des visites
 * (doc 01 §7.4).
 */
import { localStore, STORES } from "./db";
import type { Book, PlannerTask, SmallWin } from "../domain/models";
import { createId, nowIso } from "../lib/id";

/* ------------------------------ Livres ------------------------------ */

export const bookRepository = {
  getAll(): Promise<Book[]> {
    return localStore.getAll<Book>(STORES.books);
  },
  create(input: Omit<Book, "id" | "createdAt" | "updatedAt">): Promise<Book> {
    const book: Book = { ...input, id: createId(), createdAt: nowIso(), updatedAt: nowIso() };
    return localStore.put(STORES.books, book).then(() => book);
  },
  update(book: Book): Promise<Book> {
    const next = { ...book, updatedAt: nowIso() };
    return localStore.put(STORES.books, next).then(() => next);
  },
  delete(id: string): Promise<void> {
    return localStore.delete(STORES.books, id);
  },
};

/* ------------------------------ Tâches ------------------------------ */

export const taskRepository = {
  getAll(): Promise<PlannerTask[]> {
    return localStore.getAll<PlannerTask>(STORES.tasks);
  },
  create(
    input: Omit<PlannerTask, "id" | "createdAt" | "updatedAt" | "completed">,
  ): Promise<PlannerTask> {
    const task: PlannerTask = {
      ...input,
      completed: false,
      id: createId(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    return localStore.put(STORES.tasks, task).then(() => task);
  },
  update(task: PlannerTask): Promise<PlannerTask> {
    const next = { ...task, updatedAt: nowIso() };
    return localStore.put(STORES.tasks, next).then(() => next);
  },
  delete(id: string): Promise<void> {
    return localStore.delete(STORES.tasks, id);
  },
};

/* -------------------------- Petites victoires -------------------------- */

export const winRepository = {
  getAll(): Promise<SmallWin[]> {
    return localStore.getAll<SmallWin>(STORES.wins);
  },
  create(input: Omit<SmallWin, "id" | "createdAt">): Promise<SmallWin> {
    const win: SmallWin = { ...input, id: createId(), createdAt: nowIso() };
    return localStore.put(STORES.wins, win).then(() => win);
  },
  /** Une victoire peut être modifiée (doc 01 §11.3). */
  update(win: SmallWin): Promise<SmallWin> {
    return localStore.put(STORES.wins, win).then(() => win);
  },
  delete(id: string): Promise<void> {
    return localStore.delete(STORES.wins, id);
  },
};

/* ----------------------- Préférences & visites ----------------------- */

const KEYS = {
  visitedDailySpace: "princia.chapter18.visitedDailySpace",
  caseProgress: "princia.chapter18.caseProgress",
} as const;

/** localStorage protégé : jamais d'exception si indisponible (doc 03 §9.3). */
const safeStorage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* stockage indisponible : l'expérience continue sans mémorisation */
    }
  },
};

/** Doc 01 §7.3–7.4 : après la première visite de l'espace quotidien,
 *  l'entrée de l'application privilégie l'accès direct à cet espace. */
export const visitMemory = {
  hasVisitedDailySpace(): boolean {
    return safeStorage.get(KEYS.visitedDailySpace) === "yes";
  },
  markDailySpaceVisited(): void {
    safeStorage.set(KEYS.visitedDailySpace, "yes");
  },
};

/** Persistance légère de la progression de l'enquête (doc 01 §6.10) :
 *  une actualisation ne doit pas produire d'état incohérent. */
export const caseProgressMemory = {
  load(): number {
    const raw = safeStorage.get(KEYS.caseProgress);
    const n = raw === null ? 0 : Number.parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  },
  save(stepIndex: number): void {
    safeStorage.set(KEYS.caseProgress, String(stepIndex));
  },
};
