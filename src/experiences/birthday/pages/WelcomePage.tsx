/**
 * BL-01 — Entrée et invitation (doc 01 §5.3).
 * L'action principale est immédiatement identifiable ; aucune animation
 * ne retarde l'accès au contenu ; l'écran n'exige aucune permission.
 *
 * Animation : scintillement décoratif discret (Anime.js) — purement
 * ornemental, arrêté si `prefers-reduced-motion`, nettoyé au démontage
 * (doc 03 §12.7, §12.11).
 */
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { animate } from "animejs";
import { BirthdayLayout } from "../BirthdayLayout";
import { welcomeContent } from "../data/content";
import { useReducedMotion } from "../../../motion/useReducedMotion";

export function WelcomePage() {
  const reducedMotion = useReducedMotion();
  const sparklesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || !sparklesRef.current) return;
    let cancelled = false;
    const sparkles = sparklesRef.current.querySelectorAll<HTMLElement>(".welcome-sparkle");
    const animations = [...sparkles].map((el, i) =>
      animate(el, {
        opacity: [{ to: 0.25 }, { to: 0.9 }],
        scale: [{ to: 0.65 }, { to: 1.15 }],
        duration: 1800 + i * 350,
        delay: i * 220,
        ease: "inOutSine",
        alternate: true,
        loop: true,
      }),
    );
    return () => {
      // Nettoyage : aucun résidu après le démontage (doc 02 §15.4).
      if (cancelled) return;
      cancelled = true;
      animations.forEach((animation) => animation.cancel());
    };
  }, [reducedMotion]);

  return (
    <BirthdayLayout bare>
      <div
        className="page"
        style={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "var(--space-8) var(--space-5)",
          position: "relative",
          overflow: "clip",
        }}
      >
        {/* Décoration : dos de livres flottants + scintillements */}
        <div
          ref={sparklesRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {[
            { left: "12%", top: "18%", size: 10 },
            { left: "82%", top: "26%", size: 8 },
            { left: "70%", top: "72%", size: 12 },
            { left: "20%", top: "78%", size: 7 },
            { left: "48%", top: "10%", size: 9 },
          ].map((s) => (
            <span
              key={`${s.left}${s.top}`}
              className="welcome-sparkle"
              style={{
                position: "absolute",
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                borderRadius: "var(--radius-full)",
                background: "var(--color-accent)",
                opacity: 0.6,
              }}
            />
          ))}
        </div>

        <div className="stack-lg" style={{ maxWidth: "620px", position: "relative" }}>
          <p className="kicker appear">{welcomeContent.kicker}</p>
          <h1 className="display" style={{ textWrap: "balance" }}>
            {welcomeContent.title}
          </h1>
          <p className="lead">{welcomeContent.lead}</p>
          <div className="cluster" style={{ justifyContent: "center" }}>
            <Link to="/birthday" className="btn btn--primary">
              {welcomeContent.cta}
            </Link>
          </div>
          <p className="text-muted">{welcomeContent.footnote}</p>
        </div>
      </div>
    </BirthdayLayout>
  );
}
