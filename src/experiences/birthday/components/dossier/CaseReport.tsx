/**
 * Chapitre II — Rapport préliminaire (PV dactylographié en bloc
 * unique, mécanisme AN-03 de l'audit « Dossier 18 Jenny » : la
 * frappe pilote l'ordre de lecture, et la suite — conclusion + CTA
 * — n'apparaît QUE quand la frappe est finie, reduced-motion : tout
 * est écrit d'emblée et la suite est déjà disponible).
 */
import { caseDossier } from "../../data/content";
import { useTypewriter } from "../../../../motion/useTypewriter";
import { useInView } from "../../../../motion/useInView";
import { Reveal } from "../../../../components/effects/Reveal";
import { ExLibrisStamp } from "../../../../components/library/ExLibrisStamp";

export function CaseReport() {
  const report = caseDossier.report;
  const { ref: pvRef, inView: pvSeen } = useInView<HTMLDivElement>(0.25);
  const body = report.paragraphs.join("\n\n");
  const { line, chars, done } = useTypewriter([body], pvSeen, 12, 300);
  const shown = done || line >= 1 ? body : body.slice(0, chars);

  return (
    <section
      className="dossier-report"
      id="rapport"
      aria-label={report.title}
      data-chapter={caseDossier.chapters[1].label}
    >
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

        <div ref={pvRef} className="dossier-report__body">
          <div className="dossier-pv">
            <p className="dossier-pv__text">
              {/* Texte intégral pour lecteurs d'écran dès l'entrée. */}
              <span className="sr-only">{body}</span>
              <span aria-hidden="true" className="dossier-pv__typed">
                {shown}
              </span>
              {!done && <span className="dossier-caret" aria-hidden="true" />}
            </p>
          </div>

          {/* « Récompense de frappe » : la conclusion et la suite du
              parcours ne se révèlent qu'à la fin du PV. */}
          <div className={`dossier-conclusion${done ? " is-done" : ""}`}>
            <p>{report.conclusion}</p>
            <a href="#faits" className="btn btn--primary">
              {report.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
