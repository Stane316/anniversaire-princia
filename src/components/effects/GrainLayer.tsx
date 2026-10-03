/**
 * GrainLayer — grain photographique léger (mécanisme AN-05 recensé
 * dans l'audit « Dossier 18 Jenny », version bleue PRINCIA).
 * Calque SVG feTurbulence en data-URI, CSS pur, pointer-events none ;
 * reduced-motion : animé OFF (calque retiré — le fond reste net).
 */
import { useReducedMotion } from "../../motion/useReducedMotion";

export function GrainLayer({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return <div className={`grain-layer ${className}`} aria-hidden="true" />;
}
