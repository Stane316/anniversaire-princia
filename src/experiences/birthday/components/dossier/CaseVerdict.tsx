/**
 * Pièce IV — Verdict (mécanisme équivalent au Verdict du dossier de
 * référence « Dossier 18 Jenny », recréé : tampon « RÉSOLUE » qui
 * claque à l'arrivée à l'écran, braises bleues, ex-libris flottant
 * en lieu et place de tout animal).
 * Le verdict reste consultable sans aucune énigme résolue — la
 * pièce jointe précise simplement l'état du dossier.
 */
import { useEffect } from "react";
import { caseDossier } from "../../data/content";
import { useInView } from "../../../../motion/useInView";
import GlowCursor from "../../../../components/effects/GlowCursor";
import { Reveal } from "../../../../components/effects/Reveal";
import { ExLibrisStamp } from "../../../../components/library/ExLibrisStamp";
import { Icon } from "../../../../components/ui/Icon";

/** Traînée lumineuse du verdict (source GlowCursor fournie par Stane) :
 *  réglages PRINCIA — bleu ciel → bleu profond, blend screen sur le
 *  fond sombre de la scène (seule zone assez foncée pour rester
 *  visible ; ailleurs l'effet blanchirait sur le papier clair). */

export function CaseVerdict({
  completed,
  solvedCount,
  totalClues,
  onComplete,
}: {
  completed: boolean;
  solvedCount: number;
  totalClues: number;
  onComplete: () => void;
}) {
  const verdict = caseDossier.verdict;
  const { ref: stampRef, inView: slam } = useInView<HTMLDivElement>(0.45);

  /* Archivage du verdict dès qu'il entre à l'écran (une fois). */
  useEffect(() => {
    if (slam) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slam]);

  return (
    <section
      className="dossier-verdict"
      id="verdict"
      aria-label={verdict.title}
      data-chapter={caseDossier.chapters[4].label}
    >
      {/* Réglages renforcés (retour Stane : traînée jamais aperçue) :
          trace plus large et plus lumineuse, et surtout elle reste
          visible bien plus longtemps au repos (2,4 s + 1,3 s de fondu)
          au lieu de s'effacer presque aussitôt (0,7 s + 0,9 s). */}
      <GlowCursor
        color="#8EC5FF"
        secondaryColor="#3978D4"
        trailLength={44}
        trailWidth={12}
        trailTaper={0.8}
        followSpeed={0.16}
        glowIntensity={2.3}
        glowSpread={1.25}
        hotspot={0.6}
        brightness={1.35}
        opacity={0.95}
        pulseSpeed={0.9}
        noiseStrength={0.03}
        idleFade
        idleTimeout={2400}
        fadeDuration={1300}
        blendMode="screen"
        maxDevicePixelRatio={1.5}
      >
      <Reveal className="dossier-verdict__head">
        <p className="dossier-verdict__jury">{verdict.juryLine}</p>
        <h2 className="h2">{verdict.title}</h2>
      </Reveal>

      <div
        ref={stampRef}
        className={`dossier-verdict__slam${slam ? " is-slammed" : ""}`}
      >
        <ExLibrisStamp
          text={verdict.stamp}
          subline="Réf. ENQ-18/10-04"
          size={170}
          rotate={-12}
          ink="rgba(23, 74, 145, 0.75)"
        />
        <p className="dossier-verdict__stampline">{verdict.stampLine}</p>
      </div>

      <Reveal delay={160}>
        <p className="dossier-verdict__sentence">{verdict.sentence}</p>
        <p className="dossier-verdict__note text-muted" role="status">
          {solvedCount === totalClues
            ? verdict.completeNote
            : `Dossier consulté — ${solvedCount}/${totalClues} interrogatoires signés. Rien n'empêchait le verdict : il tenait déjà.`}
        </p>
      </Reveal>

      {/* Pièce jointe manuscrite : message personnel sincère
          (ambitions jamais promises, appui offert, amitié de sixième). */}
      <Reveal delay={240}>
        <article className="dossier-letter">
          <span className="dossier-letter__exlibris" aria-hidden="true">
            <ExLibrisStamp text="18" size={64} rotate={8} ink="rgba(23,74,145,0.4)" />
          </span>
          <h3 className="dossier-letter__title">{verdict.messageTitle}</h3>
          {verdict.messageParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          <p className="dossier-letter__signature">{verdict.signature}</p>
          <p className="dossier-letter__hint text-muted">
            <Icon name="sparkles" size={14} /> {verdict.sealedHint}
          </p>
        </article>
      </Reveal>

      <Reveal delay={320}>
        <p className="dossier-verdict__to-cleanse text-muted">
          Le classement suit juste après — c'est ici que le dossier décide de sa destinée.
        </p>
      </Reveal>
      {completed && (
        <p className="sr-only" role="status">
          Verdict consulté et archivé.
        </p>
      )}
      </GlowCursor>
    </section>
  );
}
