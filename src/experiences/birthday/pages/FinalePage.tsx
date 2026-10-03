/**
 * BL-06 + TRANS-01 — Fin du parcours principal et passage vers l'espace
 * personnel (doc 01 §5.8, §7.2).
 * - marque la fin sans exiger d'action supplémentaire ;
 * - accès facultatif à The 18th Case, à la lettre et à l'espace quotidien ;
 * - fonctionne même si les chapitres n'ont pas tous été ouverts.
 */
import { Link } from "react-router-dom";
import { BirthdayLayout } from "../BirthdayLayout";
import { finaleContent } from "../data/content";
import { Icon } from "../../../components/ui/Icon";

export function FinalePage() {
  return (
    <BirthdayLayout back={{ to: "/birthday/bibliotheque", label: finaleContent.toLibrary }}>
      <section className="container container--readable section" style={{ paddingBlock: "var(--space-16)" }}>
        <div className="stack-lg center">
          <p className="kicker appear">{finaleContent.kicker}</p>
          <h1 className="h1">{finaleContent.title}</h1>
          <div className="prose" style={{ marginInline: "auto" }}>
            {finaleContent.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="lead">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="stack" style={{ justifyItems: "center", marginTop: "var(--space-6)" }}>
            <Link to="/app" className="btn btn--primary">
              {finaleContent.toDaily}
              <Icon name="arrow-right" size={16} />
            </Link>
            <div className="cluster" style={{ justifyContent: "center" }}>
              <Link to="/birthday/enquete" className="btn btn--secondary">
                <Icon name="magnifier" size={16} />
                {finaleContent.toCase}
              </Link>
              <Link to="/birthday/lettre" className="btn btn--secondary">
                <Icon name="letter" size={16} />
                {finaleContent.toLetter}
              </Link>
            </div>
            <Link to="/birthday/bibliotheque" className="btn btn--text">
              {finaleContent.toLibrary}
            </Link>
          </div>
        </div>
      </section>
    </BirthdayLayout>
  );
}
