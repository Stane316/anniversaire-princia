/**
 * The 18th Case — parcours alternatif facultatif (doc 01 §6).
 *
 * Machine à états simple (doc 03 §7.4) :
 *   0 intro → 1 indice 01 → 2 révélation 01 → 3 indice 02 → 4 révélation 02 → 5 conclusion
 * persistante légère via localStorage (doc 01 §6.10 : jamais d'état
 * incohérent après actualisation).
 *
 * Règles UX respectées :
 * - parcours 100 % facultatif, retour bibliothèque permanent ;
 * - la lettre ne dépend jamais de la résolution (lien visible en
 *   conclusion ET dans le bandeau de navigation) ;
 * - réponses modifiables avant validation, saisie conservée après
 *   erreur, indice supplémentaire sur demande, tentatives illimitées ;
 * - retours neutres et encourageants, jamais culpabilisants (doc 01 §6.7) ;
 * - la progression visuelle (points) reflète l'état fonctionnel réel
 *   (doc 02 §8.2) ;
 * - la révélation "dépliée" est une décoration Anime.js : l'état
 *   fonctionnel change indépendamment de l'animation (doc 03 §12.1).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate } from "animejs";
import { BirthdayLayout } from "../BirthdayLayout";
import { caseContent, caseSteps } from "../data/content";
import type { CaseStep } from "../data/content";
import { isChoiceCorrect, isTextCorrect } from "../riddle";
import { caseProgressMemory } from "../../../data/repositories";
import { Icon } from "../../../components/ui/Icon";
import { useReducedMotion } from "../../../motion/useReducedMotion";
import { MarginNote } from "../../../components/library/MarginNote";
import { ExLibrisStamp } from "../../../components/library/ExLibrisStamp";

/** Numéro de pièce à la Jenny : A-01, A-02… (pure présentation). */
function exhibitNumber(clueIndex: number): string {
  return `A-0${clueIndex + 1}`;
}

type ClueStep = Extract<CaseStep, { type: "clue" }>;

const CLUES = caseSteps.filter((step): step is ClueStep => step.type === "clue");
const LAST_STEP = CLUES.length * 2 + 1; // intro = 0, conclusion = LAST_STEP

function clampProgress(value: number): number {
  if (value < 0) return 0;
  if (value > LAST_STEP) return LAST_STEP;
  return value;
}

export function CasePage() {
  const [progress, setProgress] = useState<number>(() => clampProgress(caseProgressMemory.load()));
  const [selected, setSelected] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const fileRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const goTo = (next: number) => {
    const clamped = clampProgress(next);
    setProgress(clamped);
    caseProgressMemory.save(clamped);
    setSelected(null);
    setAnswer("");
    setWrong(false);
    setHintShown(false);
  };

  /* Décoration uniquement : le changement d'écran ne dépend pas
     d'Anime.js — en cas d'échec, le panneau est déjà affiché. */
  useEffect(() => {
    if (reducedMotion || !fileRef.current) return;
    const animation = animate(fileRef.current, {
      opacity: { from: 0, to: 1 },
      translateY: { from: 14, to: 0 },
      rotateX: { from: "6deg", to: "0deg" },
      duration: 520,
      ease: "outQuint",
    });
    return () => {
      animation.cancel();
    };
  }, [progress, reducedMotion]);

  const currentClue: ClueStep | undefined = useMemo(() => {
    if (progress >= 1 && progress % 2 === 1) return CLUES[(progress - 1) / 2];
    if (progress >= 2 && progress % 2 === 0 && progress < LAST_STEP)
      return CLUES[(progress - 2) / 2];
    return undefined;
  }, [progress]);

  const validate = () => {
    if (!currentClue) return;
    const riddle = currentClue.riddle;
    const ok =
      riddle.kind === "choice"
        ? selected !== null && isChoiceCorrect(riddle, selected)
        : isTextCorrect(riddle, answer);
    if (ok) {
      goTo(progress + 1);
    } else {
      setWrong(true);
    }
  };

  const solvedCount = Math.min(CLUES.length, Math.max(0, Math.floor(progress / 2)));
  const onConclusion = progress >= LAST_STEP;

  return (
    <BirthdayLayout back={{ to: "/birthday/bibliotheque", label: caseContent.intro.back }}>
      <section className="container container--readable section" style={{ paddingBlock: "var(--space-12)" }}>
        <header className="stack" style={{ alignItems: "start", marginBottom: "var(--space-8)" }}>
          <p className="case-reference">
            Réf. {caseContent.reference} — versée à la Grande Salle Bleue
          </p>
          <div className="cluster cluster--between" style={{ width: "100%" }}>
            <span className="case-stamp">{caseContent.intro.stamp}</span>
            <div
              className="case-progress"
              role="img"
              aria-label={`Progression : ${solvedCount} indice${solvedCount > 1 ? "s" : ""} résolu${solvedCount > 1 ? "s" : ""} sur ${CLUES.length}`}
            >
              {CLUES.map((clue, i) => (
                <span
                  key={clue.id}
                  className={`case-progress__dot${
                    i < solvedCount
                      ? " case-progress__dot--done"
                      : i === solvedCount && progress > 0 && !onConclusion
                        ? " case-progress__dot--current"
                        : ""
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="case-counter">
            Pièces vérifiées : {String(solvedCount).padStart(2, "0")}/{String(CLUES.length).padStart(2, "0")}
            {" "}— disparues : 00
          </p>
          <h1 className="h1">{caseContent.intro.title}</h1>
        </header>

        {/* -------- Étape : introduction (CASE-01/02) -------- */}
        {progress === 0 && (
          <div ref={fileRef} className="case-file stack">
            <span className="case-stamp">Ouverture</span>
            <ul className="case-filemeta" aria-label="Mentions du dossier">
              {caseContent.intro.fileMeta.map((meta) => (
                <li key={meta}>{meta}</li>
              ))}
            </ul>
            <div className="prose">
              {caseContent.intro.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} style={{ fontSize: "var(--text-body-lg)" }}>
                  {paragraph}
                </p>
              ))}
            </div>
            <MarginNote label="La bibliothécaire, au dossier">{caseContent.intro.mention}</MarginNote>
            <p className="alert alert--info">
              <Icon name="sparkles" size={18} />
              <span>{caseContent.intro.note}</span>
            </p>
            <div className="cluster" style={{ marginTop: "var(--space-2)" }}>
              <button type="button" className="btn btn--primary" onClick={() => goTo(1)}>
                {caseContent.intro.start}
                <Icon name="arrow-right" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* -------- Étape : indice + énigme (CASE-03/04/05) -------- */}
        {progress >= 1 && progress % 2 === 1 && currentClue && (
          <div ref={fileRef} className="case-file stack-lg">
            <div className="cluster cluster--between" style={{ alignItems: "start" }}>
              <span className="case-stamp">{currentClue.stamp}</span>
              <span className="case-exhibit">
                Pièce {exhibitNumber(CLUES.indexOf(currentClue))} — à manipuler avec gants
              </span>
            </div>
            <h2 className="h3">{currentClue.title}</h2>
            <p style={{ fontSize: "var(--text-body-lg)" }}>{currentClue.body}</p>
            <MarginNote label="La bibliothécaire, au dossier">{currentClue.mention}</MarginNote>

            <div className="stack" role="group" aria-label={currentClue.riddle.question}>
              <h3 className="h4">{currentClue.riddle.question}</h3>

              {currentClue.riddle.kind === "choice" ? (
                <div className="choice-list">
                  {currentClue.riddle.options.map((option, i) => (
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
                      <span className="choice-option__key">{String.fromCharCode(65 + i)}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="field">
                  <label className="sr-only" htmlFor="case-text-answer">
                    {currentClue.riddle.question}
                  </label>
                  <input
                    id="case-text-answer"
                    className="field__input"
                    type="text"
                    value={answer}
                    placeholder={currentClue.riddle.placeholder}
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
                    <span>{currentClue.wrongFeedback}</span>
                  </p>
                )}
              </div>

              <div className="cluster">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={validate}
                  disabled={currentClue.riddle.kind === "choice" ? selected === null : answer.trim().length === 0}
                >
                  Valider ma réponse
                </button>
                <button
                  type="button"
                  className="btn btn--text"
                  onClick={() => setHintShown(true)}
                  disabled={hintShown}
                >
                  <Icon name="sparkles" size={16} />
                  Indice supplémentaire
                </button>
              </div>
              {hintShown && (
                <p className="text-muted appear" style={{ fontFamily: "var(--font-mono)" }}>
                  {currentClue.hint}
                </p>
              )}
            </div>
          </div>
        )}

        {/* -------- Étape : révélation (CASE-06) -------- */}
        {progress >= 2 && progress % 2 === 0 && progress < LAST_STEP && currentClue && (
          <div ref={fileRef} className="case-file stack">
            <span className="case-stamp">{currentClue.reveal.stamp}</span>
            <div className="cluster">
              <Icon name="check-circle" size={26} style={{ color: "var(--color-success)" }} />
              <h2 className="h3">Bonne réponse</h2>
            </div>
            <h3 className="h4" style={{ color: "var(--color-primary-strong)" }}>
              {currentClue.reveal.title}
            </h3>
            <p style={{ fontSize: "var(--text-body-lg)" }}>{currentClue.reveal.body}</p>
            <MarginNote label="La bibliothécaire, au dossier">{currentClue.reveal.mention}</MarginNote>
            <div>
              <button type="button" className="btn btn--primary" onClick={() => goTo(progress + 1)}>
                {progress + 1 >= LAST_STEP ? "Refermer le dossier" : "Indice suivant"}
                <Icon name="arrow-right" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* -------- Étape : conclusion (CASE-07) -------- */}
        {onConclusion && (
          <div ref={fileRef} className="case-file stack-lg case-file--verdict">
            <ExLibrisStamp
              text={caseContent.conclusion.verdictStamp}
              subline={`Réf. ${caseContent.reference}`}
              size={128}
              rotate={-10}
              ink="rgba(23, 74, 145, 0.7)"
            />
            <span className="case-stamp">{caseContent.conclusion.stamp}</span>
            <h2 className="h2">{caseContent.conclusion.title}</h2>
            {caseContent.conclusion.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} style={{ fontSize: "var(--text-body-lg)" }}>
                {paragraph}
              </p>
            ))}
            <ul className="case-filemeta" aria-label="Mentions finales du dossier">
              {caseContent.conclusion.mentions.map((mention) => (
                <li key={mention}>{mention}</li>
              ))}
            </ul>
            <div className="cluster">
              <Link to="/birthday/lettre" className="btn btn--primary">
                <Icon name="letter" size={16} />
                {caseContent.conclusion.toLetter}
              </Link>
              <Link to="/app" className="btn btn--secondary">
                {caseContent.conclusion.toDaily}
              </Link>
            </div>
            <div className="cluster">
              <button type="button" className="btn btn--text" onClick={() => goTo(0)}>
                {caseContent.restart}
              </button>
              <Link to="/birthday/bibliotheque" className="btn btn--text">
                {caseContent.conclusion.toLibrary}
              </Link>
            </div>
          </div>
        )}
      </section>
    </BirthdayLayout>
  );
}
