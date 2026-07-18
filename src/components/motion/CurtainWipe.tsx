"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

/**
 * A signature fern curtain — wipes fully across a dark track as it scrolls
 * through view, echoing PageTransition's route-wipe language, with a short
 * tagline surfacing mid-wipe. A dramatic once-per-page beat between Team and
 * the Kadal Karai cinematic scene. Desktop + motion only; collapses to a
 * plain dark strip otherwise.
 */
export default function CurtainWipe() {
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const panel = panelRef.current;
    const text = textRef.current;
    if (!track || !panel || !text) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduced || !desktop) return;

    const ctx = gsap.context(() => {
      gsap.set(panel, { scaleY: 0, transformOrigin: "bottom" });
      gsap.set(text, { opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: { trigger: track, start: "top bottom", end: "bottom top", scrub: 0.7 },
        })
        .to(panel, { scaleY: 1, transformOrigin: "bottom", ease: "none" }, 0)
        .to(text, { opacity: 1, ease: "none" }, 0.32)
        .to(text, { opacity: 0, ease: "none" }, 0.55)
        .to(panel, { scaleY: 0, transformOrigin: "top", ease: "none" }, 0.5);
    }, track);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={trackRef} className="relative h-[46vh] w-full overflow-hidden bg-ink">
      <div ref={panelRef} className="absolute inset-0 bg-fern" />
      <span
        ref={textRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center font-display text-[clamp(1.5rem,4vw,2.75rem)] text-white"
      >
        Preserving Chennai&rsquo;s coastline, one cleanup at a time.
      </span>
    </div>
  );
}
