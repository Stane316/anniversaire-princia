/**
 * Déclarations ambiantes minimales pour les tests lisant la source
 * (environnement vitest "node" ; le projet n'embarque pas @types/node
 * et nous préférons ne pas ajouter de dépendance juste pour deux
 * imports typés). Signatures limitées à l'usage réel des tests.
 */
interface MinimalBuffer {
  readonly length: number;
  subarray(start: number, end?: number): MinimalBuffer;
  toString(encoding?: "utf8" | "ascii" | "hex"): string;
  readUInt32BE(offset: number): number;
}

declare module "node:fs" {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string, encoding: "utf8"): string;
  export function readFileSync(path: string): MinimalBuffer;
}

declare module "node:path" {
  export function resolve(...segments: string[]): string;
}

declare const __dirname: string;
