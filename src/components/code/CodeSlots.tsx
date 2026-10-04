/**
 * CodeSlots — composant de saisie de code à cases (référence React Bits)
 * utilisant `motion/react`, `@hugeicons/react` et `@hugeicons/core-free-icons`.
 *
 * Adaptations au design system PRINCIA — Chapter 18 (§7.1–§7.3) :
 * - styles CSS projet (`.code-slots*` dans `src/styles/globals.css`) à la place
 *   de Tailwind, avec la palette bleu et blanc (`#3978D4`, `#F7FAFF`, `#15345B`) ;
 * - contrat complet : `length={6}`, `status` (`idle` | `error` | `success`),
 *   `value`, `onChange`, `onComplete`, navigation clavier complète, pavé
 *   numérique mobile (`inputMode="numeric"`), collage (`onPaste`), accessibilité
 *   ARIA et respect strict de `prefers-reduced-motion`.
 */
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  LockPasswordIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { useReducedMotion } from "../../motion/useReducedMotion";

export type CodeSlotsStatus = "idle" | "error" | "success";

export interface CodeSlotsProps {
  /** Nombre de chiffres attendus (par défaut 6). */
  length?: number;
  /** Valeur contrôlée optionnelle (chaîne de chiffres). */
  value?: string;
  /** État visuel et fonctionnel du composant. */
  status?: CodeSlotsStatus;
  /** Désactive la saisie (ex. pendant la transition de succès). */
  disabled?: boolean;
  /** Focus automatique sur la première case au montage. */
  autoFocus?: boolean;
  /** Appelé à chaque modification de la saisie. */
  onChange?: (value: string) => void;
  /** Appelé une seule fois lorsque les `length` chiffres sont remplis. */
  onComplete?: (value: string) => void;
  /** Libellé accessible du groupe de saisie. */
  ariaLabel?: string;
  /** Classe CSS additionnelle. */
  className?: string;
}

function normalizeDigits(raw: string, maxLength: number): string {
  return raw.replace(/\D/g, "").slice(0, maxLength);
}

function buildSlotsArray(code: string, length: number): string[] {
  const digits = normalizeDigits(code, length);
  return Array.from({ length }, (_, index) => digits[index] ?? "");
}

export function CodeSlots({
  length = 6,
  value,
  status = "idle",
  disabled = false,
  autoFocus = true,
  onChange,
  onComplete,
  ariaLabel = "Code d'accès à 6 chiffres",
  className = "",
}: CodeSlotsProps) {
  const reducedMotion = useReducedMotion();
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(() =>
    normalizeDigits(value ?? "", length),
  );
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const lastCompletedRef = useRef<string | null>(null);

  const currentCode = isControlled
    ? normalizeDigits(value ?? "", length)
    : internalValue;
  const slots = buildSlotsArray(currentCode, length);

  useEffect(() => {
    if (currentCode.length < length) {
      lastCompletedRef.current = null;
    }
  }, [currentCode, length]);

  useEffect(() => {
    if (!autoFocus || disabled) return;
    const firstEmpty = Math.min(currentCode.length, length - 1);
    const id = window.setTimeout(() => {
      inputRefs.current[firstEmpty]?.focus({ preventScroll: true });
    }, 40);
    return () => window.clearTimeout(id);
    // Focus initial uniquement au montage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusSlot = (index: number) => {
    const clamped = Math.max(0, Math.min(length - 1, index));
    const el = inputRefs.current[clamped];
    if (el) {
      el.focus({ preventScroll: true });
      try {
        el.select();
      } catch {
        /* certains environnements JSDOM / mobiles ignorent select() */
      }
    }
  };

  const commitSlots = (nextSlots: string[], nextFocusIndex?: number) => {
    const nextCode = nextSlots.join("");
    if (!isControlled) {
      setInternalValue(nextCode);
    }
    onChange?.(nextCode);

    if (typeof nextFocusIndex === "number") {
      focusSlot(nextFocusIndex);
    }

    const allFilled =
      nextSlots.length === length &&
      nextSlots.every((digit) => /^\d$/.test(digit));
    if (allFilled && lastCompletedRef.current !== nextCode) {
      lastCompletedRef.current = nextCode;
      onComplete?.(nextCode);
    }
  };

  const handleSlotChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (disabled || status === "success") return;
    const raw = event.target.value;
    const digits = raw.replace(/\D/g, "");

    if (digits.length === 0) {
      const next = [...slots];
      next[index] = "";
      commitSlots(next, index);
      return;
    }

    if (digits.length === 1) {
      const next = [...slots];
      next[index] = digits[0]!;
      const nextFocus = index < length - 1 ? index + 1 : index;
      commitSlots(next, nextFocus);
      return;
    }

    // Saisie multiple (ex. autocomplétion mobile ou collage rapide dans un champ)
    const next = [...slots];
    let cursor = index;
    for (const ch of digits) {
      if (cursor >= length) break;
      next[cursor] = ch;
      cursor += 1;
    }
    commitSlots(next, Math.min(cursor, length - 1));
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (disabled || status === "success") return;
    const { key } = event;

    if (/^\d$/.test(key)) {
      event.preventDefault();
      const next = [...slots];
      next[index] = key;
      const nextFocus = index < length - 1 ? index + 1 : index;
      commitSlots(next, nextFocus);
      return;
    }

    if (key === "Backspace") {
      event.preventDefault();
      const next = [...slots];
      if (next[index]) {
        next[index] = "";
        commitSlots(next, index);
      } else if (index > 0) {
        next[index - 1] = "";
        commitSlots(next, index - 1);
      }
      return;
    }

    if (key === "Delete") {
      event.preventDefault();
      const next = [...slots];
      next[index] = "";
      commitSlots(next, index);
      return;
    }

    if (key === "ArrowLeft") {
      event.preventDefault();
      if (index > 0) focusSlot(index - 1);
      return;
    }

    if (key === "ArrowRight") {
      event.preventDefault();
      if (index < length - 1) focusSlot(index + 1);
      return;
    }

    if (key === "Home") {
      event.preventDefault();
      focusSlot(0);
      return;
    }

    if (key === "End") {
      event.preventDefault();
      focusSlot(length - 1);
    }
  };

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    if (disabled || status === "success") return;
    const pastedText = event.clipboardData?.getData("text") ?? "";
    const digits = pastedText.replace(/\D/g, "");
    if (!digits) return;
    event.preventDefault();

    const next = [...slots];
    // Si l'utilisateur colle un code complet (ex. 6 chiffres), on remplit dès la case 0
    const startIndex = digits.length >= length ? 0 : index;
    let cursor = startIndex;
    for (const ch of digits) {
      if (cursor >= length) break;
      next[cursor] = ch;
      cursor += 1;
    }
    commitSlots(next, Math.min(cursor, length - 1));
  };

  const containerAnimate = reducedMotion
    ? {}
    : status === "error"
      ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
      : status === "success"
        ? { scale: [1, 1.02, 1] }
        : { x: 0, scale: 1 };

  return (
    <div
      className={`code-slots code-slots--${status} ${className}`.trim()}
      data-status={status}
    >
      <motion.div
        role="group"
        aria-label={ariaLabel}
        className="code-slots__row"
        animate={containerAnimate}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.36, ease: "easeInOut" }
        }
      >
        {slots.map((digit, index) => {
          const isFocused = focusedIndex === index;
          const isFilled = digit !== "";
          const slotAnimate = reducedMotion
            ? {}
            : status === "success"
              ? { y: [0, -4, 0], scale: [1, 1.04, 1] }
              : isFilled
                ? { scale: [0.94, 1] }
                : { scale: 1 };

          return (
            <React.Fragment key={index}>
              <motion.div
                className={[
                  "code-slots__cell",
                  isFocused ? "code-slots__cell--focused" : "",
                  isFilled ? "code-slots__cell--filled" : "",
                  status === "error" ? "code-slots__cell--error" : "",
                  status === "success" ? "code-slots__cell--success" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                animate={slotAnimate}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.22,
                        delay: status === "success" ? index * 0.04 : 0,
                      }
                }
              >
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={length}
                  disabled={disabled || status === "success"}
                  value={digit}
                  aria-label={`Chiffre ${index + 1} sur ${length}`}
                  aria-invalid={status === "error"}
                  className="code-slots__input"
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() =>
                    setFocusedIndex((current) =>
                      current === index ? null : current,
                    )
                  }
                  onChange={(e) => handleSlotChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(index, e)}
                />
              </motion.div>
              {index === 1 || index === 3 ? (
                <span className="code-slots__sep" aria-hidden="true">
                  ·
                </span>
              ) : null}
            </React.Fragment>
          );
        })}
      </motion.div>

      <div className="code-slots__status" aria-live="polite">
        {status === "idle" && (
          <span className="code-slots__badge code-slots__badge--idle">
            <HugeiconsIcon icon={LockPasswordIcon} size={15} />
            <span>Saisis les 6 chiffres du sceau (JJ · MM · AA)</span>
          </span>
        )}
        {status === "error" && (
          <span
            className="code-slots__badge code-slots__badge--error"
            role="alert"
          >
            <HugeiconsIcon icon={Alert02Icon} size={15} />
            <span>
              Ce code ne correspond pas au sceau de ce chapitre. Tu peux
              corriger ou recommencer.
            </span>
          </span>
        )}
        {status === "success" && (
          <span
            className="code-slots__badge code-slots__badge--success"
            role="status"
          >
            <HugeiconsIcon icon={Tick02Icon} size={15} />
            <span>Sceau reconnu — ouverture de Chapter 18…</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default CodeSlots;
