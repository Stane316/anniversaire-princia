/**
 * Carte d'installation PWA, de diagnostic mobile, d'état hors ligne et
 * d'information sur la persistance locale (doc 01 §16.3, §18.6 ; doc 03 §11.6, §11.8).
 *
 * États d'installation gérés explicitement (§3.3) :
 * - `idle` : avant toute tentative ;
 * - `prompting` : boîte de dialogue native `beforeinstallprompt` ouverte ;
 * - `installing` : l'utilisateur a accepté, Android génère/installe le WebAPK
 *   (état borné dans le temps : ne reste jamais bloqué indéfiniment sur
 *   « Installation en cours… » si `appinstalled` tarde) ;
 * - `pending-verification` : délai écoulé après acceptation sans événement
 *   `appinstalled` (explique où trouver l'icône dans le tiroir d'applications
 *   Android ou comment vérifier l'autorisation « Raccourcis sur l'écran d'accueil ») ;
 * - `cancelled` : installation annulée par l'utilisateur (peut réessayer) ;
 * - `installed` : confirmé par `display-mode: standalone` ou l'événement `appinstalled` ;
 * - `error` : échec d'appel au prompt natif, bascule vers les étapes manuelles.
 */
import { useEffect, useRef, useState } from "react";
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
  | "android-manual"
  | "browser-manual";

export type InstallAttemptState =
  | "idle"
  | "prompting"
  | "installing"
  | "pending-verification"
  | "installed"
  | "cancelled"
  | "error";

export function detectInstallPlatform(
  userAgent: string,
  isStandalone: boolean,
  hasDeferredPrompt: boolean,
): InstallPlatformMode {
  if (isStandalone) return "installed";
  if (hasDeferredPrompt) return "native-prompt";
  const ua = userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "ios-manual";
  if (/android/.test(ua)) return "android-manual";
  return "browser-manual";
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (
      window.matchMedia?.("(display-mode: standalone)").matches ||
      window.matchMedia?.("(display-mode: fullscreen)").matches ||
      window.matchMedia?.("(display-mode: minimal-ui)").matches
    ) {
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

const INSTALL_VERIFY_TIMEOUT_MS = 6000;

export function PwaInstallCard() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState<boolean>(() =>
    isStandaloneDisplay(),
  );
  const [attemptState, setAttemptState] = useState<InstallAttemptState>(() =>
    isStandaloneDisplay() ? "installed" : "idle",
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
  const installTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearInstallTimer = () => {
      if (installTimerRef.current !== null) {
        window.clearTimeout(installTimerRef.current);
        installTimerRef.current = null;
      }
    };

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setAttemptState((prev) => (prev === "installed" ? "installed" : "idle"));
    };

    const onAppInstalled = () => {
      clearInstallTimer();
      setStandalone(true);
      setAttemptState("installed");
      setDeferredPrompt(null);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && isStandaloneDisplay()) {
        clearInstallTimer();
        setStandalone(true);
        setAttemptState("installed");
      }
    };

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    const media = window.matchMedia?.("(display-mode: standalone)");
    const onMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        clearInstallTimer();
        setStandalone(true);
        setAttemptState("installed");
      }
    };
    media?.addEventListener?.("change", onMediaChange);

    return () => {
      clearInstallTimer();
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      media?.removeEventListener?.("change", onMediaChange);
    };
  }, []);

  // Préchargement doux en arrière-plan des 21 photos de la galerie Souvenirs
  // une fois le shell chargé, afin qu'elles soient en cache Workbox (CacheFirst)
  // sans alourdir l'installation initiale du Service Worker sur mobile.
  useEffect(() => {
    if (!isOnline || typeof window === "undefined" || typeof fetch !== "function") {
      return;
    }
    let cancelled = false;
    const warmTimer = window.setTimeout(() => {
      void (async () => {
        for (let i = 1; i <= 21; i += 1) {
          if (cancelled) return;
          const num = String(i).padStart(2, "0");
          try {
            await fetch(`/souvenirs-gallery/photo-${num}.webp`, {
              credentials: "same-origin",
            });
          } catch {
            /* silencieux hors connexion */
          }
        }
      })();
    }, 2500);
    return () => {
      cancelled = true;
      window.clearTimeout(warmTimer);
    };
  }, [isOnline]);

  const userAgent =
    typeof navigator !== "undefined" ? navigator.userAgent : "";
  const mode = detectInstallPlatform(
    userAgent,
    standalone || attemptState === "installed",
    deferredPrompt !== null,
  );

  const handleInstallClick = async () => {
    if (!deferredPrompt || attemptState === "prompting" || attemptState === "installing") {
      return;
    }
    setAttemptState("prompting");
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (choice.outcome === "accepted") {
        // Sur Android Chrome, « accepted » lance la création du WebAPK en arrière-plan
        // (« Installation en cours… »). On ne déclare pas l'installation terminée
        // immédiatement : on attend `appinstalled` avec un timeout borné de 6 s.
        setAttemptState("installing");
        if (installTimerRef.current !== null) {
          window.clearTimeout(installTimerRef.current);
        }
        installTimerRef.current = window.setTimeout(() => {
          installTimerRef.current = null;
          setAttemptState((current) =>
            current === "installing" ? "pending-verification" : current,
          );
          setShowManualHelp(true);
        }, INSTALL_VERIFY_TIMEOUT_MS);
      } else {
        setAttemptState("cancelled");
      }
    } catch {
      setDeferredPrompt(null);
      setAttemptState("error");
      setShowManualHelp(true);
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
            <span className="badge badge--blue" role="status">
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
                  disabled={attemptState === "prompting" || attemptState === "installing"}
                  onClick={() => {
                    void handleInstallClick();
                  }}
                >
                  <Icon name="plus" size={16} />
                  {attemptState === "prompting"
                    ? "Confirmation…"
                    : attemptState === "installing"
                      ? "Finalisation sur le téléphone…"
                      : "Installer l'application"}
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

          {attemptState === "installing" && (
            <p className="alert alert--info" role="status" style={{ margin: 0 }}>
              <Icon name="sparkles" size={18} />
              <span>
                Android prépare l'icône <strong>Chapter 18</strong> (quelques secondes)…
              </span>
            </p>
          )}

          {attemptState === "cancelled" && (
            <p className="text-secondary" role="status" style={{ margin: 0, fontSize: "var(--text-body-sm)" }}>
              Installation annulée. Tu peux réessayer quand tu le souhaites ou passer par le
              menu du navigateur (<strong>⋮ → Ajouter à l'écran d'accueil</strong>).
            </p>
          )}

          {attemptState === "pending-verification" && (
            <div
              className="alert alert--info stack"
              role="status"
              style={{ margin: 0, gap: "var(--space-2)", alignItems: "flex-start" }}
            >
              <strong>Si l'icône « Chapter 18 » n'apparaît pas sur ton premier écran :</strong>
              <ul style={{ margin: 0, paddingLeft: "var(--space-5)", fontSize: "var(--text-body-sm)" }}>
                <li>
                  Ouvre le <strong>tiroir d'applications</strong> (glisse vers le haut sur
                  l'écran d'accueil) et cherche <strong>« Chapter 18 »</strong> ou{" "}
                  <strong>« PRINCIA »</strong>, ou vérifie la <strong>dernière page</strong> de
                  ton écran d'accueil.
                </li>
                <li>
                  Sur <strong>Xiaomi (MIUI / HyperOS) / Oppo / Vivo</strong> : vérifie dans{" "}
                  <em>Paramètres → Applications → Chrome → Autorisations</em> que{" "}
                  <strong>« Raccourcis sur l'écran d'accueil »</strong> est autorisé.
                </li>
                <li>
                  Sur <strong>Samsung (One UI)</strong> : active{" "}
                  <em>Paramètres de l'écran d'accueil → Ajouter les nouvelles applications à l'écran d'accueil</em>,
                  ou utilise le menu <strong>⋮ → Ajouter à l'écran d'accueil</strong>.
                </li>
              </ul>
            </div>
          )}

          {attemptState === "error" && (
            <p className="alert alert--info" role="status" style={{ margin: 0 }}>
              <Icon name="alert" size={18} />
              <span>
                Le dialogue automatique n'a pas pu aboutir sur ce navigateur. Utilise les
                étapes manuelles ci-dessous pour ajouter l'icône à ton écran d'accueil.
              </span>
            </p>
          )}

          {(showManualHelp || mode === "ios-manual" || mode === "android-manual") &&
            mode !== "native-prompt" && (
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
                ) : mode === "android-manual" ? (
                  <div className="stack" style={{ gap: "var(--space-2)" }}>
                    <p style={{ margin: 0 }}>
                      <strong>Sur Android (Chrome, Samsung Internet, Brave, Firefox) :</strong>{" "}
                      ouvre le menu du navigateur (<strong>⋮</strong> en haut à droite), puis
                      touche <strong>« Ajouter à l'écran d'accueil »</strong> ou{" "}
                      <strong>« Installer l'application »</strong>.
                    </p>
                    <p className="text-muted" style={{ margin: 0, fontSize: "var(--text-caption)" }}>
                      Astuce : si le téléphone affiche « Installation en cours » sans poser
                      l'icône sur la première page, cherche <strong>« Chapter 18 »</strong> dans
                      le tiroir d'applications ou active l'autorisation « Raccourcis sur l'écran
                      d'accueil » pour ton navigateur.
                    </p>
                  </div>
                ) : (
                  <p style={{ margin: 0 }}>
                    <strong>Sur ordinateur ou mobile :</strong> ouvre le menu de ton
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
        appareil et restent disponibles hors ligne (aucune donnée personnelle n'est
        supprimée lors d'une mise à jour de l'application). Évite d'effacer les données de
        navigation de ce site si tu souhaites les conserver sur ce téléphone.
      </p>
    </aside>
  );
}
