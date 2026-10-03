/**
 * SouvenirPhotoIntro — scène d'introduction de la section Souvenirs
 * (mission du 3 oct. 2026) : la photo de Princia devant la statue du
 * roi Béhanzin (tenue traditionnelle) se dévoile par mosaïque via le
 * composant Stane RefineFrame, puis laisse la place à Infinite Spiral.
 *
 * Orchestration EXPLICITE — jamais de temporisation aveugle :
 *  1. chargement de l'image (4 extensions candidates — le fichier
 *     source vit dans public/souvenirs/, extension non présumée) ;
 *  2. séquence de statuts queued → generating → refining → complete
 *     (durées déclarées, cohérentes) — la photo reste visible pendant
 *     toute la révélation ;
 *  3. pause de regard après la mise au point, puis fondu de sortie ;
 *  4. appel d'`onDone` → la galerie prend le relais.
 *
 * Repli GARANTI : image introuvable, canvas indisponible, reduced-
 * motion ou clic « Passer l'introduction » → onDone sans bloquer
 * l'accès à la galerie. Tout est local : aucune photo ne quitte
 * jamais l'appareil.
 */
import { memo, useCallback, useEffect, useRef, useState } from "react";
import RefineFrame from "../../../components/media/RefineFrame";
import type { RefineFrameStatus } from "../../../components/media/RefineFrame";
import { Icon } from "../../../components/ui/Icon";
import { useReducedMotion } from "../../../motion/useReducedMotion";

/** Fichier attendu (public/souvenirs/) — extensions essayées dans
 *  l'ordre, le code ne présume pas de l'extension réelle. */
/** Fichier confirmé (3 oct. 2026) : `public/souvenirs/souvenirs_behanzin.jpeg`
 *  — extrait de `origin/main:souvenirs/souvenirs_behanzin.jpeg`, jamais
 *  recadré ni retouché (66 Ko, 720×1280). L'extension réelle est tentée
 *  en premier ; les autres servent si le fichier change de format. */
const CANDIDATES = [
  "/souvenirs/souvenirs_behanzin.jpeg",
  "/souvenirs/souvenirs_behanzin.webp",
  "/souvenirs/souvenirs_behanzin.jpg",
  "/souvenirs/souvenirs_behanzin.png",
] as const;

const ALT =
  "Photographie de Princia devant la statue du roi Béhanzin, en tenue traditionnelle.";

/** Étapes de la révélation — durées EXPLICITES et CONFIGURABLES
 *  (mission 3 oct. 2026, chantier B) :
 *  - la photo floue/pixellisée doit réellement se voir (≈ 1 s) ;
 *  - le dévoilement progressif dure ≈ 4 s en deux paliers lisibles ;
 *  - la photo NETTE reste ensuite affichée — paramètre dédié
 *    `HOLD_COMPLETE_MS`, indépendant de la révélation — avant le
 *    fondu de sortie. */
const REVEAL_STEPS: Array<{ status: RefineFrameStatus; dwell: number }> = [
  { status: "queued", dwell: 950 }, // flou profond + mosaïque grossière
  { status: "generating", dwell: 2000 }, // la photo se dévoile
  { status: "refining", dwell: 2000 }, // mise au point progressive
];

/** Photo nette : temps de regard minimal avant le fondu (exigence
 *  « environ une seconde au minimum » → on laisse respirer 2,4 s). */
const HOLD_COMPLETE_MS = 2400;

/** Fondu de sortie une fois la pause terminée. */
const FADE_MS = 700;

/** Reduced-motion : photo nette immédiate, même temps de regard. */
const HOLD_REDUCED_MS = HOLD_COMPLETE_MS;

const LABELS = {
  queued: "Le souvenir s'ouvre…",
  generating: "La photo se dévoile",
  refining: "Mise au point",
  complete: "C'est bien elle.",
} as const;

type Phase = "load" | "reveal" | "hand" | "gone";

function SouvenirPhotoIntroInner({ onDone }: { onDone: () => void }) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("load");
  const [src, setSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<RefineFrameStatus>("queued");
  const [frame, setFrame] = useState<{ aspect: string; width: number }>({
    aspect: "3 / 4",
    width: 420,
  });
  const timers = useRef<number[]>([]);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setPhase("hand");
    window.setTimeout(() => onDone(), FADE_MS);
  }, [onDone]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // 1 — Résoudre le chemin réel de la photo (candidates dans l'ordre).
  useEffect(() => {
    let cancelled = false;
    const probe = (index: number) => {
      if (index >= CANDIDATES.length || cancelled) {
        // Image introuvable : repli propre vers la galerie, sans blocage.
        if (!cancelled) finish();
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        // Cadrage adapté au ratio RÉEL : jamais de déformation, la photo
        // occupe le maximum de surface utile (borne hauteur écran).
        const aspect = `${img.naturalWidth} / ${img.naturalHeight}`;
        const byHeight =
          (window.innerHeight * 0.78 * img.naturalWidth) / img.naturalHeight;
        const width = Math.round(
          Math.max(280, Math.min(1080, window.innerWidth * 0.92, byHeight)),
        );
        setSrc(CANDIDATES[index]);
        setFrame({ aspect, width });
        setPhase("reveal");
      };
      img.onerror = () => probe(index + 1);
      img.src = CANDIDATES[index];
    };
    probe(0);
    return () => {
      cancelled = true;
    };
  }, [finish]);

  // 2 — Séquence déclarée (réduite à sa plus simple expression en
  //     reduced-motion : photo nette immédiate, même temps de regard).
  useEffect(() => {
    if (phase !== "reveal" || !src) return;
    if (reducedMotion) {
      setStatus("complete");
      timers.current.push(window.setTimeout(finish, HOLD_REDUCED_MS));
      return;
    }
    let at = 0;
    for (const step of REVEAL_STEPS) {
      timers.current.push(
        window.setTimeout(() => setStatus(step.status), at),
      );
      at += step.dwell;
    }
    // État complet : la révélation est finie — la pause de regard
    // commence (paramètre distinct du temps de révélation).
    timers.current.push(
      window.setTimeout(() => setStatus("complete"), at),
    );
    timers.current.push(window.setTimeout(finish, at + HOLD_COMPLETE_MS));
  }, [phase, src, reducedMotion, finish]);

  if (phase === "gone") return null;

  return (
    <div
      className="souvenir-intro"
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label="Ouverture de la section Souvenirs — celle-ci commence par une photographie."
    >
      {/* Le fondu de sortie ne masque jamais avant la fin : opacity 1
          tant que phase ≠ hand. */}
      <div className="souvenir-intro__scrim" aria-hidden="true" />

      {src ? (
        <figure className="souvenir-intro__frame">
          {/* Mosaïque pilotée par les statuts de la scène (composant
              Stane — RefineFrame). hideAfter=0 : la pastille de statut
              disparaît avec la scène, jamais avant. */}
          <RefineFrame
            status={status}
            aspectRatio={frame.aspect}
            width={frame.width}
            radius={20}
            background="#0F2444"
            color="#EAF3FF"
            stageDuration={420}
            labels={LABELS}
            hideAfter={0}
            sweep
            showStatus
            className="souvenir-intro__refine"
          >
            <img src={src} alt={ALT} />
          </RefineFrame>
          <figcaption className="souvenir-intro__caption">
            <span className="souvenir-intro__kicker">Souvenir d'ouverture · N° SOUV-22</span>
            <span className="souvenir-intro__title serif">
              Devant la statue du roi Béhanzin
            </span>
          </figcaption>
        </figure>
      ) : (
        /* Chargement de la photo : voile d'attente prudent (quelques
           dixièmes de seconde en pratique, repli garanti sinon). */
        <p className="souvenir-intro__loading" role="status">
          Le souvenir s'ouvre…
        </p>
      )}

      <button
        type="button"
        className="souvenir-intro__skip"
        onClick={finish}
      >
        <Icon name="arrow-right" size={14} />
        Passer l'introduction
      </button>
    </div>
  );
}

export const SouvenirPhotoIntro = memo(SouvenirPhotoIntroInner);
