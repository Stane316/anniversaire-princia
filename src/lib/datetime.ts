/**
 * Utilitaires de dates — traités dans le fuseau horaire de l'utilisatrice
 * (doc 03 §8.4 : cohérence avec le fuseau local).
 */

/** Formate une date ISO (jour) en français, ex. « 4 octobre 2026 ». */
export function formatDateFr(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Aujourd'hui au format YYYY-MM-DD (local). */
export function todayIsoDate(): string {
  return toIsoDate(new Date());
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Jours restants avant une échéance (entier signé : négatif = échue).
 * Comparaison en jours calendaires locaux.
 */
export function daysUntil(isoDate: string, reference: Date = new Date()): number {
  const target = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(target.getTime())) return Number.NaN;
  const ref = new Date(reference);
  ref.setHours(12, 0, 0, 0);
  const diff = target.getTime() - ref.getTime();
  return Math.round(diff / 86_400_000);
}

export type DueStatus = "overdue" | "today" | "soon" | "later";

/** Statut d'affichage d'une échéance, neutre et non culpabilisant (doc 01 §10). */
export function dueStatus(isoDate: string, reference?: Date): DueStatus {
  const d = daysUntil(isoDate, reference);
  if (Number.isNaN(d)) return "later";
  if (d < 0) return "overdue";
  if (d === 0) return "today";
  if (d <= 3) return "soon";
  return "later";
}

/** Libellé court et neutre, ex. « J-3 », « Aujourd'hui », « Échue le … ». */
export function dueLabel(isoDate: string, reference?: Date): string {
  const d = daysUntil(isoDate, reference);
  if (Number.isNaN(d)) return formatDateFr(isoDate);
  if (d < 0) return `Échue le ${formatDateFr(isoDate)}`;
  if (d === 0) return "Aujourd'hui";
  if (d === 1) return "Demain";
  return `J-${d}`;
}
