/**
 * Formulaire de tâche (UNI-02, doc 01 §10.3) :
 * - création en quelques secondes : seul le titre est requis ;
 * - l'échéance est facultative (doc 03 §8.4) ;
 * - aucun rappel créé silencieusement : la V1 n'active pas de
 *   notifications système — les échéances restent visibles dans
 *   le carnet (doc 03 §14.5, repli honnête).
 */
import { useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { Icon } from "../../components/ui/Icon";
import { validateTaskTitle, isIsoDate } from "../../domain/models";
import type { PlannerTask } from "../../domain/models";
import { todayIsoDate } from "../../lib/datetime";

interface TaskFormModalProps {
  task?: PlannerTask;
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    note?: string;
    dueDate?: string;
    weeklyPriority: boolean;
  }) => Promise<boolean>;
}

export function TaskFormModal({ task, onClose, onSubmit }: TaskFormModalProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [note, setNote] = useState(task?.note ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [weeklyPriority, setWeeklyPriority] = useState(task?.weeklyPriority ?? false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validateTaskTitle(title);
    if (!validation.ok) {
      setError(validation.message ?? "Titre invalide.");
      return;
    }
    if (dueDate && !isIsoDate(dueDate)) {
      setError("La date n'est pas lisible. Utilise le sélecteur de date.");
      return;
    }
    setError(null);
    setSaving(true);
    const ok = await onSubmit({
      title: title.trim(),
      note: note.trim() || undefined,
      dueDate: dueDate || undefined,
      weeklyPriority,
    });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Modal title={task ? "Modifier la tâche" : "Nouvelle tâche"} onClose={onClose}>
      <form className="stack" onSubmit={(event) => void submit(event)}>
        <div className="field">
          <label className="field__label" htmlFor="task-title">
            Quoi ? <span aria-hidden="true">*</span>
          </label>
          <input
            id="task-title"
            className={`field__input${error ? " field__input--error" : ""}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex. Relire le cours d'hydrologie"
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
          <label className="field__label" htmlFor="task-due">
            Échéance <span className="field__hint">(facultative)</span>
          </label>
          <input
            id="task-due"
            type="date"
            min={todayIsoDate()}
            className="field__input"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
          {dueDate && (
            <button
              type="button"
              className="btn btn--text"
              style={{ justifySelf: "start", minHeight: 32, paddingInline: 0 }}
              onClick={() => setDueDate("")}
            >
              Retirer l'échéance
            </button>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="task-note">
            Note <span className="field__hint">(facultative)</span>
          </label>
          <textarea
            id="task-note"
            className="field__textarea"
            rows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={weeklyPriority}
            onChange={(event) => setWeeklyPriority(event.target.checked)}
          />
          <span>
            <strong>Priorité de la semaine</strong>
            <span className="field__hint" style={{ display: "block" }}>
              Elle apparaîtra dans les priorités en haut du carnet.
            </span>
          </span>
        </label>

        <div className="cluster" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn btn--text" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Enregistrement…" : task ? "Enregistrer" : "Créer la tâche"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
