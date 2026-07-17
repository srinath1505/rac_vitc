"use client";

import { useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Clock, MapPin } from "lucide-react";
import type { ClubEvent } from "@/content/types";
import Placeholder from "@/components/ui/Placeholder";

interface Props {
  event: ClubEvent;
  x: number;
  y: number;
  placement: "top" | "bottom";
  onEnter: () => void;
  onLeave: () => void;
}

/**
 * Floating rich preview for an event day (§5.13): an auto-advancing photo
 * carousel (pauses on pointer-enter) plus title/date/time/location. Autoplay is
 * disabled under reduced motion.
 */
export default function EventPopover({ event, x, y, placement, onEnter, onLeave }: Props) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const autoplay = useRef(
    Autoplay({ delay: 3200, stopOnMouseEnter: true, stopOnInteraction: false })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    reduced ? [] : [autoplay.current]
  );

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, event.id]);

  return (
    <div
      role="dialog"
      aria-label={event.title}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="pointer-events-auto fixed z-[250] w-[320px] overflow-hidden rounded-2xl border border-line bg-paper-2 shadow-[0_30px_80px_-30px_rgba(26,26,26,0.55)]"
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, ${placement === "top" ? "-100%" : "0"})`,
      }}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {event.images.map((img, i) => (
            <div key={i} className="min-w-0 flex-[0_0_100%]">
              <div className="aspect-[16/10]">
                <Placeholder seed={img} label={event.title} kind="scene" className="h-full w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-fern">
          {event.type} · {event.date}
        </span>
        <h4 className="font-display text-lg leading-tight text-ink">{event.title}</h4>
        <div className="flex flex-col gap-1 text-xs text-ink-soft">
          <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-fern" /> {event.time}</span>
          <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-fern" /> {event.location}</span>
        </div>
      </div>
    </div>
  );
}
