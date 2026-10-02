/**
 * Action destructive explicite en deux temps (doc 01 §16.4, §21.4) :
 * la suppression ne résulte jamais d'un seul clic ambigu.
 */
import { useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

interface ConfirmButtonProps {
  label: string;
  confirmLabel: string;
  onConfirm: () => void;
  icon?: boolean;
}

export function ConfirmButton({ label, confirmLabel, onConfirm, icon = false }: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);

  const content: ReactNode = (
    <>
      <Icon name="trash" size={16} />
      {armed ? confirmLabel : label}
    </>
  );

  if (icon) {
    return (
      <button
        type="button"
        className="btn-icon"
        aria-label={armed ? confirmLabel : label}
        onClick={() => {
          if (armed) {
            setArmed(false);
            onConfirm();
          } else {
            setArmed(true);
          }
        }}
        onBlur={() => setArmed(false)}
        style={armed ? { color: "var(--color-error)", borderColor: "var(--color-error)" } : undefined}
      >
        <Icon name="trash" size={16} />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`btn ${armed ? "btn--destructive" : "btn--secondary"}`}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else {
          setArmed(true);
        }
      }}
      onBlur={() => window.setTimeout(() => setArmed(false), 180)}
    >
      {content}
    </button>
  );
}
