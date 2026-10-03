/**
 * Note de marge de la bibliothécaire (5.1).
 * Voix de l'institution — jamais un souvenir inventé : le texte
 * provient du fichier de contenu validé. Rendu « papier collé »,
 * légèrement incliné ; purement typographique.
 */
import type { ReactNode } from "react";

export function MarginNote({ children, label }: { children: ReactNode; label: string }) {
  return (
    <figure className="margin-note">
      <figcaption className="margin-note__label">{label}</figcaption>
      <blockquote className="margin-note__body">{children}</blockquote>
      <span className="margin-note__tape" aria-hidden="true" />
    </figure>
  );
}
