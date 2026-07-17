"use client";

import { useMediaQuery } from "./useMediaQuery";

/** True when the user prefers reduced motion — gate all flourish on this. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
