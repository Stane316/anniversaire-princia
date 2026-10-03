/**
 * Intégrité du dossier The 18th Case (5.5).
 * - chaque indice est une pièce à conviction complète (question, mentions,
 *   révélation) : jamais d'étape vide ;
 * - les réponses acceptées passent réellement le moteur d'énigmes ;
 * - le dossier reste facultatif : la note d'accessibilité existe.
 */
import { describe, expect, it } from "vitest";
import { caseContent, caseSteps } from "../../src/experiences/birthday/data/content";
import { isChoiceCorrect, isTextCorrect } from "../../src/experiences/birthday/riddle";

const clues = caseSteps.filter((s) => s.type === "clue");

describe("The 18th Case — intégrité du dossier", () => {
  it("chaque pièce est identifiée de façon unique", () => {
    const ids = clues.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(3);
  });

  it("chaque indice est complet (mentions, révélation, consigne)", () => {
    for (const clue of clues) {
      expect(clue.stamp, clue.id).toMatch(/Indice 0\d/);
      expect(clue.body.length).toBeGreaterThan(40);
      expect(clue.mention.length).toBeGreaterThan(20);
      expect(clue.reveal.title.length).toBeGreaterThan(4);
      expect(clue.reveal.mention.length).toBeGreaterThan(20);
      expect(clue.wrongFeedback.length).toBeGreaterThan(10);
      expect(clue.hint.length).toBeGreaterThan(10);
    }
  });

  it("la bonne réponse de chaque énigme est acceptée par le moteur", () => {
    for (const clue of clues) {
      if (clue.riddle.kind === "choice") {
        const ids = clue.riddle.options.map((o) => o.id);
        expect(ids).toContain(clue.riddle.correctOptionId);
        expect(isChoiceCorrect(clue.riddle, clue.riddle.correctOptionId)).toBe(true);
      } else {
        expect(clue.riddle.acceptedAnswers.length).toBeGreaterThan(0);
        const sample = clue.riddle.acceptedAnswers[0];
        expect(isTextCorrect(clue.riddle, sample)).toBe(true);
        expect(isTextCorrect(clue.riddle, sample.toUpperCase())).toBe(true);
      }
    }
  });

  it("le campus attend l'indice 03 (avec et sans tiret)", () => {
    const campus = clues.find((c) => c.id === "clue-3");
    expect(campus).toBeDefined();
    if (campus && campus.riddle.kind === "text") {
      expect(isTextCorrect(campus.riddle, "Abomey-Calavi")).toBe(true);
      expect(isTextCorrect(campus.riddle, "abomey calavi")).toBe(true);
      expect(isTextCorrect(campus.riddle, "Cotonou")).toBe(false);
    }
  });

  it("le dossier rappelle qu'il est facultatif et se conclut proprement", () => {
    expect(caseContent.intro.note).toContain("Aucune obligation");
    expect(caseContent.reference).toBe("ENQ-18/10-04");
    expect(caseContent.conclusion.mentions.length).toBeGreaterThanOrEqual(2);
    expect(caseContent.conclusion.toLetter.length).toBeGreaterThan(4);
  });
});
