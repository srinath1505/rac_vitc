"use client";

import { useEffect, useRef, useState } from "react";
import { coreTeam } from "@/content/team";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import Placeholder from "@/components/ui/Placeholder";
import Badge from "@/components/ui/Badge";
import Eyebrow from "@/components/ui/Eyebrow";

/**
 * Meet the Team — pinned horizontal scroll (Dragon-Scroll technique). Scrolling
 * drives the full 15-person board sideways so every member is seen. Falls back
 * to a native horizontal-scroll strip on mobile / reduced motion.
 */
export default function TeamScroll() {
  const [pin, setPin] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (desktop && !reduced) setPin(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!pin || !triggerRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const distance = () => track.scrollWidth - window.innerWidth + 96;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current!,
          start: "top top",
          end: () => "+=" + distance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, triggerRef);
    return () => ctx.revert();
  }, [pin]);

  const cards = coreTeam.map((m, i) => (
    <article key={m.role} className="group flex w-[280px] shrink-0 flex-col gap-4 sm:w-[320px]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line">
        <Placeholder seed={m.role} label={m.name} kind="person" className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-ink">{m.year}</span>
        {!m.confirmed && <span className="absolute right-3 top-3"><Badge tone="ink">Seat filling</Badge></span>}
        <span className="absolute bottom-3 right-3 font-mono text-xs text-paper/80">{String(i + 1).padStart(2, "0")}</span>
      </div>
      <div>
        <h3 className="font-display text-2xl text-ink">{m.name}</h3>
        <p className="text-sm text-fern">{m.role}</p>
      </div>
    </article>
  ));

  if (!pin) {
    return (
      <div className="py-20">
        <div className="u-container mb-8">
          <Eyebrow number="03">Meet the Team</Eyebrow>
          <h2 className="u-display mt-2 text-[clamp(1.75rem,7vw,3rem)] text-ink">The people behind the impact.</h2>
        </div>
        <div className="flex snap-x gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none]">
          {cards}
        </div>
      </div>
    );
  }

  return (
    <div ref={triggerRef} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="u-container mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow number="03">Meet the Team</Eyebrow>
            <h2 className="u-display mt-2 text-[clamp(1.75rem,4vw,3rem)] text-ink">The people behind the impact.</h2>
          </div>
          <span className="hidden font-mono text-xs uppercase tracking-widest text-ink-faint sm:block">Scroll to meet everyone →</span>
        </div>
        <div ref={trackRef} className="flex w-max items-center gap-6 pl-6 pr-24 sm:pl-[8vw]">
          {cards}
        </div>
      </div>
    </div>
  );
}
