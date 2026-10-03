/**
 * 5.7 — Souvenirs en plein écran (demande Stane : quand Princia
 * choisit « souvenir » depuis son espace, la spirale occupe
 * l'intégralité de l'écran).
 * - scène 100dvh, chrome minimal (retour + titre en pastille) ;
 * - inventaire sr-only identique à la salle de la bibliothèque ;
 * - aucune action obligatoire : retour disponible en un geste.
 */
import { Link } from "react-router-dom";
import InfiniteSpiral from "../../../components/effects/InfiniteSpiral";
import { Icon } from "../../../components/ui/Icon";
import { souvenirPhotos, souvenirsContent } from "../data/souvenirs";

export function SouvenirsGalleryPage() {
  return (
    <div className="souvenirs-fullpage">
      <InfiniteSpiral
        items={souvenirPhotos}
        animationMode="all"
        speed={0.5}
        radius={165}
        cardWidth={128}
        cardHeight={170}
        verticalSpacing={88}
        cardsPerTurn={7}
        centerScale={1.35}
        edgeFade={0.26}
        edgeBlur={5}
        pauseOnHover
        className="souvenirs-fullpage__spiral"
      />

      <header className="souvenirs-fullpage__head">
        <Link to="/app" className="souvenirs-fullpage__chip souvenirs-fullpage__chip--back">
          <Icon name="arrow-left" size={15} />
          Retour à l'espace
        </Link>
        <p className="souvenirs-fullpage__chip souvenirs-fullpage__chip--title">
          <Icon name="star" size={14} />
          {souvenirsContent.kicker} · 21 photos
        </p>
      </header>

      <p className="souvenirs-fullpage__hint text-caption">{souvenirsContent.note}</p>

      {/* Inventaire textuel : l'équivalent lecteur d'écran de la scène. */}
      <ol className="sr-only" aria-label="Inventaire des 21 photos du fonds souvenirs">
        {souvenirPhotos.map((photo) => (
          <li key={photo.src}>{photo.alt}</li>
        ))}
      </ol>
    </div>
  );
}
