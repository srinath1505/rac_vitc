"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Clock } from "lucide-react";
import { signatureProject } from "@/content/projects";
import { nextKadalKaraiEvent } from "@/content/events";
import { formatEventDate } from "@/lib/utils";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import Placeholder from "@/components/ui/Placeholder";
import KadalKarai from "./KadalKarai";

/**
 * Kadal Karai — pinned parallax scene (§5.9). A sticky stage holds the title
 * while beach strips drift and an ocean overlay scrubs away to reveal the
 * photos. Falls back to the static teaser on mobile / reduced motion.
 */
// Field-log HUD target — a plausible per-drive haul, not the lifetime total
// already shown in the big pinned stats (5,000kg+). Ticks up as its own beat
// so the two numbers read as "one drive" vs. "the whole campaign."
const HUD_KG_TARGET = 42;

export default function KadalKaraiScene() {
  const [enhanced, setEnhanced] = useState(false);
  const hudKgRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (desktop && !reduced) setEnhanced(true);
  }, []);

  // useGsapContext's setup only ever runs once its returned scope ref is
  // attached to an element (it no-ops otherwise) — attach it below instead of
  // the plain useRef this used to hold, or every animation here (not just the
  // new HUD counter) silently never plays.
  const scope = useGsapContext<HTMLDivElement>(
    () => {
      if (!enhanced || !scope.current) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom bottom", scrub: 1 },
      });
      tl.to(".kk-strip", { xPercent: -18, ease: "none" }, 0);
      tl.to(".kk-strip-2", { xPercent: 12, ease: "none" }, 0);
      tl.fromTo(".kk-overlay", { opacity: 0.9 }, { opacity: 0.25, ease: "none" }, 0);
      tl.fromTo(".kk-title", { scale: 1.14 }, { scale: 1, ease: "none" }, 0);
      tl.from(".kk-stat", { yPercent: 60, opacity: 0, stagger: 0.12, ease: "power2.out" }, 0.45);
      tl.from(".kk-hud", { opacity: 0, y: -12, ease: "power2.out" }, 0.1);
      const hud = { kg: 0 };
      tl.to(
        hud,
        {
          kg: HUD_KG_TARGET,
          ease: "power1.out",
          onUpdate: () => {
            if (hudKgRef.current) hudKgRef.current.textContent = String(Math.round(hud.kg));
          },
        },
        0.15
      );
    },
    [enhanced]
  );

  if (!enhanced) return <KadalKarai />;

  const p = signatureProject;
  const nextDrive = nextKadalKaraiEvent;

  return (
    <div ref={scope} className="relative h-[165vh]">
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

        {/* live field-log HUD — this drive's own numbers, distinct from the
            campaign-lifetime stats pinned center-stage */}
        <div className="kk-hud absolute left-6 top-24 z-20 hidden flex-col gap-1.5 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur sm:flex md:left-10 md:top-28">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[#8fe9dd]">Field Log · Live</span>
          {nextDrive && (
            <>
              <span className="flex items-center gap-2 text-xs text-white/80">
                <MapPin className="h-3 w-3 shrink-0 text-[#8fe9dd]" /> {nextDrive.location}
              </span>
              <span className="flex items-center gap-2 text-xs text-white/80">
                <Clock className="h-3 w-3 shrink-0 text-[#8fe9dd]" /> {nextDrive.time}
              </span>
            </>
          )}
          <span className="mt-1 flex items-baseline gap-1.5">
            <span className="u-display text-xl text-[#8fe9dd]"><span ref={hudKgRef}>0</span>kg</span>
            <span className="font-mono text-[0.6rem] uppercase tracking-wider text-white/50">this drive</span>
          </span>
        </div>

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
