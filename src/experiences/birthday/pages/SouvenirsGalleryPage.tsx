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
import GlowCursor from "../../../components/effects/GlowCursor";
import { Icon } from "../../../components/ui/Icon";
import { souvenirPhotos, souvenirsContent } from "../data/souvenirs";

export function SouvenirsGalleryPage() {
  return (
    // GlowCursor EST la scène plein écran : sa traînée suit le pointeur
    // (souris comme doigt, pendant le défilement de la spirale) sur le
    // fond nuit — c'est l'endroit où la lumière bleue respire le mieux.
    // Le canvas est en pointer-events:none : le drag de la spirale
    // reste intact, et reduced-motion n'active jamais le WebGL.
    <GlowCursor
      className="souvenirs-fullpage"
      color="#8EC5FF"
      secondaryColor="#2D65B8"
      trailLength={40}
      trailWidth={10}
      trailTaper={0.82}
      followSpeed={0.17}
      glowIntensity={2.1}
      glowSpread={1.2}
      hotspot={0.58}
      brightness={1.25}
      opacity={0.9}
      pulseSpeed={0.8}
      noiseStrength={0.03}
      idleFade
      idleTimeout={2600}
      fadeDuration={1400}
      blendMode="screen"
      aria-label="Souvenirs — la galerie en spirale"
    >
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
    </GlowCursor>
  );
}
