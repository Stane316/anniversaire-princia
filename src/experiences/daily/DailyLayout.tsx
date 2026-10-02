/**
 * Cadre de l'espace quotidien (doc 02 §8.3, doc 01 §4.1-B).
 * - navigation constante et reconnaissable : barre en bas sur mobile,
 *   pilule centrée sur desktop (mêmes libellés, mêmes destinations) ;
 * - aucun accès ne conditionne l'autre : chaque section est indépendante.
 */
import { NavLink, Link, Outlet } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import type { IconName } from "../../components/ui/Icon";

const NAV_ITEMS: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: "/app", label: "Accueil", icon: "home", end: true },
  { to: "/app/lectures", label: "Lectures", icon: "book-open" },
  { to: "/app/carnet", label: "Carnet", icon: "calendar" },
  { to: "/app/victoires", label: "Victoires", icon: "star" },
  { to: "/app/decouvrir", label: "Découvrir", icon: "compass" },
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
          <Link to="/birthday/bibliotheque" className="btn btn--text">
            <Icon name="library" size={16} />
            Souvenirs
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
    </div>
  );
}
