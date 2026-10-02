import { describe, expect, it } from "vitest";
import { daysUntil, dueLabel, dueStatus, formatDateFr } from "../../src/lib/datetime";
import { isIsoDate, validateBookTitle, validateTaskTitle, validateWinText } from "../../src/domain/models";

const REF = new Date("2026-10-02T08:00:00");

describe("dates d'échéance", () => {
  it("compte les jours en calendaire local", () => {
    expect(daysUntil("2026-10-02", REF)).toBe(0);
    expect(daysUntil("2026-10-03", REF)).toBe(1);
    expect(daysUntil("2026-10-05", REF)).toBe(3);
    expect(daysUntil("2026-10-09", REF)).toBe(7);
    expect(daysUntil("2026-10-01", REF)).toBe(-1);
  });

  it("distingue les statuts d'échéance sans culpabiliser", () => {
    expect(dueStatus("2026-10-02", REF)).toBe("today");
    expect(dueStatus("2026-10-04", REF)).toBe("soon");
    expect(dueStatus("2026-10-10", REF)).toBe("later");
    expect(dueStatus("2026-09-30", REF)).toBe("overdue");
  });

  it("formate les libellés J-x", () => {
    expect(dueLabel("2026-10-02", REF)).toBe("Aujourd'hui");
    expect(dueLabel("2026-10-03", REF)).toBe("Demain");
    expect(dueLabel("2026-10-05", REF)).toBe("J-3");
    expect(dueLabel("2026-09-30", REF)).toBe("Échue le 30 septembre 2026");
  });

  it("formate une date en français", () => {
    expect(formatDateFr("2026-10-04")).toBe("4 octobre 2026");
  });

  it("rejette une date mal formée", () => {
    expect(Number.isNaN(daysUntil("pas-une-date", REF))).toBe(true);
    expect(isIsoDate("04/10/2026")).toBe(false);
    expect(isIsoDate("2026-10-04")).toBe(true);
  });
});

describe("validation des données (doc 03 §8.8)", () => {
  it("un titre de livre est obligatoire mais raisonnable", () => {
    expect(validateBookTitle("").ok).toBe(false);
    expect(validateBookTitle("   ").ok).toBe(false);
    expect(validateBookTitle("Petit Pays").ok).toBe(true);
    expect(validateBookTitle("x".repeat(161)).ok).toBe(false);
  });

  it("une tâche exige un titre", () => {
    expect(validateTaskTitle("").ok).toBe(false);
    expect(validateTaskTitle("Réviser hydrologie").ok).toBe(true);
  });

  it("une victoire exige un texte", () => {
    expect(validateWinText("").ok).toBe(false);
    expect(validateWinText("J'ai compris les intégrales").ok).toBe(true);
  });
});
