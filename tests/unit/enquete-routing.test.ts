/**
 * Routage de l'enquête (mission reconstruction v2 §8) :
 * - cause réelle du bug corrigée : le menu pointait vers
 *   /birthday/dossier (route renommée/héritée du lot précédent) ;
 * - route canonique /enquete + redirection douce de l'ancienne ;
 * - tous les liens internes convergent ;
 * - repli SPA pour l'hébergement (accès direct + actualisation).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "../..");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");

describe("Routage /enquete — cause réelle corrigée (D)", () => {
  it("la route canonique /enquete mène au dossier", () => {
    const app = read("src/app/App.tsx");
    expect(app).toContain('path="/enquete" element={<CasePage />}');
  });

  it("l'ancienne adresse redirige sans route cassée", () => {
    const app = read("src/app/App.tsx");
    expect(app).toContain(
      'path="/birthday/enquete" element={<Navigate to="/enquete" replace />} />',
    );
  });

  it("le menu de l'espace personnel pointe vers /enquete", () => {
    const layout = read("src/experiences/daily/DailyLayout.tsx");
    expect(layout).toContain('href: "/enquete"');
    expect(layout).not.toContain('href: "/birthday/dossier"');
  });

  it("l'ancienne route obsolète n'existe plus nulle part", () => {
    const app = read("src/app/App.tsx");
    expect(app).not.toContain("/birthday/dossier");
    const library = read("src/experiences/birthday/pages/LibraryPage.tsx");
    expect(library).not.toContain("/birthday/dossier");
    expect(library).toContain('to="/enquete"');
    const cover = read("src/experiences/birthday/pages/CoverPage.tsx");
    expect(cover).toContain('to="/enquete"');
    const finale = read("src/experiences/birthday/pages/FinalePage.tsx");
    expect(finale).toContain('to="/enquete"');
    const dailyHome = read("src/experiences/daily/DailyHome.tsx");
    expect(dailyHome).toContain('to="/enquete"');
  });

  it("le repli SPA est déclaré pour l'hébergement (accès direct + F5)", () => {
    const redirects = read("public/_redirects");
    expect(redirects.trim()).toBe("/*  /index.html  200");
  });
});
