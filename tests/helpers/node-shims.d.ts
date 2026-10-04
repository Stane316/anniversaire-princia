/**
 * Déclarations ambiantes minimales pour les tests lisant la source
 * (environnement vitest "node" ; le projet n'embarque pas @types/node
 * et nous préférons ne pas ajouter de dépendance juste pour deux
 * imports typés). Signatures limitées à l'usage réel des tests.
 */
declare module "node:fs" {
  export function readFileSync(path: string, encoding: "utf8"): string;
}

declare module "node:path" {
  export function resolve(...segments: string[]): string;
}

declare const __dirname: string;
