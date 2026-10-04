/**
 * Architecture évolutive de recommandation de livres par IA (§10.1–§10.5).
 *
 * Séparation stricte des responsabilités (§10.3) :
 * 1. Données de lecture (`Book[]`) ;
 * 2. Préférences de lecture de Princia (`ReadingPreferences`) ;
 * 3. Constructeur de contexte minimisé (`buildMinimizedReadingContext`) :
 *    n'inclut jamais les notes personnelles (`notes`) afin de minimiser les
 *    données transmises à un futur service distant ;
 * 4. Contrat du service de recommandation (`BookRecommendationService`) ;
 * 5. Registre des appréciations sur les recommandations (`liked` / `dismissed`) ;
 * 6. Catalogue des sources externes légales (Wattpad, Project Gutenberg,
 *    Gallica · BnF, Open Library) distinguant lecture gratuite, présentation
 *    et achat (§10.5).
 *
 * Règle d'honnêteté (§10.4) :
 * - Aucune fausse recommandation codée en dur n'est présentée comme générée
 *   par une IA ;
 * - Aucune clé API secrète ne doit jamais figurer dans le frontend : seul un
 *   endpoint serveur contrôlé (`VITE_BOOK_AI_ENDPOINT`) peut être appelé.
 */
import type {
  Book,
  BookAccessType,
  BookSourcePlatform,
  ReadingStatus,
} from "../../../domain/models";

export interface ReadingPreferences {
  favoriteGenres: string[];
  preferredPlatforms: BookSourcePlatform[];
  preferredThemes: string[];
  excludedThemes: string[];
  preferFreeLegalAccess: boolean;
  updatedAt: string;
}

export interface MinimizedBookSignal {
  title: string;
  author?: string;
  category?: string;
  status: ReadingStatus;
  rating?: number;
  tags?: string[];
  sourcePlatform?: BookSourcePlatform;
}

export interface MinimizedReadingContext {
  schema: "princia.chapter18.reading-context.v1";
  generatedAt: string;
  books: MinimizedBookSignal[];
  preferences: Omit<ReadingPreferences, "updatedAt">;
  dismissedTitles: string[];
  likedTitles: string[];
}

export interface BookRecommendation {
  id: string;
  title: string;
  author?: string;
  genre?: string;
  rationale: string;
  sourcePlatform: BookSourcePlatform;
  /** Nature réelle du lien (§10.5) : ne prétend jamais qu'un livre est gratuit sans vérification. */
  sourceAccessType: BookAccessType;
  sourceUrl?: string;
  verifiedFreeLegal: boolean;
  feedback?: "liked" | "dismissed";
  createdAt: string;
}

export interface RecommendationServiceStatus {
  configured: boolean;
  endpointUrl?: string;
  message: string;
}

export type RecommendationFeedback = "liked" | "dismissed";

export interface BookRecommendationService {
  getStatus(): RecommendationServiceStatus;
  buildContext(
    books: ReadonlyArray<Book>,
    preferences?: ReadingPreferences,
  ): MinimizedReadingContext;
  requestRecommendations(
    context: MinimizedReadingContext,
    signal?: AbortSignal,
  ): Promise<BookRecommendation[]>;
  recordFeedback(
    recommendationId: string,
    title: string,
    feedback: RecommendationFeedback,
  ): void;
  getFeedbackMap(): Record<
    string,
    { title: string; feedback: RecommendationFeedback; updatedAt: string }
  >;
}

export interface LegalReadingPlatformInfo {
  id: BookSourcePlatform;
  name: string;
  url: string;
  accessType: BookAccessType;
  description: string;
}

export const LEGAL_READING_PLATFORMS: ReadonlyArray<LegalReadingPlatformInfo> = [
  {
    id: "wattpad",
    name: "Wattpad",
    url: "https://www.wattpad.com/",
    accessType: "free-reading",
    description:
      "Histoires originales, romans et récits publiés légalement par leurs auteur·rice·s (accès gratuit selon les œuvres).",
  },
  {
    id: "gutenberg",
    name: "Project Gutenberg",
    url: "https://www.gutenberg.org/",
    accessType: "free-reading",
    description:
      "Bibliothèque numérique d'œuvres tombées dans le domaine public, lisibles et téléchargeables gratuitement et légalement.",
  },
  {
    id: "gallica",
    name: "Gallica · BnF",
    url: "https://gallica.bnf.fr/",
    accessType: "free-reading",
    description:
      "Bibliothèque numérique de la Bibliothèque nationale de France : classiques francophones en accès libre et légal.",
  },
  {
    id: "openlibrary",
    name: "Open Library",
    url: "https://openlibrary.org/",
    accessType: "presentation",
    description:
      "Catalogue ouvert de livres permettant de découvrir des fiches d'œuvres et d'emprunter légalement des éditions numériques.",
  },
];

const PREFS_KEY = "princia.chapter18.readingPreferences.v1";
const FEEDBACK_KEY = "princia.chapter18.bookRecommendationsFeedback.v1";

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  favoriteGenres: ["Enquête & Mystère", "Roman"],
  preferredPlatforms: ["wattpad", "gutenberg", "gallica"],
  preferredThemes: [],
  excludedThemes: [],
  preferFreeLegalAccess: true,
  updatedAt: new Date(0).toISOString(),
};

export function loadReadingPreferences(): ReadingPreferences {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return DEFAULT_READING_PREFERENCES;
    }
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_READING_PREFERENCES;
    const parsed = JSON.parse(raw) as Partial<ReadingPreferences>;
    return {
      favoriteGenres: Array.isArray(parsed.favoriteGenres)
        ? parsed.favoriteGenres.filter((x): x is string => typeof x === "string")
        : DEFAULT_READING_PREFERENCES.favoriteGenres,
      preferredPlatforms: Array.isArray(parsed.preferredPlatforms)
        ? (parsed.preferredPlatforms.filter(
            (x): x is BookSourcePlatform => typeof x === "string",
          ))
        : DEFAULT_READING_PREFERENCES.preferredPlatforms,
      preferredThemes: Array.isArray(parsed.preferredThemes)
        ? parsed.preferredThemes.filter((x): x is string => typeof x === "string")
        : [],
      excludedThemes: Array.isArray(parsed.excludedThemes)
        ? parsed.excludedThemes.filter((x): x is string => typeof x === "string")
        : [],
      preferFreeLegalAccess:
        typeof parsed.preferFreeLegalAccess === "boolean"
          ? parsed.preferFreeLegalAccess
          : true,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : DEFAULT_READING_PREFERENCES.updatedAt,
    };
  } catch {
    return DEFAULT_READING_PREFERENCES;
  }
}

export function saveReadingPreferences(
  prefs: Omit<ReadingPreferences, "updatedAt">,
): ReadingPreferences {
  const next: ReadingPreferences = {
    ...prefs,
    updatedAt: new Date().toISOString(),
  };
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    }
  } catch {
    /* ignore */
  }
  return next;
}

export function loadRecommendationFeedbackMap(): Record<
  string,
  { title: string; feedback: RecommendationFeedback; updatedAt: string }
> {
  try {
    if (typeof window === "undefined" || !window.localStorage) return {};
    const raw = window.localStorage.getItem(FEEDBACK_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<
      string,
      { title: string; feedback: RecommendationFeedback; updatedAt: string }
    >;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Construit le contexte minimisé destiné à un futur service de recommandation IA.
 * Les notes personnelles (`book.notes`) et citations privées ne sont jamais
 * transmises dans ce payload afin de respecter la confidentialité de Princia (§10.4).
 */
export function buildMinimizedReadingContext(
  books: ReadonlyArray<Book>,
  preferences: ReadingPreferences = loadReadingPreferences(),
): MinimizedReadingContext {
  const feedbackMap = loadRecommendationFeedbackMap();
  const likedTitles: string[] = [];
  const dismissedTitles: string[] = [];
  for (const entry of Object.values(feedbackMap)) {
    if (entry.feedback === "liked") likedTitles.push(entry.title);
    if (entry.feedback === "dismissed") dismissedTitles.push(entry.title);
  }

  return {
    schema: "princia.chapter18.reading-context.v1",
    generatedAt: new Date().toISOString(),
    books: books.map((book) => ({
      title: book.title,
      author: book.author,
      category: book.category,
      status: book.status,
      rating: book.rating,
      tags: book.tags,
      sourcePlatform: book.sourcePlatform,
    })),
    preferences: {
      favoriteGenres: preferences.favoriteGenres,
      preferredPlatforms: preferences.preferredPlatforms,
      preferredThemes: preferences.preferredThemes,
      excludedThemes: preferences.excludedThemes,
      preferFreeLegalAccess: preferences.preferFreeLegalAccess,
    },
    likedTitles,
    dismissedTitles,
  };
}

function getAiEndpoint(): string {
  try {
    const meta = import.meta as unknown as {
      env?: Record<string, string | undefined>;
    };
    return (meta.env?.["VITE_BOOK_AI_ENDPOINT"] ?? "").trim();
  } catch {
    return "";
  }
}

export const bookRecommendationService: BookRecommendationService = {
  getStatus(): RecommendationServiceStatus {
    const endpoint = getAiEndpoint();
    if (!endpoint) {
      return {
        configured: false,
        message:
          "Architecture de recommandation prête. Aucun service IA serveur n'est connecté pour l'instant (variable VITE_BOOK_AI_ENDPOINT non définie) : tes préférences et tes lectures sont prêtes pour son activation future.",
      };
    }
    return {
      configured: true,
      endpointUrl: endpoint,
      message: "Service de recommandation personnalisé connecté.",
    };
  },

  buildContext(
    books: ReadonlyArray<Book>,
    preferences?: ReadingPreferences,
  ): MinimizedReadingContext {
    return buildMinimizedReadingContext(books, preferences);
  },

  async requestRecommendations(
    context: MinimizedReadingContext,
    signal?: AbortSignal,
  ): Promise<BookRecommendation[]> {
    const endpoint = getAiEndpoint();
    if (!endpoint) {
      throw new Error(
        "Aucun service de recommandation IA n'est configuré côté serveur (VITE_BOOK_AI_ENDPOINT absent).",
      );
    }
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(context),
      signal,
    });
    if (!res.ok) {
      throw new Error(
        `Le service de recommandation a répondu avec une erreur (HTTP ${res.status}).`,
      );
    }
    const payload = (await res.json()) as {
      recommendations?: BookRecommendation[];
    };
    if (!Array.isArray(payload.recommendations)) {
      return [];
    }
    return payload.recommendations.map((rec) => ({
      ...rec,
      // Ne jamais prétendre qu'un livre est disponible gratuitement sans preuve explicite (§10.5)
      verifiedFreeLegal:
        rec.verifiedFreeLegal === true &&
        rec.sourceAccessType === "free-reading",
    }));
  },

  recordFeedback(
    recommendationId: string,
    title: string,
    feedback: RecommendationFeedback,
  ): void {
    const current = loadRecommendationFeedbackMap();
    const next = {
      ...current,
      [recommendationId]: {
        title,
        feedback,
        updatedAt: new Date().toISOString(),
      },
    };
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(next));
      }
    } catch {
      /* ignore */
    }
  },

  getFeedbackMap() {
    return loadRecommendationFeedbackMap();
  },
};
