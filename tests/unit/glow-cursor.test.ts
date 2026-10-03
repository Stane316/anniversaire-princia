/**
 * GlowCursor (composant Stane, React Bits) — gardes d'intégration :
 * - les helpers purs de la source restent fidèles (hexToRgb, clamp) ;
 * - le composant n'est monté qu'avec ses gardes projet (reduced-motion,
 *   repli WebGL) — vérifié sur la source elle-même ;
 * - la traînée est un décor : le verdict garde un scénario sans effet.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { glowCursorInternals } from "../../src/components/effects/GlowCursor";

const { hexToRgb, clamp } = glowCursorInternals;

describe("GlowCursor — helpers de la source (D)", () => {
  it("hexToRgb convertit les formes usuelles", () => {
    expect(hexToRgb("#ffffff")).toEqual([1, 1, 1]);
    expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
    expect(hexToRgb("#0f0")).toEqual([0, 1, 0]);
    // Bleu ciel PRINCIA de la traînée du verdict.
    const [r, g, b] = hexToRgb("#8EC5FF");
    expect(r).toBeCloseTo(0x8e / 255, 3);
    expect(g).toBeCloseTo(0xc5 / 255, 3);
    expect(b).toBeCloseTo(1, 3);
  });

  it("hexToRgb survit aux entrées vides ou malformées", () => {
    expect(hexToRgb("")).toEqual([0, 0, 0]);
    expect(hexToRgb("#zzzzzz")).toEqual([0, 0, 0]);
  });

  it("clamp borne comme attendu par le moteur de traînée", () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-5, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });
});

describe("GlowCursor — gardes projet présentes dans la source intégrée", () => {
  const source = readFileSync(
    resolve(__dirname, "../../src/components/effects/GlowCursor.tsx"),
    "utf8",
  );

  it("le canvas WebGL n'est jamais monté en reduced-motion", () => {
    expect(source).toContain("useReducedMotion");
    expect(source).toContain("{!reducedMotion && (");
  });

  it("un repli silencieux existe si WebGL est indisponible", () => {
    expect(source).toContain("try {");
    expect(source).toContain("WebGL indisponible");
  });

  it("les listeners et le rAF sont nettoyés au démontage", () => {
    expect(source).toContain("removeEventListener('pointermove'");
    expect(source).toContain("cancelAnimationFrame(raf)");
    expect(source).toContain("resizeObserver.disconnect()");
  });

  it("le canvas reste purement décoratif", () => {
    expect(source).toContain('aria-hidden="true"');
    const css = readFileSync(resolve(__dirname, "../../src/styles/globals.css"), "utf8");
    expect(css).toMatch(/\.glow-cursor__canvas\s*\{[^}]*pointer-events:\s*none/);
  });
});

describe("GlowCursor — placement réel dans le verdict", () => {
  const verdict = readFileSync(
    resolve(
      __dirname,
      "../../src/experiences/birthday/components/dossier/CaseVerdict.tsx",
    ),
    "utf8",
  );

  it("la traînée entoure le contenu du verdict (blend screen, bleus PRINCIA)", () => {
    expect(verdict).toContain("<GlowCursor");
    expect(verdict).toContain('blendMode="screen"');
    expect(verdict).toContain("#8EC5FF");
    expect(verdict).toContain("#3978D4");
  });
});
