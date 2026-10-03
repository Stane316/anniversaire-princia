/**
 * DossierHeader — barre de lecture du dossier (mécanisme AN-11
 * recensé dans l'audit « Dossier 18 Jenny », reconstruit PRINCIA) :
 * fil de progression du scroll (rAF, passif) + nominé du chapitre
 * courant via IntersectionObserver sur [data-chapter].
 * Informationnel pur : jamais bloquant, aria poli, reduced-motion ok.
 */
import { useEffect, useRef, useState } from "react";
import { caseDossier } from "../../data/content";

export function DossierHeader() {
  const barRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState<string>(caseDossier.chapters[0].label);

  /* Progression du document (toute la page du dossier). */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p})`;
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

  /* Chapitre courant : même fenêtre d'observation que la référence. */
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-chapter]");
    if (sections.length === 0) return;
    const onScreen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onScreen.set(entry.target, entry.isIntersecting);
        }
        // Le chapitre le plus haut encore visible gagne.
        let current: Element | null = null;
        sections.forEach((section) => {
          if (onScreen.get(section)) current = section;
        });
        if (current === null) return;
        const label = (current as HTMLElement).dataset['chapter'];
        if (label) setChapter(label);
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );
    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, []);

  return (
    <div className="dossier-nav" role="status" aria-label={`Chapitre : ${chapter}`}>
      <div
        ref={barRef}
        className="dossier-nav__bar"
        aria-hidden="true"
      />
      <span className="dossier-nav__ref">Réf. ENQ-18/10-04</span>
      <span className="dossier-nav__chapter">{chapter}</span>
    </div>
  );
}
