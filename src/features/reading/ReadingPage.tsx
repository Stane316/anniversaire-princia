/**
 * LIB-01 — Bibliothèque personnelle et socle évolutif de recommandations
 * (doc 01 §9 & mission §10).
 * - distincte de Blue Library : c'est SES lectures, pas l'histoire
 *   du cadeau ;
 * - filtrer ne fait jamais disparaître une entrée (les données
 *   restent intactes — doc 03 §8.3) ;
 * - suppression explicite en deux étapes ;
 * - prépare les préférences de lecture et l'architecture de recommandation
 *   sans jamais simuler une IA non configurée (§10.4).
 */
import { useMemo, useState } from "react";
import type { Book, BookSourcePlatform, ReadingStatus } from "../../domain/models";
import {
  BOOK_ACCESS_TYPE_LABELS,
  BOOK_CATEGORIES,
  BOOK_SOURCE_PLATFORM_LABELS,
  READING_STATUS_LABELS,
} from "../../domain/models";
import { useBooks } from "./useBooks";
import { BookFormModal } from "./BookFormModal";
import { EmptyState } from "../../components/ui/EmptyState";
import { Modal } from "../../components/ui/Modal";
import { Icon } from "../../components/ui/Icon";
import { useToast } from "../../components/ui/Toast";
import {
  bookRecommendationService,
  LEGAL_READING_PLATFORMS,
  loadReadingPreferences,
  saveReadingPreferences,
  type ReadingPreferences,
} from "./recommendations/recommendationEngine";

type Filter = ReadingStatus | "all";

const FILTER_LABELS: Record<Filter, string> = {
  all: "Tous",
  "to-read": "À lire",
  reading: "En cours",
  completed: "Terminé",
};

export function ReadingPage() {
  const { books, state, reload, create, update, remove } = useBooks();
  const { notify } = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [bookBeingEdited, setBookBeingEdited] = useState<Book | undefined>(
    undefined,
  );
  const [bookBeingDeleted, setBookBeingDeleted] = useState<Book | undefined>(
    undefined,
  );
  const [preferences, setPreferences] = useState<ReadingPreferences>(() =>
    loadReadingPreferences(),
  );
  const [prefsOpen, setPrefsOpen] = useState(false);

  const aiStatus = useMemo(() => bookRecommendationService.getStatus(), []);

  const visibleBooks = useMemo(
    () =>
      filter === "all"
        ? books
        : books.filter((book) => book.status === filter),
    [books, filter],
  );

  const counts = useMemo(() => {
    const by: Record<ReadingStatus, number> = {
      "to-read": 0,
      reading: 0,
      completed: 0,
    };
    for (const book of books) by[book.status] += 1;
    return by;
  }, [books]);

  const toggleFavoriteGenre = (genre: string) => {
    const exists = preferences.favoriteGenres.includes(genre);
    const nextGenres = exists
      ? preferences.favoriteGenres.filter((g) => g !== genre)
      : [...preferences.favoriteGenres, genre];
    const saved = saveReadingPreferences({
      ...preferences,
      favoriteGenres: nextGenres,
    });
    setPreferences(saved);
    notify("Préférences de lecture enregistrées sur cet appareil.");
  };

  const togglePreferredPlatform = (platform: BookSourcePlatform) => {
    const exists = preferences.preferredPlatforms.includes(platform);
    const nextPlatforms = exists
      ? preferences.preferredPlatforms.filter((p) => p !== platform)
      : [...preferences.preferredPlatforms, platform];
    const saved = saveReadingPreferences({
      ...preferences,
      preferredPlatforms: nextPlatforms,
    });
    setPreferences(saved);
    notify("Plateformes préférées mises à jour.");
  };

  return (
    <section className="container section container--editorial page-enter">
      <header
        className="cluster cluster--between"
        style={{ marginBottom: "var(--space-6)", alignItems: "end" }}
      >
        <div className="stack">
          <p className="kicker">Ta bibliothèque</p>
          <h1 className="h2">Les livres de Princia</h1>
          <p className="text-secondary" style={{ maxWidth: "56ch" }}>
            Tes prochaines lectures, celles en cours, celles refermées avec
            émotion. Tout est modifiable, rien n'est obligatoire.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setFormOpen(true)}
        >
          <Icon name="plus" size={16} />
          Ajouter un livre
        </button>
      </header>

      <div
        className="cluster"
        role="tablist"
        aria-label="Filtrer par état de lecture"
        style={{ marginBottom: "var(--space-6)" }}
      >
        {(Object.keys(FILTER_LABELS) as Filter[]).map((key) => (
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
            {key !== "all"
              ? ` · ${counts[key as ReadingStatus]}`
              : ` · ${books.length}`}
          </button>
        ))}
      </div>

      {state === "error" && (
        <div
          className="alert alert--error"
          role="alert"
          style={{ marginBottom: "var(--space-4)" }}
        >
          <Icon name="alert" size={18} />
          <span>
            Les livres n'ont pas pu être chargés.{" "}
            <button
              type="button"
              className="btn btn--text"
              style={{ minHeight: 0, padding: 0 }}
              onClick={() => void reload()}
            >
              Réessayer
            </button>
          </span>
        </div>
      )}

      {state === "loading" && (
        <p className="text-muted" role="status">
          Chargement de ta bibliothèque…
        </p>
      )}

      {state === "ready" && visibleBooks.length === 0 && (
        <EmptyState
          icon="book-open"
          title={
            books.length === 0
              ? "Une étagère prête à être remplie"
              : "Rien dans cette catégorie pour l'instant"
          }
          description={
            books.length === 0
              ? "Commence ta liste : un roman, une enquête, une lecture d'étude. C'est ta bibliothèque, à ton rythme."
              : "Les livres d'un autre état sont toujours là — change de filtre pour les retrouver."
          }
          action={
            books.length === 0
              ? {
                  label: "Ajouter mon premier livre",
                  onClick: () => setFormOpen(true),
                }
              : undefined
          }
        />
      )}

      {visibleBooks.length > 0 && (
        <ul className="stack" aria-label="Liste des livres">
          {visibleBooks.map((book) => (
            <li key={book.id}>
              <article
                className="card cluster cluster--between"
                style={{ alignItems: "flex-start" }}
              >
                <div className="stack" style={{ gap: "var(--space-2)", flex: 1 }}>
                  <div className="cluster" style={{ gap: "var(--space-2)" }}>
                    <span
                      className={`badge ${
                        book.status === "completed"
                          ? "badge--success"
                          : book.status === "reading"
                            ? "badge--info"
                            : "badge--blue"
                      }`}
                    >
                      {READING_STATUS_LABELS[book.status]}
                    </span>
                    {book.category && (
                      <span className="badge badge--neutral">
                        {book.category}
                      </span>
                    )}
                    {book.rating && (
                      <span className="badge badge--blue">
                        {"★".repeat(book.rating)} ({book.rating}/5)
                      </span>
                    )}
                    {book.sourcePlatform && (
                      <span className="badge badge--neutral">
                        {BOOK_SOURCE_PLATFORM_LABELS[book.sourcePlatform]}
                      </span>
                    )}
                  </div>
                  <h2 className="h4" style={{ overflowWrap: "anywhere" }}>
                    {book.title}
                  </h2>
                  {book.author && <p className="text-muted">{book.author}</p>}
                  {book.notes && (
                    <p
                      className="text-secondary"
                      style={{
                        fontSize: "var(--text-body-sm)",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {book.notes}
                    </p>
                  )}
                  {book.tags && book.tags.length > 0 && (
                    <div className="cluster" style={{ gap: "var(--space-1)" }}>
                      {book.tags.map((tag) => (
                        <span
                          key={tag}
                          className="badge badge--neutral"
                          style={{ fontSize: "var(--text-caption)" }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {book.sourceUrl && (
                    <div
                      className="cluster"
                      style={{ gap: "var(--space-2)", marginTop: "var(--space-1)" }}
                    >
                      <a
                        href={book.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--secondary"
                        style={{
                          minHeight: 34,
                          padding: "var(--space-1) var(--space-3)",
                        }}
                      >
                        {book.sourceAccessType
                          ? BOOK_ACCESS_TYPE_LABELS[book.sourceAccessType]
                          : "Ouvrir le lien"}
                        <Icon name="external" size={14} />
                      </a>
                    </div>
                  )}
                  <div
                    className="cluster"
                    style={{ marginTop: "var(--space-2)" }}
                  >
                    {(Object.keys(READING_STATUS_LABELS) as ReadingStatus[])
                      .filter((s) => s !== book.status)
                      .map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="btn btn--text"
                          style={{
                            minHeight: 36,
                            padding: "var(--space-1) var(--space-3)",
                          }}
                          onClick={() => void update({ ...book, status: s })}
                          aria-label={`Passer « ${book.title} » en ${READING_STATUS_LABELS[s]}`}
                        >
                          → {READING_STATUS_LABELS[s]}
                        </button>
                      ))}
                  </div>
                </div>
                <div className="cluster" style={{ gap: "var(--space-1)" }}>
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label={`Modifier « ${book.title} »`}
                    onClick={() => setBookBeingEdited(book)}
                  >
                    <Icon name="edit" size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label={`Supprimer « ${book.title} »`}
                    onClick={() => setBookBeingDeleted(book)}
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      {/* Socle évolutif de préférences & futures recommandations (§10.3–§10.5) */}
      <aside
        className="surface-panel stack"
        aria-labelledby="reading-recommendations-heading"
        style={{ marginTop: "var(--space-10)", gap: "var(--space-4)" }}
      >
        <div
          className="cluster cluster--between"
          style={{ alignItems: "flex-start" }}
        >
          <div className="stack" style={{ gap: "var(--space-1)" }}>
            <p className="kicker">Repères & sources de lecture</p>
            <h2 id="reading-recommendations-heading" className="h3">
              Tes préférences & plateformes légales
            </h2>
            <p
              className="text-secondary"
              style={{ maxWidth: "58ch", fontSize: "var(--text-body-sm)" }}
            >
              Choisis tes genres favoris et explore des plateformes de lecture
              gratuites ou légales (dont Wattpad et le domaine public).
            </p>
          </div>

          <button
            type="button"
            className="btn btn--secondary"
            aria-expanded={prefsOpen}
            onClick={() => setPrefsOpen((prev) => !prev)}
          >
            {prefsOpen ? "Masquer mes préférences" : "Personnaliser mes goûts"}
          </button>
        </div>

        {prefsOpen && (
          <div className="stack" style={{ gap: "var(--space-4)" }}>
            <div className="stack" style={{ gap: "var(--space-2)" }}>
              <strong style={{ fontSize: "var(--text-body-sm)" }}>
                Genres que tu aimes particulièrement :
              </strong>
              <div className="cluster" style={{ gap: "var(--space-2)" }}>
                {BOOK_CATEGORIES.map((genre) => {
                  const active = preferences.favoriteGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      aria-pressed={active}
                      className={`badge ${active ? "badge--blue" : "badge--neutral"}`}
                      style={{
                        cursor: "pointer",
                        border: active
                          ? "1px solid var(--color-primary)"
                          : "1px solid transparent",
                      }}
                      onClick={() => toggleFavoriteGenre(genre)}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="stack" style={{ gap: "var(--space-2)" }}>
              <strong style={{ fontSize: "var(--text-body-sm)" }}>
                Plateformes de lecture privilégiées :
              </strong>
              <div className="cluster" style={{ gap: "var(--space-2)" }}>
                {LEGAL_READING_PLATFORMS.map((platform) => {
                  const active = preferences.preferredPlatforms.includes(
                    platform.id,
                  );
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      aria-pressed={active}
                      className={`badge ${active ? "badge--blue" : "badge--neutral"}`}
                      style={{
                        cursor: "pointer",
                        border: active
                          ? "1px solid var(--color-primary)"
                          : "1px solid transparent",
                      }}
                      onClick={() => togglePreferredPlatform(platform.id)}
                    >
                      {platform.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <ul
          className="stack"
          aria-label="Plateformes de lecture légales"
          style={{ gap: "var(--space-2)" }}
        >
          {LEGAL_READING_PLATFORMS.map((platform) => (
            <li key={platform.id}>
              <div
                className="card cluster cluster--between"
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  gap: "var(--space-3)",
                }}
              >
                <div className="stack" style={{ gap: "var(--space-1)", flex: 1 }}>
                  <div className="cluster" style={{ gap: "var(--space-2)" }}>
                    <strong>{platform.name}</strong>
                    <span className="badge badge--blue">
                      {BOOK_ACCESS_TYPE_LABELS[platform.accessType]}
                    </span>
                  </div>
                  <p
                    className="text-secondary"
                    style={{ margin: 0, fontSize: "var(--text-body-sm)" }}
                  >
                    {platform.description}
                  </p>
                </div>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary"
                  aria-label={`Ouvrir ${platform.name} (lien externe, nouvel onglet)`}
                >
                  Explorer
                  <Icon name="external" size={14} />
                </a>
              </div>
            </li>
          ))}
        </ul>

        <p
          className="text-muted"
          role="status"
          style={{ margin: 0, fontSize: "var(--text-caption)" }}
        >
          {aiStatus.message}
        </p>
      </aside>

      {formOpen && (
        <BookFormModal
          onClose={() => setFormOpen(false)}
          onSubmit={async (input) => create(input)}
        />
      )}
      {bookBeingEdited && (
        <BookFormModal
          book={bookBeingEdited}
          onClose={() => setBookBeingEdited(undefined)}
          onSubmit={async (input) => update({ ...bookBeingEdited, ...input })}
        />
      )}
      {bookBeingDeleted && (
        <Modal
          title="Supprimer ce livre ?"
          onClose={() => setBookBeingDeleted(undefined)}
        >
          <p className="text-secondary">
            « {bookBeingDeleted.title} » sera définitivement retiré de ta
            bibliothèque. Cette action n'est pas réversible.
          </p>
          <div
            className="cluster"
            style={{ justifyContent: "flex-end", marginTop: "var(--space-6)" }}
          >
            <button
              type="button"
              className="btn btn--text"
              onClick={() => setBookBeingDeleted(undefined)}
            >
              Garder le livre
            </button>
            <button
              type="button"
              className="btn btn--destructive"
              onClick={() => {
                void remove(bookBeingDeleted.id).then((ok) => {
                  if (ok) setBookBeingDeleted(undefined);
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
