"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface Props {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Scroll-gated 0 → target count-up. Renders the final value under reduced motion. */
export default function Counter({ to, suffix = "", duration = 2, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (n: number) => Math.round(n).toLocaleString("en-IN");
    el.textContent = format(to) + suffix;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const obj = { v: 0 };
    el.textContent = "0" + suffix;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: to,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = format(obj.v) + suffix;
          },
        }),
    });

    return () => st.kill();
  }, [to, suffix, duration]);

  return <span ref={ref} className={className}>0{suffix}</span>;
}
