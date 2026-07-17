import type Lenis from "lenis";

/**
 * Module-level handle to the single Lenis instance so non-scroll code
 * (preloader, modals, gallery lightbox) can stop/start smooth scrolling.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

export const stopScroll = () => instance?.stop();
export const startScroll = () => instance?.start();
export const scrollToTop = (immediate = true) =>
  instance?.scrollTo(0, { immediate });

/** Smooth-scroll to a section by "#id" selector, offset for the fixed header. */
export const scrollToSection = (selector: string, offset = -70) => {
  if (typeof document === "undefined") return;
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset, duration: 1.2 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
};
