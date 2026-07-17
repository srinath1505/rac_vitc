"use client";

import { useEffect, useRef, useState } from "react";
import { clubTimeline } from "@/content/history";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { mapRange } from "@/lib/utils";
import ClubTimeline from "./ClubTimeline";

const COUNT = clubTimeline.length;

// The source footage (10s @ 24fps, 240 frames) only grows fruit in its final
// ~0.8s (frames 220-239) — everything before that is seed -> full canopy with
// no fruit. Scroll progress is deliberately non-linear so that narrow window
// gets a fair share of scroll distance instead of flashing by in an instant.
const FRUIT_BREAK_P = 0.75; // scroll progress where the fruit segment begins
const FRUIT_BREAK_T = 220 / 24; // 9.1667s - full canopy, no fruit yet
const CLIP_END_T = 239 / 24; // 9.9583s - fruit filled in

function videoTimeFor(p: number) {
  return p < FRUIT_BREAK_P
    ? mapRange(p, 0, FRUIT_BREAK_P, 0, FRUIT_BREAK_T)
    : mapRange(p, FRUIT_BREAK_P, 1, FRUIT_BREAK_T, CLIP_END_T);
}

function yearColor(i: number) {
  const f = i / (COUNT - 1);
  if (f < 0.4) return "var(--forest)";
  if (f < 0.75) return "var(--fern)";
  return "var(--leaf)";
}

/**
 * The Growth Tree (§5.6) - the site's showpiece. A single real time-lapse
 * clip (seed -> fruiting tree) scrubbed by scroll, with each year's
 * president + awards surfacing as a text callout alongside it - no portrait
 * imagery tied to the tree itself. Degrades to the static ClubTimeline on
 * mobile / reduced motion (also the SSR output).
 */
export default function GrowthTree() {
  const [mode, setMode] = useState<"fallback" | "video">("fallback");
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (desktop && !reduced) setMode("video");
  }, []);

  // iOS Safari won't seek a video reliably until a play/pause cycle has run once.
  useEffect(() => {
    if (mode !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    v.play()
      .then(() => v.pause())
      .catch(() => {});
  }, [mode]);

  useIsomorphicLayoutEffect(() => {
    if (mode !== "video" || !sectionRef.current || !stageRef.current || !videoRef.current) return;
    const video = videoRef.current;

    const ctx = gsap.context(() => {
      let last = -1;
      ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: "top top",
        end: () => "+=" + COUNT * window.innerHeight * 0.55,
        pin: stageRef.current!,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          video.currentTime = videoTimeFor(p);
          const idx = Math.min(COUNT - 1, Math.floor(p * COUNT));
          if (idx !== last) {
            last = idx;
            setActive(idx);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [mode]);

  if (mode === "fallback") return <ClubTimeline />;

  const entry = clubTimeline[active];
  const color = yearColor(active);
  const hasAwards = entry.awards.length > 0;

  return (
    <div ref={sectionRef} className="relative">
      <div ref={stageRef} className="flex h-screen items-center overflow-hidden">
        <div className="u-container grid w-full grid-cols-12 items-center gap-10">
          {/* Video panel - framed, not seamless: the footage's own studio
              backdrop doesn't match the page's cream tone, so it reads as a
              deliberate panel (rounded, shadowed) rather than pretending to
              have no edges. */}
          <div className="col-span-6">
            <div className="overflow-hidden rounded-3xl border border-line shadow-[0_20px_60px_-20px_rgba(26,26,26,0.25)]">
              <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                poster="/club/growth-tree-poster.jpg"
                src="/club/growth-tree.mp4"
                aria-hidden="true"
                className="aspect-video w-full object-cover"
              />
            </div>
          </div>

          {/* Active year callout */}
          <div className="col-span-6">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
              Year {String(active + 1).padStart(2, "0")} / {COUNT}
            </span>
            <div className="mt-4" key={entry.year}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm" style={{ color }}>
                  {entry.year}
                </span>
                {entry.charter && (
                  <span className="rounded-full bg-forest/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-forest">
                    Charter
                  </span>
                )}
              </div>
              <h3 className="font-display text-2xl text-ink">{entry.president}</h3>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">President</p>

              {hasAwards ? (
                <div className="mt-5 border-t border-line pt-5">
                  <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold">
                    🏆 {entry.awards.length} award{entry.awards.length > 1 ? "s" : ""} this year
                  </span>
                  <ul className="mt-3 flex flex-col gap-2">
                    {entry.awards.map((a, i) => (
                      <li key={i} className="text-sm text-ink">
                        {a.title}
                        {a.recipient && <span className="text-ink-soft"> — {a.recipient}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-5 border-t border-line pt-5 text-sm text-ink-faint">
                  {entry.charter ? "The seed year — where it all began." : "A quiet year of steady growth."}
                </p>
              )}
            </div>

            {/* progress rail */}
            <div className="mt-8 flex gap-1.5">
              {clubTimeline.map((r, i) => (
                <span
                  key={r.year}
                  className="h-1 flex-1 rounded-full transition-colors duration-300"
                  style={{ background: i <= active ? yearColor(i) : "var(--line)" }}
                />
              ))}
            </div>

            {/* roots */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-6 text-xs text-ink-soft">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-forest" /> Rooted in the Rotary Club of Chennai Spotlight
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-fern" /> Part of RI District 3234
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
