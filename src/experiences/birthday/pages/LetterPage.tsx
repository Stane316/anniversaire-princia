/**
 * BL-05 — Lettre personnelle (doc 01 §5.7).
 * - mise en page pensée pour la lecture : largeur maîtrisée, typographie
 *   éditoriale, espacements généreux (doc 02 §13.5) ;
 * - texte réel, sélectionnable, aucun effet de frappe ;
 * - la lettre reste accessible après l'anniversaire et ne dépend
 *   d'aucune énigme ni animation.
 */
import { Link } from "react-router-dom";
import { BirthdayLayout } from "../BirthdayLayout";
import { letterContent } from "../data/content";
import { Icon } from "../../../components/ui/Icon";
import { visitMemory } from "../../../data/repositories";

export function LetterPage() {
  const visitedDaily = visitMemory.hasVisitedDailySpace();

  return (
    <BirthdayLayout back={{ to: "/birthday/bibliotheque", label: letterContent.backToLibrary }}>
      <article className="container container--readable section" style={{ paddingBlock: "var(--space-12)" }}>
        <header className="stack" style={{ marginBottom: "var(--space-8)", textAlign: "center" }}>
          <p className="kicker stagger-item" style={{ "--stagger-index": 0 } as React.CSSProperties}>
            {letterContent.kicker}
          </p>
          <h1 className="h1 stagger-item" style={{ "--stagger-index": 1 } as React.CSSProperties}>
            {letterContent.title}
          </h1>
        </header>

        <div className="letter-sheet appear">
          <p className="h4" style={{ fontFamily: "var(--font-serif)", marginBottom: "var(--space-6)" }}>
            {letterContent.salutation}
          </p>
          <div className="prose">
            {letterContent.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 50)}>{paragraph}</p>
            ))}
          </div>
          <blockquote
            className="lead"
            style={{
              fontStyle: "italic",
              fontFamily: "var(--font-serif)",
              fontSize: "1.35rem",
              color: "var(--color-primary-strong)",
              marginBlock: "var(--space-8)",
              textAlign: "center",
            }}
          >
            {letterContent.signatureLine}
          </blockquote>
          <p className="h4">{letterContent.closing}</p>
          <p className="letter-sign">{letterContent.signature}</p>
        </div>

        <nav className="cluster" style={{ justifyContent: "center", marginTop: "var(--space-10)" }}>
          <Link to="/birthday/bibliotheque" className="btn btn--secondary">
            <Icon name="library" size={16} />
            {letterContent.backToLibrary}
          </Link>
          <Link
            to={visitedDaily ? "/app" : "/birthday/finale"}
            className="btn btn--primary"
          >
            {letterContent.continueTo}
            <Icon name="arrow-right" size={16} />
          </Link>
        </nav>
      </article>
    </BirthdayLayout>
  );
}
