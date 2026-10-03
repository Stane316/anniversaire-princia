/**
 * Chapitre III — Les sept faits : scène FOCUS PILOTÉE PAR LE SCROLL
 * (mécanisme AN-10 / J4 de « Dossier 18 Jenny », appliqué ici aux
 * faits de Princia — le mécanisme le plus sophistiqué de la
 * référence, reconstruit FLUIDE).
 *
 * Refonte performance (audit du 3 oct. 2026) : la version initiale
 * passait par du setState React à chaque frame de scroll (7 cartes
 * re-rendues 60×/s, compteur et tampons remontés en vol) → latence
 * et texte « éparpillé ». Désormais : écriture IMPÉRATIVE des seules
 * variables CSS (--fact-a) et de la position de l'orbe, dans un
 * requestAnimationFrame amorti — React ne re-rend JAMAIS pendant le
 * défilement. Mécanique, textes et lisibilité strictement identiques.
 *
 * Mécanique préservée : progression de la section remappée
 * 10 %→92 %, centres (i+0,5)/N, activation smoothstep, orbe d'encre
 * descendant le chemin SVG via getPointAtLength, tampon « CONSTATÉ »
 * dont l'opacité suit l'activation (calc CSS, plus de remontage).
 * Reduced-motion : tout est présent, statique (--fact-a: 1 par
 * défaut, orbe et fondu désactivés).
 */
import { useEffect, useRef } from "react";
import { caseDossier } from "../../data/content";
import { Reveal } from "../../../../components/effects/Reveal";
import { ExLibrisStamp } from "../../../../components/library/ExLibrisStamp";

const WINDOW_WIDTH = 0.17; // largeur d'activation d'un fait (≈ fenêtre référence)

/** Smoothstep x²(3−2x) tel que documenté dans l'audit (J4). */
function smoothstep(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

export function CaseFacts() {
  const facts = caseDossier.factsChapter;
  const items = facts.items;
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const orbRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // Statique : --fact-a vaut 1 par défaut (CSS), orbe absente.
    }
    const section = sectionRef.current;
    const list = listRef.current;
    const path = pathRef.current;
    if (!section || !list) return;

    const itemEls = Array.from(list.querySelectorAll<HTMLElement>(".dossier-factfocus"));
    // Mémo des dernières valeurs : n'écrire la variable CSS que si le
    // changement est perceptible (évite les recalcs de style vides).
    const lastValues = new Array<number>(itemEls.length).fill(-1);
    let pathLength = 0;
    try {
      pathLength = path ? path.getTotalLength() : 0;
    } catch {
      pathLength = 0;
    }

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const raw = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / total),
      );
      // Remap : l'action utile occupe 10 % → 92 % du défilement.
      const p = Math.max(0, Math.min(1, (raw - 0.1) / 0.82));

      for (let i = 0; i < itemEls.length; i++) {
        const center = (i + 0.5) / items.length;
        const d = Math.abs(p - center);
        const a = smoothstep(1 - d / WINDOW_WIDTH);
        if (Math.abs(a - lastValues[i]) > 0.004) {
          lastValues[i] = a;
          itemEls[i].style.setProperty("--fact-a", a.toFixed(3));
        }
      }

      if (path && pathLength > 0 && orbRef.current) {
        const point = path.getPointAtLength(pathLength * p);
        orbRef.current.setAttribute(
          "transform",
          `translate(${point.x} ${point.y})`,
        );
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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
            <g ref={orbRef} className="dossier-facts__orb">
              <circle r="12" fill="rgba(142, 197, 255, 0.35)" />
              <circle r="5.5" fill="var(--color-primary)" />
            </g>
          </svg>
        </div>

        <ol className="dossier-facts__list" ref={listRef}>
          {items.map((fact) => (
            <li key={fact.code} className="dossier-factfocus">
              <article className="dossier-factfocus__card">
                <header className="dossier-factfocus__head">
                  <span className="dossier-factfocus__code">{fact.code}</span>
                  {/* Le tampon est TOUJOURS monté : son opacité suit
                      --fact-a en calc CSS (plus de remontage en vol). */}
                  <span className="dossier-factfocus__stamp" aria-hidden="true">
                    <ExLibrisStamp text="CONSTATÉ" size={70} rotate={-8} ink="rgba(23,74,145,0.4)" />
                  </span>
                </header>
                <h3 className="h3 dossier-factfocus__title">{fact.title}</h3>
                <p className="dossier-factfocus__text">{fact.text}</p>
                <p className="dossier-factfocus__indice">{fact.indice}</p>
              </article>
            </li>
          ))}
        </ol>

        <Reveal>
          <p className="dossier-facts__outro">{facts.outro}</p>
        </Reveal>
      </div>
    </section>
  );
}
