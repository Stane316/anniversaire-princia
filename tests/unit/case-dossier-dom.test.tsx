// @vitest-environment jsdom
import { describe, expect, it, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

/**
 * Preuve comportementale (3 oct. 2026) — TOUT le texte de l'enquête
 * est dans le DOM et VISIBLE même quand aucune machine de révélation
 * ne répond : ce test s'exécute dans jsdom, où IntersectionObserver
 * N'EXISTE PAS. Si un texte dépendait encore du seul observer pour
 * apparaître, il échouerait ici.
 *
 * Limite honnête : jsdom ne peint aucun pixel. Ce test prouve la
 * présence dans le DOM + l'état de classes qui garantit la
 * visibilité (is-in posé d'emblée, aucune règle CSS ne masque sans
 * la gâchette `reveal-armed`, vérifiée dans les gardes CSS).
 */
import { CaseCover } from "../../src/experiences/birthday/components/dossier/CaseCover";
import { CaseReport } from "../../src/experiences/birthday/components/dossier/CaseReport";
import { CaseFacts } from "../../src/experiences/birthday/components/dossier/CaseFacts";
import { CaseClosure } from "../../src/experiences/birthday/components/dossier/CaseClosure";
import { caseDossier } from "../../src/experiences/birthday/data/content";

beforeAll(() => {
  // jsdom n'implémente pas matchMedia : stub fidèle « pas de réduction ».
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Enquête — le texte est présent et visible sans observer", () => {
  it("chapitre I (couverture) : titre, lead, fiche d'identification", () => {
    renderWithRouter(<CaseCover />);
    expect(screen.getByText(caseDossier.cover.titleName)).toBeTruthy();
    expect(screen.getByText(caseDossier.cover.lead)).toBeTruthy();
    expect(screen.getByText(caseDossier.cover.bureau)).toBeTruthy();
  });

  it("chapitre II : le PV intégral est rendu (typewriter court-circuité)", () => {
    const { container } = renderWithRouter(<CaseReport />);
    expect(screen.getByText(caseDossier.report.title)).toBeTruthy();
    for (const paragraph of caseDossier.report.paragraphs) {
      // Texte sr-only + texte frappé : au moins l'un des deux le porte.
      expect(container.textContent).toContain(paragraph.slice(0, 60));
    }
  });

  it("chapitre III : les sept faits complets", () => {
    renderWithRouter(<CaseFacts />);
    expect(screen.getByText(caseDossier.factsChapter.title)).toBeTruthy();
    for (const item of caseDossier.factsChapter.items) {
      const card = screen.getByText(item.title);
      expect(card).toBeTruthy();
      const region = card.closest("li");
      expect(region?.textContent).toContain(item.text.slice(0, 40));
    }
  });

  it("tous les blocs [data-reveal] sont visibles d'emblée (is-in)", () => {
    const { container } = renderWithRouter(
      <>
        <CaseCover />
        <CaseReport />
        <CaseFacts />
        <CaseClosure solvedCount={3} totalClues={5} onRestart={() => {}} />
      </>,
    );
    const reveals = Array.from(container.querySelectorAll("[data-reveal]"));
    expect(reveals.length).toBeGreaterThan(10);
    for (const el of reveals) {
      expect(el.classList.contains("is-in")).toBe(true);
    }
  });

  it("les gabarits de chapitres du scroll-spy existent", () => {
    const { container } = renderWithRouter(
      <>
        <CaseCover />
        <CaseReport />
        <CaseFacts />
      </>,
    );
    for (const label of [
      caseDossier.chapters[0].label,
      caseDossier.chapters[1].label,
      caseDossier.chapters[2].label,
    ]) {
      const section = container.querySelector(`[data-chapter="${label}"]`);
      expect(section, label).toBeTruthy();
    }
  });
});
