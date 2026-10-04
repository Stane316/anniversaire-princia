/**
 * Écran de code d'accès à 6 chiffres placé en toute première étape
 * avant l'ouverture de la lettre et de l'expérience (§6 & §7).
 *
 * États gérés :
 * - `idle` : saisie en cours ;
 * - `error` : code incorrect, retour visuel doux sans révéler le code,
 *   bouton « Effacer et réessayer » ou modification directe au clavier ;
 * - `success` : code accepté, animation de validation puis ouverture de
 *   l'expérience habituelle (lettre d'ouverture / bibliothèque / espace).
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon } from "@hugeicons/core-free-icons";
import { CodeSlots, type CodeSlotsStatus } from "../../components/code/CodeSlots";
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

export function AccessCodeGate({ children }: AccessCodeGateProps) {
  const reducedMotion = useReducedMotion();
  const [unlocked, setUnlocked] = useState<boolean>(() =>
    hasUnlockedAccessSession(),
  );
  const [code, setCode] = useState<string>("");
  const [status, setStatus] = useState<CodeSlotsStatus>("idle");
  const unlockTimerRef = useRef<number | null>(null);
  const validatingRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      if (unlockTimerRef.current !== null) {
        window.clearTimeout(unlockTimerRef.current);
      }
    };
  }, []);

  if (unlocked) {
    return <>{children}</>;
  }

  const handleChange = (nextValue: string) => {
    setCode(nextValue);
    if (status === "error" && nextValue.length < 6) {
      setStatus("idle");
      validatingRef.current = false;
    }
  };

  const handleComplete = (completedCode: string) => {
    if (validatingRef.current || status === "success") return;
    validatingRef.current = true;

    if (verifyAccessCode(completedCode)) {
      setStatus("success");
      grantAccessSession();
      const delay = reducedMotion ? 0 : 420;
      if (delay === 0) {
        setUnlocked(true);
      } else {
        unlockTimerRef.current = window.setTimeout(() => {
          unlockTimerRef.current = null;
          setUnlocked(true);
        }, delay);
      }
    } else {
      setStatus("error");
      validatingRef.current = false;
    }
  };

  const handleRetry = () => {
    validatingRef.current = false;
    setCode("");
    setStatus("idle");
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
            onChange={handleChange}
            onComplete={handleComplete}
            ariaLabel="Code d'accès à 6 chiffres pour ouvrir PRINCIA — Chapter 18"
          />

          <div className="access-gate__actions">
            {status === "error" && (
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
