"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, Images, Award as AwardIcon, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { gallery, galleryTags } from "@/content/gallery";
import type { GalleryItem } from "@/content/types";
import Placeholder from "@/components/ui/Placeholder";
import { gsap } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { stopScroll, startScroll } from "@/lib/lenis";
import { seededRandom } from "@/lib/utils";
import { cn } from "@/lib/utils";

const tagOfType: Record<GalleryItem["type"], string> = {
  photo: "Photos",
  video: "Videos",
  album: "Albums",
  award: "Awards",
};

/** On-brand fastener colours (fern, leaf, gold, cranberry, azure). */
const FASTENER_COLORS = ["#0b8f3f", "#7ac943", "#ffd700", "#c0392b", "#2b7fc0"];
/** Warm paper tints so no two polaroids look identical. */
const PAPER_TINTS = ["#ffffff", "#fbf4e2", "#f6efe0", "#fdf7ef", "#f2f4ee"];
const FASTENERS = ["pin", "bell", "tape"] as const;
type FastenerKind = (typeof FASTENERS)[number];

const pick = <T,>(seed: string, arr: readonly T[]): T => arr[Math.floor(seededRandom(seed) * arr.length)];

/** Stable, seeded board decor per item — tilt, fastener kind + colour, paper tint. */
function decorFor(id: string) {
  return {
    tilt: -7 + seededRandom(id + "t") * 14,
    kind: pick<FastenerKind>(id + "k", FASTENERS),
    color: pick(id + "c", FASTENER_COLORS),
    tint: pick(id + "p", PAPER_TINTS),
  };
}

/** A pin, bell-pin, or washi-tape strip. Outer span keeps the centering
 *  transform; the inner `.gw-fastener-i` is what the pluck timeline animates. */
function Fastener({ kind, color }: { kind: FastenerKind; color: string }) {
  return (
    <span className="gw-fastener pointer-events-none absolute -top-3 left-1/2 z-20 -translate-x-1/2">
      <span className="gw-fastener-i block" style={{ filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.35))" }}>
        {kind === "tape" && (
          <span
            className="block h-7 w-20 -rotate-2 rounded-[2px] opacity-80 mix-blend-multiply"
            style={{ background: color, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)" }}
          />
        )}
        {kind === "bell" && (
          <svg width="20" height="30" viewBox="0 0 20 30" aria-hidden>
            <line x1="10" y1="10" x2="10" y2="30" stroke="#8a8a8a" strokeWidth="1.5" />
            <circle cx="10" cy="8" r="7" fill={color} />
            <circle cx="7" cy="5.5" r="2.3" fill="rgba(255,255,255,0.6)" />
          </svg>
        )}
        {kind === "pin" && (
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="8" fill={color} />
            <circle cx="12" cy="12" r="8" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
            <circle cx="9.5" cy="9.5" r="2.5" fill="rgba(255,255,255,0.55)" />
            <circle cx="12" cy="12" r="2" fill="rgba(0,0,0,0.28)" />
          </svg>
        )}
      </span>
    </span>
  );
}

function Caption({ item, light }: { item: GalleryItem; light?: boolean }) {
  return (
    <div className="mt-2 flex flex-col gap-0.5 px-1 text-left">
      <span className={cn("font-display text-base leading-tight", light ? "text-paper" : "text-ink")}>{item.caption}</span>
      <span className={cn("font-mono text-[0.6rem] uppercase tracking-widest", light ? "text-paper/60" : "text-ink-faint")}>
        {item.year} · {item.tag}
      </span>
    </div>
  );
}

/**
 * Cork Notice Board (§5.14). Photos, films, albums and awards are pinned to a
 * cork wall with a mix of pins, bell-pins and washi tape (seeded, so stable).
 * Clicking a card plucks the pin → the paper waves from the bottom up → it
 * FLIP-expands into the lightbox. Reduced motion → static board, instant open.
 */
export default function GalleryWall() {
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [showAll, setShowAll] = useState(false);
  const INITIAL = 6;

  const decor = useMemo(() => Object.fromEntries(gallery.map((i) => [i.id, decorFor(i.id)])), []);
  const filtered = useMemo(
    () => (filter === "All" ? gallery : gallery.filter((i) => tagOfType[i.type] === filter)),
    [filter]
  );
  const visibleItems = showAll ? filtered : filtered.slice(0, INITIAL);

  const sourceRect = useRef<DOMRect | null>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const mounted = typeof document !== "undefined";

  // Entrance — cards drop + settle (immediateRender:false → never stuck invisible).
  const scope = useGsapContext(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".gw-card", {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.05,
      immediateRender: false,
      scrollTrigger: { trigger: scope.current, start: "top 92%", once: true },
    });
  }, [visibleItems.length]);

  // Pluck-to-open: pin lifts, paper waves bottom→top, then hand to the FLIP.
  const open = useCallback((item: GalleryItem, el: HTMLElement) => {
    const img = el.querySelector(".gw-img") as HTMLElement | null;
    sourceRect.current = (img ?? el).getBoundingClientRect();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(item);
      return;
    }
    const fastener = el.querySelector(".gw-fastener-i") as HTMLElement | null;
    const tl = gsap.timeline({ onComplete: () => setActive(item) });
    if (fastener) tl.to(fastener, { y: -20, opacity: 0, rotate: 10, duration: 0.2, ease: "power2.in" }, 0);
    tl.to(el, {
      keyframes: { rotation: [0, -3, 2.2, -1.2, 0.5, 0] },
      transformOrigin: "50% 100%",
      duration: 0.34,
      ease: "sine.out",
    }, 0.05).set(el, { clearProps: "transform" });
  }, []);

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
      const idx = filtered.findIndex((i) => i.id === active.id);
      const next = filtered[(idx + dir + filtered.length) % filtered.length];
      if (next) {
        gsap.fromTo(figureRef.current, { opacity: 0.4 }, { opacity: 1, duration: 0.3 });
        setActive(next);
      }
    },
    [active, filtered]
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
      {/* Index-card filter tabs, clipped to the board's top edge */}
      <div className="relative z-10 flex flex-wrap gap-1 pl-4">
        {galleryTags.map((t) => {
          const on = filter === t;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              data-cursor="link"
              className={cn(
                "translate-y-px rounded-t-lg border border-b-0 border-[#b98f52] px-4 py-2 font-mono text-[0.7rem] uppercase tracking-widest transition-all",
                on ? "-translate-y-0.5 bg-[#efe0b8] text-ink shadow-[0_-4px_10px_-6px_rgba(0,0,0,0.4)]" : "bg-[#e3d3a6]/80 text-ink/60 hover:bg-[#e9dbb2]"
              )}
            >
              {t}
              {on && <span className="mt-1 block h-0.5 w-full rounded bg-fern" />}
            </button>
          );
        })}
      </div>

      {/* The board — wooden frame + cork surface */}
      <div className="relative rounded-3xl border-[10px] border-[#7a5533] bg-[#7a5533] p-1 shadow-[0_50px_90px_-45px_rgba(0,0,0,0.6)]">
        <div className="u-corkboard relative overflow-hidden rounded-xl px-5 py-8 shadow-[inset_0_2px_20px_rgba(60,40,15,0.35)] sm:px-8 sm:py-10">
          {/* pinned corner sign */}
          <span className="pointer-events-none absolute right-6 top-4 z-10 hidden rotate-3 rounded-sm bg-paper/95 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-ink shadow-md sm:block">
            <span className="absolute -top-1.5 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#c0392b] shadow" />
            Pinned memories
          </span>

          {/* Collage — masonry columns for an organic scrapbook layout, with a
              small seeded top-offset per card so they sit slightly off, like a
              real hand-pinned board rather than a rigid grid. */}
          <div ref={scope} className="columns-1 gap-6 [column-fill:_balance] sm:columns-2 lg:columns-3">
            {visibleItems.map((item) => {
              const d = decor[item.id];
              const offset = Math.round(seededRandom(item.id + "o") * 22);
              return (
                <div key={item.id} className="break-inside-avoid" style={{ marginBottom: "2.25rem", marginTop: offset }}>
                  <button
                    onClick={(e) => open(item, e.currentTarget)}
                    data-cursor="view"
                    style={{ rotate: `${d.tilt}deg` }}
                    className="gw-card group relative block w-full origin-center transition-transform duration-500 hover:z-10 hover:!rotate-0"
                  >
                    <Fastener kind={d.kind} color={d.color} />

                    {/* PHOTO — polaroid */}
                    {item.type === "photo" && (
                      <div className="rounded-[3px] p-2.5 pb-4 shadow-[0_18px_40px_-24px_rgba(26,26,26,0.55)]" style={{ background: d.tint }}>
                        <div className="gw-img relative aspect-[4/3] overflow-hidden">
                          <Placeholder seed={item.id} label={item.tag} kind="scene" className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <Caption item={item} />
                      </div>
                    )}

                    {/* VIDEO — filmstrip */}
                    {item.type === "video" && (
                      <div className="relative rounded-[3px] bg-[#1c1c1c] px-4 py-2.5 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.7)]">
                        <span className="pointer-events-none absolute inset-y-2.5 left-1 w-1.5 bg-[repeating-linear-gradient(to_bottom,transparent_0_4px,rgba(255,255,255,0.85)_4px_9px)]" />
                        <span className="pointer-events-none absolute inset-y-2.5 right-1 w-1.5 bg-[repeating-linear-gradient(to_bottom,transparent_0_4px,rgba(255,255,255,0.85)_4px_9px)]" />
                        <div className="gw-img relative aspect-[16/10] overflow-hidden rounded-[1px]">
                          <Placeholder seed={item.id} label={item.tag} kind="scene" className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper/90 text-ink transition-transform duration-300 group-hover:scale-110">
                              <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <Caption item={item} light />
                          <span className="mr-1 font-mono text-[0.55rem] uppercase tracking-widest text-paper/50">Reel</span>
                        </div>
                      </div>
                    )}

                    {/* ALBUM — stacked polaroids */}
                    {item.type === "album" && (
                      <div className="relative">
                        <span className="absolute inset-0 translate-x-2 rotate-[5deg] rounded-[3px] bg-[#f0e6cc] shadow-md" />
                        <span className="absolute inset-0 -translate-x-2 -rotate-[4deg] rounded-[3px] bg-white shadow-md" />
                        <div className="relative rounded-[3px] p-2.5 pb-4 shadow-[0_18px_40px_-24px_rgba(26,26,26,0.55)]" style={{ background: d.tint }}>
                          <div className="gw-img relative aspect-[4/3] overflow-hidden">
                            <Placeholder seed={item.id} label={item.tag} kind="scene" className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-paper/90 px-2 py-1 font-mono text-[0.6rem] text-ink">
                              <Images className="h-3 w-3" /> {item.album?.length}
                            </span>
                          </div>
                          <Caption item={item} />
                        </div>
                      </div>
                    )}

                    {/* AWARD — gold certificate */}
                    {item.type === "award" && (
                      <div className="rounded-[3px] p-2 shadow-[0_18px_40px_-22px_rgba(120,90,10,0.6)]" style={{ background: "linear-gradient(145deg,#f7dd7e,#e4b53d)" }}>
                        <div className="rounded-[2px] border-2 border-[#e8c34a] bg-[#fffdf5] p-3">
                          <div className="gw-img relative flex aspect-[4/3] items-center justify-center overflow-hidden">
                            <Placeholder seed={item.id} kind="award" className="h-full w-full" />
                            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-gold/90 px-2 py-1 font-mono text-[0.6rem] text-ink">
                              <AwardIcon className="h-3 w-3" /> Award
                            </span>
                          </div>
                          <Caption item={item} />
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pin up more — a pinned paper note */}
          {filtered.length > INITIAL && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAll((v) => !v)}
                data-cursor={showAll ? "close" : "open"}
                className="group relative -rotate-1 rounded-sm bg-paper px-7 py-3 font-mono text-xs uppercase tracking-widest text-ink shadow-[0_14px_30px_-16px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5 hover:rotate-0"
              >
                <span className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-fern shadow" />
                <span className="inline-flex items-center gap-2">
                  {showAll ? "Show less" : `Pin up all ${filtered.length} memories`}
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", showAll && "rotate-180")} />
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

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
