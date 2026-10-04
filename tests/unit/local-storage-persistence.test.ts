// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
  applySchemaUpgrade,
  DB_VERSION,
  localStore,
  resetDbConnectionForTests,
  StorageError,
  STORES,
} from "../../src/data/db";
import {
  bookRepository,
  caseDossierMemory,
  taskRepository,
  visitMemory,
  winRepository,
} from "../../src/data/repositories";

describe("Stockage local, persistance et repli hors ligne", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetDbConnectionForTests();
  });

  it("persiste les livres (création, lecture, mise à jour, suppression) via le repli local", async () => {
    const created = await bookRepository.create({
      title: "Les Carnets de l'apothicaire",
      author: "Natsu Hyuuga",
      category: "Enquête & Mystère",
      status: "reading",
      notes: "Tome 1 en cours",
    });

    expect(created.id).toBeTruthy();
    const afterCreate = await bookRepository.getAll();
    expect(afterCreate).toHaveLength(1);
    expect(afterCreate[0].title).toBe("Les Carnets de l'apothicaire");

    const updated = await bookRepository.update({
      ...created,
      status: "completed",
      notes: "Terminé !",
    });
    expect(updated.status).toBe("completed");

    const afterUpdate = await bookRepository.getAll();
    expect(afterUpdate[0].status).toBe("completed");
    expect(afterUpdate[0].notes).toBe("Terminé !");

    await bookRepository.delete(created.id);
    expect(await bookRepository.getAll()).toEqual([]);
  });

  it("persiste les tâches du carnet universitaire et les petites victoires après rechargement", async () => {
    const task = await taskRepository.create({
      title: "Réviser l'hydrologie",
      note: "Chapitre 3",
      dueDate: "2026-10-12",
      weeklyPriority: true,
    });
    const win = await winRepository.create({
      text: "Exposé préparé en avance",
      category: "Études",
    });

    // Simule un rechargement de l'application (nouvelle connexion aux dépôts)
    resetDbConnectionForTests();

    const tasks = await taskRepository.getAll();
    const wins = await winRepository.getAll();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(task.id);
    expect(tasks[0].weeklyPriority).toBe(true);
    expect(wins).toHaveLength(1);
    expect(wins[0].id).toBe(win.id);
    expect(wins[0].text).toBe("Exposé préparé en avance");
  });

  it("mémorise les préférences de visite, l'état du dossier et le choix de l'invitation d'installation", () => {
    expect(visitMemory.hasVisitedDailySpace()).toBe(false);
    visitMemory.markDailySpaceVisited();
    expect(visitMemory.hasVisitedDailySpace()).toBe(true);

    expect(visitMemory.hasDismissedInstallPrompt()).toBe(false);
    visitMemory.dismissInstallPrompt();
    expect(visitMemory.hasDismissedInstallPrompt()).toBe(true);
    visitMemory.resetInstallPrompt();
    expect(visitMemory.hasDismissedInstallPrompt()).toBe(false);

    caseDossierMemory.save({ solved: ["clue-1", "clue-3"], completed: true });
    expect(caseDossierMemory.load()).toEqual({
      solved: ["clue-1", "clue-3"],
      completed: true,
    });
  });

  it("applique les migrations IndexedDB sans jamais supprimer les stores existants", () => {
    const createdStores: string[] = [];
    const fakeDb = {
      objectStoreNames: {
        contains: (name: string) => createdStores.includes(name),
      },
      createObjectStore: (name: string) => {
        createdStores.push(name);
      },
    } as unknown as IDBDatabase;

    applySchemaUpgrade(fakeDb, 0, DB_VERSION);
    expect(createdStores).toEqual([STORES.books, STORES.tasks, STORES.wins]);

    // Un second appel (montée de version sur une base déjà initialisée) ne recrée rien
    applySchemaUpgrade(fakeDb, 1, DB_VERSION + 1);
    expect(createdStores).toEqual([STORES.books, STORES.tasks, STORES.wins]);
  });

  it("rejette avec StorageError si un élément sans identifiant valide est écrit", async () => {
    await expect(
      localStore.put(STORES.books, { id: "" }),
    ).rejects.toBeInstanceOf(StorageError);
  });
});
