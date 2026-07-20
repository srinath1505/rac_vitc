"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { cn } from "@/lib/utils";

/**
 * Subtle scroll parallax. Drifts its child vertically as the element passes
 * through the viewport. Best placed on an over-scanned image inside an
 * `overflow-hidden` frame so edges never show. Static under reduced motion.
 */
export default function Parallax({ children, className, amount = 10 }: { children: ReactNode; className?: string; amount?: number }) {
  const inner = useRef<HTMLDivElement>(null);

  const scope = useGsapContext(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!inner.current) return;
    gsap.fromTo(
      inner.current,
      { yPercent: -amount },
      {
        yPercent: amount,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
  }, [amount]);

  return (
    <div ref={scope} className={cn("h-full w-full", className)}>
      <div ref={inner} className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
