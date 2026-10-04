/**
 * Gestion de la barrière d'accès légère à 6 chiffres (§6.1–§6.3).
 *
 * Limite de sécurité documentée (§6.2) :
 * - Ce code à 6 chiffres (correspondant à la date 04-10-26) constitue une
 *   barrière d'accueil contre les ouvertures accidentelles, et non une
 *   authentification cryptographique ou serveur.
 * - Le code lui-même n'est JAMAIS stocké dans `localStorage` ni `sessionStorage`.
 * - Seul un marqueur d'ouverture de session (`sessionStorage`) est conservé
 *   pendant la durée de la session courante afin qu'un rafraîchissement de page
 *   ou la navigation entre les chapitres ne redemande pas le code à chaque clic,
 *   tout en redemandant le code lors d'une réouverture complète plus tard.
 */

const SESSION_UNLOCK_KEY = "princia.chapter18.accessSession.v1";
const SESSION_UNLOCK_TOKEN = "unlocked";

/**
 * Empreinte déterministe (FNV-1a 32-bit) utilisée pour comparer la saisie
 * à 6 chiffres sans conserver la chaîne littérale dans le stockage navigateur.
 * (Pour le code 041026 : hash = "e6ec91e0", longueur = 6.)
 */
const EXPECTED_CODE_LENGTH = 6;
const EXPECTED_CODE_HASH = "e6ec91e0";

let memoryUnlocked = false;

export function computeCodeDigest(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function verifyAccessCode(candidate: string): boolean {
  const normalized = candidate.trim();
  if (!/^\d{6}$/.test(normalized)) return false;
  if (normalized.length !== EXPECTED_CODE_LENGTH) return false;
  return computeCodeDigest(normalized) === EXPECTED_CODE_HASH;
}

export function hasUnlockedAccessSession(): boolean {
  if (memoryUnlocked) return true;
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      return window.sessionStorage.getItem(SESSION_UNLOCK_KEY) === SESSION_UNLOCK_TOKEN;
    }
  } catch {
    /* sessionStorage indisponible : repli mémoire */
  }
  return memoryUnlocked;
}

export function grantAccessSession(): void {
  memoryUnlocked = true;
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(SESSION_UNLOCK_KEY, SESSION_UNLOCK_TOKEN);
    }
  } catch {
    /* ignore */
  }
}

export function revokeAccessSession(): void {
  memoryUnlocked = false;
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.removeItem(SESSION_UNLOCK_KEY);
    }
  } catch {
    /* ignore */
  }
}
