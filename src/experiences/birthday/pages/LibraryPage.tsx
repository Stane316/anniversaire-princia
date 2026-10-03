/**
 * BL-03 — Vue principale de Blue Library (doc 01 §5.5).
 * - les chapitres sont ouverts librement (pas d'ordre artificiel
 *   bloquant), l'ordre recommandé reste lisible visuellement ;
 * - accès visible à The 18th Case et à la lettre ;
 * - l'apparition en cascade est décorative (CSS) : le contenu reste
 *   accessible sans animation (doc 02 §12.4, §16).
 */
import { Link } from "react-router-dom";
import { BirthdayLayout } from "../BirthdayLayout";
import { birthdayChapters, libraryContent, libraryCodex, sealedVolume } from "../data/content";
import { Icon } from "../../../components/ui/Icon";
import { RulesBoard } from "../../../components/library/RulesBoard";
import { ReaderCard } from "../../../components/library/ReaderCard";
import { ExLibrisStamp } from "../../../components/library/ExLibrisStamp";

export function LibraryPage() {
  return (
    <BirthdayLayout back={{ to: "/birthday", label: "Retour à la couverture" }}>
      <section className="container section container--editorial">
        <header className="stack" style={{ marginBottom: "var(--space-10)" }}>
          <p className="kicker stagger-item" style={{ "--stagger-index": 0 } as React.CSSProperties}>
            {libraryContent.kicker}
          </p>
          <h1 className="h2 stagger-item" style={{ "--stagger-index": 1 } as React.CSSProperties}>
            {libraryContent.title}
          </h1>
          <p className="lead stagger-item" style={{ "--stagger-index": 2, maxWidth: "62ch" } as React.CSSProperties}>
            {libraryContent.intro}
          </p>
          <p
            className="kicker kicker--mono stagger-item"
            style={{ "--stagger-index": 3 } as React.CSSProperties}
          >
            {libraryCodex.institution} · {libraryCodex.collection}
          </p>
        </header>

        {/* L'institution qui porte la fiction : règlement + carte de lectrice (5.1). */}
        <div
          className="library-fiction stagger-item"
          style={{ "--stagger-index": 4, marginBottom: "var(--space-10)" } as React.CSSProperties}
        >
          <RulesBoard />
          <ReaderCard />
        </div>

        <ol
          className="shelf"
          aria-label="Chapitres de l'histoire"
        >
          {birthdayChapters.map((chapter, index) => (
            <li key={chapter.id} className="stagger-item" style={{ "--stagger-index": 3 + index } as React.CSSProperties}>
              <Link
                to={`/birthday/bibliotheque/chapitre/${chapter.id}`}
                className="book-card"
                aria-label={`Chapitre ${chapter.number} : ${chapter.title} — ${chapter.kicker}`}
              >
                <div
                  className="book-cover"
                  style={
                    {
                      "--book-top": chapter.gradient.top,
                      "--book-bottom": chapter.gradient.bottom,
                    } as React.CSSProperties
                  }
                >
                  <div className="cluster cluster--between">
                    <span className="book-cover__number">CH. {chapter.number}</span>
                    <Icon name="book-open" size={18} style={{ opacity: 0.85 }} />
                  </div>
                  <div>
                    <p className="book-cover__kicker">{chapter.kicker}</p>
                    <h2 className="book-cover__title">{chapter.title}</h2>
                    <p className="book-cover__cote">{chapter.callNumber}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}

          {/* La lettre : un "livre" à part, toujours accessible (doc 01 §5.7). */}
          <li
            className="stagger-item"
            style={{ "--stagger-index": 3 + birthdayChapters.length } as React.CSSProperties}
          >
            <Link
              to="/birthday/lettre"
              className="book-card book-card--letter"
              aria-label="La lettre — le message principal du cadeau"
            >
              <div className="book-cover">
                <div className="cluster cluster--between">
                  <span className="book-cover__number">LA LETTRE</span>
                  <Icon name="letter" size={18} style={{ opacity: 0.7 }} />
                </div>
                <div>
                  <p className="book-cover__kicker">Le chapitre hors-chapitre</p>
                  <h2 className="book-cover__title">Pour tes dix-huit ans</h2>
                  <p className="book-cover__cote">PRC-18/L∞ · hors collection</p>
                </div>
                <ExLibrisStamp
                  text={libraryCodex.stampText}
                  subline={libraryCodex.stampSubline}
                  size={84}
                  rotate={-11}
                />
              </div>
            </Link>
          </li>

          {/* 5.4 — Le volume sous scellé : visible, mystérieux, jamais un verrou sur la lettre. */}
          <li
            className="stagger-item"
            style={{ "--stagger-index": 4 + birthdayChapters.length } as React.CSSProperties}
          >
            <Link
              to="/birthday/bibliotheque/chapitre/volume-scelle"
              className="book-card book-card--sealed"
              aria-label={`Volume sous scellé — ${sealedVolume.sealed.title}`}
            >
              <div className="book-cover">
                <div className="cluster cluster--between">
                  <span className="book-cover__number">VOLUME S</span>
                  <span className="book-card__seal-dot" aria-hidden="true">
                    S
                  </span>
                </div>
                <div>
                  <p className="book-cover__kicker">{sealedVolume.kicker}</p>
                  <h2 className="book-cover__title">{sealedVolume.sealed.title}</h2>
                  <p className="book-cover__cote">{sealedVolume.cote}</p>
                </div>
              </div>
            </Link>
          </li>
        </ol>

        <div
          className="cluster cluster--between card stagger-item"
          style={
            {
              marginTop: "var(--space-10)",
              "--stagger-index": 5 + birthdayChapters.length,
              alignItems: "center",
              gap: "var(--space-5)",
            } as React.CSSProperties
          }
        >
          <div className="cluster">
            <Icon name="magnifier" size={24} style={{ color: "var(--color-primary)" }} />
            <div>
              <h2 className="h4">The 18th Case</h2>
              <p className="text-muted">{libraryContent.caseTeaser}</p>
            </div>
          </div>
          <Link to="/birthday/enquete" className="btn btn--secondary">
            Ouvrir l'enquête
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>
    </BirthdayLayout>
  );
}
