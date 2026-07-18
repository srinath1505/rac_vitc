"use client";

import { useRef } from "react";
import { Leaf } from "lucide-react";
import { greenRotaractors } from "@/content/join";
import { gsap, ScrollTrigger, EASE } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

const STEPS = ["Orientation", "Learn the culture", "Build & grow", "Lead"];

/**
 * Green Rotaractors — the 4 opportunities as stops along a vine that draws
 * itself in as the section scrolls (stroke-dashoffset scrub), each stop
 * popping a leaf node. Reduced motion → static full vine, everything visible.
 */
export default function JoinJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || !path) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: reduced ? 0 : length });

    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 70%", scrub: 0.6 },
      });

      gsap.utils.toArray<HTMLElement>(".join-node").forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.45,
            ease: EASE.out,
            immediateRender: false,
            scrollTrigger: { trigger: node, start: "top 78%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".join-card").forEach((card) => {
        gsap.from(card, {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: EASE.out,
          immediateRender: false,
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <span className="font-mono text-xs uppercase tracking-widest text-fern">{greenRotaractors.opportunitiesLead}</span>

      <div className="relative mt-6 flex flex-col gap-8 pl-12 sm:pl-14">
        {/* the vine */}
        <svg
          className="pointer-events-none absolute left-1 top-2 h-[calc(100%-1rem)] w-8"
          viewBox="0 0 24 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            ref={pathRef}
            d="M12 0 C 8 10, 16 20, 12 30 C 8 40, 16 50, 12 60 C 8 70, 16 80, 12 90 L 12 100"
            fill="none"
            stroke="url(#join-vine-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <defs>
            <linearGradient id="join-vine-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--forest)" />
              <stop offset="100%" stopColor="var(--leaf)" />
            </linearGradient>
          </defs>
        </svg>

        {greenRotaractors.opportunities.map((o, i) => (
          <div key={o} className="relative flex items-start gap-4">
            <span className="join-node absolute -left-12 top-0 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fern text-white shadow-[0_8px_20px_-8px_rgba(11,143,63,0.6)] sm:-left-14">
              <Leaf className="h-4 w-4" />
            </span>
            <div className="join-card flex-1 rounded-2xl border border-line bg-paper p-6 transition-colors duration-300 hover:border-fern/40">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-fern">{STEPS[i] ?? `Step ${i + 1}`}</span>
              <p className="mt-2 text-ink">{o}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
