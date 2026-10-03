/**
 * Présence (5.6) : moments du jour, compte à rebours réel, mot du jour.
 * Aucune date inventée nulle part : seule le 4 octobre 2026 (validé,
 * doc 00) pilote le compte à rebours.
 */
import { describe, expect, it } from "vitest";
import { dayOfYear, daypartLabel, getDaypart, DAYPARTS } from "../../src/lib/daypart";
import {
  BIRTHDAY_ISO,
  birthdayCountdown,
  presenceGreeting,
  wordOfTheDay,
  wordsOfDay,
} from "../../src/experiences/daily/data/presence";

const at = (h: number) => new Date(2026, 9, 2, h, 30, 0);

describe("getDaypart", () => {
  it("couvre les 4 moments aux bonnes frontières", () => {
    expect(getDaypart(at(0))).toBe("night");
    expect(getDaypart(at(4))).toBe("night");
    expect(getDaypart(at(5))).toBe("morning");
    expect(getDaypart(at(10))).toBe("morning");
    expect(getDaypart(at(11))).toBe("day");
    expect(getDaypart(at(17))).toBe("day");
    expect(getDaypart(at(18))).toBe("evening");
    expect(getDaypart(at(21))).toBe("evening");
    expect(getDaypart(at(22))).toBe("night");
  });

  it("chaque moment possède un libellé et un salut", () => {
    for (const p of DAYPARTS) {
      expect(daypartLabel[p].length).toBeGreaterThan(3);
      expect(presenceGreeting(p)).toMatch(/^Bon(jour|soir)$/);
    }
  });
});

describe("birthdayCountdown", () => {
  it("compte avec la vraie date (doc 00) : avant, jour J, après", () => {
    expect(BIRTHDAY_ISO).toBe("2026-10-04");
    const avant = birthdayCountdown(new Date(2026, 9, 2, 12, 0, 0));
    expect(avant.tone).toBe("waiting");
    expect(avant.badge).toBe("J-2");
    const veille = birthdayCountdown(new Date(2026, 9, 3, 12, 0, 0));
    expect(veille.badge).toBe("J-1");
    const jourJ = birthdayCountdown(new Date(2026, 9, 4, 12, 0, 0));
    expect(jourJ.tone).toBe("today");
    expect(jourJ.badge).toBe("Aujourd'hui");
    expect(jourJ.line).toContain("Joyeux anniversaire");
    const apres = birthdayCountdown(new Date(2026, 9, 7, 12, 0, 0));
    expect(apres.tone).toBe("after");
    expect(apres.badge).toBe("J+3");
  });
});

describe("wordOfTheDay", () => {
  it("est déterministe et tourne sur toute la semaine", () => {
    const jours = Array.from({ length: 7 }, (_, i) => new Date(2026, 9, 4 + i));
    const mots = new Set(jours.map((j) => wordOfTheDay(j)));
    expect(mots.size).toBe(wordsOfDay.length);
    for (const j of jours) {
      expect(wordOfTheDay(j)).toBe(wordOfTheDay(j));
      expect(wordOfTheDay(j).length).toBeGreaterThan(20);
    }
  });

  it("dayOfYear repère le 4 octobre 2026", () => {
    expect(dayOfYear(new Date(2026, 0, 1))).toBe(1);
    expect(dayOfYear(new Date(2026, 9, 4))).toBe(277);
  });
});
