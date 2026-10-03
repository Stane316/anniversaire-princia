import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Gardes-fous — mission « Correction définitive » (3 oct. 2026).
 *
 * P0 enquête : le héros et le rapport avaient des pistes fr à minimum
 * automatique ; en plus, le conteneur commun des chapitres utilisait une
 * piste implicite auto. Le min-content d'une section pouvait donc élargir
 * l'axe partagé et déplacer toutes les sections. Les pistes et leurs items
 * doivent pouvoir se contracter sans supprimer ni réduire leur contenu.
 *
 * P1 galerie : les interactions de la spirale (pause, drag) sont
 * limitées aux CARTES — les marges latérales restent à la page.
 *
 * P1 photo : la photo d'ouverture est préchargée (aucun écran sombre
 * d'attente).
 */
const read = (path: string) =>
  readFileSync(resolve(__dirname, "..", "..", path), "utf8");

const css = read("src/styles/globals.css");
const tokens = read("src/styles/tokens.css");
const spiral = read("src/components/effects/InfiniteSpiral.tsx");
const html = read("index.html");

describe("P0 — Dossier : fondations de layout sans décalage", () => {
  it("les conteneurs clés n'ont chacun qu'UNE définition", () => {
    for (const sel of [
      ".dossier-cover {",
      ".dossier-cover__grid {",
      ".dossier-facts {",
      ".dossier-scene {",
      ".dossier-scene__inner {",
      ".dossier-report__grid {",
    ]) {
      const count = css.split(`\n${sel}`).length - 1;
      expect(count, `${sel} défini ${count} fois`).toBe(1);
    }
  });

  it("le conteneur global garde le centrage et le plafond de 1200 px", () => {
    const container = css.match(/\.container\s*\{[^}]*\}/)?.[0] ?? "";
    expect(container).toContain("width: 100%;");
    expect(container).toContain("max-width: var(--measure-app);");
    expect(container).toContain("margin-inline: auto;");
    expect(tokens).toContain("--measure-app: 1200px;");
  });

  it("les items de couverture et de rapport peuvent se compresser", () => {
    expect(css).toContain(".dossier-cover__main,\n.dossier-cover__side {\n  min-width: 0;");
    expect(css).toContain(".dossier-report__grid > *,\n.dossier-report__side,\n.dossier-report__body {\n  min-width: 0;");
    expect(css).toContain(
      "grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);",
    );
  });

  it("le conteneur commun borne les six chapitres sur le même axe", () => {
    expect(css).toContain(
      "grid-template-columns: minmax(0, 1fr);\n  gap: clamp(4.5rem, 12vw, 9rem);",
    );
    expect(css).toContain(".dossier-scene__inner > * {\n  min-width: 0;");
    const page = read("src/experiences/birthday/pages/CasePage.tsx");
    for (const component of [
      "<CaseCover />",
      "<CaseReport />",
      "<CaseFacts />",
      "<CaseEvidence ",
      "<CaseVerdict",
      "<CaseClosure",
    ]) {
      expect(page, `${component} reste dans le conteneur partagé`).toContain(component);
    }
  });

  it("les grilles internes des chapitres restent sur des pistes compressibles", () => {
    const escapeRegex = (value: string) =>
      value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (const selector of [
      ".dossier-cover__grid",
      ".dossier-cover__main",
      ".dossier-cover__title",
      ".dossier-idcard__rows",
      ".dossier-report__grid",
      ".dossier-report__side",
      ".dossier-conclusion",
      ".dossier-facts",
      ".dossier-facts__head",
      ".dossier-facts__stage",
      ".dossier-facts__list",
      ".dossier-factfocus",
      ".dossier-factfocus__card",
      ".dossier-evidence__head",
      ".dossier-exhibits",
      ".dossier-exhibit",
      ".dossier-solved",
      ".dossier-verdict",
      ".dossier-verdict__slam",
      ".dossier-verdict .glow-cursor__content",
      ".dossier-closure",
    ]) {
      const rules = css.match(
        new RegExp(`${escapeRegex(selector)}\\s*\\{[^}]*\\}`, "g"),
      ) ?? [];
      expect(
        rules.some((rule) => rule.includes("grid-template-columns: minmax(0, 1fr);")),
        `${selector} doit borner sa piste au parent`,
      ).toBe(true);
    }
  });

  it("la grille garde ses deux paliers de colonnes (900 px puis 1024 px)", () => {
    expect(css).toContain(
      "grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.85fr);",
    );
    expect(css).toContain(
      "grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);",
    );
    // La grille hérite de la mesure du .container : aucune largeur
    // propre concurrente ne doit être ajoutée ici.
    const gridRule = css.match(/\.dossier-cover__grid\s*\{[^}]*\}/g);
    expect(gridRule?.length ?? 0).toBeGreaterThanOrEqual(1);
    for (const rule of gridRule ?? []) {
      expect(rule).not.toMatch(/width:\s*min\(/);
      expect(rule).not.toMatch(/100vw/);
    }
    const baseGrid = gridRule?.find((rule) => rule.includes("display: grid")) ?? "";
    expect(baseGrid).toContain("width: 100%;");
    expect(baseGrid).toContain("margin-inline: 0;");
    expect(css).toMatch(/\.dossier-cover__title-lead\s*\{[^}]*overflow-wrap:\s*anywhere;/s);
    expect(css).toMatch(/\.dossier-cover__title-name\s*\{[^}]*overflow-wrap:\s*anywhere;/s);
  });
});

describe("P1 — Spirale : zone interactive = les cartes, pas les marges", () => {
  it("la pause au survol n'est armée que sur une carte", () => {
    expect(spiral).toContain('closest?.(".spiral__item")');
    expect(spiral).toContain("onMouseOver");
  });

  it("le drag ne s'arme que depuis une carte", () => {
    expect(spiral).toContain('?.closest?.(".spiral__item")) {\n          return;\n        }');
  });

  it("le défilement page reste passif (jamais preventDefault global)", () => {
    expect(spiral).toContain("{ passive: true }");
    expect(spiral).not.toMatch(/window\.addEventListener\(['"]wheel/);
  });
});

describe("P1 — Photo d'ouverture : chargement sans écran sombre", () => {
  it("la photo est préchargée depuis le document", () => {
    expect(html).toContain(
      '<link rel="preload" as="image" href="/souvenirs/souvenirs_behanzin.jpeg" />',
    );
  });

  it("le fondu CSS est synchronisé sur FADE_MS (700 ms)", () => {
    expect(css).toContain("opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)");
    expect(css).not.toContain("opacity 620ms cubic-bezier(0.22, 1, 0.36, 1)");
  });
});
