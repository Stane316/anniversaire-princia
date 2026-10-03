/**
 * Enveloppe, lettre d'accueil et routage (retours Stane, 3 oct. 2026) :
 * - la lettre ne peut JAMAIS rester invisible après l'ouverture
 *   (garde temporelle absolue + voile limité à la seule phase
 *   « opening ») ;
 * - la carte est grande, centrée, et son écriture respire sur tous
 *   les formats ;
 * - l'accueil à l'enveloppe reste joignable pour toujours via une
 *   route dédiée et une entrée du menu cadeaux ;
 * - la traînée lumineuse (GlowCursor) s'étend à la galerie souvenirs.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = resolve(__dirname, "../../src");
const read = (rel: string) => readFileSync(resolve(SRC, rel), "utf8");

describe("WelcomePage — la lettre s'affiche dans TOUS les scénarios", () => {
  const page = read("experiences/birthday/pages/WelcomePage.tsx");

  it("une garde temporelle force l'affichage même si la timeline n'aboutit pas", () => {
    // safeFinish programmé quoi qu'il arrive (promesse irrecevable,
    // cible d'animation disparue pendant l'ouverture…).
    expect(page).toContain("setTimeout(safeFinish, 2500)");
    expect(page).toContain("clearTimeout(guard)");
  });

  it("le voile d'opacité est limité à la seule phase « opening »", () => {
    expect(page).toContain('phase === "opening" ? { opacity: 0 } : undefined');
    // Un seul voile opaque dans toute la page : celui du ternaire
    // « opening » (aucune opacité forcée persistante ailleurs).
    const veils = page.match(/opacity:\s*0\s*\}/g) ?? [];
    expect(veils).toHaveLength(1);
  });

  it("la phase « open » est atteinte par la fin normale ET par la chute en erreur", () => {
    expect(page).toContain("timeline.then(safeFinish)");
    expect(page).toContain("} catch");
    expect(page).toContain("safeFinish();");
  });
});

describe("Invitation — grande, centrée, écriture qui respire", () => {
  const css = read("styles/globals.css");

  it("la carte peut atteindre 880 px (fluide jusqu'à 94 vw)", () => {
    const block = css.match(/\.invitation-card\s*\{[^}]+\}/);
    expect(block).not.toBeNull();
    expect(block![0]).toContain("max-width: min(880px, 94vw)");
    expect(block![0]).toContain("clamp(2rem, 5.5vw, 4rem)");
  });

  it("l'intérieur est espacé (grille à écarts fluides), jamais collé", () => {
    const block = css.match(/\.invitation-card__inner\s*\{[^}]+\}/);
    expect(block).not.toBeNull();
    expect(block![0]).toContain("display: grid");
    expect(block![0]).toContain("gap: clamp(1.1rem, 2.6vw, 1.75rem)");
    // Le titre reste lisible sur petit écran (limite dédiée).
    expect(css).toContain(".invitation-card__inner .display");
  });

  it("le corps de la lettre passe à l'écriture manuscrite lisible (Kalam)", () => {
    const prose = css.match(/\.letter-sheet \.prose > p\s*\{[^}]+\}/);
    expect(prose).not.toBeNull();
    expect(prose![0]).toContain("var(--font-hand)");
    expect(prose![0]).toContain("line-height: 1.85");
    expect(prose![0]).toContain("clamp(1.06rem, 2.6vw, 1.2rem)");
  });

  it("la lettre du verdict partage la même écriture", () => {
    const letter = css.match(/\.dossier-letter p\s*\{[^}]+\}/);
    expect(letter).not.toBeNull();
    expect(letter![0]).toContain("var(--font-hand)");
  });
});

describe("Routage — l'accueil enveloppe reste joignable pour toujours", () => {
  it("une route dédiée /birthday/accueil sert l'invitation sans condition", () => {
    const app = read("app/App.tsx");
    expect(app).toContain('path="/birthday/accueil" element={<WelcomePage />}');
  });

  it("le menu cadeaux propose « l'invitation » vers cette route", () => {
    const layout = read("experiences/daily/DailyLayout.tsx");
    expect(layout).toContain('label: "l\'invitation"');
    expect(layout).toContain('href: "/birthday/accueil"');
  });
});

describe("GlowCursor — traînée visible et étendue aux souvenirs", () => {
  it("le verdict garde sa traînée renforcée (repos long, trace large)", () => {
    const verdict = read(
      "experiences/birthday/components/dossier/CaseVerdict.tsx",
    );
    expect(verdict).toContain("trailWidth={12}");
    expect(verdict).toContain("idleTimeout={2400}");
    expect(verdict).toContain("fadeDuration={1300}");
    expect(verdict).toContain("brightness={1.35}");
    expect(verdict).toContain("opacity={0.95}");
  });

  it("la galerie souvenirs est scénarisée par la traînée (fond nuit)", () => {
    const page = read("experiences/birthday/pages/SouvenirsGalleryPage.tsx");
    expect(page).toContain("<GlowCursor");
    expect(page).toContain('className="souvenirs-fullpage"');
    expect(page).toContain('blendMode="screen"');
    // La spirale reste à l'intérieur : le drag est préservé
    // (canvas pointer-events:none, vérifié dans glow-cursor.test).
    expect(page).toContain("<InfiniteSpiral");
  });

  it("la hauteur plein écran prime sur le style générique du curseur", () => {
    const css = read("styles/globals.css");
    expect(css).toMatch(
      /\.glow-cursor\.souvenirs-fullpage\s*\{[^}]*height:\s*100dvh/,
    );
  });
});
