/**
 * BL-04 — Lecture d'un chapitre (doc 01 §5.6) : le chapitre est une
 * double page du livre de la bibliothèque (implémentation 5.2).
 * - le texte est rendu statiquement, lisible sans aucune animation ;
 * - tourner la page = feuillet 3D décoratif, instantané si
 *   prefers-reduced-motion ;
 * - id inconnu => redirection propre vers la bibliothèque ;
 * - la lettre reste joignable à tout moment (nav + fin des chapitres).
 */
import { Navigate, useParams } from "react-router-dom";
import { BirthdayLayout } from "../BirthdayLayout";
import { birthdayChapters, libraryContent } from "../data/content";
import { ReadingBook } from "../../../components/book/ReadingBook";
import GradientWaves from "../../../components/backgrounds/GradientWaves";

export function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const index = birthdayChapters.findIndex((chapter) => chapter.id === chapterId);

  if (index < 0) {
    return <Navigate to="/birthday/bibliotheque" replace />;
  }

  return (
    <BirthdayLayout back={{ to: "/birthday/bibliotheque", label: libraryContent.backToLibrary }}>
      {/* Même mer d'encre que la bibliothèque : le livre flotte dessus. */}
      <div className="scene-backdrop" aria-hidden="true">

        {/* Réglages « mer d'encre » — identifiables à l'œil (mission
              3 oct. 2026) : l'ancienne palette (vague #3E7BD9 sur
              horizon #F3F8FF, brightness 1, opacity .85) rendait le
              composant indiscernable du dégradé du body. Les vagues
              sont désormais nettement bleues, le crêtement lumineux,
              l'horizon proche du fond pour conserver la douceur du
              haut de page, et le calque est opaque : le contenu vit
              au-dessus (z 1), les sections claires laissent respirer
              la mer au travers de leurs voiles translucides. */}
        <GradientWaves
          horizonColor="#E9F3FF"
          waveColor="#2F6FD0"
          crestColor="#BFD8F7"
          speed={0.3}
          amplitude={2.6}
          waveScale={0.55}
          waveRatio={0.9}
          swell={30}
          turbulence={16}
          tilt={1.08}
          zoom={1.05}
          height={5.0}
          fogDepth={26}
          detail="low"
          brightness={1.04}
          opacity={1}
          grain={false}
          mouseInteraction
          parallaxStrength={0.32}
          targetFps={30}
          resolutionScale={0.5}
        />
      </div>
      <ReadingBook chapters={birthdayChapters} currentIndex={index} />
    </BirthdayLayout>
  );
}
