/**
 * useTilt — inclinaison 3D légère des cartes (mécanisme du dossier
 * de référence « Dossier 18 Jenny », reconstruit pour PRINCIA).
 * Souris/trackpads uniquement (hover: hover), jamais en tactile ni en
 * reduced-motion ; listeners et rAF nettoyés.
 */
import { useEffect, useRef } from "react";

export function useTilt<T extends HTMLElement>(max = 5) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      !window.matchMedia("(hover: hover)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let raf = 0;
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--tilt-x", `${(-py * max).toFixed(2)}deg`);
        el.style.setProperty("--tilt-y", `${(px * max).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return ref;
}
