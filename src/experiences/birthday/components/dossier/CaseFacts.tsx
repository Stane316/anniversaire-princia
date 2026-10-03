/**
 * Chapitre III — Les sept faits : scène FOCUS PILOTÉE PAR LE SCROLL
 * (mécanisme AN-10 / J4 de « Dossier 18 Jenny », appliqué ici aux
 * faits de Princia — le mécanise le plus sophistiqué de la référence,
 * reconstruit en natif zéro dépendance).
 *
 * Mécanique exacte : progression p de la section (rAF + seuil de
 * mise à jour), remappée 10 %→92 % ; chaque fait a un centre
 * (i+0,5)/N ; activation = smoothstep(1 − d/fenêtre) ; statuts
 * past/active/future ; une orbe d'encre bleue descend un chemin SVG
 * via getPointAtLength. Reduced-motion : tout est présent, statique.
 *
 * Le fait net au centre est TOUJOURS lisible : les voisins restent
 * consultables (opacité réduite, jamais masqués, contenu contenu).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { caseDossier } from "../../data/content";
import { useScrollProgress, smoothstep } from "../../../../motion/useScrollProgress";
import { Reveal } from "../../../../components/effects/Reveal";
import { ExLibrisStamp } from "../../../../components/library/ExLibrisStamp";

const WINDOW_WIDTH = 0.17; // largeur d'activation d'un fait (≈ fenêtre référence)

export function CaseFacts() {
  const facts = caseDossier.factsChapter;
  const items = facts.items;
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [orb, setOrb] = useState<{ x: number; y: number } | null>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const raw = useScrollProgress(sectionRef);
  // Remap : l'action utile occupe 10 % → 92 % du défilement.
  const p = Math.max(0, Math.min(1, (raw - 0.1) / 0.82));

  /* Orbe d'encre : positionner sur le chemin (getPointAtLength). */
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const point = path.getPointAtLength(total * p);
    setOrb({ x: point.x, y: point.y });
  }, [p]);

  const activations = useMemo(
    () =>
      items.map((_, i) => {
        if (reduced) return 1;
        const center = (i + 0.5) / items.length;
        const d = Math.abs(p - center);
        return smoothstep(1 - d / WINDOW_WIDTH);
      }),
    [items, p, reduced],
  );

  return (
    <section
      ref={sectionRef}
      className="dossier-facts"
      id="faits"
      aria-label={facts.title}
      data-chapter={caseDossier.chapters[2].label}
      style={{ "--fact-items": items.length } as React.CSSProperties}
    >
      <Reveal className="dossier-facts__head">
        <p className="dossier-piece">{facts.piece}</p>
        <span className="dossier-stamp">{facts.tag}</span>
        <h2 className="h2">{facts.title}</h2>
        <p className="dossier-facts__intro">{facts.intro}</p>
      </Reveal>

      <div className="dossier-facts__stage">
        {/* Orbe d'encre guidant la lecture le long du fil vertical. */}
        <div className="dossier-facts__thread" aria-hidden="true">
          <svg viewBox="0 0 60 1000" preserveAspectRatio="none">
            <path
              ref={pathRef}
              d="M30,0 C58,130 2,260 30,390 C58,520 2,650 30,780 C58,900 18,950 30,1000"
              fill="none"
              stroke="rgba(57, 120, 212, 0.28)"
              strokeWidth="2"
              strokeDasharray="5 7"
            />
            {orb && !reduced && (
              <g>
                <circle cx={orb.x} cy={orb.y} r="12" fill="rgba(142, 197, 255, 0.35)" />
                <circle cx={orb.x} cy={orb.y} r="5.5" fill="var(--color-primary)" />
              </g>
            )}
          </svg>
        </div>

        <ol className="dossier-facts__list">
          {items.map((fact, i) => {
            const a = activations[i];
            return (
              <li
                key={fact.code}
                className="dossier-factfocus"
                style={
                  {
                    "--fact-a": a.toFixed(3),
                  } as React.CSSProperties
                }
              >
                <article className="dossier-factfocus__card">
                  <header className="dossier-factfocus__head">
                    <span className="dossier-factfocus__code">{fact.code}</span>
                    {a > 0.82 && !reduced && (
                      <ExLibrisStamp text="CONSTATÉ" size={70} rotate={-8} ink="rgba(23,74,145,0.4)" />
                    )}
                  </header>
                  <h3 className="h3 dossier-factfocus__title">{fact.title}</h3>
                  <p className="dossier-factfocus__text">{fact.text}</p>
                  <p className="dossier-factfocus__indice">{fact.indice}</p>
                </article>
              </li>
            );
          })}
        </ol>

        <Reveal>
          <p className="dossier-facts__outro">{facts.outro}</p>
        </Reveal>
      </div>
    </section>
  );
}
