/** Identifiants stables pour les entités persistantes (doc 03 §8.7). */
export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Horodatage normalisé ISO 8601 (UTC) pour createdAt / updatedAt. */
export function nowIso(): string {
  return new Date().toISOString();
}
