"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface Props {
  panels: ReactNode[];
  className?: string;
}

/**
 * Pins a section and scrubs its panels horizontally as the user scrolls
 * vertically (Dragon-Scroll technique). Un-pins to a vertical stack on mobile /
 * reduced motion — which is also the SSR output, so no hydration mismatch.
 */
export default function HorizontalPin({ panels, className }: Props) {
  const [pin, setPin] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (desktop && !reduced) setPin(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!pin || !sectionRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: () => "+=" + (track.scrollWidth - window.innerWidth),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [pin]);

  if (!pin) {
    return (
      <div className={className}>
        <div className="flex flex-col gap-6 u-container">
          {panels.map((p, i) => (
            <div key={i}>{p}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className={`relative h-screen overflow-hidden ${className ?? ""}`}>
      <div ref={trackRef} className="flex h-screen items-center">
        {panels.map((p, i) => (
          <div
            key={i}
            className="flex h-full shrink-0 items-center px-[clamp(1.5rem,5vw,6rem)]"
            style={{ width: "min(86vw, 900px)" }}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
