/**
 * Intégrité du dossier RECONSTRUIT « The 18th Case » (mission 3 oct. 2026).
 * - les nouvelles données (caseDossier) sont complètes : couverture,
 *   rapport, pièces, verdict — jamais de section vide ;
 * - les énigmes restent issues de caseSteps (source unique) : le
 *   dossier ne redéfinit aucune réponse ;
 * - règles de fond : verdict non punitif, ambitions jamais promises,
 *   mention d'appui présente ;
 * - mémoire : restitution exacte, migration de l'ancienne clé
 *   numérique, robustesse au JSON corrompu.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { caseDossier } from "../../src/experiences/birthday/data/content";
import { caseSteps } from "../../src/experiences/birthday/data/content";
import { caseDossierMemory } from "../../src/data/repositories";

const clues = caseSteps.filter((s) => s.type === "clue");

describe("The 18th Case reconstruit — intégrité des données (A/B)", () => {
  it("la couverture est complète (fiche d'identification, marquee, sceau)", () => {
    const cover = caseDossier.cover;
    expect(cover.titleName.length).toBeGreaterThan(3);
    expect(cover.lead.length).toBeGreaterThan(80);
    expect(cover.identification.rows.length).toBeGreaterThanOrEqual(6);
    for (const row of cover.identification.rows) {
      expect(row.label.length).toBeGreaterThan(2);
      expect(row.value.length).toBeGreaterThan(2);
    }
    expect(cover.marquee.length).toBeGreaterThanOrEqual(5);
    expect(cover.sealText).toContain("PRINCIA");
  });

  it("le rapport préliminaire comporte des constats factuels non vides", () => {
    const report = caseDossier.report;
    expect(report.facts.length).toBeGreaterThanOrEqual(6);
    for (const fact of report.facts) {
      expect(fact.length).toBeGreaterThan(40);
    }
    expect(report.conclusion.length).toBeGreaterThan(40);
  });

  it("l'inventaire des pièces est complet (prose + scellé + stats)", () => {
    const evidence = caseDossier.evidence;
    expect(evidence.prose).toHaveLength(2);
    for (const piece of evidence.prose) {
      expect(piece.code).toMatch(/^Pièce A-0[45]$/);
      expect(piece.description.length).toBeGreaterThan(60);
      expect(piece.mention.length).toBeGreaterThan(20);
    }
    expect(evidence.sealed.code).toBe("Pièce A-06");
    expect(evidence.sealed.description.length).toBeGreaterThan(40);
    expect(evidence.stats.missing).toBe("00");
  });

  it("les énigmes restent dans caseSteps : le dossier n'en redéfinit pas", () => {
    // La reconstruction réutilise les 3 indices existants — source unique.
    expect(clues.map((c) => c.id)).toEqual(["clue-1", "clue-2", "clue-3"]);
    for (const clue of clues) {
      expect(clue.reveal.title.length).toBeGreaterThan(4);
    }
    // Chaque pièce à énigme a son code d'exposition (A-01..A-03),
    // puis A-04/A-05 en prose et A-06 sous scellés : 6 pièces, 6 nœuds.
    expect(clues.length + caseDossier.evidence.prose.length + 1).toBe(6);
  });

  it("le verdict n'est jamais punitif et ne promet aucun résultat", () => {
    const verdict = caseDossier.verdict;
    expect(verdict.stamp).toBe("RÉSOLUE");
    const full = [
      verdict.sentence,
      ...verdict.messageParagraphs,
      verdict.signature,
    ].join(" ");
    expect(full).not.toMatch(/coupable/i);
    expect(full).not.toMatch(/tu auras/i);
    expect(full).not.toMatch(/promis[et]?[sd]?\b/i);
    expect(full).not.toMatch(/garanti/i);
    // L'appui (études, écoute) reste explicite.
    expect(full.toLowerCase()).toContain("compter sur moi");
    // L'ambition reste non contractuelle.
    expect(full.toLowerCase()).toContain("pas un contrat");
  });

  it("romance : aucun terme romantique dans le message du verdict", () => {
    const full = caseDossier.verdict.messageParagraphs.join(" ").toLowerCase();
    for (const mot of ["amour", "aimer", "romantique", "cœur", "heart"]) {
      expect(full).not.toContain(mot);
    }
  });
});

describe("The 18th Case reconstruit — mémoire du dossier (C)", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => void store.set(key, value),
        removeItem: (key: string) => void store.delete(key),
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("restitue exactement l'état sauvegardé (solved + completed)", () => {
    caseDossierMemory.save({ solved: ["clue-1", "clue-3"], completed: false });
    expect(caseDossierMemory.load()).toEqual({
      solved: ["clue-1", "clue-3"],
      completed: false,
    });
    caseDossierMemory.save({ solved: ["clue-2"], completed: true });
    expect(caseDossierMemory.load()).toEqual({
      solved: ["clue-2"],
      completed: true,
    });
  });

  it("migre l'ancienne progression numérique vers les indices", () => {
    store.set("princia.chapter18.caseProgress", "0");
    expect(caseDossierMemory.load().solved).toEqual([]);
    store.set("princia.chapter18.caseProgress", "2");
    expect(caseDossierMemory.load().solved).toEqual(["clue-1"]);
    store.set("princia.chapter18.caseProgress", "4");
    expect(caseDossierMemory.load().solved).toEqual(["clue-1", "clue-2"]);
    store.set("princia.chapter18.caseProgress", "6");
    expect(caseDossierMemory.load().solved).toEqual([
      "clue-1",
      "clue-2",
      "clue-3",
    ]);
  });

  it("migre une progression terminée (verdict déjà consulté)", () => {
    store.set("princia.chapter18.caseProgress", "8");
    expect(caseDossierMemory.load()).toEqual({
      solved: ["clue-1", "clue-2", "clue-3"],
      completed: true,
    });
  });

  it("la nouvelle clé a priorité sur l'héritage", () => {
    store.set("princia.chapter18.caseProgress", "6");
    caseDossierMemory.save({ solved: ["clue-2"], completed: false });
    expect(caseDossierMemory.load().solved).toEqual(["clue-2"]);
  });

  it("survit à un contenu corrompu (retour migration héritée)", () => {
    store.set("princia.chapter18.caseProgress", "4");
    store.set("princia.chapter18.caseDossier", "{pas du json");
    expect(caseDossierMemory.load().solved).toEqual(["clue-1", "clue-2"]);
    store.set("princia.chapter18.caseDossier", '{"solved":"bizarre"}');
    expect(caseDossierMemory.load().solved).toEqual(["clue-1", "clue-2"]);
  });

  it("sans aucun stockage, l'état initial est vierge", () => {
    vi.unstubAllGlobals(); // window inexistant : le fallback protégé agit
    expect(caseDossierMemory.load()).toEqual({ solved: [], completed: false });
  });
});
