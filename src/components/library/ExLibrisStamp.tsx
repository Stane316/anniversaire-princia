/**
 * Tampon ex-libris de la Grande Salle Bleue (système fictionnel 5.1).
 * Ornemental : purement visuel, jamais au-dessus du contenu.
 * Encre bleue, rotation légère — comme un vrai tampon de bibliothèque.
 */
export function ExLibrisStamp({
  text,
  subline,
  ink = "rgba(23, 74, 145, 0.62)",
  size = 92,
  rotate = -9,
}: {
  text: string;
  subline?: string;
  ink?: string;
  size?: number;
  rotate?: number;
}) {
  return (
    <span
      className="exlibris"
      aria-hidden="true"
      style={
        {
          "--stamp-size": `${size}px`,
          "--stamp-ink": ink,
          "--stamp-rotate": `${rotate}deg`,
        } as React.CSSProperties
      }
    >
      <span className="exlibris__text">{text}</span>
      {subline ? <span className="exlibris__subline">{subline}</span> : null}
    </span>
  );
}
