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

  it("intégré à la section enquête en encre bleue (lightMode), plafonné", () => {
    const page = read("src/experiences/birthday/pages/CasePage.tsx");
    expect(page).toContain("<WebThreads");
    expect(page).toContain("lightMode");
    expect(page).toContain('backgroundColor="#EEF5FF"');
    expect(page).toContain('color1="#1E5BB4"');
    expect(page).toContain('color2="#5B9BEB"');
    expect(page).toContain('color3="#C9E1FF"');
    expect(page).toContain("targetFps={30}");
    expect(page).toContain("resolutionScale={0.55}");
    expect(page).toContain("opacity={0.9}");
    // Jamais les couleurs de la démo.
    expect(page).not.toContain("#5227FF");
    expect(page).not.toContain("#FF9FFC");
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

  it("intégré à la bibliothèque ET au livre des chapitres, vagues bleues", () => {
    for (const page of [
      "src/experiences/birthday/pages/LibraryPage.tsx",
      "src/experiences/birthday/pages/ChapterPage.tsx",
    ]) {
      const src = read(page);
      expect(src).toContain("<GradientWaves");
      expect(src).toContain('horizonColor="#F3F8FF"');
      expect(src).toContain('waveColor="#3E7BD9"');
      expect(src).toContain('crestColor="#DBEAFE"');
      expect(src).toContain('detail="low"');
      expect(src).toContain("targetFps={30}");
      expect(src).toContain("resolutionScale={0.5}");
      expect(src).not.toContain("#5227FF");
      expect(src).not.toContain("#FF9FFC");
    }
  });
});

describe("Calque de fond — CSS projet", () => {
  const css = read("src/styles/globals.css");

  it("le fond est fixe, derrière tout, jamais cliquable", () => {
    const block = css.match(/\.scene-backdrop\s*\{[^}]+\}/);
    expect(block).not.toBeNull();
    expect(block![0]).toContain("position: fixed");
    expect(block![0]).toContain("z-index: -1");
    expect(block![0]).toContain("pointer-events: none");
  });
});

describe("Section enquête allégée", () => {
  const page = read("src/experiences/birthday/pages/CasePage.tsx");
  const verdict = read(
    "src/experiences/birthday/components/dossier/CaseVerdict.tsx",
  );

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
