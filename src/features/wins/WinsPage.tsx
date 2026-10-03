/**
 * VIC — Mes petites victoires (doc 01 §11).
 * - positive, discrète, sans pression : aucune série, aucun score,
 *   aucun jugement sur l'absence de victoires ;
 * - ajout facultatif, modification et suppression possibles ;
 * - le contenu reste privé (stockage local sur cet appareil).
 */
import { useState } from "react";
import type { SmallWin } from "../../domain/models";
import { useWins } from "./useWins";
import { Modal } from "../../components/ui/Modal";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { validateWinText } from "../../domain/models";
import { formatDateFr } from "../../lib/datetime";

const WIN_CATEGORIES = ["Études", "Lecture", "Informatique", "Projet", "Perso"];

function WinFormModal({
  win,
  onClose,
  onSubmit,
}: {
  win?: SmallWin;
  onClose: () => void;
  onSubmit: (input: { text: string; category?: string }) => Promise<boolean>;
}) {
  const [text, setText] = useState(win?.text ?? "");
  const [category, setCategory] = useState(win?.category ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validateWinText(text);
    if (!validation.ok) {
      setError(validation.message ?? "Texte invalide.");
      return;
    }
    setError(null);
    setSaving(true);
    const ok = await onSubmit({ text: text.trim(), category: category || undefined });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Modal title={win ? "Modifier cette victoire" : "Noter une petite victoire"} onClose={onClose}>
      <form className="stack" onSubmit={(event) => void submit(event)}>
        <div className="field">
          <label className="field__label" htmlFor="win-text">
            Qu'est-ce que tu as accompli ? <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="win-text"
            className={`field__textarea${error ? " field__input--error" : ""}`}
            rows={3}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Une notion comprise, un chapitre terminé, un devoir rendu…"
            autoFocus
          />
          {error && (
            <p className="field__error" role="alert">
              <Icon name="alert" size={14} />
              {error}
            </p>
          )}
        </div>
        <div className="field">
          <label className="field__label" htmlFor="win-category">
            Catégorie <span className="field__hint">(facultative)</span>
          </label>
          <select
            id="win-category"
            className="field__select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">—</option>
            {WIN_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="cluster" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn btn--text" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Enregistrement…" : win ? "Enregistrer" : "Noter cette victoire"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function WinsPage() {
  const { wins, state, reload, create, update, remove } = useWins();
  const [formOpen, setFormOpen] = useState(false);
  const [winBeingEdited, setWinBeingEdited] = useState<SmallWin | undefined>(undefined);
  const [winBeingDeleted, setWinBeingDeleted] = useState<SmallWin | undefined>(undefined);

  return (
    <section className="container section container--editorial page-enter">
      <header className="cluster cluster--between" style={{ marginBottom: "var(--space-6)", alignItems: "end" }}>
        <div className="stack">
          <p className="kicker">Mes petites victoires</p>
          <h1 className="h2">Le musée de tes progrès</h1>
          <p className="text-secondary" style={{ maxWidth: "56ch" }}>
            Un chapitre fini, une notion comprise, un effort tenu. Quand tu veux, si tu en as
            envie — jamais par obligation.
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setFormOpen(true)}>
          <Icon name="plus" size={16} />
          Noter une victoire
        </button>
      </header>

      {state === "error" && (
        <div className="alert alert--error" role="alert" style={{ marginBottom: "var(--space-4)" }}>
          <Icon name="alert" size={18} />
          <span>
            La liste n'a pas pu être chargée.{" "}
            <button type="button" className="btn btn--text" style={{ minHeight: 0, padding: 0 }} onClick={() => void reload()}>
              Réessayer
            </button>
          </span>
        </div>
      )}

      {state === "loading" && (
        <p className="text-muted" role="status">
          Chargement…
        </p>
      )}

      {state === "ready" && wins.length === 0 && (
        <EmptyState
          icon="star"
          title="Rien ici pour l'instant — et c'est très bien"
          description="Cette collection se remplit quand TU décides qu'un progrès mérite d'être gardé. Pas avant."
          action={{ label: "Noter ma première victoire", onClick: () => setFormOpen(true) }}
        />
      )}

      {wins.length > 0 && (
        <ul className="stack">
          {wins.map((win) => (
            <li key={win.id}>
              <article className="card cluster" style={{ alignItems: "flex-start", gap: "var(--space-4)" }}>
                <Icon name="star" size={22} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "var(--text-body-lg)", overflowWrap: "anywhere" }}>{win.text}</p>
                  <div className="cluster" style={{ marginTop: "var(--space-2)", gap: "var(--space-2)" }}>
                    <span className="text-muted">{formatDateFr(win.createdAt.slice(0, 10))}</span>
                    {win.category && <span className="badge badge--neutral">{win.category}</span>}
                  </div>
                </div>
                <div className="cluster" style={{ gap: "var(--space-1)" }}>
                  <button type="button" className="btn-icon" aria-label="Modifier cette victoire" onClick={() => setWinBeingEdited(win)}>
                    <Icon name="edit" size={16} />
                  </button>
                  <button type="button" className="btn-icon" aria-label="Supprimer cette victoire" onClick={() => setWinBeingDeleted(win)}>
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {formOpen && <WinFormModal onClose={() => setFormOpen(false)} onSubmit={create} />}
      {winBeingEdited && (
        <WinFormModal
          win={winBeingEdited}
          onClose={() => setWinBeingEdited(undefined)}
          onSubmit={async (input) => update({ ...winBeingEdited, ...input })}
        />
      )}
      {winBeingDeleted && (
        <Modal title="Supprimer cette victoire ?" onClose={() => setWinBeingDeleted(undefined)}>
          <p className="text-secondary">
            Cette victoire sera retirée de ta liste. Cette action n'est pas réversible — mais ta
            réussite, elle, reste bien réelle.
          </p>
          <div className="cluster" style={{ justifyContent: "flex-end", marginTop: "var(--space-6)" }}>
            <button type="button" className="btn btn--text" onClick={() => setWinBeingDeleted(undefined)}>
              Garder
            </button>
            <button
              type="button"
              className="btn btn--destructive"
              onClick={() => {
                void remove(winBeingDeleted.id).then((ok) => {
                  if (ok) setWinBeingDeleted(undefined);
                });
              }}
            >
              Oui, supprimer
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
