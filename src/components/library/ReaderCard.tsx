/**
 * Carte de lectrice de Princia (5.1) — fiche d'identité de la fiction,
 * établie uniquement avec les faits validés du document 00.
 */
import { readerCard } from "../../experiences/birthday/data/content";
import { ExLibrisStamp } from "./ExLibrisStamp";

export function ReaderCard() {
  return (
    <section className="reader-card" aria-label={readerCard.title}>
      <header className="reader-card__header">
        <div>
          <p className="reader-card__stamp">{readerCard.stamp}</p>
          <h2 className="reader-card__title">{readerCard.title}</h2>
        </div>
        <ExLibrisStamp text="BLUE LIBRARY" subline="Fonds Princia" size={78} rotate={10} />
      </header>
      <dl className="reader-card__fields">
        {readerCard.fields.map((field) => (
          <div key={field.label} className="reader-card__row">
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
      <p className="reader-card__footnote">{readerCard.footnote}</p>
    </section>
  );
}
