"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";

interface Props {
  /** Fill colour of the wave — matches the section this divider leads INTO. */
  tone?: "paper" | "paper-2" | "ink";
  className?: string;
}

const FILL: Record<NonNullable<Props["tone"]>, string> = {
  paper: "var(--paper)",
  "paper-2": "var(--paper-2)",
  ink: "var(--ink)",
};

/**
 * Organic wave seam between two sections — a leaf drifts along the crest as
 * the seam scrolls through view. Non-pinning (scrub only), so it never
 * collides with pinned neighbours. Static under reduced motion.
 */
export default function SectionDivider({ tone = "paper", className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || !leafRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leafRef.current,
        { xPercent: -160, rotate: -10 },
        {
          xPercent: 60,
          rotate: 12,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={cn("relative h-16 w-full overflow-hidden sm:h-24", className)} aria-hidden>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          d="M0 60 C 240 110, 480 10, 720 60 C 960 110, 1200 10, 1440 60 L1440 120 L0 120 Z"
          fill={FILL[tone]}
        />
      </svg>
      <span ref={leafRef} className="pointer-events-none absolute left-1/2 top-1/3 text-xl opacity-70 sm:text-2xl">
        🌿
      </span>
    </div>
  );
}
