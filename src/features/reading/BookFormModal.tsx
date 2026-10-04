/**
 * Formulaire livre (LIB-02/03, doc 01 §9.3–9.4 & mission §10.2–§10.5) :
 * - formulaire court, seul le titre est indispensable ;
 * - la saisie est préservée en cas d'erreur ;
 * - supporte les métadonnées facultatives (appréciation, tags, lien externe
 *   typé entre lecture gratuite légale, page de présentation et achat).
 */
import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { Icon } from "../../components/ui/Icon";
import {
  BOOK_ACCESS_TYPE_LABELS,
  BOOK_CATEGORIES,
  BOOK_SOURCE_PLATFORM_LABELS,
  READING_STATUS_LABELS,
  validateBookTitle,
  validateExternalUrl,
  type Book,
  type BookAccessType,
  type BookSourcePlatform,
  type ReadingStatus,
} from "../../domain/models";
import type { BookCreateInput } from "./useBooks";

interface BookFormModalProps {
  /** Livre existant (édition) ou absence (création). */
  book?: Book;
  onClose: () => void;
  onSubmit: (input: BookCreateInput) => Promise<boolean>;
}

export function BookFormModal({ book, onClose, onSubmit }: BookFormModalProps) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [category, setCategory] = useState(book?.category ?? "");
  const [status, setStatus] = useState<ReadingStatus>(
    book?.status ?? "to-read",
  );
  const [rating, setRating] = useState<string>(
    book?.rating ? String(book.rating) : "",
  );
  const [notes, setNotes] = useState(book?.notes ?? "");
  const [tagsText, setTagsText] = useState((book?.tags ?? []).join(", "));
  const [sourceUrl, setSourceUrl] = useState(book?.sourceUrl ?? "");
  const [sourcePlatform, setSourcePlatform] = useState<
    BookSourcePlatform | ""
  >(book?.sourcePlatform ?? "");
  const [sourceAccessType, setSourceAccessType] = useState<BookAccessType>(
    book?.sourceAccessType ?? "presentation",
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;

    const validation = validateBookTitle(title);
    if (!validation.ok) {
      setError(validation.message ?? "Titre invalide.");
      return;
    }

    if (sourceUrl.trim().length > 0) {
      const urlValidation = validateExternalUrl(sourceUrl);
      if (!urlValidation.ok) {
        setError(urlValidation.message ?? "Lien invalide.");
        return;
      }
    }

    setError(null);
    setSaving(true);

    const parsedRating = rating ? Number.parseInt(rating, 10) : undefined;
    const parsedTags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const input: BookCreateInput = {
      title: title.trim(),
      author: author.trim() || undefined,
      category: category || undefined,
      status,
      rating:
        parsedRating && parsedRating >= 1 && parsedRating <= 5
          ? parsedRating
          : undefined,
      notes: notes.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      sourcePlatform: sourcePlatform || undefined,
      sourceAccessType: sourceUrl.trim() ? sourceAccessType : undefined,
    };

    const ok = await onSubmit(input);
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Modal
      title={book ? "Modifier ce livre" : "Ajouter un livre"}
      onClose={onClose}
    >
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

        <div className="cluster" style={{ alignItems: "stretch" }}>
          <div className="field" style={{ flex: 2 }}>
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

          <div className="field" style={{ flex: 1 }}>
            <label className="field__label" htmlFor="book-rating">
              Appréciation <span className="field__hint">(facultative)</span>
            </label>
            <select
              id="book-rating"
              className="field__select"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              <option value="">—</option>
              <option value="5">5 / 5 · Coup de cœur</option>
              <option value="4">4 / 5 · Très aimé</option>
              <option value="3">3 / 5 · Apprécié</option>
              <option value="2">2 / 5 · Mitigé</option>
              <option value="1">1 / 5 · Pas pour moi</option>
            </select>
          </div>
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
              onChange={(event) =>
                setStatus(event.target.value as ReadingStatus)
              }
            >
              {(Object.keys(READING_STATUS_LABELS) as ReadingStatus[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {READING_STATUS_LABELS[s]}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="book-tags">
            Mots-clés / thèmes{" "}
            <span className="field__hint">(facultatif, séparés par des virgules)</span>
          </label>
          <input
            id="book-tags"
            className="field__input"
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            placeholder="Ex. enquête, mystère, université, Wattpad…"
          />
        </div>

        <div className="cluster" style={{ alignItems: "stretch" }}>
          <div className="field" style={{ flex: 2 }}>
            <label className="field__label" htmlFor="book-source-url">
              Lien vers le livre{" "}
              <span className="field__hint">(facultatif : Wattpad, Gallica…)</span>
            </label>
            <input
              id="book-source-url"
              type="url"
              className="field__input"
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="field" style={{ flex: 1 }}>
            <label className="field__label" htmlFor="book-source-platform">
              Plateforme
            </label>
            <select
              id="book-source-platform"
              className="field__select"
              value={sourcePlatform}
              onChange={(event) =>
                setSourcePlatform(
                  event.target.value as BookSourcePlatform | "",
                )
              }
            >
              <option value="">—</option>
              {(
                Object.keys(
                  BOOK_SOURCE_PLATFORM_LABELS,
                ) as BookSourcePlatform[]
              ).map((p) => (
                <option key={p} value={p}>
                  {BOOK_SOURCE_PLATFORM_LABELS[p]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {sourceUrl.trim().length > 0 && (
          <div className="field">
            <label className="field__label" htmlFor="book-access-type">
              Nature du lien
            </label>
            <select
              id="book-access-type"
              className="field__select"
              value={sourceAccessType}
              onChange={(event) =>
                setSourceAccessType(event.target.value as BookAccessType)
              }
            >
              {(Object.keys(BOOK_ACCESS_TYPE_LABELS) as BookAccessType[]).map(
                (t) => (
                  <option key={t} value={t}>
                    {BOOK_ACCESS_TYPE_LABELS[t]}
                  </option>
                ),
              )}
            </select>
          </div>
        )}

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
            {saving
              ? "Enregistrement…"
              : book
                ? "Enregistrer"
                : "Ajouter ce livre"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
