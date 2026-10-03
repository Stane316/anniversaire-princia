/**
 * Reveal — wrapper de révélation au scroll (mécanisme du dossier
 * de référence « Dossier 18 Jenny », reconstruit pour PRINCIA).
 * Purement décoratif : le contenu est AUSSI visible immédiatement
 * en reduced-motion et n'est jamais masqué au-delà du scroll effectué.
 */
import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../../motion/useInView";

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "p" | "figure" | "li" | "header" | "span" | "blockquote" | "article";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <Tag
      ref={ref as never}
      data-reveal
      className={`${className} ${inView ? "is-in" : ""}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
