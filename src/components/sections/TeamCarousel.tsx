"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { coreTeam } from "@/content/team";
import Placeholder from "@/components/ui/Placeholder";
import Badge from "@/components/ui/Badge";
import { clamp } from "@/lib/utils";

/**
 * Meet the Team — Embla coverflow (§5.7). Off-centre slides scale/fade via
 * scrollProgress; centre card is largest and sharpest. Wheel + drag + autoplay.
 */
export default function TeamCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", dragFree: false, containScroll: false },
    [
      Autoplay({ delay: 3800, stopOnInteraction: true, stopOnMouseEnter: true }),
      WheelGesturesPlugin({ forceWheelAxis: "x" }),
    ]
  );
  const [selected, setSelected] = useState(0);
  const [styles, setStyles] = useState<{ scale: number; opacity: number }[]>([]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = emblaApi.scrollProgress();
    const snaps = emblaApi.scrollSnapList();
    setStyles(
      snaps.map((snap) => {
        let diff = snap - progress;
        // wrap into [-0.5, 0.5] so looping stays continuous (version-robust)
        diff = ((diff % 1) + 1) % 1;
        if (diff > 0.5) diff -= 1;
        const a = Math.abs(diff);
        return {
          scale: clamp(1 - a * 0.85, 0.62, 1),
          opacity: clamp(1 - a * 1.4, 0.25, 1),
        };
      })
    );
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onScroll();
    onSelect();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onScroll);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onScroll]);

  return (
    <div className="flex flex-col gap-8">
      <div className="overflow-hidden" ref={emblaRef} data-cursor="drag">
        <div className="flex touch-pan-y">
          {coreTeam.map((m, i) => {
            const s = styles[i] ?? { scale: 1, opacity: 1 };
            return (
              <div
                key={m.role}
                className="min-w-0 shrink-0 grow-0 basis-[78%] px-3 sm:basis-[46%] lg:basis-[30%]"
              >
                <div
                  className="flex flex-col gap-4 transition-none"
                  style={{ transform: `scale(${s.scale})`, opacity: s.opacity }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-line">
                    <Placeholder seed={m.role} label={m.name} kind="person" className="h-full w-full" />
                    <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-ink">
                      {m.year}
                    </span>
                    {!m.confirmed && (
                      <span className="absolute right-3 top-3">
                        <Badge tone="ink">Seat filling</Badge>
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="font-display text-2xl text-ink">{m.name}</h3>
                    <p className="text-sm text-fern">{m.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous member"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {coreTeam.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to member ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selected === i ? "w-6 bg-fern" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next member"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
