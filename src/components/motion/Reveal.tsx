"use client";

import { useRef, createElement } from "react";
import type { ElementType, ReactNode } from "react";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  duration?: number;
  delay?: number;
  /** When set, staggers the element's direct children instead of itself. */
  stagger?: number;
  start?: string;
}

/** Fade + rise on scroll. With `stagger`, animates direct children in sequence. */
export default function Reveal({
  children,
  as = "div",
  className,
  y = 28,
  duration = 0.9,
  delay = 0,
  stagger,
  start = "top 85%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : el;
      gsap.from(targets, {
        y,
        opacity: 0,
        duration,
        delay,
        ease: EASE.out,
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [y, duration, delay, stagger, start]);

  return createElement(as, { ref, className }, children);
}
