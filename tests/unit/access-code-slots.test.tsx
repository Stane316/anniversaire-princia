// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AccessCodeGate } from "../../src/features/access/AccessCodeGate";
import {
  grantAccessSession,
  hasUnlockedAccessSession,
  revokeAccessSession,
  verifyAccessCode,
} from "../../src/features/access/accessSession";

describe("Code d'accès à 6 chiffres (041026) et composant CodeSlots", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    window.sessionStorage.clear();
    revokeAccessSession();
  });

  it("accepte uniquement 041026 et ne stocke jamais le code en clair dans localStorage ou sessionStorage", () => {
    expect(verifyAccessCode("041026")).toBe(true);
    expect(verifyAccessCode(" 041026 ")).toBe(true);
    expect(verifyAccessCode("041025")).toBe(false);
    expect(verifyAccessCode("000000")).toBe(false);
    expect(verifyAccessCode("41026")).toBe(false);
    expect(verifyAccessCode("0410260")).toBe(false);
    expect(verifyAccessCode("abcdef")).toBe(false);

    grantAccessSession();
    expect(hasUnlockedAccessSession()).toBe(true);
    expect(JSON.stringify(window.localStorage)).not.toContain("041026");
    expect(JSON.stringify(window.sessionStorage)).not.toContain("041026");
  });

  it("bloque l'accès à la lettre tant que le code n'est pas validé, gère une erreur et permet une nouvelle tentative", () => {
    render(
      <AccessCodeGate>
        <div data-testid="protected-letter">Contenu de la lettre d'ouverture</div>
      </AccessCodeGate>,
    );

    // Le contenu protégé ne doit pas être rendu avant validation
    expect(screen.queryByTestId("protected-letter")).toBeNull();
    expect(screen.getByText("Le sceau d'entrée")).toBeTruthy();

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);

    // Saisie d'un code erroné par collage
    fireEvent.paste(inputs[0]!, {
      clipboardData: { getData: () => "111111" },
    });

    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain("Ce code ne correspond pas au sceau");
    // Le message d'erreur ne doit jamais révéler le code 041026
    expect(alert.textContent).not.toContain("041026");
    expect(screen.queryByTestId("protected-letter")).toBeNull();

    // Nouvelle tentative via le bouton « Effacer et réessayer »
    const retryBtn = screen.getByRole("button", {
      name: /Effacer et réessayer/i,
    });
    fireEvent.click(retryBtn);
    expect(screen.queryByRole("alert")).toBeNull();

    // Saisie du bon code 041026 au clavier case par case
    const digits = ["0", "4", "1", "0", "2", "6"];
    digits.forEach((d, idx) => {
      fireEvent.keyDown(inputs[idx]!, { key: d });
    });

    // Clique sur « Entrer maintenant » (ou fin de transition) pour ouvrir la lettre
    const enterBtn = screen.queryByRole("button", {
      name: /Entrer maintenant/i,
    });
    if (enterBtn) {
      fireEvent.click(enterBtn);
    }

    expect(screen.getByTestId("protected-letter")).toBeTruthy();
    expect(hasUnlockedAccessSession()).toBe(true);
  });

  it("supporte le collage formaté (04-10-26) et conserve l'accès au rechargement dans la même session", () => {
    const { unmount } = render(
      <AccessCodeGate>
        <div data-testid="protected-letter">Lettre ouverte</div>
      </AccessCodeGate>,
    );

    const inputs = screen.getAllByRole("textbox");
    fireEvent.paste(inputs[0]!, {
      clipboardData: { getData: () => "04-10-26" },
    });

    const enterBtn = screen.queryByRole("button", {
      name: /Entrer maintenant/i,
    });
    if (enterBtn) {
      fireEvent.click(enterBtn);
    }

    expect(screen.getByTestId("protected-letter")).toBeTruthy();
    unmount();

    // Simule un rechargement de page dans la même session : accès direct sans redemander le code
    render(
      <AccessCodeGate>
        <div data-testid="protected-letter">Lettre ouverte après reload</div>
      </AccessCodeGate>,
    );
    expect(screen.getByTestId("protected-letter").textContent).toBe(
      "Lettre ouverte après reload",
    );
  });
});
