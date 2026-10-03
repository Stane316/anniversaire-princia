/**
 * useInView — révélation au scroll (mécanisme du dossier de référence
 * « Dossier 18 Jenny », reconstruit pour PRINCIA en bleu).
 * Une seule fois, jamais d'attente de contenu : sous reduced-motion,
 * l'état « visible » est immédiat. Observer déconnecté proprement.
 *
 * Garde de visibilité (3 oct. 2026) : si l'observer n'a rien signalé
 * sous 1,4 s (contexte dégradé, API présente mais muette, conteneur
 * exotique), le contenu bascule TOUT DE MÊME en visible — le contenu
 * prime toujours sur l'effet. Aucun impact sur le fonctionnement
 * nominal : le délai n'est qu'un filet de sécurité.
 */
import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setInView(true);
      return;
    }
    let done = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done) {
          done = true;
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    // Filet de sécurité : visibilité garantie même sans signal.
    const guard = window.setTimeout(() => {
      if (!done) {
        done = true;
        setInView(true);
        io.disconnect();
      }
    }, 1400);
    return () => {
      window.clearTimeout(guard);
      io.disconnect();
    };
  }, [threshold]);

  return { ref, inView };
}
