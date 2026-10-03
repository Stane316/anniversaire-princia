/**
 * SealDisc — sceau circulaire à texte courbe (mécanisme du dossier
 * de référence « Dossier 18 Jenny », reconstruit : encre bleue).
 * Ornement pur (aria-hidden) ; reduced-motion : aucune rotation.
 */
export function SealDisc({
  text,
  center = "N°18",
  size = 144,
  className = "",
}: {
  /** Texte inscrit sur le cercle (terminé par un point médian). */
  text: string;
  /** Inscription centrale. */
  center?: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`seal-disc ${className}`}
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 144 144" className="seal-disc__svg">
        <defs>
          <path
            id="seal-disc-circle"
            d="M72,72 m-56,0 a56,56 0 1,1 112,0 a56,56 0 1,1 -112,0"
          />
        </defs>
        <circle cx="72" cy="72" r="69" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.85" />
        <circle cx="72" cy="72" r="44" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <text
          fill="currentColor"
          fontSize="10.5"
          fontFamily="var(--font-mono)"
          letterSpacing="3.2"
        >
          <textPath href="#seal-disc-circle">{text}</textPath>
        </text>
      </svg>
      <span className="seal-disc__center">{center}</span>
    </div>
  );
}
