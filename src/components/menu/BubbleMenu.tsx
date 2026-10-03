/**
 * BubbleMenu — composant fourni par Stane (React Bits, référence
 * https://reactbits.dev) — intégré tel quel ; dépendance `gsap`
 * installée avec son accord, version 3.15. Adaptations, comportement
 * inchangé :
 *  - classes Tailwind remplacées par les classes projet `.bubble-*`
 *    (styles équivalents dans globals.css) ;
 *  - hors navigation interne : les items utilisent react-router
 *    (même destination, sans rechargement) et le menu se referme ;
 *  - Échap ferme le menu ; reduced-motion : aucune animation gsap
 *    (apparition/disparition immédiates) ; aria maintenu ;
 *  - useFixedPosition monté dans l'en-tête de son espace (Stane).
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useReducedMotion } from "../../motion/useReducedMotion";

export type BubbleMenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: {
    bgColor?: string;
    textColor?: string;
  };
};

export type BubbleMenuProps = {
  logo: ReactNode | string;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  items: BubbleMenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
};

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = "Basculer le menu",
  menuBg = "#fff",
  menuContentColor = "#111",
  items,
  animationEase = "back.out(1.5)",
  animationDuration = 0.5,
  staggerDelay = 0.12
}: BubbleMenuProps) {
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLAnchorElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => {
    if (!isMenuOpen) return;
    setIsMenuOpen(false);
    onMenuClick?.(false);
  };

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  const goTo = (href: string) => {
    closeMenu();
    navigate(href);
  };

  // Échap ferme toujours (accessibilité, doc 02 §16).
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;
    if (reducedMotion) return; // aucune animation : état instantané par CSS

    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: "power3.out"
            },
            "-=" + animationDuration * 0.9
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: "power3.in"
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setShowOverlay(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay, reducedMotion]);

  // Sans animation (reduced-motion) : l'overlay suit l'état sans gsap.
  useEffect(() => {
    if (reducedMotion && !isMenuOpen) setShowOverlay(false);
  }, [reducedMotion, isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;
        bubbles.forEach((bubble, i) => {
          const item = items[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen, items]);

  return (
    <>
      <nav
        className={`bubble-menu ${className ?? ""}`}
        style={style}
        aria-label="Menu des cadeaux de Princia"
        data-open={isMenuOpen || undefined}
      >
        <div
          className="bubble bubble--logo"
          aria-label="Logo"
          style={{ background: menuBg }}
        >
          <span className="bubble__logo-content">
            {typeof logo === "string" ? (
              <img src={logo} alt="Logo" className="bubble-logo" />
            ) : (
              logo
            )}
          </span>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={`bubble bubble--toggle${isMenuOpen ? " open" : ""}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          aria-expanded={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span
            className="menu-line"
            style={{
              background: menuContentColor,
              transform: isMenuOpen ? "translateY(4px) rotate(45deg)" : "none"
            }}
          />
          <span
            className="menu-line menu-line--short"
            style={{
              background: menuContentColor,
              transform: isMenuOpen ? "translateY(-4px) rotate(-45deg)" : "none"
            }}
          />
        </button>
      </nav>

      {showOverlay && (
        <div
          ref={overlayRef}
          className="bubble-menu-items"
          aria-hidden={!isMenuOpen}
          data-open={isMenuOpen || undefined}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        >
          <ul className="pill-list" role="menu" aria-label="Liens du menu">
            {items.map((item, idx) => (
              <li key={idx} role="none" className="pill-col">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="pill-link"
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(item.href);
                  }}
                  style={
                    {
                      "--item-rot": `${item.rotation ?? 0}deg`,
                      "--pill-bg": menuBg,
                      "--pill-color": menuContentColor,
                      "--hover-bg": item.hoverStyles?.bgColor || "#f3f4f6",
                      "--hover-color": item.hoverStyles?.textColor || menuContentColor,
                      background: "var(--pill-bg)",
                      color: "var(--pill-color)"
                    } as CSSProperties
                  }
                  ref={(el) => {
                    if (el) bubblesRef.current[idx] = el;
                  }}
                >
                  <span
                    className="pill-label"
                    ref={(el) => {
                      if (el) labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
