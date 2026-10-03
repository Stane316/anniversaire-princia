/**
 * Fonds d'espaces (composants Stane : WebThreads + GradientWaves) et
 * bibliothèque fluide — gardes d'intégration (3 oct. 2026) :
 * - un fond par espace : WebThreads à l'encre pour l'enquête,
 *   GradientWaves aux vagues bleues pour la bibliothèque ET le livre ;
 * - jamais les couleurs d'origine (violet/rose/blanc) — uniquement
 *   les nuances de bleu du design system ;
 * - performance : DPR ≤ 1.5, pause hors écran (IO), canvas sans
 *   interception de gestes, reduced-motion → aucun canvas monté ;
 * - section enquête allégée : plus de rayons animés pleine scène ni
 *   de canvas de braises superposés au WebGL.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");

describe("WebThreads (background enquête) — gardes", () => {
  const comp = read("src/components/backgrounds/WebThreads.tsx");

  it("dépend de ogl, shaders de la source conservés", () => {
    expect(comp).toContain("from 'ogl'");
    expect(comp).toContain("uLightMode");
    expect(comp).toContain("MAX_THREADS 10");
  });

  it("jamais interactif : canvas et écoute passée à la fenêtre", () => {
    expect(comp).toContain("canvas.style.pointerEvents = 'none'");
    expect(comp).toContain("window.addEventListener('pointermove', onPointerMove, { passive: true })");
  });

  it("GPU plafonné : DPR 1, résolution réduite, 30 fps, pause hors écran", () => {
    expect(comp).toContain("dpr: 1");
    expect(comp).toContain("resolutionScale");
    expect(comp).toContain("fpsRef.current");
    expect(comp).toContain("frameInterval");
    expect(comp).toContain("IntersectionObserver");
    expect(comp).toContain("visibilitychange");
    expect(comp).toContain("if (reducedMotion) return null");
    expect(comp).toContain("if (reducedMotion) return;");
  });

  it("repli silencieux si WebGL est indisponible", () => {
    expect(comp).toContain("try {");
    expect(comp).toContain("WebGL indisponible");
  });

  it("retiré de l'enquête sur prescription (composant gardé intact)", () => {
    // Décision Stane (3 oct. 2026) : la section enquête n'a plus de
    // fond WebGL — retour à l'identité v2 claire et lisible, sans
    // reculer sur le reste. Le composant reste disponible et tests
    // ses gardes dans ce fichier.
    const page = read("src/experiences/birthday/pages/CasePage.tsx");
    expect(page).not.toContain("<WebThreads");
    expect(page).not.toContain("scene-backdrop");
  });
});

describe("GradientWaves (background bibliothèque) — gardes", () => {
  const comp = read("src/components/backgrounds/GradientWaves.tsx");

  it("dépend de ogl, raymarch conservé, détail raisonnable", () => {
    expect(comp).toContain("from 'ogl'");
    expect(comp).toContain("raymarch");
    expect(comp).toContain("if (detail === 'low') return 32.0");
  });

  it("jamais interactif, DPR 1, résolution réduite, reduced-motion sans canvas", () => {
    expect(comp).toContain("canvas.style.pointerEvents = 'none'");
    expect(comp).toContain("window.addEventListener('pointermove', onPointerMove, { passive: true })");
    expect(comp).toContain("dpr: 1");
    expect(comp).toContain("resolutionScale");
    expect(comp).toContain("frameInterval");
    expect(comp).toContain("if (reducedMotion) return null");
    expect(comp).toContain("if (reducedMotion) return;");
  });

  it("intégré à la bibliothèque ET au livre, vagues IDENTIFIABLES", () => {
    // Bascule explicite (mission du 3 oct. 2026) : l'ancienne palette
    // (#F3F8FF/#3E7BD9/#DBEAFE, opacity .85) était indiscernable du
    // dégradé du body — Stane ne pouvait pas confirmer visuellement
    // la présence du composant. Réglages renforcés, gardés ici.
    for (const page of [
      "src/experiences/birthday/pages/LibraryPage.tsx",
      "src/experiences/birthday/pages/ChapterPage.tsx",
    ]) {
      const src = read(page);
      expect(src).toContain("<GradientWaves");
      expect(src).toContain('horizonColor="#E9F3FF"');
      expect(src).toContain('waveColor="#2F6FD0"');
      expect(src).toContain('crestColor="#BFD8F7"');
      expect(src).toContain("opacity={1}");
      expect(src).toContain("brightness={1.04}");
      expect(src).toContain('detail="low"');
      expect(src).toContain("targetFps={30}");
      expect(src).toContain("resolutionScale={0.5}");
      expect(src).not.toContain("#5227FF");
      expect(src).not.toContain("#FF9FFC");
    }
  });

  it("la section blanche de la bibliothèque laisse respirer la mer", () => {
    const css = read("src/styles/globals.css");
    const block = css.match(/\.library-institution \{[^}]+\}/);
    expect(block).not.toBeNull();
    expect(block![0]).toContain("rgba(247, 250, 255, 0.82)");
    // Plus jamais le blanc opaque qui recouvrait le composant.
    expect(block![0]).not.toContain("var(--color-surface)");
  });
});

describe("Calque de fond — CSS projet", () => {
  const css = read("src/styles/globals.css");

  it("le fond est fixe, pleine page au-dessus du fond body, jamais cliquable", () => {
    const block = css.match(/\.scene-backdrop\s*\{[^}]+\}/);
    expect(block).not.toBeNull();
    expect(block![0]).toContain("position: fixed");
    // Bascule explicite (3 oct. 2026) : z-index négatif = calque
    // recouvert par le fond de body (« compartiment » invisible).
    expect(block![0]).toContain("z-index: 0");
    expect(block![0]).not.toContain("z-index: -1");
    expect(block![0]).toContain("pointer-events: none");
  });
});

describe("Section enquête — affichage v2 restauré (sans reculer)", () => {
  const page = read("src/experiences/birthday/pages/CasePage.tsx");
  const verdict = read(
    "src/experiences/birthday/components/dossier/CaseVerdict.tsx",
  );
  const css = read("src/styles/globals.css");

  it("aucun fond WebGL ; identité claire d'origine restaurée", () => {
    expect(page).not.toContain("<WebThreads");
    const scene = css.match(/\.dossier-scene\s*\{[^}]+\}/);
    expect(scene).not.toBeNull();
    expect(scene![0]).toContain("#eef5ff");
    expect(scene![0]).not.toContain("rgba(238, 245, 255");
  });

  it("plus de rendu différé expérimental sur les chapitres", () => {
    const inner = css.match(/\.dossier-scene__inner > section\s*\{[^}]+\}/);
    expect(inner).toBeNull();
  });

  it("la couverture ne dépend plus de l'astuce 50vw plein-bleed", () => {
    const cover = css.match(/\.dossier-cover \{[^}]+\}/);
    expect(cover).not.toBeNull();
    // Bloc du dossier v2 : min-height 100svh présent, calage vw absent.
    expect(css).toMatch(/\.dossier-cover\s*\{[^}]*min-height:\s*100svh/);
    const blocks = css.match(/\.dossier-cover \{[^}]+\}/g) ?? [];
    for (const b of blocks) {
      expect(b).not.toContain("calc(50% - 50vw)");
    }
  });

  it("plus de rayons animés à l'échelle de la scène", () => {
    expect(page).not.toContain("FallingRays");
  });

  it("plus de canvas de braises superposé au WebGL du verdict", () => {
    expect(verdict).not.toContain("EmberField");
    let gone = true;
    try {
      read("src/components/effects/EmberField.tsx");
      gone = false;
    } catch {
      gone = true;
    }
    expect(gone).toBe(true);
  });

  it("la traînée du verdict reste présente, en plan viewport 30 fps", () => {
    // Le canvas ne couvre plus toute la section (~3000 px) mais le
    // viewport seul : ~6× moins de surface GPU à tracé identique,
    // plus le sommeil complet hors écran et à l'inactivité.
    expect(verdict).toContain("<GlowCursor");
    expect(verdict).toContain("maxDevicePixelRatio={1}");
    expect(verdict).toContain("viewportCanvas");
    expect(verdict).toContain("targetFps={30}");
  });
});

describe("FoldText (composant Stane) sur chaque chapitre", () => {
  const book = read("src/components/book/ReadingBook.tsx");
  const comp = read("src/components/text/FoldText.tsx");

  it("le nom de chaque chapitre s'affiche via FoldText, rejoué à l'ouverture", () => {
    expect(book).toContain("<FoldText");
    expect(book).toContain("key={chapter.id}");
    expect(book).toContain("text={chapter.title}");
    expect(book).toContain('trigger="mount"');
  });

  it("source intégrée avec ses gardes (gsap, sr-only, reduced-motion)", () => {
    expect(comp).toContain("gsap.registerPlugin(ScrollTrigger)");
    expect(comp).toContain("fold-text-sr-only");
    expect(comp).toContain("aria-hidden");
    expect(comp).toContain("prefers-reduced-motion: reduce");
    expect(comp).toContain('from \'gsap\'');
  });
});

describe("Livre — pages qui respirent et feuillet fluide", () => {
  const book = read("src/components/book/ReadingBook.tsx");
  const css = read("src/styles/globals.css");

  it("les pages ont des marges internes fluides (jamais collées)", () => {
    const block = css.match(/\.reading-book__page\s*\{[^}]+\}/);
    expect(block).not.toBeNull();
    expect(block![0]).toContain("clamp(1.4rem, 4.5vw, 2.75rem)");
    expect(block![0]).toContain("clamp(1.3rem, 5vw, 3rem)");
  });

  it("le feuillet passe par le GPU pendant la rotation", () => {
    expect(css).toMatch(/\.book-leaf--active\s*\{[^}]*will-change:\s*transform/);
  });

  it("pas de défilement « smooth » en concurrence avec le feuillet", () => {
    expect(book).not.toContain('behavior: "smooth"');
    expect(book).toContain('behavior: "auto"');
  });
});
