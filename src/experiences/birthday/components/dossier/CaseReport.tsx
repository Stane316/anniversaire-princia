/**
 * Pièce II — Rapport préliminaire typewriter (mécanisme équivalent
 * au Report du dossier de référence « Dossier 18 Jenny », recréé).
 * Les constats défilent phrase par phrase quand ils entrent à
 * l'écran ; reduced-motion / hors animation : texte complet direct.
 */
import { caseDossier } from "../../data/content";
import { useTypewriter } from "../../../../motion/useTypewriter";
import { useInView } from "../../../../motion/useInView";
import { Reveal } from "../../../../components/effects/Reveal";
import { ExLibrisStamp } from "../../../../components/library/ExLibrisStamp";

function FactLine({ index, text }: { index: number; text: string }) {
  const { ref, inView } = useInView<HTMLLIElement>(0.3);
  const { line, chars, done } = useTypewriter([text], inView, 14, 300);
  const shown = line >= 1 || done ? text : text.slice(0, chars);
  return (
    <li ref={ref} className={`dossier-fact${done ? " dossier-fact--done" : ""}`}>
      <span className="dossier-fact__num">Fait n°{index + 1}</span>
      <p className="dossier-fact__text">
        <span aria-hidden="true">{shown}</span>
        {/* Texte intégral pour lecteurs d'écran dès l'entrée à l'écran. */}
        <span className="sr-only">{text}</span>
        {!done && <span className="dossier-caret" aria-hidden="true" />}
      </p>
    </li>
  );
}

export function CaseReport() {
  const report = caseDossier.report;
  const { ref: conclusionRef, inView: conclusionSeen } =
    useInView<HTMLDivElement>(0.4);
  return (
    <section className="dossier-report" id="rapport" aria-label={report.title}>
      <div className="dossier-report__grid">
        <div className="dossier-report__side">
          <p className="dossier-piece">{report.piece}</p>
          <Reveal>
            <span className="dossier-stamp">{report.tag}</span>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="h2">{report.title}</h2>
          </Reveal>
          <Reveal delay={220}>
            <p className="dossier-report__intro">{report.intro}</p>
          </Reveal>
          <Reveal delay={320}>
            <ExLibrisStamp
              text={report.stamp}
              size={110}
              rotate={-8}
              ink="rgba(23, 74, 145, 0.55)"
            />
          </Reveal>
        </div>

        <div className="dossier-report__body">
          <ol className="dossier-facts">
            {report.facts.map((fact, i) => (
              <FactLine key={fact.slice(0, 32)} index={i} text={fact} />
            ))}
          </ol>
          <div
            ref={conclusionRef}
            className={`dossier-conclusion${conclusionSeen ? " is-inview" : ""}`}
          >
            <p>{report.conclusion}</p>
            <a href="#pieces" className="btn btn--primary">
              {report.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
