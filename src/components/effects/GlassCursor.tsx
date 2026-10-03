/**
 * Glass Cursor — équivalent natif du composant demandé (React Bits Pro,
 * @reactbits-starter/glass-cursor-tw) : l'accès au registre étant
 * impossible depuis cet environnement (erreur réseau exacte consignée
 * au registre documentaire), ce composant est réalisé sans dépendance.
 *
 * Réalisme mesuré (doc 00 §6.2 / doc 03 §12.5) :
 *  - décor pur : aucun pointeur manquant du système, `pointer-events`
 *    à none, jamais au-dessus du focus ;
 *  - pointeurs fins uniquement (mouse/trackpad) : désactivé sur tactile
 *    (media `pointer: coarse`) et sous `prefers-reduced-motion` ;
 *  - nettoyage complet des listeners et rAF au démontage ;
 *  - bleu du système, blur discret via backdrop-filter avec repli.
 */
import { useEffect, useRef, useState } from "react";

export function GlassCursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || !enabled) return;

    let raf = 0;
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let visible = false;
    let onInteractive = false;

    const apply = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      const scale = onInteractive ? 1.65 : 1;
      ring.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      ring.style.opacity = visible ? "1" : "0";
      ring.style.setProperty("--gc-ink", onInteractive ? "rgba(142, 197, 255, 0.5)" : "rgba(142, 197, 255, 0.22)");
      raf = window.requestAnimationFrame(apply);
    };
    raf = window.requestAnimationFrame(apply);

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) visible = true;
      const el = event.target instanceof Element ? event.target : null;
      onInteractive = Boolean(el?.closest("a, button, [role='button'], input, textarea, select, label"));
    };
    const onLeave = () => {
      visible = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={ringRef} className="glass-cursor" aria-hidden="true" />;
}
