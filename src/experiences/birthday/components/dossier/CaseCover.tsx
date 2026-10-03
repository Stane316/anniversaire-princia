/**
 * Couverture du dossier « The 18th Case » (Pièce I).
 * Fonction équivalente à la cover du dossier de référence
 * « Dossier 18 Jenny », entièrement recréée : identité bleue
 * PRINCIA, sceau dossier comme emblème (aucun animal), fiche
 * d'identification factuelle validée.
 */
import { Link } from "react-router-dom";
import { caseDossier } from "../../data/content";
import { SealDisc } from "../../../../components/library/SealDisc";
import { Marquee } from "../../../../components/effects/Marquee";
import { Reveal } from "../../../../components/effects/Reveal";
import { Icon } from "../../../../components/ui/Icon";

export function CaseCover() {
  const cover = caseDossier.cover;
  return (
    <header className="dossier-cover" id="couverture">
      <Marquee className="dossier-cover__marquee" items={cover.marquee} />

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
        </div>

        {/* Fiche d'identification — carte administrative, seule
            information factuelle de couverture (tout est visible
            sans survol, règle permanente). */}
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
