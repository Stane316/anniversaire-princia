/**
 * 5.2 — Livre à pages tournantes (doc 02 §14 : CSS d'abord, anime.js
 * pour l'orchestration).
 *
 * Fonctionnement :
 * - le contenu (méta + texte) est rendu STATIQUEMENT, toujours lisible ;
 * - le feuillet n'est qu'un voile 3D décoratif : pivoter ne bloque
 *   jamais l'accès au contenu (doc 02 §12.4), il est `aria-hidden` ;
 * - mi-course (90°), on navigue vers le chapitre cible : le contenu
 *   sous le feuillet change pendant que la page est de profil ;
 * - prefers-reduced-motion : navigation immédiate, aucun feuillet
 *   (doc 02 §16) ; nettoyage des animations au démontage (doc 03 §12.7).
 */
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { animate, type JSAnimation } from "animejs";
import type { BirthdayChapter } from "../../experiences/birthday/data/content";
import { Icon } from "../ui/Icon";
import { MarginNote } from "../library/MarginNote";
import { ExLibrisStamp } from "../library/ExLibrisStamp";
import { useReducedMotion } from "../../motion/useReducedMotion";

interface FlipState {
  direction: "forward" | "backward";
  targetIndex: number;
  /** Numéros figés au départ : le feuillet ne change pas en vol. */
  frontNumber: string;
  backNumber: string;
}

function chapterUrl(id: string) {
  return `/birthday/bibliotheque/chapitre/${id}`;
}

export function ReadingBook({
  chapters,
  currentIndex,
}: {
  chapters: BirthdayChapter[];
  currentIndex: number;
}) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [flip, setFlip] = useState<FlipState | null>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const animationsRef = useRef<JSAnimation[]>([]);

  const chapter = chapters[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === chapters.length - 1;
  const previousChapter = isFirst ? undefined : chapters[currentIndex - 1];
  const nextChapter = isLast ? undefined : chapters[currentIndex + 1];

  // Annonce et repères à chaque chapitre affiché (focus titre = doux
  // pour clavier et lecteurs d'écran, doc 02 §16.5).
  useEffect(() => {
    const id = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 60);
    return () => window.clearTimeout(id);
  }, [chapter.id]);

  const startFlip = (targetIndex: number) => {
    if (flip || targetIndex === currentIndex) return;
    if (reducedMotion) {
      navigate(chapterUrl(chapters[targetIndex].id));
      return;
    }
    const target = chapters[targetIndex];
    rootRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    const direction = targetIndex > currentIndex ? "forward" : "backward";
    // Faces selon le sens : posée, la page affiche toujours le bon folio.
    setFlip({
      direction,
      targetIndex,
      frontNumber: direction === "forward" ? chapter.number : target.number,
      backNumber: direction === "forward" ? target.number : chapter.number,
    });
  };

  useEffect(() => {
    if (!flip) return;
    const leaf = leafRef.current;
    if (!leaf) {
      setFlip(null);
      return;
    }
    let cancelled = false;
    const from = flip.direction === "forward" ? 0 : -180;
    const to = flip.direction === "forward" ? -180 : 0;
    const mid = from + (to - from) / 2;

    leaf.style.transform = `rotateY(${from}deg)`;
    leaf.style.opacity = "1";

    const first = animate(leaf, {
      rotateY: [from, mid],
      duration: 340,
      ease: "inSine",
      onComplete: () => {
        if (cancelled) return;
        navigate(chapterUrl(chapters[flip.targetIndex].id));
        // Le contenu a changé sous le feuillet : on le repose en douceur.
        const second = animate(leaf, {
          rotateY: [mid, to],
          duration: 340,
          ease: "outSine",
          onComplete: () => {
            if (!cancelled) setFlip(null);
          },
        });
        animationsRef.current.push(second);
      },
    });
    animationsRef.current.push(first);

    return () => {
      cancelled = true;
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = [];
    };
    // chapters navigate stables ; flip pilote le cycle.
  }, [flip]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <article ref={rootRef} className="container section" aria-labelledby="chapter-heading">
      <div className="reading-book" data-flipping={flip ? "true" : undefined}>
        {/* Méta du chapitre — page de gauche (au-dessus sur mobile). */}
        <div className="reading-book__page reading-book__page--meta">
          <p className="reading-book__cote">{chapter.callNumber}</p>
          <p className="reading-book__number serif">
            Chapitre <span>{chapter.number}</span>
          </p>
          <p className="kicker kicker--mono">{chapter.kicker}</p>
          <h1 id="chapter-heading" ref={headingRef} tabIndex={-1} className="reading-book__title">
            {chapter.title}
          </h1>
          {chapter.aside ? <p className="reading-book__aside">{chapter.aside}</p> : null}
          <MarginNote label="La bibliothécaire, en marge">{chapter.marginNote}</MarginNote>
          <ExLibrisStamp text="EX · LIBRIS" subline={chapter.callNumber} size={86} rotate={-8} />
        </div>

        {/* Texte du chapitre — page de droite (sous le feuillet). */}
        <div className="reading-book__page reading-book__page--text">
          <div className="prose reading-book__prose">
            {chapter.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <nav className="reading-book__nav" aria-label="Tourner les pages">
            {previousChapter ? (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => startFlip(currentIndex - 1)}
                disabled={Boolean(flip)}
                aria-label={`Revenir d'une page — ${previousChapter.title}`}
              >
                <Icon name="arrow-left" size={16} />
                <span className="reading-book__nav-label">
                  <span className="reading-book__nav-hint">Revenir d'une page</span>
                  {previousChapter.title}
                </span>
              </button>
            ) : (
              <span />
            )}
            {nextChapter ? (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => startFlip(currentIndex + 1)}
                disabled={Boolean(flip)}
                aria-label={`Tourner la page — ${nextChapter.title}`}
              >
                <span className="reading-book__nav-label reading-book__nav-label--right">
                  <span className="reading-book__nav-hint">Tourner la page</span>
                  {nextChapter.title}
                </span>
                <Icon name="arrow-right" size={16} />
              </button>
            ) : (
              <Link to="/birthday/lettre" className="btn btn--primary">
                <span className="reading-book__nav-label reading-book__nav-label--right">
                  <span className="reading-book__nav-hint">Fin des chapitres</span>
                  Continuer vers la lettre
                </span>
                <Icon name="letter" size={16} />
              </Link>
            )}
          </nav>
        </div>

        {/* Feuillet : voile 3D décoratif (aria-hidden, non interactif). */}
        <div
          ref={leafRef}
          className={`book-leaf${flip ? " book-leaf--active" : ""}`}
          aria-hidden="true"
          style={{ opacity: 0 }}
        >
          <div className="book-leaf__face book-leaf__face--front">
            <span className="book-leaf__folio">
              {flip?.frontNumber}
            </span>
          </div>
          <div className="book-leaf__face book-leaf__face--back">
            <span className="book-leaf__folio">
              {flip?.backNumber}
            </span>
          </div>
        </div>
      </div>

      <p className="center text-muted reading-book__reminder">
        La lettre reste accessible à tout moment depuis le bandeau, en haut de la page.
      </p>
    </article>
  );
}
