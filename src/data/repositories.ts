/**
 * Dépôts de données (doc 03 §9.6) : interface stable entre la couche
 * présentation et IndexedDB. Regroupe aussi les préférences localStorage
 * (simples, non sensibles — doc 03 §9.3) et la mémorisation des visites
 * (doc 01 §7.4).
 */
import { localStore, STORES } from "./db";
import type { Book, PlannerTask, QgProposal, SmallWin } from "../domain/models";
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

/* ------------------------- Propositions du QG ------------------------- */

export const qgProposalLocalRepository = {
  getAll(): Promise<QgProposal[]> {
    return localStore.getAll<QgProposal>(STORES.proposals);
  },
  save(proposal: QgProposal): Promise<QgProposal> {
    return localStore.put(STORES.proposals, proposal);
  },
  create(
    input: Omit<QgProposal, "id" | "createdAt" | "updatedAt">,
  ): Promise<QgProposal> {
    const now = nowIso();
    const proposal: QgProposal = {
      ...input,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    };
    return localStore.put(STORES.proposals, proposal).then(() => proposal);
  },
  update(proposal: QgProposal): Promise<QgProposal> {
    const next: QgProposal = { ...proposal, updatedAt: nowIso() };
    return localStore.put(STORES.proposals, next).then(() => next);
  },
  delete(id: string): Promise<void> {
    return localStore.delete(STORES.proposals, id);
  },
};

/* ----------------------- Préférences & visites ----------------------- */

const KEYS = {
  visitedDailySpace: "princia.chapter18.visitedDailySpace",
  caseProgress: "princia.chapter18.caseProgress",
  caseDossier: "princia.chapter18.caseDossier",
  seenIntro: "princia.chapter18.seenIntro",
  installDismissed: "princia.chapter18.installDismissed",
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
  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* stockage indisponible */
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
  /** Séquence d'entrée (5.3) : déjà vue → invitation directement ouverte. */
  hasSeenIntro(): boolean {
    return safeStorage.get(KEYS.seenIntro) === "yes";
  },
  markIntroSeen(): void {
    safeStorage.set(KEYS.seenIntro, "yes");
  },
  /** Invitation d'installation PWA (doc 03 §11.6) : ne pas relancer à chaque visite. */
  hasDismissedInstallPrompt(): boolean {
    return safeStorage.get(KEYS.installDismissed) === "yes";
  },
  dismissInstallPrompt(): void {
    safeStorage.set(KEYS.installDismissed, "yes");
  },
  resetInstallPrompt(): void {
    safeStorage.remove(KEYS.installDismissed);
  },
};

/** Persistance légère de la progression de l'enquête (doc 01 §6.10) :
 *  une actualisation ne doit pas produire d'état incohérent.
 *  Clé héritée de l'ancien moteur à étapes (conservée pour migration). */
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

/** État du dossier reconstruit (mission « The 18th Case », oct. 2026) :
 *  indices résolus + verdict vu. Une actualisation le restitue tel quel. */
export type CaseDossierState = {
  solved: ReadonlyArray<string>;
  completed: boolean;
};

export const caseDossierMemory = {
  load(): CaseDossierState {
    const raw = safeStorage.get(KEYS.caseDossier);
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw) as Partial<CaseDossierState>;
        if (Array.isArray(parsed.solved)) {
          const solved = parsed.solved.filter(
            (s): s is string => typeof s === "string",
          );
          return { solved, completed: parsed.completed === true };
        }
        /* Structure inattendue → on retombe sur la migration héritée. */
      } catch {
        /* JSON illisible → on retombe sur la migration héritée. */
      }
    }
    // Migration depuis l'ancien moteur à étapes : les seuils 2/4/6
    // correspondaient aux trois indices résolus dans l'ordre.
    const legacy = caseProgressMemory.load();
    const solved: string[] = [];
    if (legacy >= 2) solved.push("clue-1");
    if (legacy >= 4) solved.push("clue-2");
    if (legacy >= 6) solved.push("clue-3");
    if (legacy >= 8) return { solved: ["clue-1", "clue-2", "clue-3"], completed: true };
    return { solved, completed: false };
  },
  save(state: CaseDossierState): void {
    safeStorage.set(KEYS.caseDossier, JSON.stringify(state));
  },
};
