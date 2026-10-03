/**
 * Salut « Joyeux anniversaire, Princia. » — garanti VISIBLE :
 * - rendu par BlurText (composant Stane) au lancement pour tous les
 *   visiteurs, mémorisé ou non ;
 * - repli statique par ErrorBoundary : l'animation peut mourir,
 *   jamais le message (contenu > effet) ;
 * - token de police réel du design system (--font-serif).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const WELCOME = resolve(
  __dirname,
  "../../src/experiences/birthday/pages/WelcomePage.tsx",
);
const GLOBALS = resolve(__dirname, "../../src/styles/globals.css");

describe("Salut d'accueil — présence garantie", () => {
  const page = readFileSync(WELCOME, "utf8");

  it("BlurText reçoit exactement le message d'anniversaire", () => {
    expect(page).toContain('text="Joyeux anniversaire, Princia."');
    expect(page).toContain("<BlurText");
  });

  it("le message est monté dès l'ouverture (après le délai voulu), pour chaque visiteur", () => {
    // greetingReady s'active dès la phase « open » — que l'intro soit
    // réelle (première visite) ou mémorisée (visites suivantes).
    expect(page).toContain('setGreetingReady(true)');
    expect(page).toContain('phase === "open" && greetingReady');
  });

  it("un repli statique affiche le même message si BlurText échoue", () => {
    expect(page).toContain("GreetingBoundary");
    // Le repli réutilise la même typographie que l'effet animé.
    expect(page).toContain(
      '<p className="blur-text welcome-greeting">Joyeux anniversaire, Princia.</p>',
    );
  });

  it("BlurText rend un texte statique immédiat en reduced-motion", () => {
    const blur = readFileSync(
      resolve(__dirname, "../../src/components/text/BlurText.tsx"),
      "utf8",
    );
    expect(blur).toContain("if (reducedMotion)");
    expect(blur).toContain("return <p className={`blur-text ${className}`}>{text}</p>");
  });

  it("la classe du salut utilise un token de police existant", () => {
    const css = readFileSync(GLOBALS, "utf8");
    const block = css.match(/\.welcome-greeting\s*\{[^}]+\}/);
    expect(block).not.toBeNull();
    expect(block![0]).toContain("var(--font-serif)");
    expect(block![0]).not.toContain("--font-display");
  });
});
