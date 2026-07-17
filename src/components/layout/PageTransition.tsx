"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

/**
 * Route-change wipe (§3.6): a fern panel sweeps up over the viewport and back,
 * so navigation reads as intentional. Skipped on the first load (the preloader
 * owns that) and under reduced motion.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useIsomorphicLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .set(panel, { display: "block", scaleY: 0, transformOrigin: "bottom" })
        .to(panel, { scaleY: 1, duration: 0.45, ease: "expo.inOut" })
        .set(panel, { transformOrigin: "top" })
        .to(panel, { scaleY: 0, duration: 0.55, ease: "expo.inOut" }, "+=0.05")
        .set(panel, { display: "none" });
    });
    return () => ctx.revert();
  }, [pathname]);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[500] hidden bg-fern"
      aria-hidden
      style={{ pointerEvents: "none" }}
    />
  );
}
