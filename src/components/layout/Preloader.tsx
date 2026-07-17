"use client";

import { useRef, useState } from "react";
import { gsap, EASE } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { stopScroll, startScroll } from "@/lib/lenis";
import { setIntroDone } from "@/lib/intro";
import { site } from "@/content/site";

const SCRIBBLE_D =
  "M299.654 453.865C505.574 319.225 711.494 184.585 836.054 109.945C960.614 35.3048 997.574 24.7448 944.014 110.385C890.454 196.025 745.254 378.185 571.454 634.385C397.654 890.585 199.654 1215.3 110.854 1382.58C22.0544 1549.86 48.4544 1549.86 77.8944 1540.62C107.334 1531.38 139.014 1512.9 367.854 1319.9C596.694 1126.9 1021.73 759.945 1255.21 555.065C1488.69 350.185 1517.73 318.505 1527.41 306.145C1537.09 293.785 1526.53 301.705 1346.85 618.625C1167.17 935.545 818.694 1561.22 635.214 1896.74C451.734 2232.26 443.814 2258.66 447.654 2268.3C451.494 2277.94 467.334 2270.02 511.134 2236.9C554.934 2203.78 626.214 2145.7 966.534 1817.46C1306.85 1489.22 1914.05 892.585 2263.81 557.505C2613.57 222.425 2687.49 166.985 2741.41 129.185C2795.33 91.3848 2827.01 72.9048 2843.33 67.3448C2859.65 61.7848 2859.65 69.7048 2849.09 96.2248C2838.53 122.745 2817.41 167.625 2584.77 544.505C2352.13 921.385 1370.37 2165.43 1139.25 2537.83C908.134 2910.23 902.854 2926.07 902.774 2939.51C902.694 2952.95 907.974 2963.51 1255.21 2613.87C1602.45 2264.23 2829.73 1017.54 2903.53 1071.46C2977.33 1125.38 2176.12 2817.04 2128 3037C2079.88 3256.96 2911.24 2018.56 3172 1793";

// muted, theme-related greens (no bright orange / yellow / blue)
const SCRIBBLE_COLORS = ["#0a5933", "#0b8f3f", "#0d3b24", "#356234", "#5c5a2a"];

/**
 * Intro sequence: a 0→100 counter, a clip-path reveal, then a Truus-style
 * scribble that draws in and out over the page before the hero reveals
 * ("preloader:done"). Replays on every reload; instant under reduced motion.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const scribbleSvgRef = useRef<SVGSVGElement>(null);
  const scribblePathRef = useRef<SVGPathElement>(null);

  useIsomorphicLayoutEffect(() => {
    const finish = () => {
      setIntroDone();
      window.dispatchEvent(new Event("preloader:done"));
      startScroll();
      setDone(true);
    };

    stopScroll();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const ctx = gsap.context(() => {
      const path = scribblePathRef.current!;
      const svg = scribbleSvgRef.current!;
      const L = path.getTotalLength() + 5;
      svg.style.color = SCRIBBLE_COLORS[Math.floor(Math.random() * SCRIBBLE_COLORS.length)];
      gsap.set(path, { strokeDasharray: L, strokeDashoffset: L, strokeWidth: 20, opacity: 1 });

      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      // 1 — counter
      tl.to(counter, {
        v: 100,
        duration: 1.5,
        ease: "power1.inOut",
        onUpdate: () => {
          if (numRef.current) numRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`;
        },
      });
      // 2 — scribble draws in BEHIND the cream overlay, growing until it fully
      //     covers the screen (thick stroke fills the viewport)
      tl.to(path, { strokeDashoffset: 0, strokeWidth: 3200, duration: 1.5, ease: "power1.inOut" }, 0.5);
      // 3 — overlay text out, then clip the cream overlay away → the full-cover
      //     scribble is now what's on screen
      tl.to(".pl-fade", { yPercent: -110, opacity: 0, duration: 0.5, ease: EASE.out, stagger: 0.05 }, 1.5);
      tl.to(rootRef.current, { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", duration: 0.7, ease: "expo.inOut" }, ">-0.1");
      // 4 — hold at full cover, then draw the scribble out SMOOTHLY to reveal the hero
      tl.to(path, { strokeDashoffset: -L, strokeWidth: 20, duration: 2.1, ease: "power2.inOut" }, ">+0.2");
    });

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <>
      {/* scribble layer (revealed after the cream overlay clips away) */}
      <svg
        ref={scribbleSvgRef}
        className="pointer-events-none fixed inset-0 z-[9998] h-full w-full"
        viewBox="0 0 3222 3114"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path ref={scribblePathRef} d={SCRIBBLE_D} stroke="currentColor" strokeLinecap="round" style={{ strokeWidth: 0 }} />
      </svg>

      {/* cream counter overlay */}
      <div
        ref={rootRef}
        id="preloader"
        className="fixed inset-0 z-[9999] flex flex-col justify-between bg-paper p-8 sm:p-12"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        <div className="pl-fade flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">{site.shortName}</span>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">{site.district}</span>
        </div>
        <div className="pl-fade flex flex-col gap-6">
          <span className="u-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.95] text-ink">
            Service Above Self.
            <br />
            <span className="text-fern">Leadership Beyond Limits.</span>
          </span>
          <div className="h-px w-full bg-line">
            <span ref={barRef} className="block h-full origin-left bg-fern" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
        <div className="pl-fade flex items-end justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">Loading experience</span>
          <span className="u-display text-[clamp(3rem,10vw,7rem)] leading-none text-ink">
            <span ref={numRef}>000</span>
            <span className="text-fern">%</span>
          </span>
        </div>
      </div>
    </>
  );
}
