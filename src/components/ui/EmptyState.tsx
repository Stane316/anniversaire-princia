/**
 * État vide (doc 01 §18.2) : explique simplement ce que l'espace permet,
 * avec une action facultative. Jamais présenté comme une erreur, jamais
 * culpabilisant (doc 02 §9.8).
 */
import type { IconName } from "./Icon";
import { Icon } from "./Icon";

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={36} />
      <h3 className="h4">{title}</h3>
      <p className="text-secondary" style={{ maxWidth: "42ch" }}>
        {description}
      </p>
      {action ? (
        <button type="button" className="btn btn--secondary" onClick={action.onClick}>
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
