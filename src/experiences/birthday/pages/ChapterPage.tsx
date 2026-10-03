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
        <GradientWaves
          horizonColor="#F3F8FF"
          waveColor="#3E7BD9"
          crestColor="#DBEAFE"
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
          brightness={1}
          opacity={0.85}
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
