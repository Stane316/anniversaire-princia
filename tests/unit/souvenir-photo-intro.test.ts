import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Gardes-fous — séquence photographique d'ouverture des Souvenirs
 * (mission du 3 oct. 2026) : la photo `souvenirs_behanzin` révélée
 * par RefineFrame AVANT la galerie Infinite Spiral, avec repli
 * garanti quoi qu'il arrive.
 */
const read = (path: string) =>
  readFileSync(resolve(__dirname, "..", "..", path), "utf8");

describe("RefineFrame (composant Stane) — moteur intact, style projet", () => {
  const src = read("src/components/media/RefineFrame.tsx");

  it("moteur de mosaïque et progressivité inchangés", () => {
    expect(src).toContain("const LEVELS = [48, 32, 20, 12, 8, 5, 3, 2, 1]");
    expect(src).toContain("const STRIPS = 14");
    expect(src).toContain("requestAnimationFrame");
    expect(src).toContain("imageSmoothingQuality");
    expect(src).toContain("refine-frame-sweep");
  });

  it("palette projet (bleu nuit) — jamais le zinc de la démo", () => {
    expect(src).toContain("background = '#0F2444'");
    expect(src).toContain("color = '#EAF3FF'");
    expect(src).not.toContain("#27272a");
    expect(src).not.toContain("#f5f5f5");
  });

  it("lisible au lecteur d'écran et non bloquant", () => {
    expect(src).toContain('role="img"');
    expect(src).toContain("aria-busy");
    expect(src).toContain("reduce");
  });
});

describe("Scène d'introduction de la photo (Béhanzin)", () => {
  const intro = read(
    "src/experiences/birthday/components/SouvenirPhotoIntro.tsx",
  );
  const page = read(
    "src/experiences/birthday/pages/SouvenirsGalleryPage.tsx",
  );
  const css = read("src/styles/globals.css");

  it("le fichier photo n'est jamais présupposé : candidats en cascade", () => {
    expect(intro).toContain("/souvenirs/souvenirs_behanzin.webp");
    expect(intro).toContain("/souvenirs/souvenirs_behanzin.jpg");
    expect(intro).toContain("img.onerror = () => probe(index + 1)");
    // Aucune extension supposée au niveau de la donnée.
    expect(intro).toContain("CANDIDATES");
  });

  it("repli garanti : image absente → galerie, jamais de blocage", () => {
    expect(intro).toContain("repli");
    expect(intro).toContain("finish");
    expect(intro).toContain("index >= CANDIDATES.length");
  });

  it("séquence déclarée et aboutïssant à complete", () => {
    expect(intro).toContain('"queued"');
    expect(intro).toContain('"generating"');
    expect(intro).toContain('"refining"');
    expect(intro).toContain('"complete"');
    expect(intro).toContain("SEQUENCE");
    // Pause de regard APRÈS la mise au point, pas avant.
    expect(intro).toContain("pause de regard");
  });

  it("libellés en français, jamais de référence à une génération IA", () => {
    expect(intro).toContain("La photo se dévoile");
    expect(intro).toContain("Mise au point");
    expect(intro).not.toMatch(/g[ée]n[ée]r[ée]e? par/i);
    expect(intro).not.toMatch(/artificial|AI\b/i);
  });

  it("texte alternatif véridique, sans détail non vérifié", () => {
    expect(intro).toContain("statue du roi Béhanzin");
    expect(intro).toContain("tenue traditionnelle");
  });

  it("ratio réel de l'image — jamais de déformation", () => {
    expect(intro).toContain("naturalWidth");
    expect(intro).toContain("naturalHeight");
    expect(intro).toContain("Math.min(1080");
  });

  it("reduced-motion : photo nette quasi immédiate, sortie courte", () => {
    expect(intro).toContain('setStatus("complete")');
    expect(intro).toContain("900");
    expect(intro).toContain("useReducedMotion");
  });

  it("sortie contrôlée par l'état — pas de temporisation aveugle", () => {
    expect(intro).toContain('data-phase={phase}');
    expect(intro).toContain('"hand"');
    // Bouton d'abandon toujours disponible.
    expect(intro).toContain("Passer l'introduction");
  });

  it("intégrée AVANT Infinite Spiral, sans toucher à la galerie", () => {
    expect(page).toContain("<SouvenirPhotoIntro onDone={closeIntro}");
    const introPos = page.indexOf("SouvenirPhotoIntro onDone");
    const spiralPos = page.indexOf("<InfiniteSpiral");
    expect(introPos).toBeGreaterThan(-1);
    expect(spiralPos).toBeGreaterThan(introPos);
    // La galerie est intacte (réglages Inchangés).
    expect(page).toContain('animationMode="all"');
    expect(page).toContain("radius={165}");
  });

  it("jouée une fois par session, pas à chaque visite", () => {
    expect(page).toContain("souvenirs-intro-v1");
    expect(page).toContain("sessionStorage");
    expect(page).toContain("INTRO_SEEN_KEY");
  });

  it("scène immersive pleine écran, sortie en fondu orchestré", () => {
    expect(css).toContain(".souvenir-intro");
    expect(css).toContain('data-phase="hand"');
    expect(css).toContain(".souvenir-intro__refine");
    expect(css).toContain(".souvenir-intro__skip");
    // La scène referme sur elle-même : opacity 0 seulement en sortie.
    const hand = css.match(/\.souvenir-intro\[data-phase="hand"\]\s*\{[^}]+\}/);
    expect(hand).not.toBeNull();
    expect(hand![0]).toContain("opacity: 0");
  });
});
