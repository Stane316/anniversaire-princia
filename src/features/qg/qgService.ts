/**
 * Service de propositions du QG (§9.1–§9.8).
 *
 * Principes d'honnêteté et de sécurité :
 * 1. Ne prétend JAMAIS que IndexedDB / localStorage synchronise les appareils
 *    entre l'ordinateur/téléphone de Stane et le téléphone de Princia (§9.2).
 * 2. Lorsque `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont configurés :
 *    - toutes les opérations passent par l'API REST Supabase (`qg_proposals`)
 *      et le bucket privé `qg-attachments` ;
 *    - une proposition n'est marquée `syncOrigin: "remote"` qu'après confirmation
 *      explicite HTTP 2xx du serveur (§9.6) ;
 *    - l'espace auteur de Stane utilise Supabase Auth (`signInWithPassword`)
 *      et un jeton JWT de session (aucune clé secrète `service_role` dans le
 *      frontend, et le code `041026` n'est jamais utilisé comme autorisation
 *      serveur — §9.7).
 * 3. Lorsque Supabase n'est pas encore configuré :
 *    - le service fonctionne en mode local honnête (`mode: "local"`, IndexedDB
 *      store `proposals`), clairement signalé dans l'interface ;
 *    - un export / import de paquet JSON signé est disponible pour transmettre
 *      manuellement des propositions sans redéployer la PWA en attendant le
 *      branchement du projet Supabase.
 */
import { qgProposalLocalRepository } from "../../data/repositories";
import {
  validateQgAttachmentFile,
  validateQgProposalInput,
  type QgAttachment,
  type QgProposal,
  type QgProposalStatus,
  type QgProposalType,
} from "../../domain/models";
import { createId, nowIso } from "../../lib/id";

export interface QgBackendStatus {
  mode: "remote" | "local";
  configured: boolean;
  authenticatedAsStane: boolean;
  staneEmail?: string;
  label: string;
  detail: string;
}

export interface CreateQgProposalInput {
  title: string;
  description: string;
  type: QgProposalType;
  author?: "Stane" | "Princia";
  status?: QgProposalStatus;
  priority?: "normal" | "important";
  dueDate?: string;
  externalUrl?: string;
  attachments?: QgAttachment[];
}

interface SupabaseAuthSession {
  accessToken: string;
  email: string;
  expiresAt: number;
}

const AUTH_SESSION_KEY = "princia.chapter18.qgSupabaseAuth.v1";

function getEnv(name: string): string {
  try {
    const meta = import.meta as unknown as {
      env?: Record<string, string | undefined>;
    };
    return (meta.env?.[name] ?? "").trim();
  } catch {
    return "";
  }
}

export function getSupabaseConfig(): {
  url: string;
  anonKey: string;
  sharedReadToken: string;
  configured: boolean;
} {
  const url = getEnv("VITE_SUPABASE_URL").replace(/\/+$/, "");
  const anonKey = getEnv("VITE_SUPABASE_ANON_KEY");
  const sharedReadToken = getEnv("VITE_QG_SHARED_READ_TOKEN");
  return {
    url,
    anonKey,
    sharedReadToken,
    configured: Boolean(url && anonKey),
  };
}

function loadAuthSession(): SupabaseAuthSession | null {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return null;
    const raw = window.sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SupabaseAuthSession;
    if (
      !parsed.accessToken ||
      typeof parsed.expiresAt !== "number" ||
      Date.now() > parsed.expiresAt
    ) {
      window.sessionStorage.removeItem(AUTH_SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveAuthSession(session: SupabaseAuthSession | null): void {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    if (!session) {
      window.sessionStorage.removeItem(AUTH_SESSION_KEY);
    } else {
      window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    }
  } catch {
    /* ignore */
  }
}

export function getQgBackendStatus(): QgBackendStatus {
  const cfg = getSupabaseConfig();
  const session = loadAuthSession();
  if (!cfg.configured) {
    return {
      mode: "local",
      configured: false,
      authenticatedAsStane: false,
      label: "Stockage local sur cet appareil",
      detail:
        "Le backend partagé Supabase n'est pas encore configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY absents). Les propositions créées ici sont enregistrées dans IndexedDB sur cet appareil uniquement et peuvent être exportées/importées en JSON.",
    };
  }
  return {
    mode: "remote",
    configured: true,
    authenticatedAsStane: Boolean(session),
    staneEmail: session?.email,
    label: session
      ? "Synchronisation QG active (mode auteur Stane)"
      : "Synchronisation QG active (consultation Princia)",
    detail: session
      ? `Connecté en tant que ${session.email}. Toute proposition enregistrée est immédiatement disponible sur l'espace de Princia.`
      : "Les propositions publiées par Stane sont synchronisées depuis le serveur partagé.",
  };
}

function buildSupabaseHeaders(
  cfg: ReturnType<typeof getSupabaseConfig>,
  extra?: Record<string, string>,
): Record<string, string> {
  const session = loadAuthSession();
  const bearer = session?.accessToken ?? cfg.anonKey;
  const headers: Record<string, string> = {
    apikey: cfg.anonKey,
    Authorization: `Bearer ${bearer}`,
    ...extra,
  };
  if (cfg.sharedReadToken) {
    headers["x-qg-shared-token"] = cfg.sharedReadToken;
  }
  return headers;
}

interface RemoteProposalRow {
  id: string;
  title: string;
  description: string;
  type: QgProposalType;
  author: "Stane" | "Princia";
  status: QgProposalStatus;
  priority?: "normal" | "important" | null;
  due_date?: string | null;
  external_url?: string | null;
  attachments?: QgAttachment[] | null;
  response_note?: string | null;
  created_at: string;
  updated_at: string;
}

function mapRowToProposal(row: RemoteProposalRow): QgProposal {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    type: row.type,
    author: row.author ?? "Stane",
    status: row.status ?? "proposed",
    priority: row.priority ?? "normal",
    dueDate: row.due_date ?? undefined,
    externalUrl: row.external_url ?? undefined,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    responseNote: row.response_note ?? undefined,
    syncOrigin: "remote",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProposalToRow(proposal: QgProposal): RemoteProposalRow {
  return {
    id: proposal.id,
    title: proposal.title,
    description: proposal.description,
    type: proposal.type,
    author: proposal.author,
    status: proposal.status,
    priority: proposal.priority ?? "normal",
    due_date: proposal.dueDate ?? null,
    external_url: proposal.externalUrl ?? null,
    attachments: proposal.attachments,
    response_note: proposal.responseNote ?? null,
    created_at: proposal.createdAt,
    updated_at: proposal.updatedAt,
  };
}

function readFileAsDataUrl(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    reader.onload = () => {
      onProgress?.(100);
      resolve(String(reader.result ?? ""));
    };
    reader.onerror = () =>
      reject(new Error("Impossible de lire le fichier sélectionné."));
    reader.readAsDataURL(file);
  });
}

function uploadToSupabaseStorageWithProgress(
  url: string,
  headers: Record<string, string>,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    for (const [k, v] of Object.entries(headers)) {
      xhr.setRequestHeader(k, v);
    }
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
      } else {
        reject(
          new Error(
            `Échec du téléversement (${xhr.status}). Vérifie tes droits d'accès et ta connexion.`,
          ),
        );
      }
    };
    xhr.onerror = () =>
      reject(
        new Error(
          "Erreur réseau pendant le téléversement du fichier vers le QG.",
        ),
      );
    xhr.send(file);
  });
}

export const qgService = {
  getStatus(): QgBackendStatus {
    return getQgBackendStatus();
  },

  async signInStane(email: string, password: string): Promise<QgBackendStatus> {
    const cfg = getSupabaseConfig();
    if (!cfg.configured) {
      throw new Error(
        "Supabase n'est pas configuré (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY requis).",
      );
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      throw new Error("Adresse e-mail et mot de passe requis.");
    }
    const res = await fetch(
      `${cfg.url}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          apikey: cfg.anonKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail, password }),
      },
    );
    if (!res.ok) {
      throw new Error(
        "Identifiants refusés par le serveur d'authentification.",
      );
    }
    const data = (await res.json()) as {
      access_token: string;
      expires_in?: number;
      user?: { email?: string };
    };
    saveAuthSession({
      accessToken: data.access_token,
      email: data.user?.email ?? trimmedEmail,
      expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
    });
    return getQgBackendStatus();
  },

  signOutStane(): QgBackendStatus {
    saveAuthSession(null);
    return getQgBackendStatus();
  },

  async listProposals(): Promise<QgProposal[]> {
    const cfg = getSupabaseConfig();
    if (!cfg.configured) {
      const local = await qgProposalLocalRepository.getAll();
      return local
        .map((p) => ({ ...p, syncOrigin: p.syncOrigin ?? ("local" as const) }))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }

    const res = await fetch(
      `${cfg.url}/rest/v1/qg_proposals?select=*&order=updated_at.desc`,
      {
        method: "GET",
        headers: buildSupabaseHeaders(cfg, {
          Accept: "application/json",
        }),
      },
    );
    if (!res.ok) {
      throw new Error(
        `Impossible de récupérer les propositions partagées (HTTP ${res.status}).`,
      );
    }
    const rows = (await res.json()) as RemoteProposalRow[];
    const proposals = rows.map(mapRowToProposal);
    // Met en cache localement pour lecture hors ligne
    for (const p of proposals) {
      await qgProposalLocalRepository.save(p);
    }
    return proposals;
  },

  async createProposal(input: CreateQgProposalInput): Promise<QgProposal> {
    const validation = validateQgProposalInput(input);
    if (!validation.ok) {
      throw new Error(validation.message ?? "Proposition invalide.");
    }

    const cfg = getSupabaseConfig();
    const now = nowIso();
    const draft: QgProposal = {
      id: createId(),
      title: input.title.trim(),
      description: input.description.trim(),
      type: input.type,
      author: input.author ?? "Stane",
      status: input.status ?? "proposed",
      priority: input.priority ?? "normal",
      dueDate: input.dueDate?.trim() || undefined,
      externalUrl: input.externalUrl?.trim() || undefined,
      attachments: input.attachments ?? [],
      syncOrigin: cfg.configured ? "remote" : "local",
      createdAt: now,
      updatedAt: now,
    };

    if (!cfg.configured) {
      await qgProposalLocalRepository.save(draft);
      return draft;
    }

    const res = await fetch(`${cfg.url}/rest/v1/qg_proposals`, {
      method: "POST",
      headers: buildSupabaseHeaders(cfg, {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      }),
      body: JSON.stringify(mapProposalToRow(draft)),
    });
    if (!res.ok) {
      throw new Error(
        `Le serveur n'a pas confirmé l'enregistrement (HTTP ${res.status}). Ta saisie est conservée pour réessayer.`,
      );
    }
    const createdRows = (await res.json()) as RemoteProposalRow[];
    const confirmed = createdRows[0]
      ? mapRowToProposal(createdRows[0])
      : draft;
    await qgProposalLocalRepository.save(confirmed);
    return confirmed;
  },

  async updateProposal(proposal: QgProposal): Promise<QgProposal> {
    const validation = validateQgProposalInput(proposal);
    if (!validation.ok) {
      throw new Error(validation.message ?? "Proposition invalide.");
    }

    const cfg = getSupabaseConfig();
    const next: QgProposal = {
      ...proposal,
      title: proposal.title.trim(),
      description: proposal.description.trim(),
      externalUrl: proposal.externalUrl?.trim() || undefined,
      dueDate: proposal.dueDate?.trim() || undefined,
      updatedAt: nowIso(),
    };

    if (!cfg.configured) {
      await qgProposalLocalRepository.save({ ...next, syncOrigin: "local" });
      return { ...next, syncOrigin: "local" };
    }

    const res = await fetch(
      `${cfg.url}/rest/v1/qg_proposals?id=eq.${encodeURIComponent(next.id)}`,
      {
        method: "PATCH",
        headers: buildSupabaseHeaders(cfg, {
          "Content-Type": "application/json",
          Prefer: "return=representation",
        }),
        body: JSON.stringify(mapProposalToRow(next)),
      },
    );
    if (!res.ok) {
      throw new Error(
        `La modification n'a pas été confirmée par le serveur (HTTP ${res.status}).`,
      );
    }
    const rows = (await res.json()) as RemoteProposalRow[];
    const confirmed = rows[0] ? mapRowToProposal(rows[0]) : { ...next, syncOrigin: "remote" as const };
    await qgProposalLocalRepository.save(confirmed);
    return confirmed;
  },

  async deleteProposal(id: string): Promise<void> {
    const cfg = getSupabaseConfig();
    if (cfg.configured) {
      const res = await fetch(
        `${cfg.url}/rest/v1/qg_proposals?id=eq.${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: buildSupabaseHeaders(cfg),
        },
      );
      if (!res.ok) {
        throw new Error(
          `La suppression n'a pas été confirmée par le serveur (HTTP ${res.status}).`,
        );
      }
    }
    await qgProposalLocalRepository.delete(id);
  },

  async uploadAttachment(
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<QgAttachment> {
    const cfg = getSupabaseConfig();
    const mode = cfg.configured ? "remote" : "local";
    const check = validateQgAttachmentFile(file, mode);
    if (!check.ok || !check.kind) {
      throw new Error(check.message ?? "Fichier non valide.");
    }

    const attachmentId = createId();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const createdAt = nowIso();

    if (!cfg.configured) {
      const dataUrl = await readFileAsDataUrl(file, onProgress);
      return {
        id: attachmentId,
        name: file.name,
        mimeType:
          file.type ||
          (check.kind === "pdf" ? "application/pdf" : "audio/mpeg"),
        sizeBytes: file.size,
        kind: check.kind,
        localDataUrl: dataUrl,
        createdAt,
      };
    }

    const storagePath = `${check.kind}/${attachmentId}-${safeFileName}`;
    const uploadUrl = `${cfg.url}/storage/v1/object/qg-attachments/${storagePath}`;
    await uploadToSupabaseStorageWithProgress(
      uploadUrl,
      buildSupabaseHeaders(cfg, {
        "Content-Type":
          file.type ||
          (check.kind === "pdf" ? "application/pdf" : "audio/mpeg"),
        "x-upsert": "false",
      }),
      file,
      onProgress,
    );

    return {
      id: attachmentId,
      name: file.name,
      mimeType:
        file.type ||
        (check.kind === "pdf" ? "application/pdf" : "audio/mpeg"),
      sizeBytes: file.size,
      kind: check.kind,
      storagePath,
      createdAt,
    };
  },

  async resolveAttachmentUrl(attachment: QgAttachment): Promise<string> {
    if (attachment.localDataUrl) {
      return attachment.localDataUrl;
    }
    if (!attachment.storagePath) {
      throw new Error("Ce fichier joint est introuvable ou son chemin est manquant.");
    }
    const cfg = getSupabaseConfig();
    if (!cfg.configured) {
      throw new Error(
        "Ce fichier est hébergé sur le stockage partagé Supabase qui n'est pas configuré sur cet appareil.",
      );
    }
    const res = await fetch(
      `${cfg.url}/storage/v1/object/sign/qg-attachments/${attachment.storagePath}`,
      {
        method: "POST",
        headers: buildSupabaseHeaders(cfg, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ expiresIn: 3600 }),
      },
    );
    if (!res.ok) {
      throw new Error(
        `Le fichier « ${attachment.name} » est temporairement inaccessible (HTTP ${res.status}).`,
      );
    }
    const data = (await res.json()) as { signedURL?: string };
    if (!data.signedURL) {
      throw new Error("Impossible d'obtenir le lien sécurisé du fichier.");
    }
    return data.signedURL.startsWith("http")
      ? data.signedURL
      : `${cfg.url}/storage/v1${data.signedURL}`;
  },

  exportProposalsPayload(proposals: QgProposal[]): string {
    return JSON.stringify(
      {
        schema: "princia.chapter18.qg.v1",
        exportedAt: nowIso(),
        proposals,
      },
      null,
      2,
    );
  },

  async importProposalsPayload(rawJson: string): Promise<number> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      throw new Error("Le fichier JSON sélectionné est illisible.");
    }
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray((parsed as { proposals?: unknown }).proposals)
    ) {
      throw new Error(
        "Ce fichier ne correspond pas à un export de propositions du QG.",
      );
    }
    const items = (parsed as { proposals: QgProposal[] }).proposals;
    let count = 0;
    for (const item of items) {
      if (item && typeof item.id === "string" && typeof item.title === "string") {
        const check = validateQgProposalInput(item);
        if (check.ok) {
          await qgProposalLocalRepository.save({
            ...item,
            attachments: Array.isArray(item.attachments) ? item.attachments : [],
            syncOrigin: "local",
          });
          count += 1;
        }
      }
    }
    return count;
  },
};
