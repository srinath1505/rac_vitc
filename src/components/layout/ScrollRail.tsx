"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { getLenis, scrollToSection } from "@/lib/lenis";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "club", label: "About" },
  { id: "avenues", label: "Avenues" },
  { id: "team", label: "Team" },
  { id: "projects", label: "Projects" },
  { id: "events", label: "Events" },
  { id: "gallery", label: "Gallery" },
  { id: "join", label: "Join" },
  { id: "partner", label: "Partner" },
];

/**
 * Growing-vine scroll progress rail. A forest→leaf vine fills top-to-bottom
 * with page scroll progress, a leaf marker rides the growing tip, and
 * section tick-marks (positioned at each section's real scroll offset)
 * double as click-to-jump nav. Fine-pointer desktop only; renders nothing
 * under reduced motion, on touch, or off the home page — leaving the native
 * scrollbar as the fallback everywhere else.
 */
export default function ScrollRail() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [offsets, setOffsets] = useState<number[]>(() => SECTIONS.map(() => 0));
  const [hover, setHover] = useState<number | null>(null);
  const offsetsRef = useRef(offsets);
  offsetsRef.current = offsets;

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onHome = pathname === "/";
    if (!fine || reduced || !onHome) return;

    setEnabled(true);
    document.documentElement.classList.add("has-scroll-rail");

    const measure = () => {
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const next = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return 0;
        const top = el.getBoundingClientRect().top + window.scrollY - 76;
        return Math.min(1, Math.max(0, top / total));
      });
      setOffsets(next);
    };
    measure();
    window.addEventListener("resize", measure);
    const t1 = window.setTimeout(measure, 800);
    const t2 = window.setTimeout(measure, 2000);

    const tick = () => {
      const lenis = getLenis();
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = lenis ? lenis.progress : window.scrollY / total;
      setProgress(p);
      setActive((prevActive) => {
        let idx = 0;
        for (let i = 0; i < offsetsRef.current.length; i++) {
          if (p >= offsetsRef.current[i] - 0.015) idx = i;
        }
        return idx !== prevActive ? idx : prevActive;
      });
    };
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t1);
      clearTimeout(t2);
      gsap.ticker.remove(tick);
      document.documentElement.classList.remove("has-scroll-rail");
    };
  }, [pathname]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed right-5 top-1/2 z-[350] hidden -translate-y-1/2 lg:block">
      <div className="relative h-[46vh] max-h-[520px] w-6">
        {/* track */}
        <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-[var(--line-strong)]" />
        {/* vine fill */}
        <div
          className="absolute left-1/2 top-0 w-[3px] -translate-x-1/2 rounded-full"
          style={{
            height: `${progress * 100}%`,
            background: "linear-gradient(to bottom, var(--forest), var(--fern) 55%, var(--leaf))",
          }}
        />
        {/* leaf marker at the growing tip */}
        <span
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm"
          style={{ top: `${progress * 100}%` }}
          aria-hidden
        >
          🌿
        </span>

        {/* section ticks */}
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(`#${s.id}`)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover((h) => (h === i ? null : h))}
            aria-label={`Jump to ${s.label}`}
            className="pointer-events-auto absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5"
            style={{ top: `${offsets[i] * 100}%` }}
          >
            <span
              className={cn(
                "block rounded-full border-2 border-paper transition-all duration-300",
                i === active
                  ? "h-3 w-3 bg-fern shadow-[0_0_0_3px_rgba(11,143,63,0.25)]"
                  : "h-2 w-2 bg-[var(--line-strong)] hover:bg-fern/60"
              )}
            />
            <span
              className={cn(
                "pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-paper transition-opacity duration-200",
                hover === i || i === active ? "opacity-100" : "opacity-0"
              )}
            >
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
