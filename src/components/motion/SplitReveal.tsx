"use client";

import { useRef, useState, createElement } from "react";
import type { ElementType, ReactNode } from "react";
import { gsap, SplitText, ScrollTrigger, EASE, STAGGER } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { isIntroDone } from "@/lib/intro";
import { cn } from "@/lib/utils";

type Trigger = "scroll" | "mount" | "preloader";

interface Props {
  children: ReactNode;
  as?: ElementType;
  type?: "lines" | "words" | "chars";
  stagger?: number;
  duration?: number;
  delay?: number;
  trigger?: Trigger;
  start?: string;
  className?: string;
}

/**
 * Masked text reveal built on GSAP SplitText. Lines/words/chars rise from a
 * clipped baseline on scroll / mount / preloader hand-off. Robust by design:
 * the font wait is capped, the reveal is guaranteed to play (safety timeout),
 * and it collapses to plain visible text under reduced motion.
 */
export default function SplitReveal({
  children,
  as = "div",
  type = "lines",
  stagger = STAGGER.base,
  duration = 0.9,
  delay = 0,
  trigger = "scroll",
  start = "top 85%",
  className,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      return;
    }

    let cancelled = false;
    let played = false;
    let split: SplitText | null = null;
    let st: ScrollTrigger | null = null;
    const cleanups: Array<() => void> = [];

    const build = () => {
      if (cancelled || !ref.current) return;
      const ctx = gsap.context(() => {
        split = new SplitText(el, {
          type,
          mask: type,
          linesClass: "split-line",
          wordsClass: "split-word",
          charsClass: "split-char",
        });
        const targets =
          type === "lines" ? split.lines : type === "words" ? split.words : split.chars;

        gsap.set(targets, { yPercent: 115 });
        setReady(true); // outer becomes visible; glyphs stay hidden inside masks

        const play = () => {
          if (played) return;
          played = true;
          gsap.to(targets, { yPercent: 0, duration, delay, ease: EASE.out, stagger });
        };

        if (trigger === "mount") {
          play();
        } else if (trigger === "scroll") {
          st = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: play });
        } else {
          // preloader / intro hand-off
          if (isIntroDone()) {
            play();
          } else {
            window.addEventListener("preloader:done", play, { once: true });
            cleanups.push(() => window.removeEventListener("preloader:done", play));
            const safety = window.setTimeout(play, 4000); // never leave text hidden
            cleanups.push(() => clearTimeout(safety));
          }
        }
      }, ref);
      cleanups.push(() => ctx.revert());
    };

    // Split after fonts settle, but never wait more than 400ms.
    const fontWait = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fontWait, new Promise((r) => setTimeout(r, 400))]).then(() => build());

    return () => {
      cancelled = true;
      cleanups.forEach((f) => f());
      st?.kill();
      split?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createElement(
    as,
    { ref, className: cn(className), style: { opacity: ready ? 1 : 0 } },
    children
  );
}
