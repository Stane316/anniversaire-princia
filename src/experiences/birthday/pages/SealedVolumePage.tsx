/**
 * 5.4 — Le volume sous scellé.
 * Verrou de DATE uniquement (jamais d'énigme nécessaire, jamais de
 * blocage de la lettre — doc 01 §5.7) : avant le 4 octobre, le volume
 * explique poliment qu'il attend ; au jour J, il s'ouvre en grand livre
 * comme les autres chapitres (même composant — doc 02 §12.4).
 */
import { Link } from "react-router-dom";
import { BirthdayLayout } from "../BirthdayLayout";
import { SEALED_VOLUME_UNLOCK_ISO, sealedVolume } from "../data/content";
import { daysUntil, formatDateFr } from "../../../lib/datetime";
import { ReadingBook } from "../../../components/book/ReadingBook";
import type { BirthdayChapter } from "../data/content";
import { Icon } from "../../../components/ui/Icon";

const sealedAsChapter: BirthdayChapter = {
  id: sealedVolume.id,
  number: sealedVolume.number,
  kicker: sealedVolume.kicker,
  title: sealedVolume.title,
  paragraphs: [...sealedVolume.paragraphs],
  aside: sealedVolume.aside,
  callNumber: sealedVolume.cote,
  marginNote: sealedVolume.marginNote,
  gradient: sealedVolume.gradient,
};

export function SealedVolumePage() {
  const days = daysUntil(SEALED_VOLUME_UNLOCK_ISO);

  if (days > 0) {
    return (
      <BirthdayLayout back={{ to: "/birthday/bibliotheque", label: "Retour à la bibliothèque" }}>
        <section className="container section sealed-waiting" aria-labelledby="sealed-title">
          <div className="sealed-waiting__card">
            <span className="sealed-waiting__cote">{sealedVolume.cote}</span>
            <span className="sealed-waiting__stamp" aria-hidden="true">
              S
            </span>
            <h1 id="sealed-title" className="h2">
              {sealedVolume.sealed.title}
            </h1>
            <p className="lead">{sealedVolume.sealed.line}</p>
            <p className="text-muted" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-caption)" }}>
              Ouverture prévue : {formatDateFr(SEALED_VOLUME_UNLOCK_ISO)} · J-{days}
            </p>
            <Link to="/birthday/bibliotheque" className="btn btn--secondary">
              <Icon name="arrow-left" size={16} />
              Feuilleter les autres volumes
            </Link>
          </div>
        </section>
      </BirthdayLayout>
    );
  }

  return (
    <BirthdayLayout back={{ to: "/birthday/bibliotheque", label: "Retour à la bibliothèque" }}>
      <ReadingBook chapters={[sealedAsChapter]} currentIndex={0} />
    </BirthdayLayout>
  );
}
