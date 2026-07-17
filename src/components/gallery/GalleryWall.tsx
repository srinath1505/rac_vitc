"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, Images, Award as AwardIcon, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { gallery, tiltFor, galleryTags } from "@/content/gallery";
import type { GalleryItem } from "@/content/types";
import Placeholder from "@/components/ui/Placeholder";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { stopScroll, startScroll } from "@/lib/lenis";
import { cn } from "@/lib/utils";

const tagOfType: Record<GalleryItem["type"], string> = {
  photo: "Photos",
  video: "Videos",
  album: "Albums",
  award: "Awards",
};

/**
 * Yearbook / Polaroid Wall (§5.14). Cards "land" on scroll with a settle,
 * carry a stable tilt, and open in a lightbox that FLIP-expands from the exact
 * board position. Reduced motion → static grid, instant lightbox.
 */
export default function GalleryWall() {
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [showAll, setShowAll] = useState(false);
  const INITIAL = 6;
  const visibleItems = showAll ? gallery : gallery.slice(0, INITIAL);
  const sourceRect = useRef<DOMRect | null>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const mounted = typeof document !== "undefined";

  const visible = gallery.filter((i) => filter === "All" || tagOfType[i.type] === filter);

  // Entrance — cards drop + settle, staggered by DOM order.
  const scope = useGsapContext(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // immediateRender:false → cards stay visible by default and only get the
    // reveal when the trigger fires (never left stuck at opacity 0).
    gsap.from(".gw-card", {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.05,
      immediateRender: false,
      scrollTrigger: { trigger: scope.current, start: "top 92%", once: true },
    });
  });

  const open = (item: GalleryItem, el: HTMLElement) => {
    const img = el.querySelector(".gw-img") as HTMLElement | null;
    sourceRect.current = (img ?? el).getBoundingClientRect();
    setActive(item);
  };

  // FLIP the lightbox figure from the clicked card's rect.
  useIsomorphicLayoutEffect(() => {
    if (!active || !figureRef.current || !sourceRect.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stopScroll();
    if (reduced) return;
    const fig = figureRef.current;
    const final = fig.getBoundingClientRect();
    const s = sourceRect.current;
    gsap.fromTo(
      fig,
      {
        x: s.left - final.left,
        y: s.top - final.top,
        scaleX: s.width / final.width,
        scaleY: s.height / final.height,
        transformOrigin: "top left",
      },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.6, ease: "expo.out" }
    );
  }, [active]);

  const close = useCallback(() => {
    setActive(null);
    startScroll();
  }, []);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (!active) return;
      const idx = visible.findIndex((i) => i.id === active.id);
      const next = visible[(idx + dir + visible.length) % visible.length];
      if (next) {
        gsap.fromTo(figureRef.current, { opacity: 0.4 }, { opacity: 1, duration: 0.3 });
        setActive(next);
      }
    },
    [active, visible]
  );

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, navigate]);

  return (
    <>
      {/* Filter chips */}
      <div className="mb-12 flex flex-wrap gap-2">
        {galleryTags.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
              filter === t ? "border-fern bg-fern text-white" : "border-line text-ink-soft hover:border-ink hover:text-ink"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Scrapbook grid */}
      <div ref={scope} className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => {
          const dim = filter !== "All" && tagOfType[item.type] !== filter;
          return (
            <button
              key={item.id}
              onClick={(e) => open(item, e.currentTarget)}
              data-cursor="view"
              style={{ rotate: `${tiltFor(item.id)}deg` }}
              className={cn(
                "gw-card group relative flex flex-col bg-paper-2 p-3 pb-5 shadow-[0_18px_40px_-24px_rgba(26,26,26,0.5)] transition-[transform,opacity,box-shadow] duration-500 hover:!rotate-0 hover:shadow-[0_28px_60px_-28px_rgba(26,26,26,0.6)]",
                dim ? "opacity-30" : "opacity-100"
              )}
            >
              <span className="absolute -top-2 left-1/2 h-5 w-16 -translate-x-1/2 rounded-sm bg-gold/40 mix-blend-multiply" />
              <div className="gw-img relative aspect-[4/3] overflow-hidden">
                <Placeholder
                  seed={item.id}
                  label={item.type === "award" ? undefined : item.tag}
                  kind={item.type === "award" ? "award" : "scene"}
                  className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                />
                {item.type === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper/90 text-ink transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                    </span>
                  </span>
                )}
                {item.type === "album" && (
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-paper/90 px-2 py-1 font-mono text-[0.6rem] text-ink">
                    <Images className="h-3 w-3" /> {item.album?.length}
                  </span>
                )}
                {item.type === "award" && (
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-gold/90 px-2 py-1 font-mono text-[0.6rem] text-ink">
                    <AwardIcon className="h-3 w-3" /> Award
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-col gap-0.5 text-left">
                <span className="font-display text-base leading-tight text-ink">{item.caption}</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">
                  {item.year} · {item.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Expand / collapse */}
      {gallery.length > INITIAL && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            data-cursor={showAll ? "close" : "open"}
            className="group inline-flex items-center gap-2 rounded-full border border-ink px-7 py-3 font-mono text-xs uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {showAll ? "Show less" : `Show all ${gallery.length} moments`}
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", showAll && "rotate-180")} />
          </button>
        </div>
      )}

      {/* FLIP lightbox */}
      {mounted && active &&
        createPortal(
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-10">
            <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={close} data-cursor="close" />
            <div ref={figureRef} className="relative z-10 w-full max-w-4xl">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-paper-2">
                <div className="aspect-video">
                  <Placeholder
                    seed={active.id}
                    label={active.type === "award" ? undefined : active.tag}
                    kind={active.type === "award" ? "award" : "scene"}
                    className="h-full w-full"
                  />
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="font-display text-xl text-ink">{active.caption}</h3>
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
                      {active.year} · {active.tag}
                    </span>
                  </div>
                  {active.type === "video" && (
                    <span className="flex items-center gap-2 text-sm text-ink-soft">
                      <Play className="h-4 w-4" fill="currentColor" /> Video
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <button onClick={close} aria-label="Close" className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink hover:bg-leaf">
              <X className="h-5 w-5" />
            </button>
            <button onClick={() => navigate(-1)} aria-label="Previous" className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink hover:bg-leaf">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => navigate(1)} aria-label="Next" className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink hover:bg-leaf">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
