/**
 * Accueil de l'espace quotidien (doc 01 §8).
 * - donne une vue simple des fonctions RÉELLEMENT disponibles ;
 * - pas de statistiques artificielles : les compteurs reflètent les
 *   données réelles ; en cas d'erreur de chargement, les cartes
 *   restent utilisables sans chiffres (dégradation élégante) ;
 * - mémorise la visite : les prochains accès à « / » mèneront
 *   directement ici (doc 01 §7.4), l'expérience anniversaire
 *   restant accessible depuis « Souvenirs ».
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import type { IconName } from "../../components/ui/Icon";
import { bookRepository, taskRepository, winRepository, visitMemory } from "../../data/repositories";
import { dueLabel } from "../../lib/datetime";
import { daypartLabel, getDaypart } from "../../lib/daypart";
import {
  birthdayCountdown,
  presenceGreeting,
  wordOfTheDay,
} from "./data/presence";
import { PwaInstallCard } from "../../app/PwaInstallCard";

interface Summary {
  books: number;
  readingNow: number;
  openTasks: number;
  nextDueLabel: string | null;
  wins: number;
}

function FeatureCard({
  to,
  icon,
  title,
  description,
  stat,
}: {
  to: string;
  icon: IconName;
  title: string;
  description: string;
  stat?: string;
}) {
  return (
    <Link to={to} className="card card--hover stack" style={{ textDecoration: "none", color: "inherit", gap: "var(--space-3)" }}>
      <span
        aria-hidden="true"
        style={{
          width: 46,
          height: 46,
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface-blue)",
          color: "var(--color-primary-strong)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={22} />
      </span>
      <div>
        <h2 className="h4">{title}</h2>
        <p className="text-secondary" style={{ fontSize: "var(--text-body-sm)" }}>
          {description}
        </p>
      </div>
      {stat ? <p className="badge badge--neutral">{stat}</p> : null}
    </Link>
  );
}

export function DailyHome() {
  const [summary, setSummary] = useState<Summary | null>(null);
  // 5.6 — Présence : évaluée une fois au rendu (dates réelles, pas de boucle).
  const daypart = getDaypart();
  const countdown = birthdayCountdown();

  useEffect(() => {
    // Première visite de l'espace : mémorisée pour les prochains accès
    // (doc 01 §7.4). Le contenu anniversaire reste toujours accessible.
    visitMemory.markDailySpaceVisited();

    let cancelled = false;
    const load = async () => {
      try {
        const [books, tasks, wins] = await Promise.all([
          bookRepository.getAll(),
          taskRepository.getAll(),
          winRepository.getAll(),
        ]);
        if (cancelled) return;
        const open = tasks.filter((t) => !t.completed && t.dueDate);
        open.sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
        setSummary({
          books: books.length,
          readingNow: books.filter((b) => b.status === "reading").length,
          openTasks: tasks.filter((t) => !t.completed).length,
          nextDueLabel: open.length > 0 && open[0].dueDate ? dueLabel(open[0].dueDate) : null,
          wins: wins.length,
        });
      } catch {
        // Données indisponibles : l'accueil s'affiche sans compteurs
        // (les fonctionnalités restent accessibles — doc 01 §8.3).
        if (!cancelled) setSummary(null);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="container section container--editorial page-enter">
      <header className="stack" style={{ marginBottom: "var(--space-8)" }}>
        <p className="kicker">
          {presenceGreeting(daypart)} · Ton espace
        </p>
        <h1 className="h2">Bienvenue dans la suite, Princia</h1>
        <p className="lead" style={{ maxWidth: "62ch" }}>
          La bibliothèque du cadeau racontait des chapitres déjà écrits. Ici, c'est toi qui
          écris : tes lectures, tes priorités, tes victoires, tes découvertes. Rien n'est
          obligatoire — tout t'appartient.
        </p>
      </header>

      {/* 5.6 — Bande de présence : compte à rebours + mot du jour. */}
      <aside className="presence" aria-label="Présence du jour" style={{ marginBottom: "var(--space-10)" }}>
        <div className={`presence__countdown presence__countdown--${countdown.tone}`}>
          <span className="presence__badge">{countdown.badge}</span>
          <div>
            <p className="presence__eyebrow">Les 18 ans, relève du dossier</p>
            <p className="presence__line">{countdown.line}</p>
          </div>
        </div>
        <blockquote className="presence__word">
          <p className="presence__eyebrow">Mot du jour — {daypartLabel[daypart]}</p>
          <p className="presence__quote">{wordOfTheDay()}</p>
        </blockquote>
      </aside>

      <div
        className="stack"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
          marginBottom: "var(--space-10)",
        }}
      >
        <FeatureCard
          to="/app/lectures"
          icon="book-open"
          title="Ta bibliothèque"
          description="Ce que tu lis, ce que tu veux lire, tes notes."
          stat={summary ? `${summary.books} livre${summary.books > 1 ? "s" : ""}${summary.readingNow > 0 ? ` · ${summary.readingNow} en cours` : ""}` : undefined}
        />
        <FeatureCard
          to="/app/carnet"
          icon="calendar"
          title="Carnet universitaire"
          description="Tes tâches, tes échéances, tes priorités de la semaine."
          stat={summary ? `${summary.openTasks} tâche${summary.openTasks > 1 ? "s" : ""} ouverte${summary.openTasks > 1 ? "s" : ""}${summary.nextDueLabel ? ` · Prochaine échéance : ${summary.nextDueLabel}` : ""}` : undefined}
        />
        <FeatureCard
          to="/app/victoires"
          icon="star"
          title="Mes petites victoires"
          description="Le musée de tes progrès, grands et petits."
          stat={summary ? `${summary.wins} victoire${summary.wins > 1 ? "s" : ""} notée${summary.wins > 1 ? "s" : ""}` : undefined}
        />
        <FeatureCard
          to="/app/decouvrir"
          icon="compass"
          title="À découvrir"
          description="Propositions préparées pour toi et le coin informatique."
          stat="Toujours ouvert"
        />
      </div>

      <aside className="surface-panel cluster cluster--between" aria-label="Revenir aux souvenirs">
        <div className="stack" style={{ gap: "var(--space-2)" }}>
          <h2 className="h4">Revenir aux souvenirs</h2>
          <p className="text-secondary" style={{ maxWidth: "52ch" }}>
            La Blue Library, les chapitres, la lettre et l'enquête restent ouverts, pour toujours.
          </p>
        </div>
        <div className="cluster">
          <Link to="/birthday/bibliotheque" className="btn btn--secondary">
            <Icon name="library" size={16} />
            Blue Library
          </Link>
          <Link to="/birthday/lettre" className="btn btn--text">
            <Icon name="letter" size={16} />
            La lettre
          </Link>
          <Link to="/enquete" className="btn btn--text">
            <Icon name="magnifier" size={16} />
            L'enquête
          </Link>
        </div>
      </aside>

      <PwaInstallCard />
    </section>
  );
}
