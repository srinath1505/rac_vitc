"use client";

import { useRef, createElement } from "react";
import type { ElementType, ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Positive drifts slower (up), negative faster. Fraction of viewport. */
  speed?: number;
}

/** Scroll-scrubbed vertical parallax. No-op under reduced motion. */
export default function Parallax({ children, as = "div", className, speed = 0.15 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 100 },
        {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [speed]);

  return createElement(as, { ref, className }, children);
}
