/**
 * Particle Text — équivalent natif (solution de repli adaptée, registre
 * React Bits Pro inaccessible sans licence : aucune installation
 * n'a été lancée, erreur 401 évitée par construction).
 *
 * Le prénom est dessiné en particules sur un canvas 2D (aucun WebGL) :
 * - les particules occupent le texte, respirent doucement, se repoussent
 *   sous le pointeur puis reviennent en place (ressort) ;
 * - couleurs du système (bleu ciel → bleu profond) ;
 * - prefers-reduced-motion : texte statique, aucun canvas ;
 * - mobile : densité réduite ; pointerleave : retour tranquille ;
 * - l'accessibilité ne dépend JAMAIS du canvas : un vrai texte
 *   HTML est fourni par la page (sr-only ou copie statique).
 *
 * Nettoyage : rAF annulé, listeners retirés (doc 03 §12.7).
 */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../motion/useReducedMotion";

interface Particle {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  jitterPhase: number;
  color: string;
  size: number;
}

const PALETTE = ["#8ec5ff", "#5b9beb", "#3978d4", "#24559f", "#174a91"] as const;

export function ParticleName({ text, className = "" }: { text: string; className?: string }) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) {
      setFailed(true);
      return;
    }
    let raf = 0;
    let disposed = false;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    const pointer = { x: -9_999, y: -9_999, active: false };
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setFailed(true);
      return;
    }

    const isMobile = window.innerWidth < 640;
    const strideBase = isMobile ? 5 : 4;

    const build = async () => {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {
        /* police de repli système si le chargement échoue */
      }
      if (disposed) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const host = canvas.parentElement;
      if (!host) return;
      width = host.clientWidth;
      height = Math.max(120, Math.round(width * 0.26));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rasterisation du texte → positions cibles des particules.
      const off = document.createElement("canvas");
      const offWidth = 900;
      const offHeight = Math.max(160, Math.round(offWidth * 0.26));
      off.width = offWidth;
      off.height = offHeight;
      const offCtx = off.getContext("2d");
      if (!offCtx) {
        setFailed(true);
        return;
      }
      const fontSize = Math.min(offHeight * 0.78, (offWidth / text.length) * 1.7);
      offCtx.font = `${fontSize}px "DM Serif Display", Georgia, serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#000";
      offCtx.fillText(text, offWidth / 2, offHeight * 0.55);

      const pixels = offCtx.getImageData(0, 0, offWidth, offHeight).data;
      const stride = strideBase;
      particles = [];
      const scaleX = width / offWidth;
      const scaleY = height / offHeight;
      for (let py = 0; py < offHeight; py += stride) {
        for (let px = 0; px < offWidth; px += stride) {
          if (pixels[(py * offWidth + px) * 4 + 3] > 128) {
            const homeX = px * scaleX;
            const homeY = py * scaleY;
            const ratio = homeY / height;
            const colorIdx = Math.min(PALETTE.length - 1, Math.floor(ratio * PALETTE.length + 1));
            particles.push({
              homeX,
              homeY,
              x: homeX + (Math.sin(px * 1.7) * 14),
              y: homeY + (Math.cos(py * 2.3) * 14),
              vx: 0,
              vy: 0,
              jitterPhase: (px + py) % 6.283,
              color: PALETTE[colorIdx],
              size: isMobile ? 1.6 : 1.9,
            });
          }
        }
      }
    };

    const render = (time: number) => {
      if (disposed) return;
      ctx.clearRect(0, 0, width, height);
      const REPULSE_R = isMobile ? 46 : 72;
      for (const p of particles) {
        const drift = Math.sin(time / 1400 + p.jitterPhase) * 0.55;
        let tx = p.homeX;
        let ty = p.homeY + drift;
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < REPULSE_R && d > 0.01) {
            const force = ((REPULSE_R - d) / REPULSE_R) * 9;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }
        p.vx += (tx - p.x) * 0.045;
        p.vy += (ty - p.y) * 0.045;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      raf = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };
    const onResize = () => {
      void build();
    };

    void build().then(() => {
      if (!disposed) raf = window.requestAnimationFrame(render);
    });
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [reducedMotion, text]);

  if (reducedMotion || failed) {
    return <span className="particle-name__static">{text}</span>;
  }
  return (
    <div className={`particle-name ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="particle-name__canvas" />
    </div>
  );
}
