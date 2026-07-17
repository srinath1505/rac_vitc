"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis, getLenis } from "@/lib/lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Single source of smooth scrolling. Lenis is driven by GSAP's ticker (one rAF
 * loop, no jank) and kept in sync with ScrollTrigger. Disabled entirely under
 * prefers-reduced-motion so nothing hijacks native scroll.
 */
export default function SmoothScroll() {
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Pins from multiple sections are created async (after images/fonts and
    // component state). Refresh once everything settles so pin ranges don't
    // overlap / drift.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 800);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 2000);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", onLoad);
      clearTimeout(t1);
      clearTimeout(t2);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // On route change: honour a #hash (deep-link to a section), else jump to top.
  useEffect(() => {
    const hash = window.location.hash;
    const lenis = getLenis();
    if (hash && document.querySelector(hash)) {
      // wait for layout + preloader, then scroll to the section
      const t = setTimeout(() => {
        const el = document.querySelector(hash) as HTMLElement | null;
        if (el) lenis ? lenis.scrollTo(el, { offset: -70 }) : el.scrollIntoView();
      }, 600);
      return () => clearTimeout(t);
    }
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
