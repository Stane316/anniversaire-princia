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

export function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const index = birthdayChapters.findIndex((chapter) => chapter.id === chapterId);

  if (index < 0) {
    return <Navigate to="/birthday/bibliotheque" replace />;
  }

  return (
    <BirthdayLayout back={{ to: "/birthday/bibliotheque", label: libraryContent.backToLibrary }}>
      <ReadingBook chapters={birthdayChapters} currentIndex={index} />
    </BirthdayLayout>
  );
}
