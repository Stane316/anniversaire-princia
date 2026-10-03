/**
 * Falling Rays — équivalent natif (solution de repli adaptée,
 * registre React Bits Pro inaccessible sans licence — cf. registre).
 * Rayons lumineux descendants, purement décoratifs :
 * - aucun WebGL, aucune dépendance : divs + keyframes CSS ;
 * - prefers-reduced-motion : versions fixes, plus sombres, sans animation ;
 * - le contenu et les actions ne dépendent jamais de cet effet.
 */
import { useMemo } from "react";
import { useReducedMotion } from "../../motion/useReducedMotion";

export function FallingRays({
  rayCount = 12,
  color = "rgba(106, 165, 238, 0.5)",
  slantDeg = -14,
  className = "",
}: {
  rayCount?: number;
  color?: string;
  slantDeg?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const rays = useMemo(() => {
    // Pseudo-aléatoire stable (pas de Math.random au rendu : positions
    // reproductibles à chaque visite).
    return Array.from({ length: rayCount }, (_, i) => {
      const x = (i * 37 + 11) % 100;
      const dur = 6.5 + ((i * 13) % 7) * 0.7;
      const delay = -((i * 29) % 9);
      const height = 48 + ((i * 17) % 5) * 9;
      return { x, dur, delay, height, key: i };
    });
  }, [rayCount]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const visible = isMobile ? Math.max(6, Math.round(rayCount / 2)) : rays.length;

  return (
    <div
      className={`falling-rays${reducedMotion ? " falling-rays--static" : ""} ${className}`}
      aria-hidden="true"
      style={{ "--ray-slant": `${slantDeg}deg`, "--ray-color": color } as React.CSSProperties}
    >
      {rays.slice(0, visible).map((ray) => (
        <span
          key={ray.key}
          className="falling-rays__ray"
          style={
            {
              left: `${ray.x}%`,
              height: `${ray.height}%`,
              animationDuration: `${ray.dur}s`,
              animationDelay: `${ray.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
