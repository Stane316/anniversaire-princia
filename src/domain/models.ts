/**
 * Modèles métier et validation — couche domaine (doc 03 §8).
 * Aucune dépendance à l'interface : ces types et fonctions sont testables
 * isolément (tests/unit).
 */

export type ReadingStatus = "to-read" | "reading" | "completed";

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  "to-read": "À lire",
  reading: "En cours",
  completed: "Terminé",
};

export const BOOK_CATEGORIES = [
  "Roman",
  "Enquête & Mystère",
  "Lecture religieuse",
  "Étude & Méthode",
  "Autre",
] as const;

/**
 * Plateformes de lecture identifiées (§10.2 & §10.5).
 */
export type BookSourcePlatform =
  | "wattpad"
  | "gutenberg"
  | "gallica"
  | "openlibrary"
  | "other";

export const BOOK_SOURCE_PLATFORM_LABELS: Record<BookSourcePlatform, string> = {
  wattpad: "Wattpad",
  gutenberg: "Project Gutenberg (domaine public)",
  gallica: "Gallica · BnF (domaine public)",
  openlibrary: "Open Library",
  other: "Autre source",
};

/**
 * Nature honnête du lien associé à un livre (§10.5) :
 * distingue un lien de lecture gratuite légale, une simple page de
 * présentation et un lien d'achat.
 */
export type BookAccessType = "free-reading" | "presentation" | "purchase";

export const BOOK_ACCESS_TYPE_LABELS: Record<BookAccessType, string> = {
  "free-reading": "Lecture gratuite et légale",
  presentation: "Page de présentation",
  purchase: "Lien d'achat / librairie",
};

export interface Book {
  id: string;
  title: string;
  author?: string;
  category?: string;
  description?: string;
  status: ReadingStatus;
  /** Appréciation personnelle facultative de 1 à 5. */
  rating?: number;
  notes?: string;
  favoriteQuote?: string;
  tags?: string[];
  /** Date de fin de lecture facultative au format YYYY-MM-DD. */
  finishedAt?: string;
  /** URL externe facultative vers l'œuvre. */
  sourceUrl?: string;
  sourcePlatform?: BookSourcePlatform;
  sourceAccessType?: BookAccessType;
  createdAt: string;
  updatedAt: string;
}

export interface PlannerTask {
  id: string;
  title: string;
  note?: string;
  /** Échéance facultative au format YYYY-MM-DD (doc 01 §10 : jamais bloquante). */
  dueDate?: string;
  /** Marque « priorité de la semaine » choisie par Princia (UNI-03). */
  weeklyPriority: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SmallWin {
  id: string;
  text: string;
  category?: string;
  createdAt: string;
}

/* ---------------- Propositions du QG (§9.4 & §9.5) ---------------- */

export type QgProposalType = "resource" | "text" | "exercise" | "pdf" | "audio";

export const QG_PROPOSAL_TYPE_LABELS: Record<QgProposalType, string> = {
  resource: "Ressource externe",
  text: "Texte / consigne",
  exercise: "Exercice / défi",
  pdf: "Document PDF",
  audio: "Message vocal",
};

export type QgProposalStatus =
  | "proposed"
  | "in-progress"
  | "completed"
  | "archived";

export const QG_PROPOSAL_STATUS_LABELS: Record<QgProposalStatus, string> = {
  proposed: "À découvrir",
  "in-progress": "En cours",
  completed: "Terminé",
  archived: "Archivé",
};

export type QgAttachmentKind = "pdf" | "audio";

export interface QgAttachment {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  kind: QgAttachmentKind;
  /** Chemin dans le bucket privé Supabase Storage (`qg-attachments`) en mode partagé. */
  storagePath?: string;
  /** Data URL locale uniquement lorsque la pièce est enregistrée dans IndexedDB local. */
  localDataUrl?: string;
  createdAt: string;
}

export interface QgProposal {
  id: string;
  title: string;
  description: string;
  type: QgProposalType;
  author: "Stane" | "Princia";
  status: QgProposalStatus;
  priority?: "normal" | "important";
  dueDate?: string;
  externalUrl?: string;
  attachments: QgAttachment[];
  /** Note ou retour laissé par Princia sur la proposition. */
  responseNote?: string;
  /** Origine de persistance réelle (`remote` = serveur Supabase confirmé, `local` = cet appareil). */
  syncOrigin?: "remote" | "local";
  createdAt: string;
  updatedAt: string;
}

/* ---------------- Validation (doc 03 §8.8) ---------------- */

const MAX_TITLE = 160;
const MAX_TEXT = 2000;
const MAX_QG_TEXT = 4000;

export const MAX_REMOTE_PDF_BYTES = 10 * 1024 * 1024; // 10 Mo
export const MAX_REMOTE_AUDIO_BYTES = 15 * 1024 * 1024; // 15 Mo
export const MAX_LOCAL_ATTACHMENT_BYTES = 3 * 1024 * 1024; // 3 Mo en stockage navigateur local

const ALLOWED_AUDIO_MIMES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "audio/mp4",
  "audio/aac",
  "audio/x-m4a",
]);

function clean(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export interface ValidationResult {
  ok: boolean;
  message?: string;
}

export function validateExternalUrl(rawUrl: string): ValidationResult {
  const trimmed = rawUrl.trim();
  if (trimmed.length === 0) return { ok: true };
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return {
        ok: false,
        message: "Le lien doit commencer par https:// ou http://.",
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Le format de l'URL est invalide (ex. https://exemple.org).",
    };
  }
}

export function validateBookTitle(title: string): ValidationResult {
  const t = clean(title);
  if (t.length === 0)
    return { ok: false, message: "Le titre du livre est nécessaire." };
  if (t.length > MAX_TITLE)
    return {
      ok: false,
      message: `Le titre est limité à ${MAX_TITLE} caractères.`,
    };
  return { ok: true };
}

export function validateTaskTitle(title: string): ValidationResult {
  const t = clean(title);
  if (t.length === 0)
    return { ok: false, message: "La tâche a besoin d'un titre." };
  if (t.length > MAX_TITLE)
    return {
      ok: false,
      message: `Le titre est limité à ${MAX_TITLE} caractères.`,
    };
  return { ok: true };
}

export function validateWinText(text: string): ValidationResult {
  const t = clean(text);
  if (t.length === 0)
    return { ok: false, message: "Décris ta victoire en quelques mots." };
  if (t.length > MAX_TEXT)
    return {
      ok: false,
      message: `Le texte est limité à ${MAX_TEXT} caractères.`,
    };
  return { ok: true };
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T12:00:00`);
  return !Number.isNaN(d.getTime());
}

export function validateQgProposalInput(input: {
  title: string;
  description?: string;
  externalUrl?: string;
  dueDate?: string;
}): ValidationResult {
  const t = clean(input.title);
  if (t.length === 0) {
    return { ok: false, message: "Le titre de la proposition est requis." };
  }
  if (t.length > MAX_TITLE) {
    return {
      ok: false,
      message: `Le titre est limité à ${MAX_TITLE} caractères.`,
    };
  }
  if ((input.description ?? "").trim().length > MAX_QG_TEXT) {
    return {
      ok: false,
      message: `La description est limitée à ${MAX_QG_TEXT} caractères.`,
    };
  }
  if (input.externalUrl && input.externalUrl.trim().length > 0) {
    const urlCheck = validateExternalUrl(input.externalUrl);
    if (!urlCheck.ok) return urlCheck;
  }
  if (input.dueDate && input.dueDate.trim().length > 0) {
    if (!isIsoDate(input.dueDate.trim())) {
      return {
        ok: false,
        message: "La date limite doit être au format AAAA-MM-JJ.",
      };
    }
  }
  return { ok: true };
}

export function validateQgAttachmentFile(
  file: { name: string; type: string; size: number },
  storageMode: "remote" | "local",
): ValidationResult & { kind?: QgAttachmentKind } {
  if (!file || typeof file.name !== "string") {
    return { ok: false, message: "Fichier invalide." };
  }
  if (file.size <= 0) {
    return { ok: false, message: "Le fichier sélectionné est vide." };
  }

  const lowerName = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();
  const isPdf = mime === "application/pdf" || lowerName.endsWith(".pdf");
  const isAudio =
    ALLOWED_AUDIO_MIMES.has(mime) ||
    /\.(mp3|wav|ogg|webm|m4a|aac)$/i.test(lowerName);

  if (!isPdf && !isAudio) {
    return {
      ok: false,
      message:
        "Format non autorisé. Seuls les documents PDF (.pdf) et les enregistrements audio (.mp3, .wav, .ogg, .m4a, .aac, .webm) sont acceptés.",
    };
  }

  const kind: QgAttachmentKind = isPdf ? "pdf" : "audio";
  const maxBytes =
    storageMode === "local"
      ? MAX_LOCAL_ATTACHMENT_BYTES
      : kind === "pdf"
        ? MAX_REMOTE_PDF_BYTES
        : MAX_REMOTE_AUDIO_BYTES;

  if (file.size > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    return {
      ok: false,
      message:
        storageMode === "local"
          ? `En mode local sur appareil, chaque pièce jointe est limitée à ${maxMb} Mo pour préserver l'espace du navigateur.`
          : `Ce fichier dépasse la taille maximale autorisée (${maxMb} Mo).`,
    };
  }

  return { ok: true, kind };
}

export { clean as cleanText };
