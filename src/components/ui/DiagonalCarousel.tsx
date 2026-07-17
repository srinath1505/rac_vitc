"use client";

// Ported from vengenceui.com/r/diagonal-carousel.json — brand-adapted controls.
import * as React from "react";
import { motion, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DiagonalCarouselItem {
  src: string;
  title: string;
  alt?: string;
}

const DEFAULT_TRANSITION: Transition = { type: "spring", bounce: 0.16, duration: 0.85 };
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export function DiagonalCarousel({
  items,
  loop = true,
  slideSize = 260,
  rotationStep = 30,
  verticalStep = 120,
  inactiveScale = 0.6,
  transition = DEFAULT_TRANSITION,
  autoPlay = true,
  interval = 1400,
  className,
}: {
  items: DiagonalCarouselItem[];
  loop?: boolean;
  slideSize?: number;
  rotationStep?: number;
  verticalStep?: number;
  inactiveScale?: number;
  transition?: Transition;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}) {
  const maxIndex = Math.max(0, items.length - 1);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const safeSlideSize = Math.max(120, slideSize);
  const safeInactiveScale = clamp(inactiveScale, 0.35, 1);

  const select = React.useCallback(
    (next: number) => {
      if (!items.length) return;
      setCurrentIndex(loop ? (next + items.length) % items.length : clamp(next, 0, maxIndex));
    },
    [items.length, loop, maxIndex]
  );

  // auto-advance to the next image
  React.useEffect(() => {
    if (!autoPlay || paused || items.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setCurrentIndex((p) => (p + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [autoPlay, paused, interval, items.length]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); select(currentIndex - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); select(currentIndex + 1); }
  };

  if (!items.length) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Event highlights"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-cursor="drag"
      className={cn("relative isolate h-full w-full overflow-hidden", className)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-[28%] flex w-fit"
          animate={{ x: -(currentIndex * safeSlideSize + safeSlideSize / 2) }}
          transition={transition}
        >
          {items.map((item, index) => {
            const isActive = currentIndex === index;
            const distance = index - currentIndex;
            return (
              <motion.div
                key={`${item.src}-${index}`}
                className="flex shrink-0 flex-col items-center gap-3 will-change-transform"
                style={{ width: safeSlideSize }}
                animate={{ rotate: distance * rotationStep, scale: isActive ? 1 : safeInactiveScale, y: distance * verticalStep }}
                transition={transition}
              >
                <motion.p
                  className="whitespace-nowrap font-display text-lg text-ink"
                  animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.7 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.title}
                </motion.p>
                <button type="button" aria-label={`Show ${item.title}`} aria-current={isActive ? "true" : undefined} className="aspect-[4/5] w-full cursor-pointer" onClick={() => select(index)}>
                  <img src={item.src} alt={item.alt ?? item.title} draggable={false} className="h-full w-full select-none rounded-2xl border-4 border-paper-2 object-cover shadow-xl" />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="absolute inset-x-4 bottom-5 z-10 mx-auto flex w-fit items-center justify-center gap-3 rounded-full border border-line bg-paper-2/80 px-2 py-1 text-ink shadow-sm backdrop-blur-sm">
        <button type="button" aria-label="Previous" className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-ink hover:text-paper" onClick={() => select(currentIndex - 1)}>
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex items-center justify-center gap-2">
          {items.map((item, index) => (
            <button
              key={`${item.title}-${index}`}
              type="button"
              aria-label={`Slide ${index + 1}`}
              aria-current={currentIndex === index ? "true" : undefined}
              className={cn("h-2 rounded-full bg-fern transition-[width,opacity] duration-300", currentIndex === index ? "w-7 opacity-100" : "w-2 opacity-30")}
              onClick={() => select(index)}
            />
          ))}
        </div>
        <button type="button" aria-label="Next" className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-ink hover:text-paper" onClick={() => select(currentIndex + 1)}>
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}

export default DiagonalCarousel;
