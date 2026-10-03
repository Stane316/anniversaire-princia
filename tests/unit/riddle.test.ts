import { describe, expect, it } from "vitest";
import { isChoiceCorrect, isTextCorrect, normalizeAnswer } from "../../src/experiences/birthday/riddle";
import { caseSteps } from "../../src/experiences/birthday/data/content";

const [clue1, clue2] = caseSteps.filter((s) => s.type === "clue") as [
  Extract<(typeof caseSteps)[number], { type: "clue" }>,
  Extract<(typeof caseSteps)[number], { type: "clue" }>,
];

describe("normalizeAnswer", () => {
  it("normalise casse, accents et espaces", () => {
    expect(normalizeAnswer("  BLEU  Ciel  ")).toBe("bleu ciel");
    expect(normalizeAnswer("Été")).toBe("ete");
  });
});

describe("énigme à choix (indice 01)", () => {
  it("accepte la bonne option", () => {
    expect(isChoiceCorrect(clue1.riddle, "lambo-bleue")).toBe(true);
  });

  it("rejette les autres options", () => {
    for (const option of clue1.riddle.kind === "choice" ? clue1.riddle.options : []) {
      if (option.id !== "lambo-bleue") {
        expect(isChoiceCorrect(clue1.riddle, option.id)).toBe(false);
      }
    }
    expect(isChoiceCorrect(clue1.riddle, "inexistant")).toBe(false);
  });
});

describe("énigme texte (indice 02)", () => {
  it("accepte les formulations documentées", () => {
    expect(isTextCorrect(clue2.riddle, "bleu")).toBe(true);
    expect(isTextCorrect(clue2.riddle, "Bleu")).toBe(true);
    expect(isTextCorrect(clue2.riddle, "BLEUE")).toBe(true);
    expect(isTextCorrect(clue2.riddle, "bleu ciel")).toBe(true);
    expect(isTextCorrect(clue2.riddle, "  Bleu  Ciel ")).toBe(true);
  });

  it("rejette une mauvaise couleur ou une saisie vide", () => {
    expect(isTextCorrect(clue2.riddle, "rouge")).toBe(false);
    expect(isTextCorrect(clue2.riddle, "")).toBe(false);
    expect(isTextCorrect(clue2.riddle, "   ")).toBe(false);
  });

  it("ne bloque jamais sur une erreur mineure d'accent", () => {
    // la normalisation retire les accents : doc 01 §6.6
    expect(isTextCorrect(clue2.riddle, "bléue")).toBe(true);
  });
});

describe("données de l'enquête", () => {
  it("chaque indice possède une révélation cohérente (doc 01 §6.8)", () => {
    expect(clue1.reveal.title).toBeTruthy();
    expect(clue2.reveal.title).toBeTruthy();
  });

  it("l'ordre des étapes est intro indice indice", () => {
    expect(caseSteps[0].type).toBe("intro");
    expect(caseSteps[1].type).toBe("clue");
    expect(caseSteps[2].type).toBe("clue");
  });
});
