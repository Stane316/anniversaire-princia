/**
 * BlueThread — fil d'enquête qui se déroule avec le scroll (mécanisme
 * du dossier de référence « Dossier 18 Jenny », reconstruit : encre
 * bleue, nœuds d'épingle). Purement décoratif (aria-hidden) ;
 * reduced-motion : fil entièrement déroulé, immobile.
 */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../motion/useReducedMotion";

/** Chemin en « S » qui court le long des pièces (vue 360×N). */
const PATH =
  "M180,0 C300,120 60,220 180,340 C300,460 60,560 180,680 C300,800 60,900 180,1020 C300,1140 60,1240 180,1360";

export function BlueThread({
  nodeOffsets,
  className = "",
}: {
  /** Positions (fractions de la hauteur du chemin) des nœuds d'épingle. */
  nodeOffsets: readonly number[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progression : 0 quand le haut entre en bas d'écran, 1 quand
      // le fil a dépassé les deux tiers du défilement du bloc.
      const raw = (vh - rect.top) / (rect.height * 0.66);
      setProgress(Math.max(0, Math.min(1, raw)));
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
  }, [reduced]);

  const [pathLength, setPathLength] = useState(2800);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    if (!pathRef.current) return;
    const total = pathRef.current.getTotalLength();
    setPathLength(total);
    setPoints(
      nodeOffsets.map((offset) => {
        const p = pathRef.current!.getPointAtLength(offset * total);
        return { x: p.x, y: p.y };
      }),
    );
  }, [nodeOffsets]);

  return (
    <div ref={wrapRef} className={`blue-thread ${className}`} aria-hidden="true">
      <svg viewBox="0 0 360 1360" preserveAspectRatio="none">
        <path
          ref={pathRef}
          d={PATH}
          fill="none"
          stroke="var(--color-primary, #2f6fd0)"
          strokeWidth="2.5"
          strokeDasharray={pathLength}
          strokeDashoffset={(1 - progress) * pathLength}
          strokeLinecap="round"
          opacity="0.85"
        />
        {points.map((point, i) => {
          const visible = progress * 1.15 > nodeOffsets[i];
          return (
            <g key={i} opacity={visible ? 1 : 0.25} style={{ transition: "opacity 400ms" }}>
              <circle cx={point.x} cy={point.y} r="11" fill="var(--color-primary, #2f6fd0)" />
              <circle cx={point.x} cy={point.y} r="4.5" fill="var(--color-surface, #fff)" />
              <circle cx={point.x + 4} cy={point.y - 4} r="2" fill="rgba(47,111,208,0.35)" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
