/**
 * Règlement affiché à l'entrée de la Grande Salle Bleue (5.1).
 * Panneau « cartel de bibliothèque » : bord double, typographie
 * dactylographiée pour les chiffres d'articles.
 */
import { libraryCodex } from "../../experiences/birthday/data/content";
import { ExLibrisStamp } from "./ExLibrisStamp";

export function RulesBoard() {
  return (
    <section className="rules-board" aria-label={libraryCodex.rulesTitle}>
      <ExLibrisStamp
        text={libraryCodex.stampText}
        subline={libraryCodex.stampSubline}
        size={104}
        rotate={7}
      />
      <div className="rules-board__inner">
        <p className="rules-board__eyebrow">{libraryCodex.registration}</p>
        <h2 className="rules-board__title">{libraryCodex.rulesTitle}</h2>
        <ol className="rules-board__list">
          {libraryCodex.rules.map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ol>
        <p className="rules-board__note">{libraryCodex.rulesNote}</p>
      </div>
    </section>
  );
}
