/**
 * Cadre de l'espace quotidien (doc 02 §8.3, doc 01 §4.1-B).
 * - navigation constante et reconnaissable : barre en bas sur mobile,
 *   pilule centrée sur desktop (mêmes libellés, mêmes destinations) ;
 * - aucun accès ne conditionne l'autre : chaque section est indépendante.
 *
 * Menu cadeaux (demande Stane, 3 oct. 2026) : un gros bouton dans
 * l'en-tête (BubbleMenu, composant fourni par Stane) ouvre la liste
 * déroulante vers ses sections dédiées — souvenirs (plein écran),
 * lettre, bibliothèque, enquête. Bouton toujours visible, jamais
 * bloquant ; Échap ferme.
 */
import { NavLink, Link, Outlet } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import type { IconName } from "../../components/ui/Icon";
import BubbleMenu from "../../components/menu/BubbleMenu";
import type { BubbleMenuItem } from "../../components/menu/BubbleMenu";

const NAV_ITEMS: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: "/app", label: "Accueil", icon: "home", end: true },
  { to: "/app/lectures", label: "Lectures", icon: "book-open" },
  { to: "/app/carnet", label: "Carnet", icon: "calendar" },
  { to: "/app/victoires", label: "Victoires", icon: "star" },
  { to: "/app/decouvrir", label: "Découvrir", icon: "compass" },
];

/** Les quatre sections cadeaux, dans ses couleurs (bleu majeur). */
const GIFT_ITEMS: BubbleMenuItem[] = [
  {
    label: "souvenirs",
    href: "/souvenirs",
    ariaLabel: "Souvenirs — la galerie en spirale, en plein écran",
    rotation: -6,
    hoverStyles: { bgColor: "#8ec5ff", textColor: "#0b1e3a" },
  },
  {
    label: "la lettre",
    href: "/birthday/lettre",
    ariaLabel: "La lettre d'anniversaire",
    rotation: 6,
    hoverStyles: { bgColor: "#2d65b8", textColor: "#ffffff" },
  },
  {
    label: "bibliothèque",
    href: "/birthday/bibliotheque",
    ariaLabel: "La Blue Library et ses chapitres",
    rotation: -6,
    hoverStyles: { bgColor: "#5b9beb", textColor: "#0b1e3a" },
  },
  {
    label: "l'enquête",
    href: "/enquete",
    ariaLabel: "The 18th Case — le mini-dossier d'enquête",
    rotation: 6,
    hoverStyles: { bgColor: "#0f2444", textColor: "#8ec5ff" },
  },
];

export function DailyLayout() {
  return (
    <div className="page">
      <header className="top-nav">
        <div className="container top-nav__inner">
          <Link to="/app" className="brand-mark">
            <Icon name="book" size={20} />
            Chapter 18
          </Link>
        </div>
      </header>

      <main className="daily-content" style={{ flex: 1 }}>
        <Outlet />
      </main>

      <nav className="daily-nav" aria-label="Navigation principale de l'espace quotidien">
        <ul className="daily-nav__list">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className="daily-nav__link"
                aria-label={item.label}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <BubbleMenu
        logo={
          <span>
            <Icon name="sparkles" size={15} aria-hidden="true" />
            cadeaux
          </span>
        }
        items={GIFT_ITEMS}
        menuAriaLabel="Ouvrir le menu des sections cadeaux (souvenirs, lettre, bibliothèque, enquête)"
        menuBg="#f6faff"
        menuContentColor="#15345b"
        animationEase="back.out(1.5)"
        animationDuration={0.45}
        staggerDelay={0.1}
      />
    </div>
  );
}
