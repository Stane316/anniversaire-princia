/**
 * EmberField — particules montantes (mécanisme du dossier de
 * référence « Dossier 18 Jenny », reconstruit : braises BLEUES).
 * Canvas 2D léger, uniquement à l'écran ; reduced-motion : rien.
 */
import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../motion/useReducedMotion";

type Ember = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  swaySp: number;
  a: number;
  gold: boolean;
};

export function EmberField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (anywhere = false): Ember => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 12,
      r: 0.8 + Math.random() * 1.8,
      vy: 0.25 + Math.random() * 0.55,
      sway: Math.random() * Math.PI * 2,
      swaySp: 0.008 + Math.random() * 0.014,
      a: 0.2 + Math.random() * 0.5,
      gold: Math.random() < 0.3,
    });

    const embers: Ember[] = Array.from({ length: 34 }, () => spawn(true));
    let raf = 0;
    let running = false;

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of embers) {
        p.y -= p.vy;
        p.sway += p.swaySp;
        p.x += Math.sin(p.sway) * 0.3;
        if (p.y < -14 || p.x < -14 || p.x > w + 14) Object.assign(p, spawn());
        const life = Math.max(0, Math.min(1, (h - p.y) / (h * 0.9)));
        ctx.globalAlpha = p.a * life;
        ctx.fillStyle = p.gold ? "#8EC5FF" : "#3978D4";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <canvas
      ref={canvasRef}
      className={`ember-field ${className}`}
      aria-hidden="true"
    />
  );
}
