/**
 * Logique pure des énigmes de The 18th Case (doc 01 §6.6).
 * Testable isolément (tests/unit) — jamais liée à l'interface.
 *
 * Règles respectées :
 * - la réponse reste modifiable avant validation ;
 * - une erreur n'efface pas la saisie ;
 * - les variantes de formulation acceptables sont reconnues
 *   (casse, accents, espaces) — une erreur mineure de saisie ne
 *   doit pas bloquer (doc 01 §6.6) ;
 * - aucune limite de tentatives (doc 01 §6.7).
 */
import type { CaseRiddle } from "./data/content";

/** Normalisation tolérante : minuscules, sans accents, espaces condensés. */
export function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

export function isChoiceCorrect(riddle: CaseRiddle, optionId: string): boolean {
  if (riddle.kind !== "choice") return false;
  return riddle.correctOptionId === optionId;
}

export function isTextCorrect(riddle: CaseRiddle, input: string): boolean {
  if (riddle.kind !== "text") return false;
  const clean = normalizeAnswer(input);
  if (clean.length === 0) return false;
  return riddle.acceptedAnswers.some((accepted) => {
    const expected = normalizeAnswer(accepted);
    return clean === expected;
  });
}

/**
 * États de progression d'un indice (doc 02 §8.2 : la progression
 * visuelle reflète l'état fonctionnel réel).
 */
export type ClueState = "available" | "answered-wrong" | "solved";

export const clueStateLabel: Record<ClueState, string> = {
  available: "Disponible",
  "answered-wrong": "À revoir",
  solved: "Résolu",
};

/** Index de progression global dans l'enquête (étapes de `caseSteps`). */
export function countSolved(solvedClueIds: ReadonlySet<string>): number {
  return solvedClueIds.size;
}
