/**
 * Écran de code d'accès à 6 chiffres ("041026") placé en toute première étape
 * dès l'ouverture du site, avant la lettre d'ouverture (§6 & §7).
 *
 * Intègre le composant React Bits `<CodeSlots />` avec :
 * - `length={6}`, `status` (`idle` | `error` | `success`), `onChange`, `onComplete` ;
 * - couleurs adaptées à l'identité bleu et blanc de PRINCIA :
 *   `accentColor="#3978D4"`, `inkColor="#3978D4"`, `slotColor="#E4EEFB"`,
 *   `digitColor="#FFFFFF"`, `dangerColor="#ff3b30"` ;
 * - adaptation responsive (`slotSize` et `gap` ajustés sur très petits écrans) ;
 * - états `idle` (saisie), `error` (vidage en cascade sous la teinte danger et
 *   possibilité immédiate de recommencer) et `success` (fusion des 6 cases en
 *   un bandeau bleu avec coche `Tick02Icon`, puis ouverture de la lettre).
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  LockPasswordIcon,
  RefreshIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import CodeSlots, { type CodeSlotsStatus } from "../../components/code/CodeSlots";
import { ExLibrisStamp } from "../../components/library/ExLibrisStamp";
import { useReducedMotion } from "../../motion/useReducedMotion";
import {
  grantAccessSession,
  hasUnlockedAccessSession,
  verifyAccessCode,
} from "./accessSession";

interface AccessCodeGateProps {
  children: ReactNode;
}

function getResponsiveSlotMetrics(): { slotSize: number; gap: number } {
  if (typeof window === "undefined") return { slotSize: 44, gap: 8 };
  const w = window.innerWidth || 390;
  if (w < 360) return { slotSize: 36, gap: 6 };
  if (w < 420) return { slotSize: 40, gap: 7 };
  return { slotSize: 44, gap: 8 };
}

export function AccessCodeGate({ children }: AccessCodeGateProps) {
  const reducedMotion = useReducedMotion();
  const [unlocked, setUnlocked] = useState<boolean>(() =>
    hasUnlockedAccessSession(),
  );
  const [code, setCode] = useState<string>("");
  const [status, setStatus] = useState<CodeSlotsStatus>("idle");
  const [lastAttemptFailed, setLastAttemptFailed] = useState<boolean>(false);
  const [{ slotSize, gap }, setMetrics] = useState(getResponsiveSlotMetrics);
  const unlockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => setMetrics(getResponsiveSlotMetrics());
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (unlockTimerRef.current !== null) {
        window.clearTimeout(unlockTimerRef.current);
      }
    };
  }, []);

  if (unlocked) {
    return <>{children}</>;
  }

  const handleComplete = (completedCode: string) => {
    if (status === "success") return;
    const ok = verifyAccessCode(completedCode);
    if (ok) {
      setLastAttemptFailed(false);
      setStatus("success");
      grantAccessSession();
      const delay = reducedMotion ? 0 : 680;
      if (delay === 0) {
        setUnlocked(true);
      } else {
        unlockTimerRef.current = window.setTimeout(() => {
          unlockTimerRef.current = null;
          setUnlocked(true);
        }, delay);
      }
    } else {
      setLastAttemptFailed(true);
      setStatus("error");
    }
  };

  const handleRetry = () => {
    setCode("");
    setStatus("idle");
    setLastAttemptFailed(false);
  };

  return (
    <main className="access-gate" aria-labelledby="access-gate-title">
      <div className="access-gate__card surface-panel">
        <div className="access-gate__stamp">
          <ExLibrisStamp
            text="BLUE · LIBRARY"
            subline="CH · 18"
            size={76}
            rotate={-7}
            ink="rgba(57, 120, 212, 0.45)"
          />
        </div>

        <p className="kicker kicker--mono">Accès réservé · Chapter 18</p>
        <h1 id="access-gate-title" className="h2 access-gate__title">
          Le sceau d'entrée
        </h1>
        <p className="text-secondary access-gate__lead">
          Avant d'ouvrir l'enveloppe et la bibliothèque de Princia, compose la
          date à six chiffres qui inaugure ce dix-huitième chapitre.
        </p>

        <form
          className="access-gate__form"
          onSubmit={(event) => {
            event.preventDefault();
            if (code.length === 6) {
              handleComplete(code);
            }
          }}
        >
          <CodeSlots
            length={6}
            value={code}
            status={status}
            autoFocus
            onChange={(nextCode) => {
              setCode(nextCode);
              setStatus("idle");
              if (nextCode.length > 0) {
                setLastAttemptFailed(false);
              }
            }}
            onComplete={handleComplete}
            accentColor="#3978D4"
            inkColor="#3978D4"
            slotColor="#E4EEFB"
            digitColor="#FFFFFF"
            dangerColor="#ff3b30"
            slotSize={slotSize}
            gap={gap}
            radius={12}
            bounce={0.2}
            settle={0.3}
            rise={8}
            cascade={20}
            ariaLabel="Code d'accès à 6 chiffres pour ouvrir PRINCIA — Chapter 18"
          />

          <div className="code-slots__status" aria-live="polite">
            {status === "success" ? (
              <span
                className="code-slots__badge code-slots__badge--success"
                role="status"
              >
                <HugeiconsIcon icon={Tick02Icon} size={15} />
                <span>Sceau reconnu — ouverture de Chapter 18…</span>
              </span>
            ) : status === "error" || lastAttemptFailed ? (
              <span
                className="code-slots__badge code-slots__badge--error"
                role="alert"
              >
                <HugeiconsIcon icon={Alert02Icon} size={15} />
                <span>
                  Ce code ne correspond pas au sceau de ce chapitre. Tu peux
                  recommencer.
                </span>
              </span>
            ) : (
              <span className="code-slots__badge code-slots__badge--idle">
                <HugeiconsIcon icon={LockPasswordIcon} size={15} />
                <span>Saisis les 6 chiffres du sceau (JJ · MM · AA)</span>
              </span>
            )}
          </div>

          <div className="access-gate__actions">
            {(status === "error" || lastAttemptFailed) && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={handleRetry}
              >
                <HugeiconsIcon icon={RefreshIcon} size={16} />
                Effacer et réessayer
              </button>
            )}

            {status === "success" && (
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  if (unlockTimerRef.current !== null) {
                    window.clearTimeout(unlockTimerRef.current);
                    unlockTimerRef.current = null;
                  }
                  setUnlocked(true);
                }}
              >
                Entrer maintenant
              </button>
            )}
          </div>
        </form>

        <p className="text-muted access-gate__hint">
          Indice de la bibliothécaire : six chiffres au format{" "}
          <span className="access-gate__mono">JJ · MM · AA</span>.
        </p>
      </div>
    </main>
  );
}
