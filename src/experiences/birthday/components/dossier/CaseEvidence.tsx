/**
 * Pièce III — Pièces à conviction (mécanisme équivalent à l'Evidence
 * du dossier de référence « Dossier 18 Jenny », recréé).
 * Fil d'encre bleue qui se déroule au scroll, cartes à inclinaison,
 * tapes, mentions d'archiviste, pièce sous scellés.
 *
 * Énigmes : inlinées dans les pièces A-01..A-03, jamais bloquantes
 * (on peut passer chacune), logique issue de `riddle.ts` inchangée
 * (normalizeAnswer/isChoiceCorrect/isTextCorrect) — source : caseSteps.
 */
import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { caseDossier, caseSteps } from "../../data/content";
import type { CaseStep } from "../../data/content";
import { isChoiceCorrect, isTextCorrect } from "../../riddle";
import { BlueThread } from "../../../../components/effects/BlueThread";
import { Reveal } from "../../../../components/effects/Reveal";
import { useTilt } from "../../../../motion/useTilt";
import { MarginNote } from "../../../../components/library/MarginNote";
import { Icon } from "../../../../components/ui/Icon";

type ClueStep = Extract<CaseStep, { type: "clue" }>;
const CLUES = caseSteps.filter((step): step is ClueStep => step.type === "clue");

const EXHIBIT_META: ReadonlyArray<{ code: string; status: string }> = [
  { code: "Pièce A-01", status: "Rêve sur roues" },
  { code: "Pièce A-02", status: "Affaire de couleur" },
  { code: "Pièce A-03", status: "Recoupement géographique" },
];

function ExhibitFrame({
  code,
  status,
  children,
  index,
}: {
  code: string;
  status: string;
  children: ReactNode;
  index: number;
}) {
  const ref = useTilt<HTMLDivElement>(4.5);
  return (
    <Reveal delay={index * 60}>
      <div ref={ref} className="dossier-exhibit">
        <span className="dossier-exhibit__tape" aria-hidden="true">
          à manipuler avec gants
        </span>
        <header className="dossier-exhibit__head">
          <span className="dossier-exhibit__code">{code}</span>
          <span className="dossier-stamp dossier-stamp--small">{status}</span>
        </header>
        {children}
        <footer className="dossier-exhibit__barcode" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </footer>
      </div>
    </Reveal>
  );
}

/** Interrogatoire non bloquant : erreur conservée, indice sur demande,
 *  possibilité de passer — la résolution reste sa seule issue « Résolu ». */
function RiddleCard({
  clue,
  index,
  solved,
  onSolved,
}: {
  clue: ClueStep;
  index: number;
  solved: boolean;
  onSolved: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const meta = EXHIBIT_META[index];
  const interro = caseDossier.evidence.interrogation;

  const validate = () => {
    const riddle = clue.riddle;
    const ok =
      riddle.kind === "choice"
        ? selected !== null && isChoiceCorrect(riddle, selected)
        : isTextCorrect(riddle, answer);
    if (ok) onSolved(clue.id);
    else setWrong(true);
  };

  return (
    <ExhibitFrame code={meta.code} status={meta.status} index={index}>
      <h3 className="h3 dossier-exhibit__title">{clue.title}</h3>
      <p className="dossier-exhibit__body">{clue.body}</p>
      <MarginNote label="La bibliothécaire, au dossier">{clue.mention}</MarginNote>

      {solved ? (
        <div className="dossier-solved" aria-live="polite">
          <span className="dossier-stamp dossier-stamp--solved">
            {interro.solvedStamp}
          </span>
          <p className="dossier-exhibit__body">
            <strong>{clue.reveal.title} — </strong>
            {clue.reveal.body}
          </p>
          <p className="dossier-exhibit__mention">{clue.reveal.mention}</p>
        </div>
      ) : (
        <div className="stack" role="group" aria-label={clue.riddle.question}>
          <h4 className="h4">{clue.riddle.question}</h4>
          {clue.riddle.kind === "choice" ? (
            <div className="choice-list">
              {clue.riddle.options.map((option, i) => (
                <button
                  key={option.id}
                  type="button"
                  className={`choice-option${selected === option.id ? " choice-option--selected" : ""}`}
                  aria-pressed={selected === option.id}
                  onClick={() => {
                    setSelected(option.id);
                    setWrong(false);
                  }}
                >
                  <span className="choice-option__key">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="field">
              <label className="sr-only" htmlFor={`riddle-${clue.id}`}>
                {clue.riddle.question}
              </label>
              <input
                id={`riddle-${clue.id}`}
                className="field__input"
                type="text"
                value={answer}
                placeholder={interro.placeholder}
                autoComplete="off"
                onChange={(event) => {
                  setAnswer(event.target.value);
                  setWrong(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    validate();
                  }
                }}
              />
            </div>
          )}
          <div aria-live="polite">
            {wrong && (
              <p className="alert alert--info" role="status">
                <Icon name="alert" size={18} />
                <span>
                  {clue.wrongFeedback} {interro.wrongLine}
                </span>
              </p>
            )}
          </div>
          <div className="cluster">
            <button
              type="button"
              className="btn btn--primary"
              onClick={validate}
              disabled={
                clue.riddle.kind === "choice"
                  ? selected === null
                  : answer.trim().length === 0
              }
            >
              {clue.riddle.kind === "choice"
                ? interro.choiceCta
                : interro.textCta}
            </button>
            <button
              type="button"
              className="btn btn--text"
              onClick={() => setHintShown(true)}
              disabled={hintShown}
            >
              <Icon name="sparkles" size={16} />
              {interro.hintCta}
            </button>
            <a href="#verdict" className="btn btn--text">
              {interro.skipCta}
            </a>
          </div>
          {hintShown && (
            <p
              className="text-muted appear"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {clue.hint}
            </p>
          )}
        </div>
      )}
    </ExhibitFrame>
  );
}

export function CaseEvidence({
  solved,
  onSolve,
}: {
  solved: ReadonlySet<string>;
  onSolve: (id: string) => void;
}) {
  const evidence = caseDossier.evidence;
  const solvedCount = CLUES.filter((clue) => solved.has(clue.id)).length;
  return (
    <section className="dossier-evidence" id="pieces" aria-label={evidence.title}>
      <Reveal className="dossier-evidence__head">
        <p className="dossier-piece">{evidence.piece}</p>
        <span className="dossier-stamp">{evidence.tag}</span>
        <h2 className="h2">{evidence.title}</h2>
        <p className="dossier-evidence__stats" role="status">
          Interrogatoires signés : {String(solvedCount).padStart(2, "0")}/
          {String(CLUES.length).padStart(2, "0")} — pièces versées :{" "}
          {evidence.stats.lodged} — disparues : {evidence.stats.missing}
        </p>
        <p className="text-muted">{evidence.stats.note}.</p>
      </Reveal>

      <div className="dossier-evidence__rail">
        <BlueThread nodeOffsets={[0.06, 0.2, 0.34, 0.5, 0.66, 0.84]} />
        <div className="dossier-exhibits">
          {CLUES.map((clue, i) => (
            <RiddleCard
              key={clue.id}
              clue={clue}
              index={i}
              solved={solved.has(clue.id)}
              onSolved={onSolve}
            />
          ))}
          {evidence.prose.map((piece, i) => (
            <ExhibitFrame
              key={piece.id}
              code={piece.code}
              status={piece.status}
              index={CLUES.length + i}
            >
              <h3 className="h3 dossier-exhibit__title">{piece.title}</h3>
              <p className="dossier-exhibit__body">{piece.description}</p>
              <p className="dossier-exhibit__mention">{piece.mention}</p>
            </ExhibitFrame>
          ))}
          <Reveal delay={140}>
            <div className="dossier-exhibit dossier-exhibit--sealed">
              <header className="dossier-exhibit__head">
                <span className="dossier-exhibit__code">
                  {evidence.sealed.code}
                </span>
                <span className="dossier-stamp dossier-stamp--small">
                  Sous scellés
                </span>
              </header>
              <h3 className="h3 dossier-exhibit__title">
                {evidence.sealed.title}
              </h3>
              <div className="dossier-sealed__void" aria-hidden="true">
                ?
              </div>
              <p className="dossier-exhibit__body">
                {evidence.sealed.description}
              </p>
              <Link
                to="/birthday/bibliotheque/chapitre/volume-scelle"
                className="btn btn--secondary"
              >
                <Icon name="book" size={16} />
                {evidence.sealed.cta}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
