/**
 * BL-01 + 5.3 — Entrée immersive orchestrée.
 *
 * Trois phases :
 *   sealed  → enveloppe cachetée à la cire (un seul bouton : briser) ;
 *   opening → séquence anime.js (sceau brisé → rabat → invitation) ;
 *   open    → invitation ouverte, contenu de welcomeContent.
 *
 * Garanties (doc 02 §12.4, §16 ; doc 03 §12.7) :
 * - skippable à tout moment (« Passer l'introduction » toujours visible) ;
 * - mémorisée : visitMemory.hasSeenIntro → ouverture directe ensuite,
 *   avec possibilité de refermer l'enveloppe pour revoir l'instant ;
 * - prefers-reduced-motion : jamais d'enveloppe, contenu immédiat ;
 * - aucune animation ne retarde le contenu : l'invitation reste dans
 *   le DOM dès la phase d'ouverture (voile visuel, pas barrière) ;
 * - timeline annulée si le composant se démonte en plein vol.
 */
import { useEffect, useRef, useState, Component, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { animate, createTimeline, type JSAnimation, type Timeline } from "animejs";
import { BirthdayLayout } from "../BirthdayLayout";
import { invitationContent, welcomeContent } from "../data/content";
import { visitMemory } from "../../../data/repositories";
import { useReducedMotion } from "../../../motion/useReducedMotion";
import { ExLibrisStamp } from "../../../components/library/ExLibrisStamp";
import BlurText from "../../../components/text/BlurText";
import { Icon } from "../../../components/ui/Icon";

type IntroPhase = "sealed" | "opening" | "open";

/** Le salut BlurText est décoratif : si son moteur d'animation
 *  venait à lever une erreur quelconque, le message doit TOUJOURS
 *  rester visible (contenu > effet — doc 00 §6.2, doc 03 §12.1).
 *  Les équivalents statiques réutilisent la même classe. */
class GreetingBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    // Traçage honnête : l'erreur reste visible en console, jamais masquée.
    console.error("BlurText a échoué — repli statique affiché.", error);
  }
  render() {
    if (this.state.failed) {
      return <p className="blur-text welcome-greeting">Joyeux anniversaire, Princia.</p>;
    }
    return this.props.children;
  }
}

export function WelcomePage() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<IntroPhase>(() =>
    reducedMotion || visitMemory.hasSeenIntro() ? "open" : "sealed",
  );
  // Le message d'accueil BlurText naît un instant APRÈS l'ouverture
  // de l'enveloppe (délai voulu par Stane — contenu jamais bloqué :
  // le titre/lead sont déjà là avant l'apparition du message).
  const [greetingReady, setGreetingReady] = useState(false);

  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealLeftRef = useRef<HTMLSpanElement>(null);
  const sealRightRef = useRef<HTMLSpanElement>(null);
  const inviteRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);

  const finish = () => {
    timelineRef.current = null;
    visitMemory.markIntroSeen();
    setPhase("open");
  };

  // Séquence d'ouverture — décorative : si quoi que ce soit échoue,
  // finish() garantit l'accès au contenu (jamais d'écran bloqué).
  useEffect(() => {
    if (phase !== "opening") return;
    const sealL = sealLeftRef.current;
    const sealR = sealRightRef.current;
    const flap = flapRef.current;
    const envelope = envelopeRef.current;
    const invite = inviteRef.current;
    if (!sealL || !sealR || !flap || !envelope || !invite) {
      finish();
      return;
    }
    let cancelled = false;
    const safeFinish = () => {
      if (!cancelled) finish();
    };
    try {
      const timeline = createTimeline({
        defaults: { ease: "outCubic" },
      });
      timelineRef.current = timeline;
      timeline
        .add(sealL, { translateX: [0, -18], translateY: [0, 54], rotate: [0, -26], opacity: [1, 0], duration: 430 }, 0)
        .add(sealR, { translateX: [0, 18], translateY: [0, 58], rotate: [0, 24], opacity: [1, 0], duration: 430 }, 0)
        .add(flap, { rotateX: [0, -166], duration: 640 }, 230)
        .add(envelope, { translateY: [0, 72], scale: [1, 0.94], opacity: [1, 0], duration: 580 }, 700)
        .add(invite, { opacity: [0, 1], translateY: [28, 0], scale: [0.96, 1], duration: 720 }, 950);
      timeline.then(safeFinish);
    } catch {
      safeFinish();
    }
    return () => {
      cancelled = true;
      timelineRef.current?.cancel();
      timelineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Focus sur le titre une fois l'invitation ouverte (doc 02 §16.5).
  useEffect(() => {
    if (phase !== "open") return;
    const id = window.setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 80);
    return () => window.clearTimeout(id);
  }, [phase]);

  // Délai volonté avant l'arrivée du message « Joyeux anniversaire ».
  useEffect(() => {
    if (phase !== "open") {
      setGreetingReady(false);
      return;
    }
    const id = window.setTimeout(() => setGreetingReady(true), reducedMotion ? 0 : 1050);
    return () => window.clearTimeout(id);
  }, [phase, reducedMotion]);

  // Scintillements décoratifs de l'invitation ouverte (réutilisés de BL-01).
  useEffect(() => {
    if (reducedMotion || phase !== "open" || !sparklesRef.current) return;
    const sparkles = sparklesRef.current.querySelectorAll<HTMLElement>(".welcome-sparkle");
    const animations: JSAnimation[] = [...sparkles].map((el, i) =>
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
    return () => animations.forEach((animation) => animation.cancel());
  }, [reducedMotion, phase]);

  const skip = () => {
    timelineRef.current?.cancel();
    finish();
  };

  return (
    <BirthdayLayout bare>
      <div className="invitation-stage">
        {/* Enveloppe scellée — décorative, la seule action est le bouton. */}
        {phase !== "open" && (
          <div ref={envelopeRef} className="envelope" aria-hidden="true">
            <div className="envelope__back" />
            <div className="envelope__address">
              <p className="envelope__addressee">{invitationContent.addressee}</p>
              <p className="envelope__origin">{invitationContent.origin}</p>
            </div>
            <div className="envelope__postage">{invitationContent.postage}</div>
            <div className="envelope__front" />
            <div ref={flapRef} className="envelope__flap" />
            <div className="envelope__seal">
              <span ref={sealLeftRef} className="envelope__seal-half envelope__seal-half--l">
                P·
              </span>
              <span ref={sealRightRef} className="envelope__seal-half envelope__seal-half--r">
                18
              </span>
            </div>
          </div>
        )}

        {phase === "sealed" && (
          <button
            type="button"
            className="btn btn--primary invitation-stage__cta"
            onClick={() => setPhase("opening")}
            aria-label={invitationContent.sealLabel}
          >
            <Icon name="letter" size={18} />
            {invitationContent.sealCta}
          </button>
        )}

        {/* Invitation : présente dès l'ouverture pour être animée —
            et lisible quoi qu'il arrive. */}
        {phase !== "sealed" && (
          <div
            ref={inviteRef}
            className="invitation-card"
            data-open={phase === "open" || undefined}
            style={phase === "opening" ? { opacity: 0 } : undefined}
          >
            {phase === "open" && (
              <div ref={sparklesRef} aria-hidden="true" className="invitation-card__sparkles">
                {[
                  { left: "8%", top: "14%", size: 9 },
                  { left: "88%", top: "22%", size: 7 },
                  { left: "75%", top: "78%", size: 11 },
                  { left: "14%", top: "82%", size: 6 },
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
            )}
            <ExLibrisStamp text="EX · LIBRIS" subline="PRC-18" size={84} rotate={-9} ink="rgba(57, 120, 212, 0.5)" />
            <div className="stack-lg invitation-card__inner">
              {phase === "open" && greetingReady && (
                <GreetingBoundary>
                  <BlurText
                    text="Joyeux anniversaire, Princia."
                    animateBy="words"
                    direction="top"
                    delay={190}
                    stepDuration={0.5}
                    className="welcome-greeting"
                  />
                </GreetingBoundary>
              )}
              <p className="kicker">{welcomeContent.kicker}</p>
              <h1 ref={headingRef} tabIndex={-1} className="display invitation-card__title">
                {welcomeContent.title}
              </h1>
              <p className="lead">{welcomeContent.lead}</p>
              <div className="cluster" style={{ justifyContent: "center" }}>
                <Link to="/birthday" className="btn btn--primary">
                  {welcomeContent.cta}
                  <Icon name="arrow-right" size={16} />
                </Link>
              </div>
              <p className="text-muted">{welcomeContent.footnote}</p>
              {phase === "open" && !reducedMotion && (
                <button
                  type="button"
                  className="btn btn--text invitation-card__replay"
                  onClick={() => setPhase("sealed")}
                  title={invitationContent.openedNote}
                >
                  {invitationContent.replay}
                </button>
              )}
            </div>
          </div>
        )}

        {phase !== "open" && (
          <button type="button" className="btn btn--text invitation-stage__skip" onClick={skip}>
            {invitationContent.skip}
          </button>
        )}
      </div>
    </BirthdayLayout>
  );
}
