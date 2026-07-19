"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { greenRotaractors } from "@/content/join";
import Button from "@/components/ui/Button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Orientation", "Learn the culture", "Build & grow", "Lead"];
const STAGE_NAME = ["Seed planted", "Sprouting", "Growing strong", "In full bloom"];
const EASE = "cubic-bezier(0.16,1,0.3,1)";

/** A leaf, positioned + rotated by attribute transform; the inner group scales
 *  in when `on` flips true so leaves unfurl as the plant grows. */
function Leaf({ x, y, rot, flip = false, on, delay = 0 }: { x: number; y: number; rot: number; flip?: boolean; on: boolean; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -1 : 1} 1)`}>
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "0% 100%",
          transform: on ? "scale(1)" : "scale(0)",
          opacity: on ? 1 : 0,
          transition: `transform 0.6s ${EASE} ${delay}s, opacity 0.4s ease ${delay}s`,
        }}
      >
        <path d="M0 0 C 4 -18 24 -24 40 -12 C 26 -2 10 -2 0 0 Z" fill="url(#jj-leaf)" />
        <path d="M2 -2 C 14 -8 26 -11 36 -12" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" fill="none" />
      </g>
    </g>
  );
}

/**
 * Green Rotaractors — "Plant your journey". An interactive seed-to-tree grower:
 * picking (or auto-cycling through) the four steps grows a real plant stage by
 * stage — stem draws upward, leaves unfurl, and it finally blooms on "Lead".
 * CSS-transition driven, so it degrades gracefully under reduced motion.
 */
export default function JoinJourney() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Gentle auto-grow until the visitor takes over.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % STEP_LABELS.length), 2600);
    return () => clearInterval(id);
  }, [paused]);

  const select = (i: number) => {
    setPaused(true);
    setActive(i);
  };

  const grow = 0.16 + (active / (STEP_LABELS.length - 1)) * 0.84;

  return (
    <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-center">
      {/* The growing plant */}
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-[linear-gradient(180deg,#f4fbee,#ffffff)]">
        <div className="flex items-end justify-center px-6 pt-8">
          <svg viewBox="0 0 240 300" className="h-[24rem] w-full max-w-[20rem]" role="img" aria-label={`Growth stage: ${STAGE_NAME[active]}`}>
            <defs>
              <linearGradient id="jj-stem" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--forest)" />
                <stop offset="100%" stopColor="var(--fern)" />
              </linearGradient>
              <linearGradient id="jj-leaf" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--fern)" />
                <stop offset="100%" stopColor="var(--leaf)" />
              </linearGradient>
            </defs>

            {/* soil */}
            <ellipse cx="120" cy="266" rx="82" ry="16" fill="#c9a36a" />
            <ellipse cx="120" cy="262" rx="82" ry="14" fill="#a9814f" />
            <ellipse cx="120" cy="259" rx="70" ry="9" fill="#8a6a3a" />

            {/* stem — draws upward with growth */}
            <path
              d="M120 260 C 108 222 132 198 120 160 C 108 124 132 98 120 60"
              fill="none"
              stroke="url(#jj-stem)"
              strokeWidth="6"
              strokeLinecap="round"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 - grow, transition: `stroke-dashoffset 0.7s ${EASE}` }}
            />

            {/* cotyledons at the base — always present once seeded */}
            <Leaf x={120} y={250} rot={20} on={active >= 0} />
            <Leaf x={120} y={250} rot={20} flip on={active >= 0} />

            {/* leaves unfurl up the stem */}
            <Leaf x={130} y={214} rot={-8} on={active >= 1} delay={0.05} />
            <Leaf x={110} y={172} rot={-8} flip on={active >= 2} delay={0.05} />
            <Leaf x={131} y={126} rot={-14} on={active >= 3} delay={0.05} />

            {/* bloom on the final stage */}
            <g
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                transform: active >= 3 ? "scale(1)" : "scale(0)",
                opacity: active >= 3 ? 1 : 0,
                transition: `transform 0.6s ${EASE} 0.15s, opacity 0.5s ease 0.15s`,
              }}
            >
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="120" cy="60" rx="7" ry="14" fill="var(--leaf)" transform={`rotate(${a} 120 60)`} />
              ))}
              <circle cx="120" cy="60" r="7" fill="var(--gold)" />
            </g>
          </svg>
        </div>

        {/* stage meter */}
        <div className="flex items-center gap-3 border-t border-line px-6 py-4">
          <div className="flex flex-1 gap-1.5">
            {STEP_LABELS.map((_, i) => (
              <span
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{ background: i <= active ? "var(--fern)" : "var(--line)", transition: `background 0.4s ${EASE}` }}
              />
            ))}
          </div>
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-fern">{STAGE_NAME[active]}</span>
        </div>
      </div>

      {/* The four steps */}
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-fern">{greenRotaractors.opportunitiesLead}</span>
        <div className="mt-4 flex flex-col gap-3" onMouseLeave={() => setPaused(true)}>
          {greenRotaractors.opportunities.map((o, i) => {
            const on = i === active;
            return (
              <button
                key={o}
                type="button"
                data-cursor="view"
                onMouseEnter={() => select(i)}
                onFocus={() => select(i)}
                onClick={() => select(i)}
                className={cn(
                  "group relative flex items-start gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500",
                  on ? "border-fern bg-paper-2 shadow-[0_20px_45px_-30px_rgba(10,89,51,0.6)]" : "border-line bg-transparent hover:border-fern/40"
                )}
              >
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 w-1 origin-top bg-gradient-to-b from-fern to-leaf transition-transform duration-500",
                    on ? "scale-y-100" : "scale-y-0"
                  )}
                />
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold transition-colors duration-500",
                    on ? "bg-fern text-white" : "bg-fern/10 text-fern"
                  )}
                >
                  {i + 1}
                </span>
                <span className="flex flex-col gap-1">
                  <span className={cn("font-display text-lg leading-tight transition-colors", on ? "text-ink" : "text-ink-soft")}>{STEP_LABELS[i]}</span>
                  <span className={cn("text-sm leading-relaxed transition-colors", on ? "text-ink-soft" : "text-ink-faint")}>{o}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-ink-soft">{greenRotaractors.closing}</p>
        <div className="mt-5">
          <Button href={site.registrationForm} external variant="primary" magnetic cursor="join">
            Plant your seed <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
