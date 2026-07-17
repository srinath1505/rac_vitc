"use client";

import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeftRight } from "lucide-react";
import Placeholder from "@/components/ui/Placeholder";
import { clamp, cn } from "@/lib/utils";

interface Props {
  beforeSeed: string;
  afterSeed: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

/**
 * Drag-to-compare slider for the Signature Project (§5.9 innovation #1) —
 * littered beach vs. cleaned beach. The "before" layer is desaturated/duller
 * so the improvement reads even before real matched photography exists.
 */
export default function BeforeAfterSlider({
  beforeSeed,
  afterSeed,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [pct, setPct] = useState(50);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPct(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) updateFromClientX(e.clientX);
  };
  const stopDragging = () => {
    draggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label={`Drag to compare ${beforeLabel} and ${afterLabel}`}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPct((p) => clamp(p - 5, 0, 100));
        if (e.key === "ArrowRight") setPct((p) => clamp(p + 5, 0, 100));
      }}
      className={cn(
        "group relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-3xl border border-line outline-none focus-visible:ring-2 focus-visible:ring-fern focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        className
      )}
    >
      {/* AFTER — full base layer */}
      <div className="absolute inset-0">
        <Placeholder seed={afterSeed} label={afterLabel} kind="scene" className="h-full w-full" />
        <span className="absolute bottom-4 right-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-paper backdrop-blur">
          {afterLabel}
        </span>
      </div>

      {/* BEFORE — clipped overlay, deliberately duller */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        <div className="h-full w-full" style={{ filter: "grayscale(0.5) sepia(0.15) contrast(1.05) brightness(0.85)" }}>
          <Placeholder seed={beforeSeed} label={beforeLabel} kind="scene" className="h-full w-full" />
        </div>
        <span className="absolute bottom-4 left-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-paper backdrop-blur">
          {beforeLabel}
        </span>
      </div>

      {/* handle */}
      <div className="pointer-events-none absolute inset-y-0 w-[2px] bg-paper shadow-[0_0_0_1px_rgba(26,26,26,0.15)]" style={{ left: `${pct}%` }}>
        <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-[0_10px_30px_-8px_rgba(26,26,26,0.5)] transition-transform duration-200 group-hover:scale-105">
          <ArrowLeftRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
