/**
 * useInView — révélation au scroll (mécanisme du dossier de référence
 * « Dossier 18 Jenny », reconstruit pour PRINCIA en bleu).
 * Une seule fois, jamais d'attente de contenu : sous reduced-motion,
 * l'état « visible » est immédiat. Observer déconnecté proprement.
 */
import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}
