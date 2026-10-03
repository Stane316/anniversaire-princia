import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Garde-fous — panneau volume (premier affichage de la bibliothèque)
 * et menu Dock de l'espace (3 oct. 2026).
 *
 * Le panneau volume doit retrouver le confort du grand livre : texte
 * jamais collé aux extrémités (marges fluides), titre déplié par
 * FoldText comme le nom du livre. Le Dock est le composant fourni
 * par Stane, intégré au menu existant de l'espace (pas de menu
 * parallèle) : hygiene motion, libellés permanents, page active.
 */
const read = (path: string) =>
  readFileSync(resolve(__dirname, "..", "..", path), "utf8");

describe("Panneau volume — même confort que le grand livre", () => {
  const page = read("src/experiences/birthday/pages/LibraryPage.tsx");
  const css = read("src/styles/globals.css");

  it("le titre du volume est déplié par FoldText (rejoué par volume)", () => {
    const sheet = page.indexOf('id="volume-sheet"');
    expect(sheet).toBeGreaterThan(-1);
    const window = page.slice(sheet, sheet + 2400);
    expect(window).toContain("<FoldText");
    expect(window).toContain('key={openVolume.id}');
    expect(window).toContain('text={openVolume.title}');
    // Le titre h3 reste l'élément focusable/annoncé (accessibilité).
    expect(window).toContain("sheetHeadingRef");
  });

  it("marges fluides : jamais collé aux extrémités", () => {
    const block = css.match(/\.volume-sheet \{[\s\S]*?\n\}/);
    expect(block).not.toBeNull();
    expect(block![0]).toContain("clamp(");
    expect(block![0]).toMatch(/padding: clamp\(/);
  });

  it("fond presque plein mais translucide : la mer d'encre respire", () => {
    const block = css.match(/\.volume-sheet \{[\s\S]*?\n\}/);
    expect(block).not.toBeNull();
    expect(block![0]).toContain("rgba(253, 254, 254, 0.94)");
  });

  it("le titre du panneau utilise la police serif du livre", () => {
    const block = css.match(/\.volume-sheet__title \{[\s\S]*?\n\}/);
    expect(block).not.toBeNull();
    expect(block![0]).toContain("var(--font-serif)");
  });
});

describe("Menu Dock de l'espace (composant Stane intégré)", () => {
  const dock = read("src/components/dock/Dock.tsx");
  const layout = read("src/experiences/daily/DailyLayout.tsx");
  const css = read("src/styles/globals.css");

  it("mécanique spring/motion du composant intacte", () => {
    expect(dock).toContain("useSpring");
    expect(dock).toContain("useTransform");
    expect(dock).toContain("useMotionValue(Infinity)");
    expect(dock).toContain("AnimatePresence");
    expect(dock).toContain("stiffness: 150");
    expect(dock).toContain("damping: 12");
  });

  it("accessibilité : role boutons, clavier, page courante", () => {
    expect(dock).toContain("onKeyDown");
    expect(dock).toContain("role: 'button'");
    expect(dock).toContain("aria-current");
    expect(dock).toContain('role="toolbar"');
  });

  it("libellés permanents (aperçu mobile sans survol) + tooltip", () => {
    expect(dock).toContain("showLabels");
    expect(dock).toContain("dock__label");
    expect(dock).toContain("dock__tooltip");
  });

  it("reduced-motion : magnification coupée, menu identique", () => {
    expect(dock).toContain("useReducedMotion");
    expect(dock).toContain("reducedMotion");
  });

  it("intégré au menu existant de l'espace — les cinq entrées", () => {
    expect(layout).toContain("<Dock");
    expect(layout).toContain("NAV_ITEMS");
    expect(layout).toContain("showLabels");
    expect(layout).toContain("activeLabel");
    expect(layout).toContain("page courante");
    // Plus de liste doublée : le menu historique est remplacé, pas doublé.
    expect(layout).not.toContain("daily-nav__list");
  });

  it("styles projet : fonds clairs bleus, jamais le noir de la démo", () => {
    expect(dock).not.toContain("bg-[#120F17]");
    expect(css).toContain(".dock__panel");
    expect(css).toContain(".dock__item--active");
    expect(css).toContain("174a91");
  });
});
