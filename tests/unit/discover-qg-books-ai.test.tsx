// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CODE_RESOURCES, DiscoverPage } from "../../src/features/discover/DiscoverPage";
import { ToastProvider } from "../../src/components/ui/Toast";
import { resetDbConnectionForTests } from "../../src/data/db";
import { bookRepository } from "../../src/data/repositories";
import {
  validateExternalUrl,
  validateQgAttachmentFile,
  validateQgProposalInput,
} from "../../src/domain/models";
import { qgService } from "../../src/features/qg/qgService";
import {
  bookRecommendationService,
  buildMinimizedReadingContext,
  LEGAL_READING_PLATFORMS,
  saveReadingPreferences,
} from "../../src/features/reading/recommendations/recommendationEngine";

const root = resolve(__dirname, "..", "..");

describe("Espace Découvrir — ressources externes (§8)", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    resetDbConnectionForTests();
  });

  it("expose exactement freeCodeCamp, W3Schools, Codecademy, OpenClassrooms et roadmap.sh avec la bonne casse et les bonnes URL", () => {
    const names = CODE_RESOURCES.map((r) => r.name);
    expect(names).toEqual([
      "freeCodeCamp",
      "W3Schools",
      "Codecademy",
      "OpenClassrooms",
      "roadmap.sh",
    ]);

    const urls = CODE_RESOURCES.map((r) => r.url);
    expect(urls).toEqual([
      "https://www.freecodecamp.org/",
      "https://www.w3schools.com/",
      "https://www.codecademy.com/",
      "https://openclassrooms.com/",
      "https://roadmap.sh/",
    ]);

    // MDN Web Docs a bien été remplacé par W3Schools
    expect(names).not.toContain("MDN Web Docs");
    expect(urls.some((u) => u.includes("mozilla.org"))).toBe(false);
  });

  it("affiche les liens externes dans DiscoverPage avec target=_blank et rel=noopener noreferrer", () => {
    render(
      <ToastProvider>
        <DiscoverPage />
      </ToastProvider>,
    );

    for (const resource of CODE_RESOURCES) {
      const visitLink = screen.getByRole("link", {
        name: new RegExp(`Ouvrir ${resource.name}`, "i"),
      });
      expect(visitLink.getAttribute("href")).toBe(resource.url);
      expect(visitLink.getAttribute("target")).toBe("_blank");
      expect(visitLink.getAttribute("rel")).toContain("noopener");
      expect(visitLink.getAttribute("rel")).toContain("noreferrer");
    }
  });
});

describe("Propositions du QG — modèle, validation PDF/audio, persistance et schéma Supabase (§9)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    resetDbConnectionForTests();
  });

  it("valide les propositions et les pièces jointes PDF et audio", () => {
    expect(validateQgProposalInput({ title: "" }).ok).toBe(false);
    expect(
      validateQgProposalInput({
        title: "Découvrir Flexbox",
        externalUrl: "javascript:alert(1)",
      }).ok,
    ).toBe(false);
    expect(
      validateQgProposalInput({
        title: "Découvrir Flexbox",
        externalUrl: "https://www.w3schools.com/",
        dueDate: "2026-10-20",
      }).ok,
    ).toBe(true);

    // Validation PDF et Audio
    expect(
      validateQgAttachmentFile(
        { name: "fiche-cours.pdf", type: "application/pdf", size: 500_000 },
        "local",
      ),
    ).toEqual({ ok: true, kind: "pdf" });

    expect(
      validateQgAttachmentFile(
        { name: "note-stane.mp3", type: "audio/mpeg", size: 800_000 },
        "local",
      ),
    ).toEqual({ ok: true, kind: "audio" });

    // Rejet d'un exécutable ou d'un fichier trop volumineux
    expect(
      validateQgAttachmentFile(
        { name: "script.exe", type: "application/octet-stream", size: 1024 },
        "remote",
      ).ok,
    ).toBe(false);

    expect(
      validateQgAttachmentFile(
        { name: "lourd.pdf", type: "application/pdf", size: 25 * 1024 * 1024 },
        "remote",
      ).ok,
    ).toBe(false);
  });

  it("crée, modifie, exporte, importe et supprime une proposition QG avec honnêteté sur le mode de synchronisation", async () => {
    const status = qgService.getStatus();
    expect(status.mode).toBe("local");
    expect(status.configured).toBe(false);

    const created = await qgService.createProposal({
      title: "Premier défi HTML",
      description: "Créer une carte de présentation sur freeCodeCamp.",
      type: "exercise",
      priority: "important",
      externalUrl: "https://www.freecodecamp.org/",
    });
    expect(created.syncOrigin).toBe("local");
    expect(created.status).toBe("proposed");

    const updated = await qgService.updateProposal({
      ...created,
      status: "in-progress",
    });
    expect(updated.status).toBe("in-progress");

    const list = await qgService.listProposals();
    expect(list).toHaveLength(1);
    expect(list[0]!.title).toBe("Premier défi HTML");

    const exported = qgService.exportProposalsPayload(list);
    await qgService.deleteProposal(created.id);
    expect(await qgService.listProposals()).toHaveLength(0);

    const importedCount = await qgService.importProposalsPayload(exported);
    expect(importedCount).toBe(1);
    expect((await qgService.listProposals())[0]!.title).toBe("Premier défi HTML");
  });

  it("fournit la migration SQL Supabase avec RLS activé et bucket privé qg-attachments", () => {
    const sqlPath = resolve(root, "supabase/migrations/001_qg_proposals.sql");
    expect(existsSync(sqlPath)).toBe(true);
    const sql = readFileSync(sqlPath, "utf8");
    expect(sql).toContain("create table if not exists public.qg_proposals");
    expect(sql).toContain("enable row level security");
    expect(sql).toContain("'qg-attachments'");
  });
});

describe("Livres et architecture de recommandation par IA (§10)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetDbConnectionForTests();
  });

  it("préserve le CRUD des livres, accepte les métadonnées enrichies et minimise le contexte IA sans exposer les notes privées", async () => {
    expect(validateExternalUrl("https://www.wattpad.com/").ok).toBe(true);
    expect(LEGAL_READING_PLATFORMS.some((p) => p.id === "wattpad")).toBe(true);

    const book = await bookRepository.create({
      title: "Enquête sur le campus",
      author: "Auteur Test",
      category: "Enquête & Mystère",
      status: "completed",
      rating: 5,
      notes: "Note intime qui ne doit jamais partir vers un service IA externe",
      tags: ["mystère", "université"],
      sourcePlatform: "wattpad",
      sourceAccessType: "free-reading",
      sourceUrl: "https://www.wattpad.com/",
    });

    const prefs = saveReadingPreferences({
      favoriteGenres: ["Enquête & Mystère"],
      preferredPlatforms: ["wattpad", "gutenberg"],
      preferredThemes: ["énigmes"],
      excludedThemes: ["horreur"],
      preferFreeLegalAccess: true,
    });

    bookRecommendationService.recordFeedback("rec-1", "Le Mystère de la Chambre Jaune", "liked");

    const context = buildMinimizedReadingContext([book], prefs);
    expect(context.schema).toBe("princia.chapter18.reading-context.v1");
    expect(context.books).toHaveLength(1);
    expect(context.books[0]!.title).toBe("Enquête sur le campus");
    expect(context.books[0]!.rating).toBe(5);
    expect(context.books[0]!.sourcePlatform).toBe("wattpad");
    // Les notes personnelles ne doivent jamais figurer dans le contexte minimisé envoyé à l'IA
    expect(JSON.stringify(context)).not.toContain(
      "Note intime qui ne doit jamais partir",
    );
    expect(context.likedTitles).toContain("Le Mystère de la Chambre Jaune");

    // Sans VITE_BOOK_AI_ENDPOINT configuré, le service indique honnêtement son état
    const aiStatus = bookRecommendationService.getStatus();
    expect(aiStatus.configured).toBe(false);
    await expect(
      bookRecommendationService.requestRecommendations(context),
    ).rejects.toThrow(/VITE_BOOK_AI_ENDPOINT/);
  });
});
