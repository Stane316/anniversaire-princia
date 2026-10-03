/**
 * Chapitre VI — Affaire classée (fonction du chapitre VII de la
 * référence, recréée : le dernier écran EST la sortie — vers la
 * lettre, la bibliothèque, ou la relance du dossier).
 */
import { Link } from "react-router-dom";
import { caseDossier } from "../../data/content";
import { Reveal } from "../../../../components/effects/Reveal";
import { ExLibrisStamp } from "../../../../components/library/ExLibrisStamp";
import { Icon } from "../../../../components/ui/Icon";

export function CaseClosure({
  solvedCount,
  totalClues,
  onRestart,
}: {
  solvedCount: number;
  totalClues: number;
  onRestart: () => void;
}) {
  const closure = caseDossier.closure;
  const verdict = caseDossier.verdict;
  return (
    <section
      className="dossier-closure"
      id="classement"
      aria-label={closure.title}
      data-chapter={caseDossier.chapters[5].label}
    >
      <Reveal>
        <ExLibrisStamp
          text={closure.stamp}
          subline="Réf. ENQ-18/10-04"
          size={150}
          rotate={-7}
          ink="rgba(23, 74, 145, 0.6)"
        />
      </Reveal>
      <Reveal delay={120}>
        <p className="dossier-piece">{closure.piece}</p>
        <h2 className="h2">{closure.title}</h2>
      </Reveal>
      <Reveal delay={220}>
        <div className="prose dossier-closure__body">
          {closure.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </Reveal>
      <Reveal delay={300}>
        <ul className="case-filemeta" aria-label="Mentions finales du dossier">
          {closure.mentions.map((mention) => (
            <li key={mention}>{mention}</li>
          ))}
          <li>
            Interrogatoires signés lors de cette lecture : {solvedCount}/
            {totalClues} — {solvedCount === totalClues ? "dossier complet" : "le reste t'attend si tu veux y retourner"}.
          </li>
        </ul>
      </Reveal>
      <Reveal delay={380}>
        <p className="text-muted dossier-closure__note">{closure.note}</p>
      </Reveal>
      <Reveal delay={440}>
        <div className="cluster dossier-closure__ctas">
          <Link to="/birthday/lettre" className="btn btn--primary">
            <Icon name="letter" size={16} />
            {verdict.ctaLetter}
          </Link>
          <Link to="/birthday/bibliotheque" className="btn btn--secondary">
            <Icon name="library" size={16} />
            {verdict.ctaLibrary}
          </Link>
          <Link to="/app" className="btn btn--secondary">
            <Icon name="home" size={16} />
            {verdict.ctaDaily}
          </Link>
          <button type="button" className="btn btn--text" onClick={onRestart}>
            {verdict.restart}
          </button>
        </div>
      </Reveal>
    </section>
  );
}
