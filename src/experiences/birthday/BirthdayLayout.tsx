/**
 * Cadre commun de l'expérience anniversaire (navigation discrète et
 * contextuelle — doc 02 §9.3). Offre toujours un retour fonctionnel :
 * jamais d'impasse de navigation (doc 01 §4.3).
 */
import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { Icon } from "../../components/ui/Icon";
import { visitMemory } from "../../data/repositories";

interface BirthdayLayoutProps {
  children: ReactNode;
  /** Lien de retour affiché à gauche de la barre. */
  back?: { to: string; label: string };
  /** Désactive la barre (écrans d'entrée pleine page). */
  bare?: boolean;
}

export function BirthdayLayout({ children, back, bare = false }: BirthdayLayoutProps) {
  const visitedDaily = visitMemory.hasVisitedDailySpace();

  return (
    <div className="page">
      {!bare && (
        <nav className="top-nav" aria-label="Navigation de l'expérience anniversaire">
          <div className="container top-nav__inner">
            {back ? (
              <Link to={back.to} className="btn btn--text" style={{ marginLeft: -12 }}>
                <Icon name="arrow-left" size={18} />
                {back.label}
              </Link>
            ) : (
              <Link to="/birthday/bibliotheque" className="brand-mark">
                <Icon name="book" size={20} />
                Chapter 18
              </Link>
            )}
            <div className="cluster" style={{ gap: "var(--space-2)" }}>
              <NavLink to="/birthday/lettre" className="btn btn--text">
                La lettre
              </NavLink>
              {visitedDaily && (
                <NavLink to="/app" className="btn btn--text">
                  Mon espace
                </NavLink>
              )}
            </div>
          </div>
        </nav>
      )}
      <main id="main" className="page-enter" style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
