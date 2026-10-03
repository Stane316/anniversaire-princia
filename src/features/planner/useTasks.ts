/** Accès aux tâches pour l'interface (même contrat que useBooks). */
import { useCallback, useEffect, useState } from "react";
import type { PlannerTask } from "../../domain/models";
import { taskRepository } from "../../data/repositories";
import { useToast } from "../../components/ui/Toast";
import type { LoadState } from "../reading/useBooks";

export function useTasks() {
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const { notify } = useToast();

  const reload = useCallback(async () => {
    setState("loading");
    try {
      const all = await taskRepository.getAll();
      setTasks(all);
      setState("ready");
    } catch (error) {
      setState("error");
      notify(error instanceof Error ? error.message : "Impossible de charger les tâches.", "error");
    }
  }, [notify]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const create = useCallback(
    async (input: { title: string; note?: string; dueDate?: string; weeklyPriority: boolean }) => {
      try {
        const task = await taskRepository.create(input);
        setTasks((current) => [...current, task]);
        notify("Tâche enregistrée.");
        return true;
      } catch (error) {
        notify(error instanceof Error ? error.message : "Échec de l'enregistrement.", "error");
        return false;
      }
    },
    [notify],
  );

  const update = useCallback(
    async (task: PlannerTask) => {
      try {
        const next = await taskRepository.update(task);
        setTasks((current) => current.map((t) => (t.id === next.id ? next : t)));
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
        await taskRepository.delete(id);
        setTasks((current) => current.filter((t) => t.id !== id));
        notify("Tâche supprimée.");
        return true;
      } catch (error) {
        notify(error instanceof Error ? error.message : "La suppression n'a pas abouti.", "error");
        return false;
      }
    },
    [notify],
  );

  return { tasks, state, reload, create, update, remove };
}
