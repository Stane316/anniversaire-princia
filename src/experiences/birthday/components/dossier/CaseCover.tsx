/**
 * Véritable héros du dossier « The 18th Case » (chapitre I).
 * Fonctions reproduites de la couverture de la référence (audit
 * « Dossier 18 Jenny », fiche 1) : écran d'ouverture pleine hauteur,
 * cadre « enquête » planté en 3 secondes, fiche d'identification,
 * double sortie (lire / la lettre), marquee institutionnel.
 *
 * Identité PRINCIA, motif NON animal : le **dossier n°18 lui-même**
 * est l'emblème — grand sceau tournant + ex-libris flottant qui
 * flotte comme le papillon de la référence, zéro mascotte.
 */
import { Link } from "react-router-dom";
import { caseDossier } from "../../data/content";
import { SealDisc } from "../../../../components/library/SealDisc";
import { ExLibrisStamp } from "../../../../components/library/ExLibrisStamp";
import { Marquee } from "../../../../components/effects/Marquee";
import { Reveal } from "../../../../components/effects/Reveal";
import { Icon } from "../../../../components/ui/Icon";

export function CaseCover() {
  const cover = caseDossier.cover;
  return (
    <header
      className="dossier-cover"
      id="couverture"
      data-chapter={caseDossier.chapters[0].label}
    >
      <Marquee className="dossier-cover__marquee" items={cover.marquee} />

      {/* Motif central non animal : le sceau N°18, grand, en contre-
          jour — équivalent fonctionnel de l'emblème de la référence. */}
      <div className="dossier-cover__emblem" aria-hidden="true">
        <SealDisc text={cover.sealText} center="N°18" size={320} />
      </div>
      {/* L'ex-libris dérive en fond (rôle du papillon de la référence,
          version bibliothèque bleue). */}
      <div className="dossier-cover__exlibris" aria-hidden="true">
        <ExLibrisStamp text="EX · LIBRIS" subline="PRC-18" size={96} rotate={-12} ink="rgba(57, 120, 212, 0.34)" />
      </div>

      <div className="dossier-cover__grid">
        <div className="dossier-cover__main">
          <Reveal>
            <p className="dossier-cover__bureau">{cover.bureau}</p>
          </Reveal>
          <Reveal delay={90}>
            <p className="dossier-cover__open-line">
              {cover.openLine}
              <span className="dossier-cover__ref">{cover.reference}</span>
            </p>
          </Reveal>
          <Reveal delay={180}>
            <span className="dossier-stamp dossier-stamp--tilt">{cover.stamp}</span>
          </Reveal>
          <h1 className="dossier-cover__title">
            <Reveal delay={280}>
              <span className="dossier-cover__title-lead">{cover.titleLead}</span>
            </Reveal>
            <Reveal delay={420}>
              <span className="dossier-cover__title-name">{cover.titleName}</span>
            </Reveal>
          </h1>
          <Reveal delay={560}>
            <p className="dossier-cover__lead">{cover.lead}</p>
          </Reveal>
          <Reveal delay={680}>
            <div className="cluster">
              <a href="#rapport" className="btn btn--primary">
                <Icon name="magnifier" size={16} />
                {cover.ctaOpen}
              </a>
              <Link to="/birthday/lettre" className="btn btn--secondary">
                <Icon name="letter" size={16} />
                {cover.ctaLetter}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={780}>
            <a className="dossier-cover__continue" href="#rapport">
              Commencer la lecture du dossier
              <span aria-hidden="true">↓</span>
            </a>
          </Reveal>
        </div>

        {/* Fiche d'identification — information factuelle visible,
            agrandie sur desktop (plus d'espace utile par ligne). */}
        <Reveal delay={320} className="dossier-cover__side">
          <article className="dossier-idcard">
            <p className="dossier-idcard__label">{cover.identification.label}</p>
            <dl className="dossier-idcard__rows">
              {cover.identification.rows.map((row) => (
                <div key={row.label} className="dossier-idcard__row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="dossier-idcard__foot">{cover.identification.footLine}</p>
            <SealDisc
              className="dossier-idcard__seal"
              text={cover.sealText}
              center="N°18"
              size={128}
            />
          </article>
        </Reveal>
      </div>

      <Marquee items={cover.marquee} separator="—" />
    </header>
  );
}
