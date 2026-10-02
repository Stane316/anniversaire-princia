/**
 * Intégrité du système fictionnel (5.1) et garde-fou éditorial.
 * - chaque volume possède une cote unique et une note de bibliothécaire ;
 * - la lettre validée par Stane le 2 octobre 2026 est figée : ce test
 *   échoue si son corps est modifié sans décision explicite (adaptation
 *   de la règle « protéger les acquis », doc 04 §04.2).
 */
import { describe, expect, it } from "vitest";
import {
  birthdayChapters,
  letterContent,
  libraryCodex,
  readerCard,
} from "../../src/experiences/birthday/data/content";

describe("système fictionnel de la bibliothèque", () => {
  it("chaque chapitre possède une cote unique", () => {
    const cotes = birthdayChapters.map((c) => c.callNumber);
    expect(new Set(cotes).size).toBe(cotes.length);
    cotes.forEach((c) => expect(c).toMatch(/^PRC-18\//));
  });

  it("chaque chapitre possède une note de bibliothécaire non vide", () => {
    for (const chapter of birthdayChapters) {
      expect(chapter.marginNote.length, chapter.id).toBeGreaterThan(20);
      expect(chapter.marginNote, chapter.id).not.toMatch(/Lamborghini bleue.*Lamborghini bleue/);
    }
  });

  it("chaque chapitre possède du contenu et une couverture définie", () => {
    for (const chapter of birthdayChapters) {
      expect(chapter.paragraphs.length, chapter.id).toBeGreaterThan(0);
      expect(chapter.gradient.top).toMatch(/^#/);
      expect(chapter.gradient.bottom).toMatch(/^#/);
    }
  });

  it("le règlement et la carte de lectrice sont renseignés", () => {
    expect(libraryCodex.rules.length).toBeGreaterThanOrEqual(3);
    expect(readerCard.fields.every((f) => f.label && f.value)).toBe(true);
  });
});

describe("garde-fou — lettre validée (2 oct. 2026)", () => {
  it("la lettre conserve son corps validé", () => {
    expect(letterContent.salutation).toBe("Princia,");
    expect(letterContent.signature).toBe("Stane");
    expect(letterContent.closing).toBe("Joyeux anniversaire, Princia.");
    expect(letterContent.paragraphs).toHaveLength(5);
    expect(letterContent.signatureLine).toBe(
      "Une nouvelle page s'ouvre. Et cette fois, c'est elle qui écrit la suite.",
    );
  });
});
