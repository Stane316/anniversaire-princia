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
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import type { IconName } from "../../components/ui/Icon";
import BubbleMenu from "../../components/menu/BubbleMenu";
import type { BubbleMenuItem } from "../../components/menu/BubbleMenu";
import Dock from "../../components/dock/Dock";

const NAV_ITEMS: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: "/app", label: "Accueil", icon: "home", end: true },
  { to: "/app/lectures", label: "Lectures", icon: "book-open" },
  { to: "/app/carnet", label: "Carnet", icon: "calendar" },
  { to: "/app/victoires", label: "Victoires", icon: "star" },
  { to: "/app/decouvrir", label: "Découvrir", icon: "compass" },
];

/** Les sections cadeaux, dans ses couleurs (bleu majeur). */
const GIFT_ITEMS: BubbleMenuItem[] = [
  {
    label: "l'invitation",
    href: "/birthday/accueil",
    ariaLabel: "L'invitation — l'enveloppe et la carte d'accueil",
    rotation: 6,
    hoverStyles: { bgColor: "#dbeafe", textColor: "#0b1e3a" },
  },
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
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Page courante : correspondance au prefep plus spécifique d'abord
  // (/app exact ne doit pas voler l'actif de /app/lectures…).
  const activeLabel =
    [...NAV_ITEMS]
      .sort((a, b) => b.to.length - a.to.length)
      .find((item) =>
        item.end ? pathname === item.to : pathname.startsWith(item.to),
      )?.label ?? NAV_ITEMS[0].label;

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

      {/* Menu principal animé (composant Stane — Dock) : les cinq
          sections de l'espace, magnification douce au survol, libellés
          toujours visibles (mobile), page courante marquée. */}
      <nav className="daily-dock" aria-label="Navigation principale de l'espace quotidien">
        <Dock
          items={NAV_ITEMS.map((item) => ({
            icon: <Icon name={item.icon} size={20} />,
            label: item.label,
            onClick: () => navigate(item.to),
          }))}
          activeLabel={activeLabel}
          showLabels
          // Amplitude calmée : cadre animé plafonné (dockHeight),
          // le rail ancré en bas empêche tout va-et-vient.

          baseItemSize={56}
          magnification={68}
          panelHeight={86}
          dockHeight={150}
          distance={140}
        />
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
