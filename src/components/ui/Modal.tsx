/**
 * Fenêtre modale accessible (doc 02 §9.4) :
 * - focus piégé dans le panneau, retour de focus à la fermeture ;
 * - fermeture par Échap et par bouton visible ;
 * - utilisable avec une faible hauteur d'écran (panneau défilable).
 */
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
}

export function Modal({ title, onClose, children, actions }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("input, textarea, select, button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      previousFocus.current?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="cluster cluster--between" style={{ marginBottom: "var(--space-5)" }}>
          <h2 className="h4">{title}</h2>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="Fermer la fenêtre">
            <Icon name="close" size={18} />
          </button>
        </div>
        {children}
        {actions ? (
          <div className="cluster" style={{ justifyContent: "flex-end", marginTop: "var(--space-6)" }}>
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
