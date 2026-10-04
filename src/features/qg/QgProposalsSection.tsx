/**
 * Interface complète des Propositions du QG (§9.1–§9.8).
 *
 * États gérés explicitement (§9.6) :
 * - chargement initial (`loading`) et actualisation (`refreshing`) ;
 * - absence de propositions (`empty`) ;
 * - création / modification en cours (`saving`) avec prévention des doubles
 *   soumissions et conservation des saisies en cas d'erreur ;
 * - téléversement asynchrone de fichiers PDF et audio (`uploading`, progression
 *   0 % → 100 %, succès, erreur de taille/type/réseau) ;
 * - suivi d'état par Princia (`À découvrir`, `En cours`, `Terminé`, `Archivé`)
 *   et note de retour ;
 * - distinction claire entre enregistrement confirmé sur serveur distant
 *   (`remote`) et enregistrement local sur l'appareil (`local`).
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import {
  QG_PROPOSAL_STATUS_LABELS,
  QG_PROPOSAL_TYPE_LABELS,
  validateQgProposalInput,
  type QgAttachment,
  type QgProposal,
  type QgProposalStatus,
  type QgProposalType,
} from "../../domain/models";
import { formatDateFr } from "../../lib/datetime";
import { qgService, type QgBackendStatus } from "./qgService";

type FilterStatus = QgProposalStatus | "all";

const FILTER_LABELS: Record<FilterStatus, string> = {
  all: "Toutes",
  proposed: "À découvrir",
  "in-progress": "En cours",
  completed: "Terminé",
  archived: "Archivées",
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}

interface AttachmentViewerProps {
  attachment: QgAttachment;
}

function AttachmentItem({ attachment }: AttachmentViewerProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(
    attachment.localDataUrl ?? null,
  );
  const [loadingUrl, setLoadingUrl] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleResolve = async () => {
    if (resolvedUrl) return resolvedUrl;
    setLoadingUrl(true);
    setFileError(null);
    try {
      const url = await qgService.resolveAttachmentUrl(attachment);
      setResolvedUrl(url);
      return url;
    } catch (err) {
      setFileError(
        err instanceof Error
          ? err.message
          : "Ce fichier est temporairement inaccessible.",
      );
      return null;
    } finally {
      setLoadingUrl(false);
    }
  };

  return (
    <div
      className="card stack"
      style={{
        padding: "var(--space-3)",
        gap: "var(--space-2)",
        background: "var(--color-surface-soft)",
      }}
    >
      <div className="cluster cluster--between" style={{ gap: "var(--space-2)" }}>
        <div className="cluster" style={{ gap: "var(--space-2)" }}>
          <span className="badge badge--blue">
            {attachment.kind === "pdf" ? "PDF" : "Audio"}
          </span>
          <strong style={{ fontSize: "var(--text-body-sm)", overflowWrap: "anywhere" }}>
            {attachment.name}
          </strong>
          <span className="text-muted" style={{ fontSize: "var(--text-caption)" }}>
            ({formatFileSize(attachment.sizeBytes)})
          </span>
        </div>

        <div className="cluster" style={{ gap: "var(--space-2)" }}>
          {attachment.kind === "pdf" ? (
            resolvedUrl ? (
              <>
                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary"
                  style={{ minHeight: 34, padding: "var(--space-1) var(--space-3)" }}
                >
                  Ouvrir le PDF
                  <Icon name="external" size={14} />
                </a>
                <a
                  href={resolvedUrl}
                  download={attachment.name}
                  className="btn btn--text"
                  style={{ minHeight: 34, padding: "var(--space-1) var(--space-2)" }}
                >
                  Télécharger
                </a>
              </>
            ) : (
              <button
                type="button"
                className="btn btn--secondary"
                style={{ minHeight: 34, padding: "var(--space-1) var(--space-3)" }}
                disabled={loadingUrl}
                onClick={() => {
                  void handleResolve().then((url) => {
                    if (url && typeof window !== "undefined") {
                      window.open(url, "_blank", "noopener,noreferrer");
                    }
                  });
                }}
              >
                {loadingUrl ? "Préparation…" : "Accéder au PDF"}
              </button>
            )
          ) : !resolvedUrl ? (
            <button
              type="button"
              className="btn btn--secondary"
              style={{ minHeight: 34, padding: "var(--space-1) var(--space-3)" }}
              disabled={loadingUrl}
              onClick={() => void handleResolve()}
            >
              {loadingUrl ? "Chargement audio…" : "Écouter l'enregistrement"}
            </button>
          ) : null}
        </div>
      </div>

      {attachment.kind === "audio" && resolvedUrl && (
        <div className="stack" style={{ gap: "var(--space-1)" }}>
          <audio
            controls
            preload="metadata"
            src={resolvedUrl}
            style={{ width: "100%", maxWidth: 420 }}
            onError={() =>
              setFileError(
                "Impossible de lire cet enregistrement vocal (fichier manquant ou format non supporté).",
              )
            }
          >
            Ton navigateur ne prend pas en charge la lecture audio intégrée.
          </audio>
          <div>
            <a
              href={resolvedUrl}
              download={attachment.name}
              className="btn btn--text"
              style={{ minHeight: 30, padding: 0, fontSize: "var(--text-caption)" }}
            >
              Télécharger le fichier audio ({attachment.name})
            </a>
          </div>
        </div>
      )}

      {fileError && (
        <p className="alert alert--error" role="alert" style={{ margin: 0 }}>
          <Icon name="alert" size={16} />
          <span>{fileError}</span>
        </p>
      )}
    </div>
  );
}

interface ProposalFormModalProps {
  proposal?: QgProposal;
  onClose: () => void;
  onSaved: (saved: QgProposal) => void;
}

function ProposalFormModal({
  proposal,
  onClose,
  onSaved,
}: ProposalFormModalProps) {
  const [title, setTitle] = useState(proposal?.title ?? "");
  const [description, setDescription] = useState(proposal?.description ?? "");
  const [type, setType] = useState<QgProposalType>(
    proposal?.type ?? "resource",
  );
  const [priority, setPriority] = useState<"normal" | "important">(
    proposal?.priority ?? "normal",
  );
  const [dueDate, setDueDate] = useState(proposal?.dueDate ?? "");
  const [externalUrl, setExternalUrl] = useState(proposal?.externalUrl ?? "");
  const [attachments, setAttachments] = useState<QgAttachment[]>(
    proposal?.attachments ?? [],
  );

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadMessage(null);
    try {
      const uploaded = await qgService.uploadAttachment(file, (pct) =>
        setUploadProgress(pct),
      );
      setAttachments((prev) => [...prev, uploaded]);
      setUploadMessage(
        `Pièce jointe « ${uploaded.name} » prête (${formatFileSize(uploaded.sizeBytes)}).`,
      );
      if (uploaded.kind === "pdf" && type === "text") setType("pdf");
      if (uploaded.kind === "audio" && type === "text") setType("audio");
    } catch (err) {
      setUploadError(
        err instanceof Error
          ? err.message
          : "Le téléversement du fichier a échoué.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving || uploading) return;

    const validation = validateQgProposalInput({
      title,
      description,
      externalUrl,
      dueDate,
    });
    if (!validation.ok) {
      setFormError(validation.message ?? "Vérifie les champs du formulaire.");
      return;
    }

    setFormError(null);
    setSaving(true);
    try {
      const saved = proposal
        ? await qgService.updateProposal({
            ...proposal,
            title,
            description,
            type,
            priority,
            dueDate: dueDate.trim() || undefined,
            externalUrl: externalUrl.trim() || undefined,
            attachments,
          })
        : await qgService.createProposal({
            title,
            description,
            type,
            author: "Stane",
            status: "proposed",
            priority,
            dueDate: dueDate.trim() || undefined,
            externalUrl: externalUrl.trim() || undefined,
            attachments,
          });
      onSaved(saved);
    } catch (err) {
      // Conservation intégrale de la saisie en cas d'erreur (§9.6 & §11)
      setFormError(
        err instanceof Error
          ? err.message
          : "L'enregistrement n'a pas pu aboutir. Tes saisies sont conservées.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title={
        proposal ? "Modifier la proposition du QG" : "Nouvelle proposition du QG"
      }
      onClose={onClose}
    >
      <form className="stack" onSubmit={(e) => void handleSubmit(e)}>
        {formError && (
          <p className="alert alert--error" role="alert" style={{ margin: 0 }}>
            <Icon name="alert" size={16} />
            <span>{formError}</span>
          </p>
        )}

        <div className="field">
          <label className="field__label" htmlFor="qg-title">
            Titre de la proposition <span aria-hidden="true">*</span>
          </label>
          <input
            id="qg-title"
            className="field__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. Exercice HTML/CSS, Lecture recommandée, Note vocale…"
            autoFocus
          />
        </div>

        <div className="cluster" style={{ alignItems: "stretch" }}>
          <div className="field" style={{ flex: 1 }}>
            <label className="field__label" htmlFor="qg-type">
              Type de contenu
            </label>
            <select
              id="qg-type"
              className="field__select"
              value={type}
              onChange={(e) => setType(e.target.value as QgProposalType)}
            >
              {(Object.keys(QG_PROPOSAL_TYPE_LABELS) as QgProposalType[]).map(
                (k) => (
                  <option key={k} value={k}>
                    {QG_PROPOSAL_TYPE_LABELS[k]}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="field" style={{ flex: 1 }}>
            <label className="field__label" htmlFor="qg-priority">
              Repère d'attention
            </label>
            <select
              id="qg-priority"
              className="field__select"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "normal" | "important")
              }
            >
              <option value="normal">À ton rythme</option>
              <option value="important">Suggestion prioritaire</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="qg-description">
            Consigne, explication ou message
          </label>
          <textarea
            id="qg-description"
            className="field__textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Détaille la proposition, les étapes de l'exercice ou le contexte…"
          />
        </div>

        <div className="cluster" style={{ alignItems: "stretch" }}>
          <div className="field" style={{ flex: 2 }}>
            <label className="field__label" htmlFor="qg-url">
              Lien externe <span className="field__hint">(facultatif)</span>
            </label>
            <input
              id="qg-url"
              type="url"
              className="field__input"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="field" style={{ flex: 1 }}>
            <label className="field__label" htmlFor="qg-due">
              Date cible <span className="field__hint">(facultative)</span>
            </label>
            <input
              id="qg-due"
              type="date"
              className="field__input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="field stack" style={{ gap: "var(--space-2)" }}>
          <label className="field__label" htmlFor="qg-file">
            Joindre un document PDF ou un enregistrement vocal{" "}
            <span className="field__hint">(.pdf, .mp3, .wav, .ogg, .m4a)</span>
          </label>
          <input
            id="qg-file"
            type="file"
            accept=".pdf,application/pdf,audio/*,.mp3,.wav,.ogg,.m4a,.aac,.webm"
            disabled={uploading || saving}
            onChange={(e) => void handleFileSelect(e)}
          />

          {uploading && (
            <p className="text-secondary" role="status" style={{ margin: 0 }}>
              Téléversement en cours… {uploadProgress} %
            </p>
          )}
          {uploadMessage && (
            <p
              className="text-secondary"
              role="status"
              style={{ margin: 0, color: "#16693d", fontSize: "var(--text-caption)" }}
            >
              {uploadMessage}
            </p>
          )}
          {uploadError && (
            <p className="field__error" role="alert" style={{ margin: 0 }}>
              <Icon name="alert" size={14} />
              <span>{uploadError}</span>
            </p>
          )}

          {attachments.length > 0 && (
            <ul className="stack" style={{ gap: "var(--space-2)" }}>
              {attachments.map((att) => (
                <li
                  key={att.id}
                  className="cluster cluster--between"
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    background: "var(--color-surface-soft)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "var(--text-caption)",
                  }}
                >
                  <span>
                    <strong>[{att.kind.toUpperCase()}]</strong> {att.name} (
                    {formatFileSize(att.sizeBytes)})
                  </span>
                  <button
                    type="button"
                    className="btn btn--text"
                    style={{ minHeight: 28, padding: "0 var(--space-2)" }}
                    onClick={() =>
                      setAttachments((prev) =>
                        prev.filter((item) => item.id !== att.id),
                      )
                    }
                  >
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cluster" style={{ justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn btn--text"
            disabled={saving}
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={saving || uploading}
          >
            {saving
              ? "Enregistrement…"
              : proposal
                ? "Enregistrer les modifications"
                : "Publier dans le QG"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function QgProposalsSection() {
  const { notify } = useToast();
  const [backendStatus, setBackendStatus] = useState<QgBackendStatus>(() =>
    qgService.getStatus(),
  );
  const [proposals, setProposals] = useState<QgProposal[]>([]);
  const [loadState, setLoadState] = useState<
    "loading" | "ready" | "refreshing" | "error"
  >("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<
    QgProposal | undefined
  >(undefined);
  const [deletingProposal, setDeletingProposal] = useState<
    QgProposal | undefined
  >(undefined);
  const [busyProposalId, setBusyProposalId] = useState<string | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadProposals = useCallback(async (isRefresh = false) => {
    setLoadState(isRefresh ? "refreshing" : "loading");
    setLoadError(null);
    setBackendStatus(qgService.getStatus());
    try {
      const list = await qgService.listProposals();
      setProposals(list);
      setLoadState("ready");
    } catch (err) {
      setLoadState("error");
      setLoadError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les propositions du QG.",
      );
    }
  }, []);

  useEffect(() => {
    void loadProposals(false);
  }, [loadProposals]);

  const visibleProposals = useMemo(() => {
    if (filter === "all") {
      return proposals.filter((p) => p.status !== "archived");
    }
    return proposals.filter((p) => p.status === filter);
  }, [proposals, filter]);

  const handleStatusChange = async (
    proposal: QgProposal,
    nextStatus: QgProposalStatus,
  ) => {
    if (busyProposalId === proposal.id) return;
    setBusyProposalId(proposal.id);
    try {
      const updated = await qgService.updateProposal({
        ...proposal,
        status: nextStatus,
      });
      setProposals((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
      notify(
        updated.syncOrigin === "remote"
          ? `État mis à jour et synchronisé (${QG_PROPOSAL_STATUS_LABELS[nextStatus]}).`
          : `État enregistré sur cet appareil (${QG_PROPOSAL_STATUS_LABELS[nextStatus]}).`,
      );
    } catch (err) {
      notify(
        err instanceof Error
          ? err.message
          : "La mise à jour du statut a échoué.",
        "error",
      );
    } finally {
      setBusyProposalId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProposal || busyProposalId === deletingProposal.id) return;
    setBusyProposalId(deletingProposal.id);
    try {
      await qgService.deleteProposal(deletingProposal.id);
      setProposals((prev) =>
        prev.filter((p) => p.id !== deletingProposal.id),
      );
      notify("Proposition retirée du QG.");
      setDeletingProposal(undefined);
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "La suppression a échoué.",
        "error",
      );
    } finally {
      setBusyProposalId(null);
    }
  };

  const handleExportJson = () => {
    const json = qgService.exportProposalsPayload(proposals);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "propositions-qg-princia.json";
    a.click();
    URL.revokeObjectURL(url);
    notify("Fichier d'export JSON généré.");
  };

  const handleImportJson = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const count = await qgService.importProposalsPayload(text);
      await loadProposals(true);
      notify(
        `${count} proposition(s) importée(s) dans le stockage local de cet appareil.`,
      );
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Échec de l'import JSON.",
        "error",
      );
    }
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (authBusy) return;
    setAuthBusy(true);
    setAuthError(null);
    try {
      const nextStatus = await qgService.signInStane(authEmail, authPassword);
      setBackendStatus(nextStatus);
      setAuthPassword("");
      setAuthModalOpen(false);
      notify("Connecté à l'espace auteur Stane.");
      await loadProposals(true);
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : "Connexion impossible.",
      );
    } finally {
      setAuthBusy(false);
    }
  };

  return (
    <section
      aria-labelledby="discover-stane"
      style={{ marginBottom: "var(--space-10)" }}
    >
      <div
        className="cluster cluster--between"
        style={{ marginBottom: "var(--space-3)", alignItems: "flex-end" }}
      >
        <div className="stack" style={{ gap: "var(--space-1)" }}>
          <h2 id="discover-stane" className="h3">
            Propositions du QG{" "}
            <span className="badge badge--blue">signées Stane</span>
          </h2>
          <p className="text-secondary" style={{ fontSize: "var(--text-body-sm)" }}>
            Ressources, consignes, exercices, documents PDF ou notes vocales déposés
            pour toi.
          </p>
        </div>

        <div className="cluster" style={{ gap: "var(--space-2)" }}>
          <button
            type="button"
            className="btn btn--secondary"
            disabled={loadState === "loading" || loadState === "refreshing"}
            onClick={() => void loadProposals(true)}
          >
            {loadState === "refreshing" ? "Actualisation…" : "Actualiser"}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setFormOpen(true)}
          >
            <Icon name="plus" size={16} />
            Nouvelle proposition
          </button>
        </div>
      </div>

      {/* Bandeau d'état honnête sur le mode de persistance / synchronisation (§9.2 & §9.8) */}
      <div
        className="surface-panel stack"
        style={{
          marginBottom: "var(--space-4)",
          padding: "var(--space-3) var(--space-4)",
          gap: "var(--space-2)",
        }}
      >
        <div className="cluster cluster--between" style={{ gap: "var(--space-2)" }}>
          <div className="cluster" style={{ gap: "var(--space-2)" }}>
            <span
              className={`badge ${backendStatus.configured ? "badge--success" : "badge--neutral"}`}
              role="status"
            >
              {backendStatus.label}
            </span>
          </div>

          <div className="cluster" style={{ gap: "var(--space-2)" }}>
            {backendStatus.configured ? (
              backendStatus.authenticatedAsStane ? (
                <button
                  type="button"
                  className="btn btn--text"
                  style={{ minHeight: 30, padding: "0 var(--space-2)" }}
                  onClick={() => {
                    setBackendStatus(qgService.signOutStane());
                    notify("Déconnecté du mode auteur Stane.");
                  }}
                >
                  Se déconnecter ({backendStatus.staneEmail})
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--text"
                  style={{ minHeight: 30, padding: "0 var(--space-2)" }}
                  onClick={() => setAuthModalOpen(true)}
                >
                  Accès auteur Stane
                </button>
              )
            ) : (
              <>
                {proposals.length > 0 && (
                  <button
                    type="button"
                    className="btn btn--text"
                    style={{ minHeight: 30, padding: "0 var(--space-2)" }}
                    onClick={handleExportJson}
                  >
                    Exporter (.json)
                  </button>
                )}
                <label
                  className="btn btn--text"
                  style={{
                    minHeight: 30,
                    padding: "0 var(--space-2)",
                    cursor: "pointer",
                  }}
                >
                  Importer (.json)
                  <input
                    type="file"
                    accept="application/json,.json"
                    style={{ display: "none" }}
                    onChange={(e) => void handleImportJson(e)}
                  />
                </label>
              </>
            )}
          </div>
        </div>
        <p
          className="text-muted"
          style={{ margin: 0, fontSize: "var(--text-caption)" }}
        >
          {backendStatus.detail}
        </p>
      </div>

      {proposals.length > 0 && (
        <div
          className="cluster"
          role="tablist"
          aria-label="Filtrer les propositions du QG"
          style={{ marginBottom: "var(--space-4)" }}
        >
          {(Object.keys(FILTER_LABELS) as FilterStatus[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              className={`badge ${filter === key ? "badge--blue" : "badge--neutral"}`}
              style={{
                border:
                  filter === key
                    ? "1px solid var(--color-primary)"
                    : "1px solid transparent",
                cursor: "pointer",
              }}
              onClick={() => setFilter(key)}
            >
              {FILTER_LABELS[key]}
            </button>
          ))}
        </div>
      )}

      {loadState === "loading" && (
        <p className="text-muted" role="status">
          Chargement des propositions du QG…
        </p>
      )}

      {loadState === "error" && (
        <div
          className="alert alert--error"
          role="alert"
          style={{ marginBottom: "var(--space-4)" }}
        >
          <Icon name="alert" size={18} />
          <span>
            {loadError}{" "}
            <button
              type="button"
              className="btn btn--text"
              style={{ minHeight: 0, padding: 0 }}
              onClick={() => void loadProposals(true)}
            >
              Réessayer
            </button>
          </span>
        </div>
      )}

      {(loadState === "ready" || loadState === "refreshing") &&
        visibleProposals.length === 0 && (
          <EmptyState
            icon="sparkles"
            title={
              proposals.length === 0
                ? "Stane prépare des choses"
                : "Aucune proposition dans ce filtre"
            }
            description={
              proposals.length === 0
                ? "Un livre, un exercice, un PDF ou une note vocale : dès qu'une proposition est publiée dans le QG, elle apparaît ici."
                : "Change de filtre ci-dessus pour consulter les autres propositions du QG."
            }
            action={
              proposals.length === 0
                ? {
                    label: "Créer une première proposition",
                    onClick: () => setFormOpen(true),
                  }
                : undefined
            }
          />
        )}

      {visibleProposals.length > 0 && (
        <ul className="stack" aria-label="Liste des propositions du QG">
          {visibleProposals.map((proposal) => (
            <li key={proposal.id}>
              <article className="card stack" style={{ gap: "var(--space-3)" }}>
                <div
                  className="cluster cluster--between"
                  style={{ alignItems: "flex-start" }}
                >
                  <div className="cluster" style={{ gap: "var(--space-2)" }}>
                    <span className="badge badge--blue">
                      {QG_PROPOSAL_TYPE_LABELS[proposal.type]}
                    </span>
                    <span
                      className={`badge ${
                        proposal.status === "completed"
                          ? "badge--success"
                          : proposal.status === "in-progress"
                            ? "badge--info"
                            : "badge--neutral"
                      }`}
                    >
                      {QG_PROPOSAL_STATUS_LABELS[proposal.status]}
                    </span>
                    {proposal.priority === "important" && (
                      <span className="badge badge--blue">Prioritaire</span>
                    )}
                    <span
                      className="text-muted"
                      style={{ fontSize: "var(--text-caption)" }}
                    >
                      {proposal.syncOrigin === "remote"
                        ? "· Synchronisé (serveur QG)"
                        : "· Enregistré sur cet appareil"}
                    </span>
                  </div>

                  <div className="cluster" style={{ gap: "var(--space-1)" }}>
                    <button
                      type="button"
                      className="btn-icon"
                      aria-label={`Modifier « ${proposal.title} »`}
                      onClick={() => setEditingProposal(proposal)}
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      aria-label={`Supprimer « ${proposal.title} »`}
                      onClick={() => setDeletingProposal(proposal)}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </div>

                <div className="stack" style={{ gap: "var(--space-2)" }}>
                  <h3 className="h4" style={{ margin: 0, overflowWrap: "anywhere" }}>
                    {proposal.title}
                  </h3>
                  {proposal.description && (
                    <p
                      className="text-secondary"
                      style={{
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {proposal.description}
                    </p>
                  )}
                  {proposal.dueDate && (
                    <p
                      className="text-muted"
                      style={{ margin: 0, fontSize: "var(--text-caption)" }}
                    >
                      Repère de date : {formatDateFr(proposal.dueDate)}
                    </p>
                  )}
                </div>

                {proposal.externalUrl && (
                  <div>
                    <a
                      href={proposal.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--secondary"
                      aria-label={`Ouvrir la ressource externe de « ${proposal.title} » (nouvel onglet)`}
                    >
                      Ouvrir la ressource externe
                      <Icon name="external" size={14} />
                    </a>
                  </div>
                )}

                {proposal.attachments.length > 0 && (
                  <div className="stack" style={{ gap: "var(--space-2)" }}>
                    {proposal.attachments.map((att) => (
                      <AttachmentItem key={att.id} attachment={att} />
                    ))}
                  </div>
                )}

                <div
                  className="cluster cluster--between"
                  style={{
                    borderTop: "1px solid var(--color-border)",
                    paddingTop: "var(--space-2)",
                  }}
                >
                  <div className="cluster" style={{ gap: "var(--space-2)" }}>
                    {(
                      ["proposed", "in-progress", "completed", "archived"] as QgProposalStatus[]
                    )
                      .filter((s) => s !== proposal.status)
                      .map((statusOption) => (
                        <button
                          key={statusOption}
                          type="button"
                          className="btn btn--text"
                          disabled={busyProposalId === proposal.id}
                          style={{
                            minHeight: 32,
                            padding: "var(--space-1) var(--space-2)",
                            fontSize: "var(--text-caption)",
                          }}
                          onClick={() =>
                            void handleStatusChange(proposal, statusOption)
                          }
                        >
                          → {QG_PROPOSAL_STATUS_LABELS[statusOption]}
                        </button>
                      ))}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {formOpen && (
        <ProposalFormModal
          onClose={() => setFormOpen(false)}
          onSaved={(created) => {
            setProposals((prev) => [created, ...prev]);
            setFormOpen(false);
            notify(
              created.syncOrigin === "remote"
                ? "Proposition publiée et synchronisée dans le QG."
                : "Proposition enregistrée localement sur cet appareil.",
            );
          }}
        />
      )}

      {editingProposal && (
        <ProposalFormModal
          proposal={editingProposal}
          onClose={() => setEditingProposal(undefined)}
          onSaved={(updated) => {
            setProposals((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p)),
            );
            setEditingProposal(undefined);
            notify(
              updated.syncOrigin === "remote"
                ? "Modifications synchronisées sur le serveur QG."
                : "Modifications enregistrées sur cet appareil.",
            );
          }}
        />
      )}

      {deletingProposal && (
        <Modal
          title="Supprimer cette proposition du QG ?"
          onClose={() => setDeletingProposal(undefined)}
        >
          <p className="text-secondary">
            « {deletingProposal.title} » sera retirée du QG.
          </p>
          <div
            className="cluster"
            style={{ justifyContent: "flex-end", marginTop: "var(--space-6)" }}
          >
            <button
              type="button"
              className="btn btn--text"
              onClick={() => setDeletingProposal(undefined)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="btn btn--destructive"
              disabled={busyProposalId === deletingProposal.id}
              onClick={() => void handleDeleteConfirm()}
            >
              Oui, supprimer
            </button>
          </div>
        </Modal>
      )}

      {authModalOpen && (
        <Modal
          title="Connexion auteur Stane (QG partagé)"
          onClose={() => setAuthModalOpen(false)}
        >
          <form className="stack" onSubmit={(e) => void handleSignIn(e)}>
            {authError && (
              <p className="alert alert--error" role="alert" style={{ margin: 0 }}>
                <Icon name="alert" size={16} />
                <span>{authError}</span>
              </p>
            )}
            <div className="field">
              <label className="field__label" htmlFor="qg-auth-email">
                Adresse e-mail Supabase Auth
              </label>
              <input
                id="qg-auth-email"
                type="email"
                className="field__input"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="qg-auth-password">
                Mot de passe
              </label>
              <input
                id="qg-auth-password"
                type="password"
                className="field__input"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                required
              />
            </div>
            <div className="cluster" style={{ justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn--text"
                onClick={() => setAuthModalOpen(false)}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={authBusy}
              >
                {authBusy ? "Connexion…" : "Se connecter"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}
