/** Tiny className joiner (no clsx dependency). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const mapRange = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => outMin + ((v - inMin) * (outMax - outMin)) / (inMax - inMin);

/** Deterministic 0..1 pseudo-random from a string seed (stable across renders). */
export function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // xorshift finalize → 0..1
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967295;
}

/** Seeded value in [min, max]. */
export const seededRange = (seed: string, min: number, max: number) =>
  min + seededRandom(seed) * (max - min);

/** Deterministic LOCAL image from the bundled /public pools. */
export const FACE_COUNT = 20;
export const SCENE_COUNT = 24;
export const faceUrl = (seed: string) => `/faces/f${Math.floor(seededRandom(seed + "p") * FACE_COUNT) + 1}.jpg`;
export const sceneUrl = (seed: string) => `/scenes/s${Math.floor(seededRandom(seed + "s") * SCENE_COUNT) + 1}.jpg`;
