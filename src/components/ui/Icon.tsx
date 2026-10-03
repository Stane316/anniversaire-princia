/**
 * Icônes SVG inline — une seule famille cohérente : trait uniforme,
 * extrémités arrondies, 24 × 24 (doc 02 §9.7).
 * Toutes sont décoratives par défaut (aria-hidden) ; les boutons qui les
 * utilisent portent un label accessible.
 */
import type { SVGProps } from "react";

export type IconName =
  | "home"
  | "book"
  | "book-open"
  | "library"
  | "letter"
  | "compass"
  | "calendar"
  | "star"
  | "magnifier"
  | "arrow-left"
  | "arrow-right"
  | "plus"
  | "close"
  | "check"
  | "trash"
  | "edit"
  | "sparkles"
  | "external"
  | "check-circle"
  | "alert";

const PATHS: Record<IconName, string[]> = {
  home: ["M3 10.5 12 3l9 7.5", "M5 9.5V21h14V9.5", "M9 21v-6h6v6"],
  book: [
    "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
    "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z",
  ],
  "book-open": [
    "M2 4h6.5a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H2Z",
    "M22 4h-6.5a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3H22Z",
  ],
  library: ["M4 4v16", "M8 4v16", "M12 4v16", "M16 6l4 14", "M3 20h8", "M14 20h7"],
  letter: [
    "M4 6h16v12H4z",
    "m4 7 8 6 8-6",
  ],
  compass: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "m15.5 8.5-2 5-5 2 2-5Z"],
  calendar: [
    "M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
    "M8 3v4M16 3v4M4 10h16",
  ],
  star: [
    "m12 3 2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7Z",
  ],
  magnifier: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z", "m21 21-4.8-4.8"],
  "arrow-left": ["M19 12H5", "m11 18-6-6 6-6"],
  "arrow-right": ["M5 12h14", "m13 6 6 6-6 6"],
  plus: ["M12 5v14M5 12h14"],
  close: ["M18 6 6 18M6 6l12 12"],
  check: ["m4 12.5 5 5L20 6.5"],
  trash: [
    "M4 7h16",
    "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
    "M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13",
  ],
  edit: ["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"],
  sparkles: [
    "M12 4 13.6 8.4 18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6Z",
    "M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z",
    "M5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6Z",
  ],
  external: ["M14 4h6v6", "M20 4 11 13", "M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"],
  "check-circle": ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "m8.5 12.5 2.5 2.5 4.5-5"],
  alert: [
    "M12 9v4.5",
    "M12 17.5h.01",
    "M10.3 3.9 2.6 17.4A2 2 0 0 0 4.3 20.4h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  ],
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
