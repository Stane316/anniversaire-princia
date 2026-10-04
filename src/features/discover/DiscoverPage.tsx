/**
 * DISC + CODE — « À découvrir », Propositions du QG et coin informatique
 * (doc 01 §12–§13 ; mission §8 & §9).
 *
 * Ressources externes du coin informatique (§8) :
 * - freeCodeCamp : https://www.freecodecamp.org/
 * - W3Schools : https://www.w3schools.com/
 * - Codecademy : https://www.codecademy.com/
 * - OpenClassrooms : https://openclassrooms.com/
 * - roadmap.sh : https://roadmap.sh/
 */
import { useEffect, useState } from "react";
import { Icon } from "../../components/ui/Icon";
import { QgProposalsSection } from "../qg/QgProposalsSection";

export interface DiscoverResource {
  name: string;
  url: string;
  host: string;
  description: string;
  level: string;
}

export const CODE_RESOURCES: ReadonlyArray<DiscoverResource> = [
  {
    name: "freeCodeCamp",
    url: "https://www.freecodecamp.org/",
    host: "freecodecamp.org",
    description:
      "Un parcours gratuit et progressif : HTML, CSS, JavaScript et projets concrets directement dans le navigateur. Idéal pour poser un premier pied.",
    level: "Idéal pour débuter",
  },
  {
    name: "W3Schools",
    url: "https://www.w3schools.com/",
    host: "w3schools.com",
    description:
      "Des tutoriels clairs et des exemples interactifs pas à pas pour comprendre chaque balise et tester du code immédiatement.",
    level: "Exemples interactifs",
  },
  {
    name: "Codecademy",
    url: "https://www.codecademy.com/",
    host: "codecademy.com",
    description:
      "Des exercices pratiques guidés pour apprendre les bases de la programmation et du développement web à son rythme.",
    level: "Pratique guidée",
  },
  {
    name: "OpenClassrooms",
    url: "https://openclassrooms.com/",
    host: "openclassrooms.com",
    description:
      "Des cours structurés en français avec de nombreux contenus accessibles librement pour s'initier au numérique et au code.",
    level: "Cours en français",
  },
  {
    name: "roadmap.sh",
    url: "https://roadmap.sh/",
    host: "roadmap.sh",
    description:
      "Des cartes visuelles et feuilles de route communautaires pour visualiser les étapes d'apprentissage en informatique sans se perdre.",
    level: "Feuilles de route",
  },
];

export function DiscoverPage() {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
      ? navigator.onLine
      : true,
  );

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return (
    <section className="container section container--editorial page-enter">
      <header className="stack" style={{ marginBottom: "var(--space-8)" }}>
        <p className="kicker">À découvrir</p>
        <h1 className="h2">Tes découvertes</h1>
        <p className="text-secondary" style={{ maxWidth: "60ch" }}>
          Des propositions pensées pour toi dans le QG, et un petit coin pour explorer
          l'informatique à ton rythme. Tout reste consultable quand tu veux — rien à
          valider, rien à finir.
        </p>
      </header>

      {!isOnline && (
        <p
          className="alert alert--info"
          role="status"
          style={{ marginBottom: "var(--space-6)" }}
        >
          <Icon name="alert" size={18} />
          <span>
            Mode hors ligne actif : cette page et tes espaces personnels restent
            consultables, mais l'ouverture des sites externes du coin informatique
            nécessitera le retour de la connexion.
          </span>
        </p>
      )}

      <QgProposalsSection />

      <section aria-labelledby="discover-code">
        <div className="stack" style={{ marginBottom: "var(--space-5)" }}>
          <h2 id="discover-code" className="h3">
            Le coin informatique
          </h2>
          <p className="text-secondary" style={{ maxWidth: "60ch" }}>
            Ton terrain de curiosité, sans aucune obligation. Cinq ressources fiables
            pour explorer et pratiquer — consultables quand tu veux.
          </p>
        </div>
        <ul className="stack" aria-label="Ressources externes d'apprentissage en informatique">
          {CODE_RESOURCES.map((resource) => (
            <li key={resource.url}>
              <article
                className="card cluster cluster--between"
                style={{ alignItems: "flex-start", gap: "var(--space-4)" }}
              >
                <div className="stack" style={{ gap: "var(--space-2)", flex: 1 }}>
                  <div className="cluster" style={{ gap: "var(--space-2)" }}>
                    <span className="badge badge--blue">{resource.level}</span>
                  </div>
                  <h3 className="h4">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {resource.name}
                    </a>
                  </h3>
                  <p
                    className="text-secondary"
                    style={{ fontSize: "var(--text-body-sm)" }}
                  >
                    {resource.description}
                  </p>
                  <p
                    className="text-muted"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-caption)",
                    }}
                  >
                    {resource.host} · Lien externe (nouvel onglet)
                  </p>
                </div>
                <a
                  className="btn btn--secondary"
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ouvrir ${resource.name} (${resource.host}, lien externe dans un nouvel onglet)`}
                >
                  Visiter
                  <Icon name="external" size={14} />
                </a>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
