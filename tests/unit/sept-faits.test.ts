/**
 * Les sept faits de l'enquête (mission reconstruction v2) :
 * - exactement sept, numérotés F-01..F-07, avec titres évocateurs ;
 * - textes fidèles aux formulations de référence fournies par Stane ;
 * - règles éditoriales objectivées : ambitions jamais accomplies,
 *   pas de revenu inventé, père honoré tel que fourni, franchise
 *   présentée avec sa contrepartie, aucun fait transformé en quiz.
 */
import { describe, expect, it } from "vitest";
import { caseDossier } from "../../src/experiences/birthday/data/content";

const items = caseDossier.factsChapter.items;

describe("Les sept faits — intégrité et mise en scène (A/B)", () => {
  it("compte exactement sept faits, numérotés F-01 à F-07", () => {
    expect(items).toHaveLength(7);
    expect(items.map((f) => f.code)).toEqual([
      "F-01",
      "F-02",
      "F-03",
      "F-04",
      "F-05",
      "F-06",
      "F-07",
    ]);
  });

  it("chaque fait est là tel que fourni (pas d'événement inventé)", () => {
    expect(
      items.map((f) => [f.code, f.text]),
    ).toMatchObject([
      [
        "F-01",
        expect.stringContaining("Les Carnets de l'Apothicaire"),
      ],
      ["F-02", expect.stringContaining("atteindre au minimum 16/20")],
      ["F-03", expect.stringContaining("indépendance financière")],
      ["F-04", expect.stringContaining("rendre son père fier")],
      ["F-05", expect.stringContaining("leur bien-être compte pour elle")],
      ["F-06", expect.stringContaining("battante")],
      ["F-07", expect.stringContaining("sympathique, attentionnée")],
    ]);
    for (const fact of items) {
      expect(fact.title.length).toBeGreaterThan(12);
      expect(fact.text.length).toBeGreaterThan(120);
      expect(fact.indice.length).toBeGreaterThan(20);
    }
  });

  it("ambition jamais présentée comme accomplie", () => {
    const ambition = items[1];
    // « serait » : la majorité reste une distinction éventuelle.
    expect(ambition.text).toContain("serait");
    expect(ambition.text).not.toMatch(/est major/i);
    expect(ambition.text).not.toMatch(/a obtenu/i);
    expect(ambition.text).not.toMatch(/sa moyenne actuelle/i);
  });

  it("aucun revenu fictif n'est affirmé", () => {
    const independance = items[2];
    expect(independance.text).not.toMatch(/gagne[\w\s]*par mois/i);
    expect(independance.text).not.toMatch(/\d[\d\s]*(?:fcfa|euros?|dollars)/i);
    expect(independance.text).not.toMatch(/est indépendante financièrement/i);
  });

  it("la franchise n'est jamais présentée comme un défaut à corriger", () => {
    const caractere = items[6].text.toLowerCase();
    expect(caractere).not.toMatch(/à corriger|défaut|se calmer|s'adoucir/);
    expect(caractere).toContain("ne résume pas sa personnalité");
  });

  it("aucun fait n'est une question de quiz", () => {
    for (const fact of items) {
      expect(fact.text).not.toContain("?");
    }
  });
});
