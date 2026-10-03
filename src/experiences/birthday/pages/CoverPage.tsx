/**
 * BL-02 — Couverture de Blue Library (doc 01 §5.4).
 * Introduction au titre et à la signature de l'expérience ; l'ouverture
 * de la bibliothèque est l'action principale ; l'accès alternatif à
 * The 18th Case est proposé comme secondaire, jamais obligatoire.
 */
import { Link } from "react-router-dom";
import { BirthdayLayout } from "../BirthdayLayout";
import { coverContent } from "../data/content";
import { Icon } from "../../../components/ui/Icon";

export function CoverPage() {
  return (
    <BirthdayLayout back={{ to: "/", label: "Retour" }}>
      <section
        className="container section"
        style={{
          minHeight: "calc(100dvh - 76px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="stack-lg center" style={{ maxWidth: "760px", position: "relative" }}>
          <p className="kicker kicker--mono appear">{coverContent.eyebrow}</p>
          <div>
            <h1 className="display" style={{ letterSpacing: "0.02em" }}>
              {coverContent.titleTop}
            </h1>
            <div
              aria-hidden="true"
              className="divider--ornament"
              style={{ marginBlock: "var(--space-4)" }}
            >
              <Icon name="book-open" size={22} />
            </div>
            <p className="h2" style={{ fontStyle: "italic", color: "var(--color-primary-strong)" }}>
              {coverContent.titleBottom}
            </p>
          </div>
          <blockquote
            className="lead"
            style={{ fontStyle: "italic", maxWidth: "46ch", marginInline: "auto" }}
          >
            « {coverContent.signature} »
          </blockquote>
          <div className="stack" style={{ justifyItems: "center", marginTop: "var(--space-4)" }}>
            <Link to="/birthday/bibliotheque" className="btn btn--primary">
              {coverContent.cta}
              <Icon name="arrow-right" size={18} />
            </Link>
            <Link to="/birthday/enquete" className="btn btn--text">
              {coverContent.alternative}
            </Link>
          </div>
        </div>
      </section>
    </BirthdayLayout>
  );
}
