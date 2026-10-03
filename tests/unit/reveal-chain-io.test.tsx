// @vitest-environment jsdom
import { describe, expect, it, beforeAll, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Chaîne complète de révélation SIMULÉE COMME UN NAVIGATEUR RÉEL
 * (mission « reprise technique ») — IntersectionObserver mocké à la
 * manière de Chrome : callback asynchrone, d'abord « hors écran »,
 * puis « scroll » simulé vers l'intersection.
 *
 * Ce que ce test DÉMONTRE :
 *  1. le premier callback arme `reveal-armed` sur <html> ;
 *  2. hors écran, le texte est masqué (opacity 0 calculée) — normal ;
 *  3. après le « scroll » simulé, `is-in` arrive et le texte repasse
 *     visible — avec le CSS réel de l'app injecté ;
 *  4. reduced-motion non requis pour la chaîne.
 */
import { CaseCover } from "../../src/experiences/birthday/components/dossier/CaseCover";
import { CaseFacts } from "../../src/experiences/birthday/components/dossier/CaseFacts";
import { caseDossier } from "../../src/experiences/birthday/data/content";

type IOCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

class MockIO {
  static registry: MockIO[] = [];
  cb: IOCallback;
  constructor(cb: IOCallback) {
    this.cb = cb;
    MockIO.registry.push(this);
  }
  observe() {
    // Comme Chrome : premier callback asynchrone, élément hors écran.
    queueMicrotask(() => this.cb([{ isIntersecting: false }]));
  }
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
  static scrollIntoView() {
    for (const io of MockIO.registry) io.cb([{ isIntersecting: true }]);
  }
}

const GLOBAL_CSS = readFileSync(
  resolve(__dirname, "..", "..", "src/styles/globals.css"),
  "utf8",
);

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }),
  });
  const style = document.createElement("style");
  style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
});

beforeEach(() => {
  document.documentElement.classList.remove("reveal-armed");
  MockIO.registry = [];
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
    MockIO;
});

const flush = async () => {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
};

describe("Chaîne de révélation complète (IO simulé à la Chrome)", () => {
  it("armement → masquage hors écran → révélation au scroll", async () => {
    render(
      <MemoryRouter>
        <CaseFacts />
      </MemoryRouter>,
    );
    await flush();

    // 1 — Le premier callback IO a armé le mécanisme globalement.
    expect(document.documentElement.classList.contains("reveal-armed")).toBe(
      true,
    );

    // 2 — Hors écran : le titre du chapitre est masqué (opacity 0
    //    calculée via le CSS réel) — comportement attendu avant
    //    d'atteindre la section.
    const title = screen.getByText(caseDossier.factsChapter.title);
    const block = title.closest("[data-reveal]") as HTMLElement;
    expect(block).not.toBeNull();
    expect(block.classList.contains("is-in")).toBe(false);
    expect(window.getComputedStyle(block).opacity).toBe("0");

    // 3 — « Scroll » : l'utilisateur atteint la section.
    await act(async () => {
      MockIO.scrollIntoView();
    });
    await flush();
    expect(block.classList.contains("is-in")).toBe(true);
    expect(window.getComputedStyle(block).opacity).not.toBe("0");

    // 4 — Chacun des sept faits suit la même promesse.
    for (const item of caseDossier.factsChapter.items) {
      expect(screen.getByText(item.title)).toBeTruthy();
    }
  });

  it("la couverture suit la même chaîne de bout en bout", async () => {
    render(
      <MemoryRouter>
        <CaseCover />
      </MemoryRouter>,
    );
    await flush();
    const lead = screen.getByText(caseDossier.cover.lead);
    const block = lead.closest("[data-reveal]") as HTMLElement;
    expect(block.classList.contains("is-in")).toBe(false);
    await act(async () => {
      MockIO.scrollIntoView();
    });
    await flush();
    expect(block.classList.contains("is-in")).toBe(true);
    expect(window.getComputedStyle(block).opacity).not.toBe("0");
  });
});
