/**
 * UNI — Carnet universitaire (doc 01 §10).
 * - outil flexible, pas un système de contrôle ;
 * - les priorités de la semaine sont choisies librement (UNI-03) ;
 * - une échéance dépassée est affichée neutrement, jamais avec
 *   culpabilisation (doc 01 §2.4) ;
 * - absence de permission de notification n'empêche aucune
 *   fonction : la V1 n'affiche les échéances que dans l'interface
 *   (aucune promesse de notification push — doc 03 §14.5).
 */
import { useMemo, useState } from "react";
import type { PlannerTask } from "../../domain/models";
import { useTasks } from "./useTasks";
import { TaskFormModal } from "./TaskFormModal";
import { EmptyState } from "../../components/ui/EmptyState";
import { Modal } from "../../components/ui/Modal";
import { Icon } from "../../components/ui/Icon";
import { dueLabel, dueStatus } from "../../lib/datetime";

const DUE_BADGE: Record<ReturnType<typeof dueStatus>, { className: string }> = {
  overdue: { className: "badge badge--warning" },
  today: { className: "badge badge--info" },
  soon: { className: "badge badge--warning" },
  later: { className: "badge badge--neutral" },
};

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: PlannerTask;
  onToggle: (task: PlannerTask) => void;
  onEdit: (task: PlannerTask) => void;
  onDelete: (task: PlannerTask) => void;
}) {
  return (
    <article className="card cluster" style={{ alignItems: "flex-start", gap: "var(--space-4)" }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={
          task.completed
            ? `Rouvrir la tâche « ${task.title} »`
            : `Marquer la tâche « ${task.title} » comme terminée`
        }
        style={{ width: 22, height: 22, marginTop: 3, accentColor: "var(--color-primary)", flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2
          className="h4"
          style={{
            textDecoration: task.completed ? "line-through" : "none",
            color: task.completed ? "var(--color-text-muted)" : undefined,
            overflowWrap: "anywhere",
          }}
        >
          {task.title}
        </h2>
        <div className="cluster" style={{ marginTop: "var(--space-2)", gap: "var(--space-2)" }}>
          {task.dueDate && !task.completed && (
            <span className={DUE_BADGE[dueStatus(task.dueDate)].className}>
              <Icon name="calendar" size={12} />
              {dueLabel(task.dueDate)}
            </span>
          )}
          {task.weeklyPriority && (
            <span className="badge badge--blue">
              <Icon name="star" size={12} />
              Priorité de la semaine
            </span>
          )}
        </div>
        {task.note && (
          <p className="text-secondary" style={{ fontSize: "var(--text-body-sm)", marginTop: "var(--space-2)", overflowWrap: "anywhere" }}>
            {task.note}
          </p>
        )}
      </div>
      <div className="cluster" style={{ gap: "var(--space-1)" }}>
        <button type="button" className="btn-icon" aria-label={`Modifier « ${task.title} »`} onClick={() => onEdit(task)}>
          <Icon name="edit" size={16} />
        </button>
        <button
          type="button"
          className="btn-icon"
          aria-label={`Supprimer « ${task.title} »`}
          onClick={() => onDelete(task)}
        >
          <Icon name="trash" size={16} />
        </button>
      </div>
    </article>
  );
}

export function PlannerPage() {
  const { tasks, state, reload, create, update, remove } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<PlannerTask | undefined>(undefined);
  const [taskBeingDeleted, setTaskBeingDeleted] = useState<PlannerTask | undefined>(undefined);
  const [showCompleted, setShowCompleted] = useState(false);

  const { priorities, open, completed } = useMemo(() => {
    const openTasks = tasks
      .filter((t) => !t.completed)
      .sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999") || a.createdAt.localeCompare(b.createdAt));
    return {
      priorities: openTasks.filter((t) => t.weeklyPriority),
      open: openTasks.filter((t) => !t.weeklyPriority),
      completed: tasks
        .filter((t) => t.completed)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    };
  }, [tasks]);

  const toggleCompleted = (task: PlannerTask) => void update({ ...task, completed: !task.completed });

  return (
    <section className="container section container--editorial page-enter">
      <header className="cluster cluster--between" style={{ marginBottom: "var(--space-6)", alignItems: "end" }}>
        <div className="stack">
          <p className="kicker">Carnet universitaire</p>
          <h1 className="h2">Tes priorités, tes règles</h1>
          <p className="text-secondary" style={{ maxWidth: "56ch" }}>
            Des tâches, des échéances, des priorités de la semaine — toutes décidées par toi,
            modifiables et supprimables à tout moment.
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setFormOpen(true)}>
          <Icon name="plus" size={16} />
          Nouvelle tâche
        </button>
      </header>

      {state === "error" && (
        <div className="alert alert--error" role="alert" style={{ marginBottom: "var(--space-4)" }}>
          <Icon name="alert" size={18} />
          <span>
            Le carnet n'a pas pu être chargé.{" "}
            <button type="button" className="btn btn--text" style={{ minHeight: 0, padding: 0 }} onClick={() => void reload()}>
              Réessayer
            </button>
          </span>
        </div>
      )}

      {state === "loading" && (
        <p className="text-muted" role="status">
          Chargement du carnet…
        </p>
      )}

      {state === "ready" && tasks.length === 0 && (
        <EmptyState
          icon="calendar"
          title="Un carnet tout neuf"
          description="Pose ici ce que tu veux traiter : un devoir, une révision, une échéance. Aucun objectif ne t'est imposé."
          action={{ label: "Créer ma première tâche", onClick: () => setFormOpen(true) }}
        />
      )}

      {priorities.length > 0 && (
        <section aria-labelledby="planner-priorities" style={{ marginBottom: "var(--space-8)" }}>
          <h2 id="planner-priorities" className="h3" style={{ marginBottom: "var(--space-4)" }}>
            Priorités de la semaine
          </h2>
          <ol className="stack">
            {priorities.map((task) => (
              <li key={task.id}>
                <TaskRow task={task} onToggle={toggleCompleted} onEdit={setTaskBeingEdited} onDelete={setTaskBeingDeleted} />
              </li>
            ))}
          </ol>
        </section>
      )}

      {open.length > 0 && (
        <section aria-labelledby="planner-open" style={{ marginBottom: "var(--space-8)" }}>
          <h2 id="planner-open" className="h3" style={{ marginBottom: "var(--space-4)" }}>
            {priorities.length > 0 ? "Autres tâches" : "À faire"}
          </h2>
          <ol className="stack">
            {open.map((task) => (
              <li key={task.id}>
                <TaskRow task={task} onToggle={toggleCompleted} onEdit={setTaskBeingEdited} onDelete={setTaskBeingDeleted} />
              </li>
            ))}
          </ol>
        </section>
      )}

      {completed.length > 0 && (
        <section aria-labelledby="planner-completed">
          <button
            type="button"
            className="btn btn--text"
            style={{ paddingLeft: 0 }}
            onClick={() => setShowCompleted((v) => !v)}
            aria-expanded={showCompleted}
            aria-controls="planner-completed-list"
          >
            <Icon name="check-circle" size={16} />
            Terminées ({completed.length}) {showCompleted ? "— masquer" : "— afficher"}
          </button>
          {showCompleted && (
            <ol className="stack" id="planner-completed-list">
              {completed.map((task) => (
                <li key={task.id}>
                  <TaskRow task={task} onToggle={toggleCompleted} onEdit={setTaskBeingEdited} onDelete={setTaskBeingDeleted} />
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      {formOpen && <TaskFormModal onClose={() => setFormOpen(false)} onSubmit={create} />}
      {taskBeingEdited && (
        <TaskFormModal
          task={taskBeingEdited}
          onClose={() => setTaskBeingEdited(undefined)}
          onSubmit={async (input) => update({ ...taskBeingEdited, ...input })}
        />
      )}
      {taskBeingDeleted && (
        <Modal title="Supprimer cette tâche ?" onClose={() => setTaskBeingDeleted(undefined)}>
          <p className="text-secondary">
            « {taskBeingDeleted.title} » sera supprimée de ton carnet. Cette action n'est pas
            réversible.
          </p>
          <div className="cluster" style={{ justifyContent: "flex-end", marginTop: "var(--space-6)" }}>
            <button type="button" className="btn btn--text" onClick={() => setTaskBeingDeleted(undefined)}>
              Garder la tâche
            </button>
            <button
              type="button"
              className="btn btn--destructive"
              onClick={() => {
                void remove(taskBeingDeleted.id).then((ok) => {
                  if (ok) setTaskBeingDeleted(undefined);
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
