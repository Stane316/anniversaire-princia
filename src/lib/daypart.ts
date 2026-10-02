/**
 * Moments de la journée (5.6 — présence).
 * Pur, testable, sans effet de bord : la couche visuelle lit
 * `document.body.dataset.daypart` posée une fois par App.
 */
export type Daypart = "morning" | "day" | "evening" | "night";

export const DAYPARTS: readonly Daypart[] = ["morning", "day", "evening", "night"] as const;

/** 5h–11h : matin · 11h–18h : journée · 18h–22h : soirée · sinon : nuit. */
export function getDaypart(reference: Date = new Date()): Daypart {
  const hour = reference.getHours();
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 18) return "day";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

export const daypartLabel: Record<Daypart, string> = {
  morning: "ce matin",
  day: "aujourd'hui",
  evening: "ce soir",
  night: "cette nuit",
};

/** Jour de l'année (1–366), calendrier local. */
export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}
