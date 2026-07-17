"use client";

// Ported/condensed from vengenceui.com/r/animated-footer.json — next-themes
// removed, brand defaults. Two images are drawn as live ASCII art that lights
// up near the cursor and parallaxes; the heading unmasks char-by-char on view.
import { useEffect, useMemo, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const DEFAULT_ASCII = "........:::=+xX#0369";
const HIGHLIGHT_LIFETIME = 300;
const CLUSTER_SIZE = 10;
const PARALLAX_EASE = 0.05;

interface Cell { col: number; row: number; char: string; highlightEndTime: number; }
interface Hand { ctx: CanvasRenderingContext2D; canvas: HTMLCanvasElement; cells: Map<string, Cell>; cellList: Cell[]; rows: number; columns: number; cellSize: number; baselineOffset: number; }

function buildHandCells(image: HTMLImageElement, columns: number, asciiChars: string) {
  const rows = Math.max(1, Math.round(columns / (image.naturalWidth / image.naturalHeight || 1)));
  const sampler = document.createElement("canvas");
  sampler.width = columns; sampler.height = rows;
  const s = sampler.getContext("2d");
  const cells = new Map<string, Cell>();
  if (!s) return { rows, cells };
  s.drawImage(image, 0, 0, columns, rows);
  const px = s.getImageData(0, 0, columns, rows).data;
  const bgIdx = asciiChars.lastIndexOf(".");
  for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
    const o = (row * columns + col) * 4;
    const b = (px[o] * 0.299 + px[o + 1] * 0.587 + px[o + 2] * 0.114) / 255;
    const ci = Math.min(asciiChars.length - 1, Math.floor((1 - b) * asciiChars.length));
    if (ci <= bgIdx) continue;
    cells.set(`${col},${row}`, { col, row, char: asciiChars[ci], highlightEndTime: 0 });
  }
  return { rows, cells };
}

function highlightCluster(cells: Map<string, Cell>, start: Cell) {
  const now = Date.now();
  start.highlightEndTime = now + HIGHLIGHT_LIFETIME;
  const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
  const lit = [start];
  let cur = start;
  for (let step = 0; step < steps; step++) {
    const nb: Cell[] = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const n = cells.get(`${cur.col + dx},${cur.row + dy}`);
      if (n && !lit.includes(n)) nb.push(n);
    }
    if (!nb.length) break;
    const next = nb[Math.floor(Math.random() * nb.length)];
    next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 10;
    lit.push(next); cur = next;
  }
}

export function AnimatedFooter({
  headingLines = ["Rotaract"],
  leftImage = "/hero/twig-left.webp",
  rightImage = "/hero/twig-right.webp",
  background = "#141210",
  textColor = "#fff6e3",
  charColor = "#3a6b34",
  hoverColor = "#7ac943",
  hoverCharColor = "#141210",
  columns = 80,
  cellSize = 18,
  fontSize = 16,
  parallaxStrength = 18,
  hoverRadius = 8,
  className,
}: {
  headingLines?: string[];
  leftImage?: string;
  rightImage?: string;
  background?: string;
  textColor?: string;
  charColor?: string;
  hoverColor?: string;
  hoverCharColor?: string;
  columns?: number;
  cellSize?: number;
  fontSize?: number;
  parallaxStrength?: number;
  hoverRadius?: number;
  className?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const leftWrapRef = useRef<HTMLDivElement>(null);
  const rightWrapRef = useRef<HTMLDivElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const sig = useMemo(() => JSON.stringify({ leftImage, rightImage, columns, cellSize, fontSize, headingLines }), [leftImage, rightImage, columns, cellSize, fontSize, headingLines]);

  useEffect(() => {
    const root = rootRef.current, leftWrap = leftWrapRef.current, rightWrap = rightWrapRef.current;
    if (!root || !leftWrap || !rightWrap) return;
    const hands: Hand[] = [];
    const wrappers = [leftWrap, rightWrap];

    const setupHand = (image: HTMLImageElement, canvas: HTMLCanvasElement) => {
      const { rows, cells } = buildHandCells(image, columns, DEFAULT_ASCII);
      if (!cells.size) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = columns * cellSize * dpr; canvas.height = rows * cellSize * dpr;
      const ctx = canvas.getContext("2d"); if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px monospace`; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      const m = ctx.measureText("X");
      const gh = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const baselineOffset = cellSize / 2 + gh / 2 - m.actualBoundingBoxDescent;
      hands.push({ canvas, ctx, cells, cellList: [...cells.values()], rows, columns, cellSize, baselineOffset });
    };
    const loadHand = (src: string, canvas: HTMLCanvasElement) => {
      const image = new Image(); image.crossOrigin = "anonymous";
      let done = false; const init = () => { if (done) return; done = true; setupHand(image, canvas); };
      image.onload = init; image.src = src; if (image.complete && image.naturalWidth) init();
    };
    loadHand(leftImage, leftCanvasRef.current!);
    loadHand(rightImage, rightCanvasRef.current!);

    const renderHand = (hand: Hand, now: number) => {
      const { ctx, cellList, cellSize: cs, baselineOffset, columns: cols, rows } = hand;
      ctx.clearRect(0, 0, cols * cs, rows * cs);
      for (const cell of cellList) {
        const x = cell.col * cs, y = cell.row * cs;
        const lit = cell.highlightEndTime > now;
        if (lit) { ctx.fillStyle = hoverColor; ctx.fillRect(x, y, cs, cs); }
        ctx.fillStyle = lit ? hoverCharColor : charColor;
        ctx.fillText(cell.char, x + cs / 2, y + baselineOffset);
      }
    };

    const pointer = { x: 0, y: 0 }, drift = { x: 0, y: 0 };
    const curtain = { offset: 125 };
    const hoverHand = (hand: Hand, cx: number, cy: number) => {
      const r = hand.canvas.getBoundingClientRect(); if (!r.width || !r.height) return;
      const mc = ((cx - r.left) / r.width) * hand.columns, mr = ((cy - r.top) / r.height) * hand.rows;
      let closest: Cell | null = null, cd = Infinity;
      for (const cell of hand.cellList) { const dx = mc - cell.col, dy = mr - cell.row, d = Math.hypot(dx, dy); if (d < cd) { cd = d; closest = cell; } }
      if (closest && cd <= hoverRadius) highlightCluster(hand.cells, closest);
    };
    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect(); const w = r.width || 1, h = r.height || 1;
      pointer.x = ((e.clientX - r.left) / w - 0.5) * parallaxStrength * 2;
      pointer.y = ((e.clientY - r.top) / h - 0.5) * parallaxStrength * 2;
      for (const hand of hands) hoverHand(hand, e.clientX, e.clientY);
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const frame = () => {
      const now = Date.now();
      for (const hand of hands) renderHand(hand, now);
      drift.x += (pointer.x - drift.x) * PARALLAX_EASE;
      drift.y += (pointer.y - drift.y) * PARALLAX_EASE;
      const scale = 1 + (parallaxStrength * 2) / 200;
      wrappers.forEach((wrap, i) => {
        const dir = i === 0 ? 1 : -1;
        const revealX = i === 0 ? -curtain.offset : curtain.offset;
        wrap.style.transform = `translateX(${revealX}%) translate(${(drift.x * dir) || 0}px, ${-drift.y || 0}px) scale(${scale})`;
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const chars = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-af-char]"));
    gsap.set(chars, { yPercent: 125 });
    const animateIn = () => {
      gsap.to(curtain, { offset: 0, duration: 1, ease: "power3.out", overwrite: true });
      gsap.to(chars, { yPercent: 0, duration: 1, ease: "power3.out", stagger: { each: 0.04, from: "center" }, overwrite: true });
    };
    const animateOut = () => {
      gsap.to(curtain, { offset: 125, duration: 0.4, ease: "power2.in", overwrite: true });
      gsap.to(chars, { yPercent: 125, duration: 0.4, ease: "power2.in", stagger: { each: 0.01, from: "center" }, overwrite: true });
    };
    let shown = false;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !shown) { shown = true; animateIn(); }
        else if (!e.isIntersecting && shown) { shown = false; animateOut(); }
      }
    }, { threshold: 0.35 });
    io.observe(root);

    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); io.disconnect(); gsap.killTweensOf([curtain, ...chars]); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  return (
    <footer ref={rootRef} className={cn("relative h-full w-full overflow-hidden", className)} style={{ backgroundColor: background, color: textColor, containerType: "inline-size" }}>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
        <div ref={leftWrapRef} className="relative w-2/5 min-w-[200px] will-change-transform" style={{ transform: "translateX(-125%)" }}>
          <canvas ref={leftCanvasRef} className="block h-auto w-full" />
        </div>
        <div ref={rightWrapRef} className="relative w-2/5 min-w-[200px] will-change-transform" style={{ transform: "translateX(125%)" }}>
          <canvas ref={rightCanvasRef} className="block h-auto w-full" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-4 p-8">
        {headingLines.map((word, wi) => (
          <h2 key={`${word}-${wi}`} aria-label={word} className="u-display -mb-[0.15em] overflow-hidden pb-[0.15em] leading-none tracking-tight" style={{ fontSize: "clamp(2.5rem, 14cqw, 12rem)" }}>
            {Array.from(word).map((ch, ci) => (
              <span key={ci} data-af-char aria-hidden className="inline-block">{ch === " " ? " " : ch}</span>
            ))}
          </h2>
        ))}
      </div>
    </footer>
  );
}

export default AnimatedFooter;
