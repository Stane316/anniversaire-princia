/**
 * useTypewriter — machine à écrire séquentielle (mécanisme du dossier
 * de référence « Dossier 18 Jenny », reconstruit pour PRINCIA).
 * - identité stable : la liste est mémorisée par l'appelant ;
 * - reduced-motion : tout est écrit instantanément ;
 * - nettoyage du timer au démontage.
 */
import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useTypewriter(
  lines: readonly string[],
  start: boolean,
  speed = 15,
  pause = 380,
) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState({ line: 0, chars: 0, done: false });

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setProgress({ line: lines.length, chars: 0, done: true });
      return;
    }
    let line = 0;
    let chars = 0;
    let timeout: number;

    const tick = () => {
      if (line >= lines.length) {
        setProgress({ line, chars, done: true });
        return;
      }
      const current = lines[line];
      chars += 1 + Math.floor(Math.random() * 2);
      if (chars >= current.length) {
        setProgress({ line, chars: current.length, done: false });
        line += 1;
        chars = 0;
        timeout = window.setTimeout(tick, pause);
      } else {
        setProgress({ line, chars, done: false });
        timeout = window.setTimeout(tick, speed);
      }
    };
    timeout = window.setTimeout(tick, 400);
    return () => window.clearTimeout(timeout);
  }, [start, reduced, lines, speed, pause]);

  return progress;
}
