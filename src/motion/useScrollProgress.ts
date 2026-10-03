/**
 * useScrollProgress — progression d'une section pendant le scroll
 * (mécanisme AN-10/GS recensé dans l'audit « Dossier 18 Jenny »,
 * reconstruit pour PRINCIA en natif, zéro dépendance).
 *
 * - listener { passive: true } + requestAnimationFrame (jamais de
 *   setState à chaque pixel : seuil 0.001 comme la référence) ;
 * - reduced-motion : progression forcée à 1 (contenu complet) ;
 * - valeur ∈ [0,1], remap laissé à l'appelant.
 */
import { useEffect, useState, type RefObject } from "react";

export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // queueMicrotask : éviter un setState synchrone dans l'effet.
      queueMicrotask(() => setProgress(1));
      return;
    }
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const p = Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / total),
      );
      setProgress((previous) =>
        Math.abs(previous - p) > 0.001 ? p : previous,
      );
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
  }, [ref]);

  return progress;
}

/** Smoothstep x²(3−2x) tel que documenté dans l'audit (J4). */
export function smoothstep(x: number): number {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}
