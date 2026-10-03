/**
 * Mécanismes du dossier v2 croisés avec l'audit « Dossier 18 Jenny » :
 * - hero pleine hauteur (min-h-svh) et emblème non animal ;
 * - PV en bloc avec conclusion « récompense de frappe » (is-done) ;
 * - sept faits en focus piloté par le scroll (AN-10 : remap,
 *   smoothstep, fenêtre d'activation, orbe getPointAtLength) ;
 * - nav de lecture (barre rAF + chapitre par IntersectionObserver) ;
 * - grain global bleu, coupé en reduced-motion ;
 * - chapitrage data-chapter complet I..VI.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");
const comp = (file: string) =>
  read(`src/experiences/birthday/components/dossier/${file}`);
const css = read("src/styles/globals.css");

describe("Héros d'enquête v2", () => {
  const cover = comp("CaseCover.tsx");

  it("est une vraie section pleine hauteur avec chapitrage", () => {
    expect(css).toMatch(/\.dossier-cover\s*\{[^}]*min-height:\s*100svh/);
    expect(cover).toContain('data-chapter={caseDossier.chapters[0].label}');
  });

  it("porte un emblème NON animal (grand sceau + ex-libris flottant)", () => {
    expect(cover).toContain("dossier-cover__emblem");
    expect(cover).toContain("dossier-cover__exlibris");
    // L'emblème est vectoriel déclaré : aucune image (photo, animal,
    // mascotte) n'est embarquée dans le héros.
    expect(cover).not.toContain("<img");
    expect(cover).not.toMatch(/🐱|🐈|🦋/u);
  });
});

describe("PV en bloc + récompense de frappe", () => {
  const report = comp("CaseReport.tsx");

  it("frappe le PV paragraphes joints, conclusion masquée jusqu'à done", () => {
    expect(report).toContain('report.paragraphs.join("\\n\\n")');
    expect(report).toContain("done ? \" is-done\"");
    expect(report).toContain("sr-only\">{body}");
  });

  it("le style retient la conclusion folded tant que la frappe court", () => {
    expect(css).toMatch(/\.dossier-conclusion\s*\{[^}]*max-height:\s*0/);
    expect(css).toMatch(/\.dossier-conclusion\.is-done\s*\{[^}]*max-height/);
  });
});

describe("Sept faits — focus piloté par le scroll (AN-10 reconstruit)", () => {
  const facts = comp("CaseFacts.tsx");
  const hook = read("src/motion/useScrollProgress.ts");

  it("remappe l'action utile sur 10 % → 92 % du défilement", () => {
    expect(facts).toContain("(raw - 0.1) / 0.82");
  });

  it("calcule une activation smoothstep par fait avec fenêtre", () => {
    expect(facts).toContain("smoothstep(1 - d / WINDOW_WIDTH)");
    expect(facts).toContain("(i + 0.5) / items.length");
    expect(hook).toContain("smoothstep");
    expect(hook).toContain("{ passive: true }");
    // Seuil de mise à jour (jamais de re-render à chaque pixel).
    expect(hook).toContain("0.001");
  });

  it("l'orbe d'encre suit le chemin SVG via getPointAtLength", () => {
    expect(facts).toContain("getPointAtLength(total * p)");
  });

  it("reduced-motion : activation forcée à 1 et CSS statique", () => {
    expect(facts).toContain("if (reduced) return 1");
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*\.dossier-factfocus \{\s*opacity: 1;/,
    );
  });

  it("le chapitre est déclaré au data-chapter III", () => {
    expect(facts).toContain('data-chapter={caseDossier.chapters[2].label}');
  });
});

describe("Nav de lecture + grain", () => {
  const header = comp("DossierHeader.tsx");
  const grain = read("src/components/effects/GrainLayer.tsx");

  it("barre de progression rAF au scroll, chapitre via IO (-42/-52)", () => {
    expect(header).toContain("requestAnimationFrame(update)");
    expect(header).toContain("{ passive: true }");
    expect(header).toContain('rootMargin: "-42% 0px -52% 0px"');
    expect(header).toContain("[data-chapter]");
  });

  it("le grain est décoratif, bleu, coupé en reduced-motion", () => {
    expect(grain).toContain("if (reduced) return null");
    expect(grain).toContain('aria-hidden="true"');
    expect(css).toMatch(/\.grain-layer\s*\{[^}]*feTurbulence|\.grain-layer[^}]*animation/);
  });
});

describe("Chapitrage complet de la page", () => {
  it("les six chapitres sont posés dans la scène", () => {
    const page = read("src/experiences/birthday/pages/CasePage.tsx");
    expect(page).toContain("<DossierHeader />");
    expect(page).toContain("<GrainLayer />");
    expect(page).toContain("<CaseFacts />");
    expect(page).toContain("<CaseClosure");
    // Conteneur pleine mesure (plus de --readable confiné à 720 px).
    expect(page).toContain('className="dossier-scene__inner container"');
    expect(page).not.toContain("container--readable");
  });
});
