/**
 * Gestion explicite des mises à jour du service worker (doc 03 §11.7 & §4.2) :
 * - détecte la disponibilité d'une nouvelle version (vérification au démarrage
 *   et périodiquement lorsque l'onglet redevient visible) ;
 * - n'expulse jamais brutalement l'utilisatrice pendant une saisie en cours :
 *   affiche une bannière discrète avec états explicites (`available`,
 *   `updating`, `error`) ;
 * - préserve intégralement les données locales (IndexedDB / localStorage)
 *   qui sont découplées du cache Workbox.
 */
import { useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Icon } from "../components/ui/Icon";

export type SwUpdateState = "idle" | "available" | "updating" | "error";

export function PwaUpdatePrompt() {
  const updatingRef = useRef(false);
  const [updateState, setUpdateState] = useState<SwUpdateState>("idle");
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      // Vérifie l'existence d'une nouvelle version lorsque l'application
      // revient au premier plan, sans jamais forcer un rechargement.
      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible" && navigator.onLine) {
            void registration.update().catch(() => {
              /* silencieux hors ligne */
            });
          }
        });
      }
    },
    onRegisterError() {
      // L'application continue de fonctionner normalement même si le SW échoue
    },
  });

  if (!needRefresh && updateState === "idle") return null;

  const handleApplyUpdate = async () => {
    if (updatingRef.current) return;
    updatingRef.current = true;
    setUpdateState("updating");
    try {
      await updateServiceWorker(true);
      setNeedRefresh(false);
      setUpdateState("idle");
    } catch {
      updatingRef.current = false;
      setUpdateState("error");
    }
  };

  return (
    <div className="toast-root" role="status" aria-live="polite">
      <div className="toast" style={{ justifyContent: "space-between", gap: "var(--space-3)" }}>
        <span className="cluster" style={{ gap: "var(--space-2)" }}>
          <Icon name={updateState === "error" ? "alert" : "sparkles"} size={18} />
          {updateState === "updating"
            ? "Mise à jour en cours (tes données locales sont conservées)…"
            : updateState === "error"
              ? "La mise à jour n'a pas pu s'appliquer maintenant."
              : "Une nouvelle version de Chapter 18 est prête (tes données restent intactes)."}
        </span>
        <span className="cluster" style={{ gap: "var(--space-2)" }}>
          <button
            type="button"
            className="btn btn--text"
            style={{ color: "#fff", minHeight: 36 }}
            disabled={updateState === "updating"}
            onClick={() => {
              void handleApplyUpdate();
            }}
          >
            {updateState === "updating"
              ? "Actualisation…"
              : updateState === "error"
                ? "Réessayer"
                : "Actualiser"}
          </button>
          <button
            type="button"
            className="btn-icon"
            style={{ border: "none", background: "transparent", color: "#cfe1fa" }}
            aria-label="Ignorer la mise à jour pour l'instant"
            onClick={() => {
              updatingRef.current = false;
              setNeedRefresh(false);
              setUpdateState("idle");
            }}
          >
            <Icon name="close" size={16} />
          </button>
        </span>
      </div>
    </div>
  );
}
