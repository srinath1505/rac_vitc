/**
 * Central GSAP setup. Registers plugins once (client only) and exposes
 * shared easing/duration tokens so motion stays consistent site-wide.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared easing tokens (mirror the CSS custom props in globals.css). */
export const EASE = {
  out: "power3.out",
  inOut: "expo.inOut",
  soft: "power2.out",
  expoOut: "expo.out",
} as const;

export const DUR = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
} as const;

export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.09,
} as const;

export { gsap, ScrollTrigger, SplitText, Flip };
