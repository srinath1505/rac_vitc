"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven marquee: the row drifts horizontally as the band scrolls
 * through the viewport (non-pinning, so it never collides with pinned sections).
 */
export default function ScrollMarquee({
  children,
  className,
  from = 8,
  to = -28,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || !inner.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { xPercent: from },
        {
          xPercent: to,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [from, to]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div ref={inner} className="flex w-max flex-nowrap items-center whitespace-nowrap">
        {children}
      </div>
    </div>
  );
}
