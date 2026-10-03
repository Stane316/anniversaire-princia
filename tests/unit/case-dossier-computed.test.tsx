// @vitest-environment jsdom
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Mesure de STYLE CALCULÉ (mission « reprise technique ») — le CSS
 * RÉEL de l'application est injecté dans le document, puis on mesure
 * l'opacité / la visibilité / la couleur finale des textes narratifs
 * de l'enquête. jsdom applique la cascade (sélecteurs de classe,
 * [data-*], !important) — c'est la mesure la plus proche possible
 * du navigateur dans cet environnement.
 *
 * Limite assumée du test : jsdom ne calcule ni calc() ni la mise en
 * page réelle ; les assertions ciblent le MASQUAGE (opacity 0,
 * visibility hidden, display none, couleur transparente), pas la
 * géométrie.
 */
import { CaseCover } from "../../src/experiences/birthday/components/dossier/CaseCover";
import { CaseReport } from "../../src/experiences/birthday/components/dossier/CaseReport";
import { CaseFacts } from "../../src/experiences/birthday/components/dossier/CaseFacts";
import { CaseClosure } from "../../src/experiences/birthday/components/dossier/CaseClosure";
import { caseDossier } from "../../src/experiences/birthday/data/content";

const GLOBAL_CSS = readFileSync(
  resolve(__dirname, "..", "..", "src/styles/globals.css"),
  "utf8",
);

let styleEl: HTMLStyleElement;

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
  styleEl = document.createElement("style");
  styleEl.textContent = GLOBAL_CSS;
  document.head.appendChild(styleEl);
});

afterAll(() => styleEl.remove());

/** Un texte est « peint » si aucun amorti de masquage ne s'applique. */
function expectVisibleText(text: string) {
  const el = screen.getAllByText(text)[0] ?? screen.getByText(text);
  const cs = window.getComputedStyle(el);
  expect(
    cs.opacity,
    `opacity calculée de « ${text.slice(0, 40)}… » = ${cs.opacity}`,
  ).not.toBe("0");
  expect(cs.visibility, `visibility de « ${text.slice(0, 40)}… »`).not.toBe(
    "hidden",
  );
  expect(cs.display, `display de « ${text.slice(0, 40)}… »`).not.toBe("none");
  // Jamais transparent ni recraché couleur fond pure.
  expect(cs.color, `color de « ${text.slice(0, 40)}… » = ${cs.color}`).not.toBe(
    "rgba(0, 0, 0, 0)",
  );
  return el;
}

describe("Enquête — styles calculés des textes (CSS réel injecté)", () => {
  it("chapitre I : bureau, titre, lead, fiche — visibles", () => {
    render(
      <MemoryRouter>
        <CaseCover />
      </MemoryRouter>,
    );
    expectVisibleText(caseDossier.cover.bureau);
    expectVisibleText(caseDossier.cover.titleName);
    expectVisibleText(caseDossier.cover.lead);
  });

  it("chapitre II : titre du rapport + PV — visibles", () => {
    render(
      <MemoryRouter>
        <CaseReport />
      </MemoryRouter>,
    );
    expectVisibleText(caseDossier.report.title);
    expectVisibleText(caseDossier.report.intro);
  });

  it("chapitre III : titre + chacun des sept faits — visibles", () => {
    render(
      <MemoryRouter>
        <CaseFacts />
      </MemoryRouter>,
    );
    expectVisibleText(caseDossier.factsChapter.title);
    for (const item of caseDossier.factsChapter.items) {
      expectVisibleText(item.title);
      expectVisibleText(item.text);
    }
  });

  it("chapitre VI : corps de clôture — visible", () => {
    render(
      <MemoryRouter>
        <CaseClosure solvedCount={2} totalClues={3} onRestart={() => {}} />
      </MemoryRouter>,
    );
    expectVisibleText(caseDossier.closure.title);
  });

  it("aucun bloc [data-reveal] ne conserve une opacité nulle", () => {
    const { container } = render(
      <MemoryRouter>
        <>
          <CaseCover />
          <CaseReport />
          <CaseFacts />
          <CaseClosure solvedCount={0} totalClues={3} onRestart={() => {}} />
        </>
      </MemoryRouter>,
    );
    const reveals = Array.from(container.querySelectorAll("[data-reveal]"));
    for (const el of reveals) {
      // Sans observer (jsdom), is-in est posé d'emblée : la gâchette
      // reveal-armed n'étant JAMAIS posée ici (aucun callback IO), le
      // CSS ne masque de toute façon pas.
      expect(el.classList.contains("is-in")).toBe(true);
    }
  });
});
