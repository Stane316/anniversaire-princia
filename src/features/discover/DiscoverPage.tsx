/**
 * DISC + CODE — « À découvrir » et coin de découverte informatique
 * (doc 01 §12–§13).
 *
 * Règles :
 * - les propositions de Stane sont distinguées d'éventuelles
 *   recommandations IA ; en V1 aucune recommandation IA n'existe
 *   et rien ne le prétend (doc 01 §22.3) ;
 * - l'espace informatique est une invitation à explorer, pas une
 *   obligation ; les niveaux indiqués sont des repères honnêtes ;
 * - les liens externes sont identifiables et ne prétendent pas
 *   avoir été vérifiés récemment (doc 01 §12.3).
 */
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";

interface Resource {
  title: string;
  url: string;
  host: string;
  description: string;
  level: string;
}

const CODE_RESOURCES: Resource[] = [
  {
    title: "freeCodeCamp — apprendre à coder",
    url: "https://www.freecodecamp.org/learn/",
    host: "freecodecamp.org",
    description:
      "Un parcours gratuit et progressif : HTML, CSS, JavaScript, avec des exercices directement dans le navigateur. Idéal pour poser un premier pied.",
    level: "Idéal pour débuter",
  },
  {
    title: "MDN Web Docs (français)",
    url: "https://developer.mozilla.org/fr/",
    host: "developer.mozilla.org",
    description:
      "La référence du web, expliquée en français. À garder sous le coude dès qu'un terme ou une fonction devient flou.",
    level: "Référence à consulter",
  },
  {
    title: "OpenClassrooms",
    url: "https://openclassrooms.com/fr/",
    host: "openclassrooms.com",
    description:
      "Des cours guidés en français, dont de nombreux contenus gratuits pour se lancer dans la programmation.",
    level: "Cours guidés",
  },
];

export function DiscoverPage() {
  return (
    <section className="container section container--editorial page-enter">
      <header className="stack" style={{ marginBottom: "var(--space-8)" }}>
        <p className="kicker">À découvrir</p>
        <h1 className="h2">Tes découvertes</h1>
        <p className="text-secondary" style={{ maxWidth: "60ch" }}>
          Des propositions pensées pour toi, et un petit coin pour explorer l'informatique à ton
          rythme. Tout reste consultable quand tu veux — rien à valider, rien à finir.
        </p>
      </header>

      <section aria-labelledby="discover-stane" style={{ marginBottom: "var(--space-10)" }}>
        <h2 id="discover-stane" className="h3" style={{ marginBottom: "var(--space-4)" }}>
          Propositions du QG <span className="badge badge--blue">signées Stane</span>
        </h2>
        <EmptyState
          icon="sparkles"
          title="Stane prépare des choses"
          description="Un livre, une idée de projet, une trouvaille : cette section accueillera ses propositions dès que le mécanisme de partage sera mis en place. Surveille cet espace."
        />
      </section>

      <section aria-labelledby="discover-code">
        <div className="stack" style={{ marginBottom: "var(--space-5)" }}>
          <h2 id="discover-code" className="h3">
            Le coin informatique
          </h2>
          <p className="text-secondary" style={{ maxWidth: "60ch" }}>
            Ton ancien terrain de curiosité, sans aucune obligation. Trois ressources fiables
            pour débuter — consultables quand tu veux.
          </p>
        </div>
        <ul className="stack">
          {CODE_RESOURCES.map((resource) => (
            <li key={resource.url}>
              <article className="card cluster cluster--between" style={{ alignItems: "flex-start", gap: "var(--space-4)" }}>
                <div className="stack" style={{ gap: "var(--space-2)", flex: 1 }}>
                  <div className="cluster" style={{ gap: "var(--space-2)" }}>
                    <span className="badge badge--blue">{resource.level}</span>
                  </div>
                  <h3 className="h4">{resource.title}</h3>
                  <p className="text-secondary" style={{ fontSize: "var(--text-body-sm)" }}>
                    {resource.description}
                  </p>
                  <p className="text-muted" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-caption)" }}>
                    {resource.host}
                  </p>
                </div>
                <a
                  className="btn btn--secondary"
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ouvrir ${resource.title} (lien externe, nouvel onglet)`}
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
