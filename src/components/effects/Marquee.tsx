/**
 * Marquee — bandeau défilant de mention « confidentielle » (mécanisme
 * du dossier de référence « Dossier 18 Jenny », reconstruit).
 * CSS pur, doublées aria-hidden ; reduced-motion : piste fixe.
 */
import { useReducedMotion } from "../../motion/useReducedMotion";

export function Marquee({
  items,
  separator = "◆",
  className = "",
}: {
  items: readonly string[];
  separator?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className={`marquee__track${reduced ? " marquee__track--static" : ""}`}>
        {[0, 1].map((dup) => (
          <div key={dup} className="marquee__half">
            {items.map((item) => (
              <span key={`${item}-${dup}`} className="marquee__item">
                {item}
                <span className="marquee__sep">{separator}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
