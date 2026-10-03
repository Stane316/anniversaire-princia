/**
 * Pièce IV — Verdict (mécanisme équivalent au Verdict du dossier de
 * référence « Dossier 18 Jenny », recréé : tampon « RÉSOLUE » qui
 * claque à l'arrivée à l'écran, braises bleues, ex-libris flottant
 * en lieu et place de tout animal).
 * Le verdict reste consultable sans aucune énigme résolue — la
 * pièce jointe précise simplement l'état du dossier.
 */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { caseDossier } from "../../data/content";
import { useInView } from "../../../../motion/useInView";
import { EmberField } from "../../../../components/effects/EmberField";
import { Reveal } from "../../../../components/effects/Reveal";
import { ExLibrisStamp } from "../../../../components/library/ExLibrisStamp";
import { Icon } from "../../../../components/ui/Icon";

export function CaseVerdict({
  completed,
  solvedCount,
  totalClues,
  onComplete,
  onRestart,
}: {
  completed: boolean;
  solvedCount: number;
  totalClues: number;
  onComplete: () => void;
  onRestart: () => void;
}) {
  const verdict = caseDossier.verdict;
  const { ref: stampRef, inView: slam } = useInView<HTMLDivElement>(0.45);

  /* Archivage du verdict dès qu'il entre à l'écran (une fois). */
  useEffect(() => {
    if (slam) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slam]);

  return (
    <section
      className="dossier-verdict"
      id="verdict"
      aria-label={verdict.title}
    >
      <EmberField className="dossier-verdict__embers" />

      <Reveal className="dossier-verdict__head">
        <p className="dossier-verdict__jury">{verdict.juryLine}</p>
        <h2 className="h2">{verdict.title}</h2>
      </Reveal>

      <div
        ref={stampRef}
        className={`dossier-verdict__slam${slam ? " is-slammed" : ""}`}
      >
        <ExLibrisStamp
          text={verdict.stamp}
          subline="Réf. ENQ-18/10-04"
          size={170}
          rotate={-12}
          ink="rgba(23, 74, 145, 0.75)"
        />
        <p className="dossier-verdict__stampline">{verdict.stampLine}</p>
      </div>

      <Reveal delay={160}>
        <p className="dossier-verdict__sentence">{verdict.sentence}</p>
        <p className="dossier-verdict__note text-muted" role="status">
          {solvedCount === totalClues
            ? verdict.completeNote
            : `Dossier consulté — ${solvedCount}/${totalClues} interrogatoires signés. Rien n'empêchait le verdict : il tenait déjà.`}
        </p>
      </Reveal>

      {/* Pièce jointe manuscrite : message personnel sincère
          (ambitions jamais promises, appui offert, amitié de sixième). */}
      <Reveal delay={240}>
        <article className="dossier-letter">
          <span className="dossier-letter__exlibris" aria-hidden="true">
            <ExLibrisStamp text="18" size={64} rotate={8} ink="rgba(23,74,145,0.4)" />
          </span>
          <h3 className="dossier-letter__title">{verdict.messageTitle}</h3>
          {verdict.messageParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          <p className="dossier-letter__signature">{verdict.signature}</p>
          <p className="dossier-letter__hint text-muted">
            <Icon name="sparkles" size={14} /> {verdict.sealedHint}
          </p>
        </article>
      </Reveal>

      <Reveal delay={320}>
        <div className="cluster dossier-verdict__ctas">
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
      {completed && (
        <p className="sr-only" role="status">
          Verdict consulté et archivé.
        </p>
      )}
    </section>
  );
}
