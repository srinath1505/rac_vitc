"use client";

import { useEffect, useRef, useState } from "react";
import { signatureProject } from "@/content/projects";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import Placeholder from "@/components/ui/Placeholder";
import KadalKarai from "./KadalKarai";

/**
 * Kadal Karai — pinned parallax scene (§5.9). A sticky stage holds the title
 * while beach strips drift and an ocean overlay scrubs away to reveal the
 * photos. Falls back to the static teaser on mobile / reduced motion.
 */
export default function KadalKaraiScene() {
  const [enhanced, setEnhanced] = useState(false);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (desktop && !reduced) setEnhanced(true);
  }, []);

  useGsapContext(
    () => {
      if (!enhanced || !outerRef.current) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: outerRef.current, start: "top top", end: "bottom bottom", scrub: 1 },
      });
      tl.to(".kk-strip", { xPercent: -18, ease: "none" }, 0);
      tl.to(".kk-strip-2", { xPercent: 12, ease: "none" }, 0);
      tl.fromTo(".kk-overlay", { opacity: 0.9 }, { opacity: 0.25, ease: "none" }, 0);
      tl.fromTo(".kk-title", { scale: 1.14 }, { scale: 1, ease: "none" }, 0);
      tl.from(".kk-stat", { yPercent: 60, opacity: 0, stagger: 0.12, ease: "power2.out" }, 0.45);
    },
    [enhanced]
  );

  if (!enhanced) return <KadalKarai />;

  const p = signatureProject;

  return (
    <div ref={outerRef} className="relative h-[165vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#06273a] text-white">
        {/* parallax photo strips */}
        <div className="kk-strip absolute inset-x-[-10%] top-[12%] flex gap-4 opacity-90">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-56 w-[28vw] shrink-0 overflow-hidden rounded-2xl">
              <Placeholder seed={`kk-a-${i}`} label="Kadal Karai" kind="scene" className="h-full w-full" />
            </div>
          ))}
        </div>
        <div className="kk-strip-2 absolute inset-x-[-10%] bottom-[10%] flex gap-4 opacity-90">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-56 w-[28vw] shrink-0 overflow-hidden rounded-2xl">
              <Placeholder seed={`kk-b-${i}`} label="Beach cleanup" kind="scene" className="h-full w-full" />
            </div>
          ))}
        </div>

        {/* ocean overlay */}
        <div
          className="kk-overlay absolute inset-0"
          style={{ background: "linear-gradient(180deg,#06273a,#0a3d5c 60%,#116a72)" }}
        />

        {/* pinned title + stats */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#8fe9dd]">Signature Project</span>
          <h2 className="kk-title u-display text-[clamp(3rem,14vw,12rem)] leading-[0.85]">Kadal Karai</h2>
          <p className="max-w-xl text-white/80">{p.tagline}</p>
          <div className="mt-4 flex gap-10">
            {p.stats?.map((s) => (
              <div key={s.label} className="kk-stat flex flex-col">
                <span className="u-display text-4xl text-[#8fe9dd]">
                  {s.value.toLocaleString("en-IN")}{s.suffix}
                </span>
                <span className="text-xs text-white/60">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
