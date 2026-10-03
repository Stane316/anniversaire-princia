/**
 * The 18th Case — RECONSTRUCTION (mission du 3 octobre 2026).
 *
 * Référence de réalisation étudiée : « Dossier 18 Jenny »
 * (dépôt cloné en lecture seule + site live) — seuls les MÉCANISMES
 * ont été repris (couverture/fiche, marquee, sceau tournant, rapport
 * typewriter, fil enlacé au scroll, cartes à inclinaison, pièce sous
 * scellés, tampon de verdict qui claque, particules montantes).
 * Identité, textes et contenus intégralement recréés pour Princia :
 * design system bleu, aucun animal en emblème, aucun texte de la
 * référence réutilisé.
 *
 * Différences volontaires par rapport à la référence :
 * - énigmes = SOUS-ENSEMBLE (pièces A-01..A-03), jamais la structure ;
 *   chaque interrogatoire peut être passé, le verdict reste atteignable ;
 * - scroll continu (couverture → rapport → pièces → verdict) plutôt
 *   qu'une machine à états — la progression persiste (solved/completed)
 *   via caseDossierMemory, avec migration de l'ancienne clé numérique ;
 * - verdict non punitif (« RÉSOLUE », pas de « Coupable ») et message
 *   personnel sincère (amitié de sixième, ambitions en construction,
 *   appui offert) — jamais romantique.
 *
 * Règles UX conservées : parcours facultatif, lettre toujours
 * accessible, retours jamais culpabilisants, reduced-motion respecté,
 * tout contenu visible sans survol.
 */
import { useCallback, useMemo, useState } from "react";
import { BirthdayLayout } from "../BirthdayLayout";
import { caseSteps } from "../data/content";
import { caseDossierMemory } from "../../../data/repositories";
import { CaseCover } from "../components/dossier/CaseCover";
import { CaseReport } from "../components/dossier/CaseReport";
import { CaseEvidence } from "../components/dossier/CaseEvidence";
import { CaseVerdict } from "../components/dossier/CaseVerdict";
import { FallingRays } from "../../../components/effects/FallingRays";

const CLUE_IDS = caseSteps
  .filter((step) => step.type === "clue")
  .map((step) => step.id);

export function CasePage() {
  const [solved, setSolved] = useState<Set<string>>(
    () => new Set(caseDossierMemory.load().solved),
  );
  const [completed, setCompleted] = useState<boolean>(
    () => caseDossierMemory.load().completed,
  );

  const persist = useCallback((nextSolved: Set<string>, nextCompleted: boolean) => {
    caseDossierMemory.save({
      solved: Array.from(nextSolved),
      completed: nextCompleted,
    });
  }, []);

  const handleSolve = useCallback(
    (id: string) => {
      setSolved((previous) => {
        if (previous.has(id)) return previous;
        const next = new Set(previous).add(id);
        persist(next, completed);
        return next;
      });
    },
    [completed, persist],
  );

  const handleComplete = useCallback(() => {
    setCompleted((previous) => {
      if (previous) return previous;
      persist(solved, true);
      return true;
    });
  }, [persist, solved]);

  const handleRestart = useCallback(() => {
    const empty = new Set<string>();
    setSolved(empty);
    setCompleted(false);
    persist(empty, false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [persist]);

  const solvedCount = useMemo(
    () => CLUE_IDS.filter((id) => solved.has(id)).length,
    [solved],
  );

  return (
    <BirthdayLayout
      back={{ to: "/birthday/bibliotheque", label: "Retour à la bibliothèque" }}
    >
      <div className="dossier-scene">
        {/* Rayons descendants demandés (solution native : le paquet
            shadcn React Bits reste inaccessible — cf. registre). */}
        <FallingRays rayCount={12} color="rgba(57, 120, 212, 0.16)" />
        <div className="dossier-scene__inner container container--readable">
          <CaseCover />
          <CaseReport />
          <CaseEvidence solved={solved} onSolve={handleSolve} />
          <CaseVerdict
            completed={completed}
            solvedCount={solvedCount}
            totalClues={CLUE_IDS.length}
            onComplete={handleComplete}
            onRestart={handleRestart}
          />
        </div>
      </div>
    </BirthdayLayout>
  );
}
