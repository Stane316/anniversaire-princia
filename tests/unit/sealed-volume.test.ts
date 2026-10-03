/**
 * Le volume sous scellé (5.4) : verrou de date pur, contenu complet
 * après ouverture, jamais rattaché à la lettre ni aux énigmes.
 */
import { describe, expect, it } from "vitest";
import { daysUntil } from "../../src/lib/datetime";
import {
  birthdayChapters,
  SEALED_VOLUME_UNLOCK_ISO,
  sealedVolume,
} from "../../src/experiences/birthday/data/content";

describe("volume sous scellé", () => {
  it("reste fermé avant le jour J, s'ouvre au 4 octobre", () => {
    expect(daysUntil(SEALED_VOLUME_UNLOCK_ISO, new Date(2026, 9, 2, 8, 0, 0))).toBe(2);
    expect(daysUntil(SEALED_VOLUME_UNLOCK_ISO, new Date(2026, 9, 4, 23, 0, 0))).toBeLessThanOrEqual(0);
    expect(daysUntil(SEALED_VOLUME_UNLOCK_ISO, new Date(2026, 9, 5, 8, 0, 0))).toBeLessThan(0);
  });

  it("est un volume complet une fois ouvert (texte, note, cote)", () => {
    expect(sealedVolume.paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(sealedVolume.aside.length).toBeGreaterThan(20);
    expect(sealedVolume.marginNote.length).toBeGreaterThan(20);
    expect(sealedVolume.cote).toMatch(/^PRC-18\//);
    expect(sealedVolume.sealed.title.length).toBeGreaterThan(4);
  });

  it("ne fait pas partie des chapitres ouverts et reste distinct", () => {
    expect(birthdayChapters.some((c) => c.id === sealedVolume.id)).toBe(false);
    expect(sealedVolume.id).toBe("volume-scelle");
  });

  it("présente le regard de Stane comme un regard, pas un diagnostic", () => {
    const joined = sealedVolume.paragraphs.join(" ");
    expect(joined).toContain("mon regard");
  });
});
