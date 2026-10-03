/**
 * 5.6 — Contenus de présence (espace quotidien).
 *
 * Règles éditoriales identiques au reste : aucun souvenir, date ou
 * conversation inventés ; amitié complice, jamais romantique ; ces
 * phrases relèvent de la VOIX de la bibliothèque (encouragements
 * généraux), pas du récit. STANE : personnalise-les à ta main ici —
 * elles apparaissent une par jour dans l'espace quotidien.
 */
import { dayOfYear, type Daypart } from "../../../lib/daypart";
import { daysUntil } from "../../../lib/datetime";

/** Date réelle et validée (doc 00) : anniversaire de Princia. */
export const BIRTHDAY_ISO = "2026-10-04";

/** ── Compte à rebours des 18 ans (dates réelles uniquement) ── */
export interface BirthdayCountdown {
  badge: string;
  line: string;
  tone: "waiting" | "today" | "after";
}

export function birthdayCountdown(reference: Date = new Date()): BirthdayCountdown {
  const days = daysUntil(BIRTHDAY_ISO, reference);
  if (days > 1) {
    return {
      tone: "waiting",
      badge: `J-${days}`,
      line: `Plus que ${days} petits jours avant les 18 ans. La Grande Salle Bleue retient son souffle — poliment.`,
    };
  }
  if (days === 1) {
    return {
      tone: "waiting",
      badge: "J-1",
      line: "Demain, 18 ans. Le volume le plus important du fonds est déjà sur le présentoir.",
    };
  }
  if (days === 0) {
    return {
      tone: "today",
      badge: "Aujourd'hui",
      line: "Joyeux anniversaire, Princia. Toute la bibliothèque est levée pour toi — et elle tient le coup.",
    };
  }
  return {
    tone: "after",
    badge: `J+${-days}`,
    line:
      days === -1
        ? "18 ans, depuis hier. L'éclat des étoiles dorées n'est pas encore retombé."
        : `${-days} jours déjà dans tes 18 ans. La suite s'écrit bien, paraît-il.`,
  };
}

/** ── Mot du jour : une note par jour, rotation déterministe ── */
export const wordsOfDay: readonly string[] = [
  "Une bibliothèque peut être bleue et rester sage. La tienne a renoncé aux deux.",
  "Pas besoin d'une grande victoire pour qu'elle compte : ici, chaque page lue est versée au dossier.",
  "Priorité du jour, officiellement tamponnée : avancer à ton rythme. C'est déjà beaucoup.",
  "Rappel de la bibliothécaire : un chapitre qui avance lentement n'est pas un chapitre raté.",
  "Si le bleu ciel pouvait s'applaudir, il te ressemblerait. Ouvre un livre, ça te fera une couverture.",
  "Aujourd'hui aussi, le fonds le plus précieux reste le même : tes progrès, petits ou pas.",
  "La Grande Salle Bleue tient ses registres avec soin. Le tien est digne de conservation.",
] as const;

export function wordOfTheDay(reference: Date = new Date()): string {
  return wordsOfDay[dayOfYear(reference) % wordsOfDay.length];
}

/** ── Greeting lié au moment (et aligné avec le ciel ambiant) ── */
export function presenceGreeting(daypart: Daypart): string {
  return daypart === "night" ? "Bonsoir" : daypart === "evening" ? "Bonsoir" : "Bonjour";
}
