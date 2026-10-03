/**
 * Modèles métier et validation — couche domaine (doc 03 §8).
 * Aucune dépendance à l'interface : ces types et fonctions sont testables
 * isolément (tests/unit).
 */

export type ReadingStatus = "to-read" | "reading" | "completed";

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  "to-read": "À lire",
  reading: "En cours",
  completed: "Terminé",
};

export const BOOK_CATEGORIES = [
  "Roman",
  "Enquête & Mystère",
  "Lecture religieuse",
  "Étude & Méthode",
  "Autre",
] as const;

export interface Book {
  id: string;
  title: string;
  author?: string;
  category?: string;
  status: ReadingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlannerTask {
  id: string;
  title: string;
  note?: string;
  /** Échéance facultative au format YYYY-MM-DD (doc 01 §10 : jamais bloquante). */
  dueDate?: string;
  /** Marque « priorité de la semaine » choisie par Princia (UNI-03). */
  weeklyPriority: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SmallWin {
  id: string;
  text: string;
  category?: string;
  createdAt: string;
}

/* ---------------- Validation (doc 03 §8.8) ---------------- */

const MAX_TITLE = 160;
const MAX_TEXT = 2000;

function clean(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export interface ValidationResult {
  ok: boolean;
  message?: string;
}

export function validateBookTitle(title: string): ValidationResult {
  const t = clean(title);
  if (t.length === 0) return { ok: false, message: "Le titre du livre est nécessaire." };
  if (t.length > MAX_TITLE)
    return { ok: false, message: `Le titre est limité à ${MAX_TITLE} caractères.` };
  return { ok: true };
}

export function validateTaskTitle(title: string): ValidationResult {
  const t = clean(title);
  if (t.length === 0) return { ok: false, message: "La tâche a besoin d'un titre." };
  if (t.length > MAX_TITLE)
    return { ok: false, message: `Le titre est limité à ${MAX_TITLE} caractères.` };
  return { ok: true };
}

export function validateWinText(text: string): ValidationResult {
  const t = clean(text);
  if (t.length === 0)
    return { ok: false, message: "Décris ta victoire en quelques mots." };
  if (t.length > MAX_TEXT)
    return { ok: false, message: `Le texte est limité à ${MAX_TEXT} caractères.` };
  return { ok: true };
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T12:00:00`);
  return !Number.isNaN(d.getTime());
}

export { clean as cleanText };
