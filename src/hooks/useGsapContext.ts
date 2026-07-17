"use client";

import { useRef } from "react";
import type { DependencyList } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Scoped GSAP context. Runs `setup` inside a gsap.context() bound to the
 * returned ref, and auto-reverts on unmount / dep change — the critical piece
 * for surviving App Router route changes without leaking ScrollTriggers.
 *
 *   const scope = useGsapContext(() => { gsap.to(".x", {...}); });
 *   return <section ref={scope}>...</section>
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: gsap.Context) => void | (() => void),
  deps: DependencyList = []
) {
  const scope = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    if (!scope.current) return;
    const ctx = gsap.context(setup, scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
