"use client";

// Ported from vengenceui.com/r/image-scatter.json — brand-adapted, dup-key fixed.
import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined" && !ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

export interface ScatterSet {
  heading: string;
  images: string[];
}

export interface ImageScatterProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ScatterSet[];
  cardWidth?: number;
  cardHeight?: number;
  animationDuration?: number;
  animationOverlap?: number;
  headingFadeDuration?: number;
  interval?: number;
}

export function ImageScatter({
  data,
  cardWidth = 230,
  cardHeight = 290,
  animationDuration = 0.75,
  animationOverlap = 0.5,
  headingFadeDuration = 0.5,
  interval = 3000,
  className,
  ...props
}: ImageScatterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current || !galleryRef.current || !headingRef.current || data.length === 0) return;
    const gallery = galleryRef.current;
    const galleryHeading = headingRef.current;

    const viewport = { centerX: 0, centerY: 0, rangeMin: 0, rangeMax: 0 };
    const state = { activeCards: [] as { element: HTMLDivElement; centerX: number; centerY: number }[], currentSection: 0, isAnimating: false };

    function updateViewport() {
      const c = containerRef.current!;
      viewport.centerX = c.clientWidth / 2;
      viewport.centerY = c.clientHeight / 2;
      viewport.rangeMin = Math.min(c.clientWidth, c.clientHeight) * 0.35;
      viewport.rangeMax = Math.min(c.clientWidth, c.clientHeight) * 0.7;
    }
    updateViewport();

    function getEdgePosition(centerX: number, centerY: number) {
      const w = containerRef.current?.clientWidth || window.innerWidth;
      const h = containerRef.current?.clientHeight || window.innerHeight;
      const d = { left: centerX, right: w - centerX, top: centerY, bottom: h - centerY };
      const min = Math.min(...Object.values(d));
      const ov = () => (Math.random() - 0.5) * 400;
      if (min === d.left) return { x: -cardWidth - 100 - Math.random() * 200, y: centerY - cardHeight / 2 + ov() };
      if (min === d.right) return { x: w + 50 + Math.random() * 200, y: centerY - cardHeight / 2 + ov() };
      if (min === d.top) return { x: centerX - cardWidth / 2 + ov(), y: -cardHeight - 100 - Math.random() * 200 };
      return { x: centerX - cardWidth / 2 + ov(), y: h + 50 + Math.random() * 200 };
    }

    function createCards(sectionIndex: number) {
      const cards: { element: HTMLDivElement; centerX: number; centerY: number }[] = [];
      const sectionData = data[sectionIndex];
      if (!sectionData?.images.length) return cards;
      sectionData.images.forEach((src) => {
        const card = document.createElement("div");
        card.className = "absolute rounded-2xl border-8 border-paper-2 shadow-xl overflow-hidden will-change-transform";
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
        const img = document.createElement("img");
        img.src = src;
        img.className = "w-full h-full object-cover rounded-lg pointer-events-none";
        card.appendChild(img);
        const angle = Math.random() * Math.PI * 2;
        const radius = viewport.rangeMin + Math.random() * (viewport.rangeMax - viewport.rangeMin);
        const centerX = viewport.centerX + Math.cos(angle) * radius;
        const centerY = viewport.centerY + Math.sin(angle) * radius;
        gsap.set(card, { left: centerX - cardWidth / 2, top: centerY - cardHeight / 2, rotation: Math.random() * 50 - 25 });
        gallery.appendChild(card);
        cards.push({ element: card, centerX, centerY });
      });
      return cards;
    }

    function animateHeading(newText: string) {
      return gsap.timeline()
        .to(galleryHeading, { opacity: 0, duration: headingFadeDuration, ease: "power2.inOut" })
        .call(() => { galleryHeading.textContent = newText; })
        .to(galleryHeading, { opacity: 1, duration: headingFadeDuration, ease: "power2.inOut" });
    }

    function animateCards(exiting: typeof state.activeCards, entering: typeof state.activeCards) {
      const tl = gsap.timeline();
      exiting.forEach(({ element, centerX, centerY }) => {
        const edge = getEdgePosition(centerX, centerY);
        tl.to(element, { left: edge.x, top: edge.y, rotation: Math.random() * 180 - 90, duration: animationDuration, ease: "power2.in", onComplete: () => element.remove() }, 0);
      });
      entering.forEach(({ element, centerX, centerY }) => {
        const edge = getEdgePosition(centerX, centerY);
        gsap.set(element, { left: edge.x, top: edge.y, rotation: Math.random() * 180 - 90 });
        tl.to(element, { left: centerX - cardWidth / 2, top: centerY - cardHeight / 2, rotation: Math.random() * 50 - 25, duration: animationDuration, ease: "power2.out" }, animationOverlap);
      });
      return tl;
    }

    state.activeCards = createCards(0);
    galleryHeading.textContent = data[0]?.heading || "";
    gsap.set(galleryHeading, { opacity: 1 });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    function nextSection() {
      if (state.isAnimating) return;
      const target = (state.currentSection + 1) % data.length;
      state.isAnimating = true;
      const newCards = createCards(target);
      Promise.all([animateCards(state.activeCards, newCards).then(), animateHeading(data[target]?.heading || "").then()]).then(() => {
        state.activeCards = newCards;
        state.currentSection = target;
        state.isAnimating = false;
      });
    }
    if (!reduced) intervalId = setInterval(nextSection, interval);

    const onResize = () => { state.activeCards.forEach(({ element }) => element.remove()); updateViewport(); state.activeCards = createCards(state.currentSection); };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (intervalId) clearInterval(intervalId);
      state.activeCards.forEach(({ element }) => element.remove());
    };
  }, [data, cardWidth, cardHeight, animationDuration, animationOverlap, headingFadeDuration, interval]);

  return (
    <section ref={containerRef} className={cn("relative flex h-full w-full items-center justify-center overflow-hidden bg-transparent", className)} {...props}>
      <div ref={galleryRef} className="pointer-events-none absolute inset-0" />
      <h1 ref={headingRef} className="u-display z-10 w-[90%] text-center text-[clamp(2rem,6vw,5rem)] leading-tight tracking-tight text-ink will-change-[opacity] md:w-[55%]" />
    </section>
  );
}
