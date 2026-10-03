/**
 * Formulaire livre (LIB-02/03, doc 01 §9.3–9.4) :
 * - formulaire court, seul le titre est indispensable ;
 * - la saisie est préservée en cas d'erreur ;
 * - champs avec labels explicites (doc 02 §9.5).
 */
import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { Icon } from "../../components/ui/Icon";
import { BOOK_CATEGORIES, READING_STATUS_LABELS, validateBookTitle } from "../../domain/models";
import type { Book, ReadingStatus } from "../../domain/models";

interface BookFormModalProps {
  /** Livre existant (édition) ou absence (création). */
  book?: Book;
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    author?: string;
    category?: string;
    status: ReadingStatus;
    notes?: string;
  }) => Promise<boolean>;
}

export function BookFormModal({ book, onClose, onSubmit }: BookFormModalProps) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [category, setCategory] = useState(book?.category ?? "");
  const [status, setStatus] = useState<ReadingStatus>(book?.status ?? "to-read");
  const [notes, setNotes] = useState(book?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validateBookTitle(title);
    if (!validation.ok) {
      setError(validation.message ?? "Titre invalide.");
      return;
    }
    setError(null);
    setSaving(true);
    const input = {
      title: title.trim(),
      author: author.trim() || undefined,
      category: category || undefined,
      status,
      notes: notes.trim() || undefined,
    };
    const ok = book ? await onSubmit({ ...input }) : await onSubmit(input);
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Modal title={book ? "Modifier ce livre" : "Ajouter un livre"} onClose={onClose}>
      <form className="stack" onSubmit={(event) => void submit(event)}>
        <div className="field">
          <label className="field__label" htmlFor="book-title">
            Titre <span aria-hidden="true">*</span>
          </label>
          <input
            id="book-title"
            className={`field__input${error ? " field__input--error" : ""}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-invalid={error !== null}
            aria-describedby={error ? "book-title-error" : undefined}
            autoFocus
          />
          {error && (
            <p className="field__error" id="book-title-error" role="alert">
              <Icon name="alert" size={14} />
              {error}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="book-author">
            Auteur·rice <span className="field__hint">(facultatif)</span>
          </label>
          <input
            id="book-author"
            className="field__input"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>

        <div className="cluster" style={{ alignItems: "stretch" }}>
          <div className="field" style={{ flex: 1 }}>
            <label className="field__label" htmlFor="book-category">
              Genre <span className="field__hint">(facultatif)</span>
            </label>
            <select
              id="book-category"
              className="field__select"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">—</option>
              {BOOK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label className="field__label" htmlFor="book-status">
              État de lecture
            </label>
            <select
              id="book-status"
              className="field__select"
              value={status}
              onChange={(event) => setStatus(event.target.value as ReadingStatus)}
            >
              {(Object.keys(READING_STATUS_LABELS) as ReadingStatus[]).map((s) => (
                <option key={s} value={s}>
                  {READING_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="book-notes">
            Notes personnelles <span className="field__hint">(facultatif)</span>
          </label>
          <textarea
            id="book-notes"
            className="field__textarea"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Ce que tu en attends, une page marquante, une envie…"
          />
        </div>

        <div className="cluster" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn btn--text" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Enregistrement…" : book ? "Enregistrer" : "Ajouter ce livre"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
