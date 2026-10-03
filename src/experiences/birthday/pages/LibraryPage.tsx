/**
 * Blue Library — landing narrative complète (refonte).
 * Un parcours continu en sections : héro-signature (prénom en
 * particules), l'institution (règlement + carte de lectrice), les
 * volumes feuilletables en place (le grand livre reste disponible,
 * mais n'est plus exigé pour lire), le volume sous scellé, puis les
 * ponts vers le dossier du campus et la lettre.
 *
 * Aucune étape n'est verrouillée ; navigabilité clavier et lisibilité
 * priment toujours (doc 00 §6, doc 02 §5).
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BirthdayLayout } from "../BirthdayLayout";
import {
  birthdayChapters,
  libraryContent,
  libraryCodex,
  libraryCaseTeaser,
  sealedVolume,
} from "../data/content";
import { ExLibrisStamp } from "../../../components/library/ExLibrisStamp";
import { RulesBoard } from "../../../components/library/RulesBoard";
import { ReaderCard } from "../../../components/library/ReaderCard";
import { MarginNote } from "../../../components/library/MarginNote";
import { ParticleName } from "../../../components/effects/ParticleName";
import { SouvenirsSection } from "../components/SouvenirsSection";
import { Icon } from "../../../components/ui/Icon";
import GradientWaves from "../../../components/backgrounds/GradientWaves";

export function LibraryPage() {
  const [openVolumeId, setOpenVolumeId] = useState<string | null>(null);
  const sheetHeadingRef = useRef<HTMLHeadingElement>(null);

  const openVolume = openVolumeId
    ? birthdayChapters.find((chapter) => chapter.id === openVolumeId) ?? null
    : null;
  const openIndex = openVolume
    ? birthdayChapters.findIndex((chapter) => chapter.id === openVolume.id)
    : -1;

  const toggleVolume = (id: string) => {
    setOpenVolumeId((current) => (current === id ? null : id));
  };

  const stepVolume = (direction: -1 | 1) => {
    const next = openIndex + direction;
    if (next >= 0 && next < birthdayChapters.length) {
      setOpenVolumeId(birthdayChapters[next].id);
    }
  };

  useEffect(() => {
    if (openVolume && sheetHeadingRef.current) {
      sheetHeadingRef.current.focus();
    }
  }, [openVolumeId, openVolume]);

  return (
    <BirthdayLayout back={{ to: "/birthday", label: "Retour à la couverture" }}>
      {/* Fond d'espace (composant Stane — GradientWaves) : la mer
          d'encre bleue de la bibliothèque, vagues pastel lumineuses
          sous les rayonnages. GPU pur, pause hors écran, DPR ≤ 1.5. */}
      <div className="scene-backdrop" aria-hidden="true">
        <GradientWaves
          horizonColor="#EAF3FF"
          waveColor="#7FB2F2"
          crestColor="#FFFFFF"
          speed={0.3}
          amplitude={2.2}
          waveScale={0.55}
          waveRatio={0.9}
          swell={30}
          turbulence={16}
          tilt={1.08}
          zoom={1.05}
          height={5.0}
          fogDepth={22}
          detail="low"
          brightness={1}
          opacity={0.5}
          grain={false}
          mouseInteraction
          parallaxStrength={0.32}
        />
      </div>
      <div className="library-landing">
        {/* ====================================================
            Héro — le nom signé en particules (décor pur)
            ==================================================== */}
        <section className="library-hero" aria-labelledby="library-title">
          <span className="library-hero__ghost" aria-hidden="true">
            CH. 18
          </span>
          <div className="library-hero__inner container">
            <p className="kicker">
              <Icon name="sparkles" size={14} />
              {libraryContent.kicker}
            </p>
            {/* Titre accessible réel : le canvas ne porte aucun texte sémantique */}
            <h1 id="library-title" className="sr-only">
              Princia — Chapitre 18, la Blue Library
            </h1>
            <ParticleName text="Princia" className="library-hero__particles" />
            <p className="library-hero__chapter" aria-hidden="true">
              Chapter 18 · la Blue Library
            </p>
            <p className="lead library-hero__lead">{libraryContent.intro}</p>
            <div className="cluster library-hero__actions">
              <a href="#volumes" className="btn btn--primary btn--large">
                <Icon name="library" size={18} />
                Entrer sur le rayonnage
              </a>
              <Link to="/birthday/lettre" className="btn btn--secondary btn--large">
                <Icon name="letter" size={16} />
                Lire la lettre
              </Link>
            </div>
            <span className="library-hero__stamp" aria-hidden="true">
              <ExLibrisStamp
                text={libraryCodex.stampText}
                subline={libraryCodex.stampSubline}
                size={108}
                rotate={13}
              />
            </span>
          </div>
        </section>

        {/* ====================================================
            L'institution — règlement et carte de lectrice
            ==================================================== */}
        <section className="library-institution section" aria-labelledby="institution-title">
          <div className="container container--readable library-institution__inner">
            <p className="kicker">
              <Icon name="library" size={14} />
              {libraryCodex.institution}
            </p>
            <h2 id="institution-title" className="h2">
              Une institution, et sa lectrice
            </h2>
            <div className="library-fiction">
              <RulesBoard />
              <ReaderCard />
            </div>
            <MarginNote label="Note de la bibliothécaire">
              Notice certifiée conforme — relue, tamponnée, et glissée dans le dossier {libraryCodex.collection}.
            </MarginNote>
          </div>
        </section>

        {/* ====================================================
            Les volumes — feuilletables en place (#volumes)
            ==================================================== */}
        <section id="volumes" className="library-volumes section" aria-labelledby="volumes-title">
          <div className="container">
            <header className="library-volumes__header stack">
              <p className="kicker">
                <Icon name="book-open" size={14} />
                Le rayonnage
              </p>
              <h2 id="volumes-title" className="h2">
                Cinq volumes, et un sixième sous scellé
              </h2>
              <p className="text-body text-muted">
                Ouvre-les dans l'ordre ou dans le désordre : dans cette bibliothèque, tout
                t'appartient déjà.
              </p>
            </header>

            <ol className="library-landing__shelf">
              {birthdayChapters.map((chapter, index) => (
                <li
                  key={chapter.id}
                  className="stagger-item"
                  style={{ "--stagger-index": index } as React.CSSProperties}
                >
                  <button
                    type="button"
                    className={`book-card book-card--button${openVolumeId === chapter.id ? " book-card--active" : ""}`}
                    onClick={() => toggleVolume(chapter.id)}
                    aria-expanded={openVolumeId === chapter.id}
                    aria-controls="volume-sheet"
                    aria-label={`${chapter.kicker} : ${chapter.title}`}
                  >
                    <div
                      className="book-cover"
                      style={
                        {
                          "--book-top": chapter.gradient.top,
                          "--book-bottom": chapter.gradient.bottom,
                        } as React.CSSProperties
                      }
                    >
                      <div className="cluster cluster--between">
                        <span className="book-cover__number">{chapter.number}</span>
                        <Icon name="book-open" size={18} style={{ opacity: 0.7 }} />
                      </div>
                      <div>
                        <p className="book-cover__kicker">{chapter.kicker}</p>
                        <span className="book-cover__title h2" style={{ display: "block" }}>
                          {chapter.title}
                        </span>
                        <p className="book-cover__cote">{chapter.callNumber}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}

              {/* 5.4 — Le volume sous scellé */}
              <li
                className="stagger-item"
                style={{ "--stagger-index": birthdayChapters.length } as React.CSSProperties}
              >
                <Link
                  to="/birthday/bibliotheque/chapitre/volume-scelle"
                  className="book-card book-card--sealed"
                  aria-label={`Volume sous scellé — ${sealedVolume.sealed.title}`}
                >
                  <div className="book-cover">
                    <div className="cluster cluster--between">
                      <span className="book-cover__number">VOLUME S</span>
                      <span className="book-card__seal-dot" aria-hidden="true">
                        S
                      </span>
                    </div>
                    <div>
                      <p className="book-cover__kicker">{sealedVolume.kicker}</p>
                      <span className="book-cover__title h2" style={{ display: "block" }}>
                        {sealedVolume.sealed.title}
                      </span>
                      <p className="book-cover__cote">{sealedVolume.cote}</p>
                    </div>
                  </div>
                </Link>
              </li>
            </ol>

            {/* Feuillet « en place » : le volume choisi s'ouvre ici même. */}
            {openVolume && (
              <div
                id="volume-sheet"
                className="volume-sheet"
                role="region"
                aria-label={`${openVolume.kicker} — ${openVolume.title}`}
              >
                <div className="volume-sheet__head">
                  <div>
                    <p className="kicker">
                      <Icon name="book-open" size={14} />
                      {openVolume.kicker}
                    </p>
                    <h3 ref={sheetHeadingRef} tabIndex={-1} className="h2 volume-sheet__title">
                      {openVolume.title}
                    </h3>
                    <p className="text-caption text-muted" style={{ fontFamily: "var(--font-mono)" }}>
                      Cote {openVolume.callNumber} · {libraryCodex.collection}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn--secondary btn--small"
                    onClick={() => setOpenVolumeId(null)}
                    aria-label="Refermer ce volume"
                  >
                    <Icon name="close" size={14} />
                    Fermer
                  </button>
                </div>
                <div className="volume-sheet__body">
                  <div className="copy">
                    {openVolume.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)} className="text-body">
                        {paragraph}
                      </p>
                    ))}
                    {openVolume.aside ? (
                      <blockquote className="volume-sheet__aside">
                        <span className="volume-sheet__aside-label">Entre nous</span>
                        {openVolume.aside}
                      </blockquote>
                    ) : null}
                    <MarginNote label="Note de la bibliothécaire">{openVolume.marginNote}</MarginNote>
                  </div>
                </div>
                <div className="volume-sheet__foot">
                  <div className="cluster">
                    <button
                      type="button"
                      className="btn btn--secondary btn--small"
                      onClick={() => stepVolume(-1)}
                      disabled={openIndex === 0}
                    >
                      <Icon name="arrow-left" size={14} />
                      Volume précédent
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary btn--small"
                      onClick={() => stepVolume(1)}
                      disabled={openIndex === birthdayChapters.length - 1}
                    >
                      Volume suivant
                      <Icon name="arrow-right" size={14} />
                    </button>
                  </div>
                  <Link to={`/birthday/bibliotheque/chapitre/${openVolume.id}`} className="btn btn--text">
                    Feuilleter dans le grand livre
                    <Icon name="arrow-right" size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ====================================================
            5.7 — Salle des souvenirs (galerie en spirale)
            ==================================================== */}
        <SouvenirsSection />

        {/* ====================================================
            Traversées — la lettre et le dossier du campus
            ==================================================== */}
        <section className="library-cross section" aria-labelledby="cross-title">
          <div className="container">
            <h2 id="cross-title" className="h2" style={{ marginBottom: "var(--space-6)" }}>
              Deux pièces voisines de la bibliothèque
            </h2>
            <div className="library-cross__grid">
              <Link
                to="/birthday/lettre"
                className="library-cross__card library-cross__card--letter stagger-item"
                style={{ "--stagger-index": 0 } as React.CSSProperties}
                aria-label="La lettre — le message principal du cadeau"
              >
                <span className="kicker">
                  <Icon name="letter" size={14} />
                  Le chapitre hors-chapitre
                </span>
                <span className="library-cross__title">Pour tes dix-huit ans</span>
                <span className="text-body text-muted">{libraryContent.letterTeaser}</span>
                <span className="library-cross__cta">
                  Ouvrir la lettre
                  <Icon name="arrow-right" size={14} />
                </span>
              </Link>
              <Link
                to="/enquete"
                className="library-cross__card library-cross__card--case stagger-item"
                style={{ "--stagger-index": 1 } as React.CSSProperties}
                aria-label="The 18th Case — un mini-dossier d'enquête optionnel"
              >
                <span className="kicker">
                  <Icon name="magnifier" size={14} />
                  Salle d'archives, au sous-sol
                </span>
                <span className="library-cross__title">{libraryCaseTeaser.title}</span>
                <span className="text-body text-muted">{libraryCaseTeaser.line}</span>
                <span className="library-cross__cta">
                  {libraryCaseTeaser.cta}
                  <Icon name="arrow-right" size={14} />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </BirthdayLayout>
  );
}
