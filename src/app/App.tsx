/**
 * Assemblage de l'application (doc 03 §5.2 — app/).
 *
 * Espaces :
 * - expérience anniversaire : /birthday/* (Blue Library, lettre, enquête) ;
 * - espace quotidien : /app/* ;
 * - entrée « / » : invitation la première fois, accès direct à
 *   l'espace quotidien ensuite (doc 01 §7.4) — l'expérience
 *   anniversaire reste accessible depuis l'accueil quotidien.
 *
 * L'URL représente des vues ouvrables/actualisables ; l'état temporaire
 * d'animation n'y figure jamais (doc 03 §6.4).
 */
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ToastProvider } from "../components/ui/Toast";
import { Icon } from "../components/ui/Icon";
import { visitMemory } from "../data/repositories";
import { getDaypart } from "../lib/daypart";
import { WelcomePage } from "../experiences/birthday/pages/WelcomePage";
import { CoverPage } from "../experiences/birthday/pages/CoverPage";
import { LibraryPage } from "../experiences/birthday/pages/LibraryPage";
import { ChapterPage } from "../experiences/birthday/pages/ChapterPage";
import { SealedVolumePage } from "../experiences/birthday/pages/SealedVolumePage";
import { SouvenirsGalleryPage } from "../experiences/birthday/pages/SouvenirsGalleryPage";
import { LetterPage } from "../experiences/birthday/pages/LetterPage";
import { FinalePage } from "../experiences/birthday/pages/FinalePage";
import { CasePage } from "../experiences/birthday/pages/CasePage";
import { DailyLayout } from "../experiences/daily/DailyLayout";
import { DailyHome } from "../experiences/daily/DailyHome";
import { ReadingPage } from "../features/reading/ReadingPage";
import { PlannerPage } from "../features/planner/PlannerPage";
import { WinsPage } from "../features/wins/WinsPage";
import { DiscoverPage } from "../features/discover/DiscoverPage";
import { PwaUpdatePrompt } from "./PwaUpdatePrompt";
import { GlassCursor } from "../components/effects/GlassCursor";

function EntryGate() {
  // Première visite : invitation à l'expérience. Visites suivantes :
  // accès direct à l'espace quotidien (doc 01 §7.4).
  if (visitMemory.hasVisitedDailySpace()) {
    return <Navigate to="/app" replace />;
  }
  return <WelcomePage />;
}

function NotFoundPage() {
  return (
    <div className="page" style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: "var(--space-8)" }}>
      <div className="stack" style={{ justifyItems: "center" }}>
        <p className="kicker kicker--mono">Page introuvable</p>
        <h1 className="h2">Ce rayon-là n'existe pas</h1>
        <p className="lead" style={{ maxWidth: "46ch" }}>
          Le signet semble pointé vers un chapitre absent de la bibliothèque.
        </p>
        <div className="cluster" style={{ justifyContent: "center" }}>
          <Link to="/app" className="btn btn--primary">
            <Icon name="home" size={16} />
            Aller à mon espace
          </Link>
          <Link to="/birthday/bibliotheque" className="btn btn--secondary">
            Retourner à la bibliothèque
          </Link>
        </div>
      </div>
    </div>
  );
}

export function App() {
  // 5.6 — Ciel ambiant : teinte posée UNE fois au démarrage (aucune
  // boucle d'animation ; purement esthétique, derrière le contenu).
  useEffect(() => {
    document.body.dataset["daypart"] = getDaypart();
  }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EntryGate />} />
          {/* L'accueil à l'enveloppe reste joignable pour toujours,
              même après la première visite (la redirection « / » →
              « /app » ne doit jamais rendre l'invitation perdue). */}
          <Route path="/birthday/accueil" element={<WelcomePage />} />
          <Route path="/birthday" element={<CoverPage />} />
          <Route path="/birthday/bibliotheque" element={<LibraryPage />} />
          <Route path="/birthday/bibliotheque/chapitre/volume-scelle" element={<SealedVolumePage />} />
          <Route path="/souvenirs" element={<SouvenirsGalleryPage />} />
          <Route path="/birthday/bibliotheque/chapitre/:chapterId" element={<ChapterPage />} />
          <Route path="/birthday/lettre" element={<LetterPage />} />
          <Route path="/birthday/finale" element={<FinalePage />} />
          <Route path="/enquete" element={<CasePage />} />
          {/* Ancienne adresse du dossier : redirigée (jamais de route cassée). */}
          <Route path="/birthday/enquete" element={<Navigate to="/enquete" replace />} />
          <Route path="/app" element={<DailyLayout />}>
            <Route index element={<DailyHome />} />
            <Route path="lectures" element={<ReadingPage />} />
            <Route path="carnet" element={<PlannerPage />} />
            <Route path="victoires" element={<WinsPage />} />
            <Route path="decouvrir" element={<DiscoverPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <PwaUpdatePrompt />
        <GlassCursor />
      </BrowserRouter>
    </ToastProvider>
  );
}
