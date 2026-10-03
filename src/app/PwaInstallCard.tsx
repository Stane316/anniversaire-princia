/**
 * Carte d'installation PWA, d'état hors ligne et d'information sur la
 * persistance locale (doc 01 §16.3, §18.6 ; doc 03 §11.6, §11.8).
 *
 * Règles respectées :
 * - si l'application est déjà ouverte en mode installé (`standalone`),
 *   aucune invitation d'installation n'est affichée ;
 * - si le navigateur expose `beforeinstallprompt` (Android / Chrome / Edge),
 *   un bouton déclenche le dialogue natif d'installation ;
 * - sur iOS (Safari) ou sur les navigateurs sans dialogue programmatique,
 *   des instructions adaptées et honnêtes sont proposées sans promettre
 *   un bouton automatique universel ;
 * - si l'utilisatrice ferme l'encart (« Plus tard »), ce choix est mémorisé
 *   dans `localStorage` pour ne pas la solliciter à chaque visite, tout en
 *   laissant un lien discret pour rouvrir l'aide quand elle le souhaite ;
 * - aucune demande de permission de notification n'est déclenchée ;
 * - la portée et les limites du stockage local (appareil uniquement,
 *   effacement des données navigateur) sont expliquées simplement.
 */
import { useEffect, useState } from "react";
import { Icon } from "../components/ui/Icon";
import { visitMemory } from "../data/repositories";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms?: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export type InstallPlatformMode =
  | "installed"
  | "native-prompt"
  | "ios-manual"
  | "browser-manual";

export function detectInstallPlatform(
  userAgent: string,
  isStandalone: boolean,
  hasDeferredPrompt: boolean,
): InstallPlatformMode {
  if (isStandalone) return "installed";
  if (hasDeferredPrompt) return "native-prompt";
  const ua = userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(ua);
  if (isIos) return "ios-manual";
  return "browser-manual";
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia?.("(display-mode: standalone)").matches) {
      return true;
    }
    if (
      typeof navigator !== "undefined" &&
      (navigator as { standalone?: boolean }).standalone === true
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export function PwaInstallCard() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState<boolean>(() =>
    isStandaloneDisplay(),
  );
  const [dismissed, setDismissed] = useState<boolean>(() =>
    visitMemory.hasDismissedInstallPrompt(),
  );
  const [showManualHelp, setShowManualHelp] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
      ? navigator.onLine
      : true,
  );

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const onAppInstalled = () => {
      setStandalone(true);
      setDeferredPrompt(null);
    };
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    const media = window.matchMedia?.("(display-mode: standalone)");
    const onMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) setStandalone(true);
    };
    media?.addEventListener?.("change", onMediaChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      media?.removeEventListener?.("change", onMediaChange);
    };
  }, []);

  const userAgent =
    typeof navigator !== "undefined" ? navigator.userAgent : "";
  const mode = detectInstallPlatform(
    userAgent,
    standalone,
    deferredPrompt !== null,
  );

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setStandalone(true);
      }
    } catch {
      /* le navigateur a annulé ou fermé la boîte de dialogue */
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    visitMemory.dismissInstallPrompt();
    setDismissed(true);
    setShowManualHelp(false);
  };

  const handleReopen = () => {
    visitMemory.resetInstallPrompt();
    setDismissed(false);
    setShowManualHelp(true);
  };

  return (
    <aside
      className="surface-panel stack"
      aria-label="Application, mode hors ligne et sauvegarde locale"
      style={{ marginTop: "var(--space-6)", gap: "var(--space-4)" }}
    >
      <div className="cluster cluster--between" style={{ gap: "var(--space-3)" }}>
        <div className="cluster" style={{ gap: "var(--space-2)" }}>
          <span
            className={`badge ${isOnline ? "badge--blue" : "badge--neutral"}`}
            role="status"
          >
            {isOnline
              ? "Hors ligne prêt · Stockage sur cet appareil"
              : "Mode hors ligne actif · Espaces locaux disponibles"}
          </span>
          {mode === "installed" && (
            <span className="badge badge--blue">
              <Icon name="check-circle" size={14} />
              Application installée
            </span>
          )}
        </div>

        {mode !== "installed" && dismissed && (
          <button
            type="button"
            className="btn btn--text"
            onClick={handleReopen}
          >
            Installer sur l'écran d'accueil
          </button>
        )}
      </div>

      {mode !== "installed" && !dismissed && (
        <div
          className="stack"
          style={{
            gap: "var(--space-3)",
            paddingTop: "var(--space-1)",
          }}
        >
          <div className="cluster cluster--between" style={{ alignItems: "flex-start" }}>
            <div className="stack" style={{ gap: "var(--space-1)", maxWidth: "56ch" }}>
              <h2 className="h4">Garder Chapter 18 sur ton écran d'accueil</h2>
              <p className="text-secondary" style={{ fontSize: "var(--text-body-sm)" }}>
                Tu peux ouvrir la bibliothèque, l'enquête, les souvenirs et ton espace
                comme une application sur ton téléphone, même sans connexion après ta
                première visite.
              </p>
            </div>

            <div className="cluster" style={{ gap: "var(--space-2)" }}>
              {mode === "native-prompt" ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    void handleInstallClick();
                  }}
                >
                  <Icon name="plus" size={16} />
                  Installer l'application
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--secondary"
                  aria-expanded={showManualHelp}
                  onClick={() => setShowManualHelp((prev) => !prev)}
                >
                  <Icon name="book" size={16} />
                  {showManualHelp ? "Masquer les étapes" : "Comment l'installer"}
                </button>
              )}
              <button
                type="button"
                className="btn btn--text"
                onClick={handleDismiss}
              >
                Plus tard
              </button>
            </div>
          </div>

          {(showManualHelp || mode === "ios-manual") && mode !== "native-prompt" && (
            <div
              className="card stack"
              style={{
                gap: "var(--space-2)",
                background: "var(--color-surface-soft)",
                fontSize: "var(--text-body-sm)",
              }}
            >
              {mode === "ios-manual" ? (
                <p style={{ margin: 0 }}>
                  <strong>Sur iPhone ou iPad (Safari) :</strong> touche le bouton{" "}
                  <strong>Partager</strong> en bas de l'écran, puis choisis{" "}
                  <strong>« Sur l'écran d'accueil »</strong> et valide avec{" "}
                  <strong>Ajouter</strong>.
                </p>
              ) : (
                <p style={{ margin: 0 }}>
                  <strong>Sur Android ou ordinateur :</strong> ouvre le menu de ton
                  navigateur (<strong>⋮</strong>), puis sélectionne{" "}
                  <strong>« Installer l'application »</strong> ou{" "}
                  <strong>« Ajouter à l'écran d'accueil »</strong>.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <p
        className="text-muted"
        style={{
          margin: 0,
          fontSize: "var(--text-caption)",
          borderTop: "1px dashed var(--color-border)",
          paddingTop: "var(--space-3)",
        }}
      >
        Tes livres, tâches et petites victoires sont enregistrés localement sur cet
        appareil et restent disponibles hors ligne (aucune donnée n'est envoyée vers un
        serveur distant). Évite d'effacer les données de navigation de ce site si tu
        souhaites les conserver sur ce téléphone.
      </p>
    </aside>
  );
}
