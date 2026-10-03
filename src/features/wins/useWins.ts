/** Accès aux petites victoires pour l'interface. */
import { useCallback, useEffect, useState } from "react";
import type { SmallWin } from "../../domain/models";
import { winRepository } from "../../data/repositories";
import { useToast } from "../../components/ui/Toast";
import type { LoadState } from "../reading/useBooks";

export function useWins() {
  const [wins, setWins] = useState<SmallWin[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const { notify } = useToast();

  const reload = useCallback(async () => {
    setState("loading");
    try {
      const all = await winRepository.getAll();
      all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setWins(all);
      setState("ready");
    } catch (error) {
      setState("error");
      notify(error instanceof Error ? error.message : "Impossible de charger tes victoires.", "error");
    }
  }, [notify]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: { text: string; category?: string }) => {
      try {
        const win = await winRepository.create(input);
        setWins((current) => [win, ...current]);
        notify("Petite victoire notée. Bien joué.");
        return true;
      } catch (error) {
        notify(error instanceof Error ? error.message : "Échec de l'enregistrement.", "error");
        return false;
      }
    },
    [notify],
  );

  const update = useCallback(
    async (win: SmallWin) => {
      try {
        const next = await winRepository.update(win);
        setWins((current) => current.map((w) => (w.id === next.id ? next : w)));
        return true;
      } catch (error) {
        notify(error instanceof Error ? error.message : "Échec de l'enregistrement.", "error");
        return false;
      }
    },
    [notify],
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await winRepository.delete(id);
        setWins((current) => current.filter((w) => w.id !== id));
        notify("Victoire retirée de la liste.");
        return true;
      } catch (error) {
        notify(error instanceof Error ? error.message : "La suppression n'a pas abouti.", "error");
        return false;
      }
    },
    [notify],
  );

  return { wins, state, reload, create, update, remove };
}
