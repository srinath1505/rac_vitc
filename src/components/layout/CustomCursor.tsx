"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type CursorKind = "default" | "drag" | "view" | "open" | "close" | "join" | "link" | "home";

const LABELS: Partial<Record<CursorKind, string>> = {
  drag: "Drag",
  view: "View",
  open: "Open",
  close: "Close",
  join: "Join",
};

/**
 * Bold custom cursor: a lagging ring + a tight dot. Over any [data-cursor]
 * element (or link/button) the ring swells and shows a contextual label. The
 * DOM is ALWAYS rendered so refs exist before tracking is wired (the earlier
 * bug hid the native cursor while the custom dot sat dead in the corner).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<CursorKind>("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return; // touch → keep native cursor, render nothing custom

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    // start centred so it's never stuck in the corner
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const interactive = (e.target as HTMLElement)?.closest?.("a,button,[role=button],input,textarea");
      if (el) setKind((el.dataset.cursor as CursorKind) || "link");
      else setKind(interactive ? "link" : "default");
    };
    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  const label = LABELS[kind];
  const big = kind === "drag" || kind === "view" || kind === "open" || kind === "close" || kind === "join";

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[400]"
      style={{ opacity: enabled ? 1 : 0 }}
      aria-hidden
    >
      <div
        ref={ringRef}
        className={cn(
          "absolute flex h-9 w-9 items-center justify-center rounded-full border-2 border-fern transition-[width,height,background-color,border-color] duration-300",
          big && "h-24 w-24 border-transparent bg-fern text-white",
          kind === "join" && "bg-gold text-ink",
          kind === "link" && !big && "h-14 w-14 bg-fern/10"
        )}
      >
        {label && big && (
          <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-widest">{label}</span>
        )}
      </div>
      <div
        ref={dotRef}
        className={cn(
          "absolute h-2.5 w-2.5 rounded-full bg-fern transition-opacity duration-200",
          (big || kind === "link") && "opacity-0"
        )}
      />
    </div>
  );
}
