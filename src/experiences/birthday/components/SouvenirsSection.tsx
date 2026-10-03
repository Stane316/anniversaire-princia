/**
 * 5.7 — Salle des souvenirs : la galerie en spirale (InfiniteSpiral,
 * source fournie par Stane, intégrée nativement sans dépendance).
 *
 * - décor + contenu : les photos sont les vraies pièces du fonds ;
 * - descriptions exactes en alt (voir souvenirs.ts) + liste sr-only ;
 * - reduced-motion : la spirale ne tourne pas (composant géré),
 *   la liste reste intégralement visible et accessible ;
 * - drag + auto + scroll : aucun verrou, survol = pause.
 */
import InfiniteSpiral from "../../../components/effects/InfiniteSpiral";
import { MarginNote } from "../../../components/library/MarginNote";
import { Icon } from "../../../components/ui/Icon";
import { souvenirPhotos, souvenirsContent } from "../data/souvenirs";

export function SouvenirsSection() {
  return (
    <section className="library-souvenirs section" aria-labelledby="souvenirs-title">
      <div className="container">
        <header className="library-volumes__header stack">
          <p className="kicker">
            <Icon name="star" size={14} />
            {souvenirsContent.kicker}
          </p>
          <h2 id="souvenirs-title" className="h2">
            {souvenirsContent.title}
          </h2>
          <p className="text-body text-muted">{souvenirsContent.lead}</p>
        </header>

        <div className="souvenirs-scene">
          <InfiniteSpiral
            items={souvenirPhotos}
            animationMode="all"
            speed={0.45}
            radius={150}
            cardWidth={118}
            cardHeight={156}
            verticalSpacing={82}
            cardsPerTurn={7}
            centerScale={1.3}
            edgeFade={0.28}
            edgeBlur={5}
            pauseOnHover
            className="souvenirs-scene__spiral"
          />
          <p className="souvenirs-scene__note text-caption">
            {souvenirsContent.note}
          </p>
        </div>

        {/* Inventaire textuel : l'équivalent lecteur d'écran de la scène. */}
        <div className="container container--readable" style={{ marginTop: "var(--space-5)" }}>
          <MarginNote label="Note de la bibliothécaire">{souvenirsContent.marginNote}</MarginNote>
          <ol className="sr-only" aria-label="Inventaire des 21 photos du fonds">
            {souvenirPhotos.map((photo) => (
              <li key={photo.src}>{photo.alt}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
