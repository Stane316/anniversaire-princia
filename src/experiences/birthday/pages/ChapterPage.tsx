/**
 * BL-04 — Lecture d'un chapitre (doc 01 §5.6).
 * - texte lisible sans animation ;
 * - navigation aller-retour bibliothèque + chapitre précédent/suivant ;
 * - id inconnu => redirection propre vers la bibliothèque (jamais
 *   d'écran bloqué) ;
 * - les effets décoratifs ne masquent jamais le contenu.
 */
import { Link, Navigate, useParams } from "react-router-dom";
import { BirthdayLayout } from "../BirthdayLayout";
import { birthdayChapters, libraryContent } from "../data/content";
import { Icon } from "../../../components/ui/Icon";

export function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const index = birthdayChapters.findIndex((chapter) => chapter.id === chapterId);
  const chapter = index >= 0 ? birthdayChapters[index] : undefined;

  if (!chapter) {
    return <Navigate to="/birthday/bibliotheque" replace />;
  }

  const previous = index > 0 ? birthdayChapters[index - 1] : undefined;
  const next = index < birthdayChapters.length - 1 ? birthdayChapters[index + 1] : undefined;
  const isLast = !next;

  return (
    <BirthdayLayout back={{ to: "/birthday/bibliotheque", label: libraryContent.backToLibrary }}>
      <article className="container container--readable section">
        <header className="stack" style={{ marginBottom: "var(--space-8)" }}>
          <p className="kicker kicker--mono stagger-item" style={{ "--stagger-index": 0 } as React.CSSProperties}>
            Chapitre {chapter.number} — {chapter.kicker}
          </p>
          <h1 className="h1 stagger-item" style={{ "--stagger-index": 1 } as React.CSSProperties}>
            {chapter.title}
          </h1>
        </header>

        <div className="prose stagger-item" style={{ "--stagger-index": 2 } as React.CSSProperties}>
          {chapter.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} style={{ fontSize: "var(--text-body-lg)" }}>
              {paragraph}
            </p>
          ))}
        </div>

        {chapter.aside ? (
          <figure
            className="surface-panel stagger-item"
            style={{ margin: "var(--space-8) 0", "--stagger-index": 3 } as React.CSSProperties}
          >
            <blockquote className="lead" style={{ fontStyle: "italic" }}>
              {chapter.aside}
            </blockquote>
            <figcaption className="text-muted" style={{ marginTop: "var(--space-2)" }}>
              — Note de marge
            </figcaption>
          </figure>
        ) : null}

        <hr className="divider" />

        <nav
          className="cluster cluster--between"
          aria-label="Navigation entre les chapitres"
          style={{ alignItems: "stretch" }}
        >
          {previous ? (
            <Link to={`/birthday/bibliotheque/chapitre/${previous.id}`} className="btn btn--secondary">
              <Icon name="arrow-left" size={16} />
              <span style={{ textAlign: "left" }}>
                <span className="text-muted" style={{ display: "block", fontSize: "var(--text-caption)" }}>
                  Chapitre précédent
                </span>
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/birthday/bibliotheque/chapitre/${next.id}`} className="btn btn--secondary">
              <span style={{ textAlign: "right" }}>
                <span className="text-muted" style={{ display: "block", fontSize: "var(--text-caption)" }}>
                  Chapitre suivant
                </span>
                {next.title}
              </span>
              <Icon name="arrow-right" size={16} />
            </Link>
          ) : (
            <Link to="/birthday/lettre" className="btn btn--primary">
              Continuer vers la lettre
              <Icon name="letter" size={16} />
            </Link>
          )}
        </nav>

        {isLast ? null : (
          <p className="center text-muted" style={{ marginTop: "var(--space-8)" }}>
            La lettre est accessible à tout moment depuis le bandeau, en haut de la page.
          </p>
        )}
      </article>
    </BirthdayLayout>
  );
}
