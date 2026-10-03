/**
 * 5.7 — Salle des souvenirs : le fonds est complet, accessible et réel.
 */
import { describe, expect, it } from "vitest";
import { souvenirPhotos, souvenirsContent } from "../../src/experiences/birthday/data/souvenirs";

describe("salle des souvenirs", () => {
  it("verse les 21 photos du fonds", () => {
    expect(souvenirPhotos).toHaveLength(21);
    expect(new Set(souvenirPhotos.map((p) => p.src)).size).toBe(21);
  });

  it("chaque photo possède une description exacte, pas un placeholder", () => {
    for (const photo of souvenirPhotos) {
      expect(photo.alt.length).toBeGreaterThan(30);
      expect(photo.alt).not.toMatch(/^spiral/i);
      expect(photo.alt).not.toContain("Image ");
    }
  });

  it("toutes les sources pointent vers le fonds web optimisé", () => {
    // L'existence réelle des fichiers est vérifiée en smoke (cf. registre :
    // requêtes HTTP sur chaque asset servi).
    for (const photo of souvenirPhotos) {
      expect(photo.src).toMatch(/^\/souvenirs-gallery\/photo-\d{2}\.webp$/);
    }
  });

  it("le contenu de la salle est complet", () => {
    expect(souvenirsContent.title.length).toBeGreaterThan(4);
    expect(souvenirsContent.lead).toContain("photos");
    expect(souvenirsContent.marginNote.length).toBeGreaterThan(40);
  });
});
