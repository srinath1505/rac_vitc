"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const FlowerCanvas = dynamic(() => import("./FlowerCanvas"), { ssr: false });

interface Props {
  opacity?: number;
  intensity?: number;
  className?: string;
}

/**
 * Scoped flower-field host (§4). Mounts the WebGL canvas absolutely behind its
 * section's content, and pauses rendering (frameloop → "never") whenever the
 * section is off-screen. Gated off on touch, low-power, and reduced-motion
 * devices; the shader is lazy-loaded so `three` never touches the initial bundle.
 */
export default function FlowerField({ opacity, intensity, className }: Props) {
  const [ok, setOk] = useState(false);
  const [inView, setInView] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    // @ts-expect-error deviceMemory is non-standard but useful when present
    const mem = navigator.deviceMemory ?? 4;
    if (fine && wide && !reduced && cores >= 2 && mem >= 2) setOk(true);
  }, []);

  useEffect(() => {
    if (!ok || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "100px",
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ok]);

  return (
    <div
      ref={ref}
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
      aria-hidden
    >
      {ok && (
        <FlowerCanvas
          opacity={opacity}
          intensity={intensity}
          frameloop={inView ? "always" : "never"}
        />
      )}
    </div>
  );
}
