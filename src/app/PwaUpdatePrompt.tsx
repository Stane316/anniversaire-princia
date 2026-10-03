/**
 * Invitation non intrusive après une mise à jour du service worker
 * (doc 03 §11.7) : l'application ne se remplace pas silencieusement
 * pendant une opération ; l'action est expliquée simplement.
 * Aucune promesse : seules des capacités réellement vérifiées sont
 * annoncées (doc 01 §16.3).
 */
import { useRegisterSW } from "virtual:pwa-register/react";
import { Icon } from "../components/ui/Icon";

export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="toast-root" role="status" aria-live="polite">
      <div className="toast" style={{ justifyContent: "space-between" }}>
        <span className="cluster" style={{ gap: "var(--space-2)" }}>
          <Icon name="sparkles" size={18} />
          Une nouvelle page est prête pour Chapter 18.
        </span>
        <span className="cluster" style={{ gap: "var(--space-2)" }}>
          <button
            type="button"
            className="btn btn--text"
            style={{ color: "#fff", minHeight: 36 }}
            onClick={() => {
              void updateServiceWorker(true);
            }}
          >
            Actualiser
          </button>
          <button
            type="button"
            className="btn-icon"
            style={{ border: "none", background: "transparent", color: "#cfe1fa" }}
            aria-label="Ignorer la mise à jour pour l'instant"
            onClick={() => setNeedRefresh(false)}
          >
            <Icon name="close" size={16} />
          </button>
        </span>
      </div>
    </div>
  );
}
