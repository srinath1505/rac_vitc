"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Compass, BookOpen, Sprout, Crown } from "lucide-react";
import { greenRotaractors } from "@/content/join";
import { site } from "@/content/site";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Orientation", icon: Compass },
  { label: "Learn the culture", icon: BookOpen },
  { label: "Build & grow", icon: Sprout },
  { label: "Lead", icon: Crown },
];
const STAGE_NAME = ["Seed planted", "Sprouting", "Growing strong", "In full bloom"];
const EASE = "cubic-bezier(0.16,1,0.3,1)";

/** A leaf placed + rotated by attribute transform; the inner group scales in
 *  (from its stem base) as the plant reaches its stage. */
function Leaf({ x, y, rot, flip = false, on, delay = 0 }: { x: number; y: number; rot: number; flip?: boolean; on: boolean; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -1 : 1} 1)`}>
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "0% 100%",
          transform: on ? "scale(1)" : "scale(0)",
          opacity: on ? 1 : 0,
          transition: `transform 0.7s ${EASE} ${delay}s, opacity 0.5s ease ${delay}s`,
        }}
      >
        <path d="M0 0 C 3 -20 26 -27 44 -13 C 28 -3 10 -2 0 0 Z" fill="url(#jj-leaf)" />
        <path d="M2 -2 C 15 -9 29 -12 40 -13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" fill="none" />
      </g>
    </g>
  );
}

/** A small flower/bud that pops at the final stage. */
function Bloom({ x, y, scale = 1, on, delay = 0, petalColor = "var(--leaf)" }: { x: number; y: number; scale?: number; on: boolean; delay?: number; petalColor?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: on ? "scale(1) rotate(0deg)" : "scale(0) rotate(-40deg)",
          opacity: on ? 1 : 0,
          transition: `transform 0.6s ${EASE} ${delay}s, opacity 0.5s ease ${delay}s`,
        }}
      >
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="0" rx="6.5" ry="13" fill={petalColor} transform={`rotate(${a}) translate(0 -9)`} />
        ))}
        <circle cx="0" cy="0" r="6.5" fill="var(--gold)" />
      </g>
    </g>
  );
}

/**
 * Green Rotaractors — "Plant your journey". A richer seed-to-tree grower:
 * picking (or auto-cycling through) the four steps grows a detailed plant
 * stage by stage — stem draws up, leaves unfurl, buds open, and it blooms on
 * "Lead" — with a soft grow-glow and drifting petals. CSS-transition driven,
 * so it degrades gracefully under reduced motion.
 */
export default function JoinJourney() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 2800);
    return () => clearInterval(id);
  }, [paused]);

  const select = (i: number) => {
    setPaused(true);
    setActive(i);
  };

  const grow = 0.14 + (active / (STEPS.length - 1)) * 0.86;

  return (
    <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
      {/* The growing plant */}
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-[linear-gradient(180deg,#eef8e6,#ffffff)]">
        {/* grow-glow — intensifies as the plant matures */}
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(122,201,67,0.35),transparent_70%)]"
          style={{ opacity: 0.25 + (active / (STEPS.length - 1)) * 0.6, transition: `opacity 0.7s ${EASE}` }}
          aria-hidden
        />

        {/* drifting petals (appear once there are flowers) */}
        {active >= 2 && (
          <>
            <span className="jj-petal pointer-events-none absolute bottom-24 left-[30%] h-2 w-2 rounded-full bg-leaf/70" style={{ ["--jj-dur" as string]: "6s", ["--jj-drift" as string]: "26px" }} aria-hidden />
            <span className="jj-petal pointer-events-none absolute bottom-28 left-[55%] h-1.5 w-1.5 rounded-full bg-gold/70" style={{ ["--jj-dur" as string]: "7.5s", ["--jj-drift" as string]: "-18px", animationDelay: "1.4s" }} aria-hidden />
            <span className="jj-petal pointer-events-none absolute bottom-20 left-[45%] h-2 w-2 rounded-full bg-fern/60" style={{ ["--jj-dur" as string]: "8s", ["--jj-drift" as string]: "14px", animationDelay: "3s" }} aria-hidden />
          </>
        )}

        <div className="relative flex items-end justify-center px-6 pt-8">
          <svg viewBox="0 0 260 320" className="h-[25rem] w-full max-w-[20rem]" role="img" aria-label={`Growth stage: ${STAGE_NAME[active]}`}>
            <defs>
              <linearGradient id="jj-stem" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--forest)" />
                <stop offset="100%" stopColor="var(--fern)" />
              </linearGradient>
              <linearGradient id="jj-leaf" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--fern)" />
                <stop offset="100%" stopColor="var(--leaf)" />
              </linearGradient>
              <linearGradient id="jj-pot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c96f3f" />
                <stop offset="100%" stopColor="#a4552b" />
              </linearGradient>
            </defs>

            {/* terracotta pot */}
            <path d="M92 258 L168 258 L160 312 L100 312 Z" fill="url(#jj-pot)" />
            <rect x="86" y="248" width="88" height="16" rx="4" fill="#b35f31" />
            {/* soil */}
            <ellipse cx="130" cy="252" rx="40" ry="7" fill="#6f4a26" />

            {/* stem — draws upward with growth */}
            <path
              d="M130 252 C 116 214 142 190 130 152 C 118 116 142 92 130 58"
              fill="none"
              stroke="url(#jj-stem)"
              strokeWidth="6.5"
              strokeLinecap="round"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 1 - grow, transition: `stroke-dashoffset 0.8s ${EASE}` }}
            />

            {/* cotyledons at the base */}
            <Leaf x={130} y={244} rot={22} on={active >= 0} />
            <Leaf x={130} y={244} rot={22} flip on={active >= 0} />

            {/* leaves up the stem (more of them, staggered) */}
            <Leaf x={140} y={210} rot={-6} on={active >= 1} delay={0.05} />
            <Leaf x={120} y={192} rot={-6} flip on={active >= 1} delay={0.12} />
            <Leaf x={142} y={162} rot={-12} on={active >= 2} delay={0.05} />
            <Leaf x={118} y={144} rot={-12} flip on={active >= 2} delay={0.12} />
            <Leaf x={140} y={116} rot={-18} on={active >= 3} delay={0.05} />

            {/* side buds + crowning bloom */}
            <Bloom x={150} y={128} scale={0.62} on={active >= 3} delay={0.15} petalColor="var(--fern)" />
            <Bloom x={110} y={110} scale={0.6} on={active >= 3} delay={0.22} petalColor="var(--leaf)" />
            <Bloom x={130} y={56} scale={1.05} on={active >= 3} delay={0.05} />
          </svg>
        </div>

        {/* stage meter */}
        <div className="relative flex items-center gap-3 border-t border-line px-6 py-4">
          <div className="flex flex-1 gap-1.5">
            {STEPS.map((_, i) => (
              <span key={i} className="h-1.5 flex-1 rounded-full" style={{ background: i <= active ? "var(--fern)" : "var(--line)", transition: `background 0.4s ${EASE}` }} />
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
            const Icon = STEPS[i].icon;
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
                <span className={cn("absolute inset-y-0 left-0 w-1 origin-top bg-gradient-to-b from-fern to-leaf transition-transform duration-500", on ? "scale-y-100" : "scale-y-0")} />
                <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-500", on ? "bg-fern text-white" : "bg-fern/10 text-fern")}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className={cn("flex items-center gap-2 font-display text-lg leading-tight transition-colors", on ? "text-ink" : "text-ink-soft")}>
                    <span className="font-mono text-xs text-fern">{String(i + 1).padStart(2, "0")}</span>
                    {STEPS[i].label}
                  </span>
                  <span className={cn("text-sm leading-relaxed transition-colors", on ? "text-ink-soft" : "text-ink-faint")}>{o}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {["No experience needed", "Any year welcome", "Free to join"].map((c) => (
            <span key={c} className="rounded-full border border-line bg-paper-2 px-3 py-1.5 text-xs text-ink-soft">{c}</span>
          ))}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ink-soft">{greenRotaractors.closing}</p>
        <div className="mt-5">
          <Button href={site.registrationForm} external variant="primary" magnetic cursor="join">
            Plant your seed <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
