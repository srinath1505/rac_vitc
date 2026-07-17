"use client";

// Ported from @skiper-ui/skiper17 (StickyCard_002) — pinned stacked-card scroll
// transition. Uses our global Lenis (dropped the component's own ReactLenis).
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface StickyCard {
  id: number | string;
  image: string;
  alt?: string;
}

export function StickyCards({
  cards,
  className,
  containerClassName,
}: {
  cards: StickyCard[];
  className?: string;
  containerClassName?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(
    () => {
      const imgs = imageRefs.current;
      const total = imgs.length;
      if (!imgs[0]) return;

      gsap.set(imgs[0], { y: "0%", scale: 1, rotation: 0 });
      for (let i = 1; i < total; i++) {
        if (imgs[i]) gsap.set(imgs[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top top",
          end: `+=${window.innerHeight * (total - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 0; i < total - 1; i++) {
        const cur = imgs[i];
        const next = imgs[i + 1];
        if (!cur || !next) continue;
        tl.to(cur, { scale: 0.72, rotation: 5, duration: 1, ease: "none" }, i);
        tl.to(next, { y: "0%", duration: 1, ease: "none" }, i);
      }
    },
    { scope: container }
  );

  return (
    <div className={cn("relative h-full w-full", className)} ref={container}>
      <div className="sticky-cards relative flex h-full w-full items-center justify-center overflow-hidden p-3 lg:p-8">
        <div className={cn("relative h-[86%] w-full max-w-sm overflow-hidden rounded-3xl border-4 border-paper-2 shadow-2xl sm:max-w-md md:max-w-lg lg:max-w-2xl", containerClassName)}>
          {cards.map((card, i) => (
            <img
              key={card.id}
              src={card.image}
              alt={card.alt || ""}
              className="absolute h-full w-full rounded-2xl object-cover"
              ref={(el) => { imageRefs.current[i] = el; }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StickyCards;
