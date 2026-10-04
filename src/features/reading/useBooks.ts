/**
 * Accès aux livres pour l'interface (doc 03 §9.6 : les composants
 * ne parlent jamais directement à IndexedDB).
 * États explicites : loading / ready / error (doc 03 §18.6).
 */
import { useCallback, useEffect, useState } from "react";
import type { Book } from "../../domain/models";
import { bookRepository } from "../../data/repositories";
import { useToast } from "../../components/ui/Toast";

export type LoadState = "loading" | "ready" | "error";

export type BookCreateInput = Omit<Book, "id" | "createdAt" | "updatedAt">;

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const { notify } = useToast();

  const reload = useCallback(async () => {
    setState("loading");
    try {
      const all = await bookRepository.getAll();
      all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      setBooks(all);
      setState("ready");
    } catch (error) {
      setState("error");
      notify(
        error instanceof Error
          ? error.message
          : "Impossible de charger les livres.",
        "error",
      );
    }
  }, [notify]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: BookCreateInput) => {
      try {
        const book = await bookRepository.create(input);
        setBooks((current) => [book, ...current]);
        notify("Livre ajouté à ta bibliothèque.");
        return true;
      } catch (error) {
        notify(
          error instanceof Error
            ? error.message
            : "Échec de l'enregistrement.",
          "error",
        );
        return false;
      }
    },
    [notify],
  );

  const update = useCallback(
    async (book: Book) => {
      try {
        const next = await bookRepository.update(book);
        setBooks((current) =>
          current.map((b) => (b.id === next.id ? next : b)),
        );
        return true;
      } catch (error) {
        notify(
          error instanceof Error
            ? error.message
            : "Échec de l'enregistrement.",
          "error",
        );
        return false;
      }
    },
    [notify],
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await bookRepository.delete(id);
        setBooks((current) => current.filter((b) => b.id !== id));
        notify("Livre retiré de la bibliothèque.");
        return true;
      } catch (error) {
        notify(
          error instanceof Error
            ? error.message
            : "La suppression n'a pas abouti.",
          "error",
        );
        return false;
      }
    },
    [notify],
  );

  return { books, state, reload, create, update, remove };
}
