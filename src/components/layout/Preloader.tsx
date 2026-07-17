"use client";

import { useRef, useState } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { stopScroll, startScroll } from "@/lib/lenis";
import { setIntroDone } from "@/lib/intro";
import { site } from "@/content/site";
import { sceneUrl } from "@/lib/utils";

const IMAGE_SEEDS = ["preloader-1", "preloader-2", "preloader-3", "preloader-4"];
const HEADLINE = "Rotaract Club of VITC";
// Greedily matched, in order, against HEADLINE's chars — "RAC" falls out of
// "ROTARACT" itself (R-o-t-A-r-a-C-t), then "VITC" closes it out. Chosen so
// the condense step lands on the club's actual short name, not just the
// headline's literal first/last letter.
const CONDENSE_TO = "RACVITC";

// Overall pacing dial — multiplies every duration/offset below so the whole
// choreography scales evenly. 1 = original (felt too fast); bump this up to
// slow the whole thing down without re-tuning each number by hand.
const SPEED = 1.6;
const s = (seconds: number) => seconds * SPEED;

const CLIP_FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
const CLIP_HIDDEN_BOTTOM = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
const CLIP_HIDDEN_TOP = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";

/**
 * Intro sequence adapted from Animmaster/LandingPage-Reveal: a progress bar,
 * a strip of photos wiping in one by one, the brand name masking in, then
 * condensing down to "RACVITC" before the whole panel clips away to reveal
 * the hero ("preloader:done"). Replays on every reload; instant under
 * reduced motion.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const imagesWrapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const finish = () => {
      setIntroDone();
      window.dispatchEvent(new Event("preloader:done"));
      startScroll();
      setDone(true);
    };

    stopScroll();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    let headerSplit: SplitText | undefined;
    let copySplit: SplitText | undefined;

    const ctx = gsap.context(() => {
      headerSplit = SplitText.create(headerRef.current, {
        type: "chars",
        charsClass: "pl-char",
        mask: "chars",
      });
      copySplit = SplitText.create(copyRef.current, {
        type: "lines",
        linesClass: "pl-line",
        mask: "lines",
      });

      const chars = headerSplit.chars as HTMLElement[];
      const lines = copySplit.lines;

      // Walk chars in order, greedily matching each next needed letter of
      // CONDENSE_TO — robust to whether SplitText emits whitespace as chars.
      const keepIndices: number[] = [];
      let need = 0;
      chars.forEach((char, i) => {
        if (need >= CONDENSE_TO.length) return;
        if ((char.textContent || "").toUpperCase() === CONDENSE_TO[need]) {
          keepIndices.push(i);
          need++;
        }
      });
      const keepSet = new Set(keepIndices);
      const keepChars = keepIndices.map((i) => chars[i]);

      chars.forEach((char, i) => gsap.set(char, { yPercent: i % 2 === 0 ? -100 : 100 }));
      gsap.set(lines, { yPercent: 100 });

      const images = gsap.utils.toArray<HTMLElement>(".pl-img");
      const imagesInner = gsap.utils.toArray<HTMLElement>(".pl-img img");

      const tl = gsap.timeline({ onComplete: finish, delay: s(0.15) });

      tl.addLabel("start")
        .to(barRef.current, { scaleX: 1, duration: s(1.1), ease: "power3.inOut" }, "start")
        .set(barRef.current, { transformOrigin: "right" })
        .to(barRef.current, { scaleX: 0, duration: s(0.35), ease: "power3.in" })
        .addLabel("imagesIn", `start+=${s(0.25)}`);

      images.forEach((img, i) => {
        tl.to(img, { clipPath: CLIP_FULL, duration: s(0.45), ease: "hop" }, `imagesIn+=${s(i * 0.18)}`);
      });
      imagesInner.forEach((inner, i) => {
        tl.to(inner, { scale: 1, duration: s(0.6), ease: "hop" }, `imagesIn+=${s(i * 0.18)}`);
      });

      tl.addLabel("textIn", `imagesIn+=${s(0.35)}`)
        .to(lines, { yPercent: 0, duration: s(0.7), ease: "hop", stagger: s(0.06) }, "textIn")
        .to(chars, { yPercent: 0, duration: s(0.4), ease: "hop", stagger: s(0.015) }, `textIn+=${s(0.1)}`)
        .addLabel("hold", `textIn+=${s(0.65)}`)
        .to(imagesWrapRef.current, { clipPath: CLIP_HIDDEN_TOP, duration: s(0.4), ease: "hop" }, "hold")
        .to(lines, { y: "-125%", duration: s(0.55), ease: "hop", stagger: s(0.06) }, "hold")
        .addLabel("condense", `hold+=${s(0.35)}`)
        .to(
          chars,
          {
            yPercent: (i: number) => (keepSet.has(i) ? 0 : i % 2 === 0 ? 100 : -100),
            duration: s(0.4),
            ease: "hop",
            stagger: s(0.015),
            onStart: () => {
              // Kept chars need to travel outside their own mask's bounds to
              // converge, so their masks must stop clipping them.
              keepChars.forEach((char) => {
                const mask = char.parentElement;
                if (mask?.classList.contains("pl-char-mask")) mask.style.overflow = "visible";
              });

              // Lay CONDENSE_TO out as one compact word centered on screen —
              // each kept char slides from its original spot to its slot in
              // that word, using its own current width so kerning stays even.
              const rects = keepChars.map((char) => char.getBoundingClientRect());
              const totalWidth = rects.reduce((sum, r) => sum + r.width, 0);
              let cursor = window.innerWidth / 2 - totalWidth / 2;
              const deltas = rects.map((rect) => {
                const dx = cursor - rect.left;
                cursor += rect.width;
                return dx;
              });

              gsap.to(keepChars, {
                duration: s(0.5),
                ease: "hop",
                x: (i: number) => deltas[i],
                onComplete: () => {
                  gsap.to(headerRef.current, { opacity: 0, scale: 0.6, duration: s(0.4), ease: "hop" });
                },
              });
            },
          },
          "condense"
        )
        .addLabel("reveal", `condense+=${s(0.55)}`)
        .to(rootRef.current, { clipPath: CLIP_HIDDEN_TOP, duration: s(0.7), ease: "hop" }, "reveal");
    }, rootRef);

    // ctx.revert() undoes tweens/ScrollTriggers, but SplitText's own DOM
    // restructuring needs its own revert (critical for React dev Strict Mode,
    // which mounts effects twice — otherwise the 2nd SplitText.create() runs
    // on already-split markup and the reveal breaks silently).
    return () => {
      ctx.revert();
      headerSplit?.revert();
      copySplit?.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      id="preloader"
      className="fixed inset-0 z-[9999] overflow-hidden bg-paper"
      style={{ clipPath: CLIP_FULL }}
    >
      <div ref={barRef} className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-fern" />

      <div
        ref={imagesWrapRef}
        className="absolute left-1/2 top-[42%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden sm:h-64 sm:w-64"
        style={{ clipPath: CLIP_FULL }}
      >
        {IMAGE_SEEDS.map((seed) => (
          <div
            key={seed}
            className="pl-img absolute inset-0 overflow-hidden"
            style={{ clipPath: CLIP_HIDDEN_BOTTOM }}
          >
            <img src={sceneUrl(seed)} alt="" className="h-full w-full scale-[2] object-cover" />
          </div>
        ))}
      </div>

      <p
        ref={copyRef}
        className="absolute bottom-16 left-1/2 w-[80%] max-w-xs -translate-x-1/2 text-center font-mono text-xs uppercase tracking-widest text-ink-soft sm:w-auto"
      >
        {site.tagline}
      </p>

      <div ref={headerRef} className="pointer-events-none absolute inset-x-0 top-[58svh] flex items-center justify-center px-4">
        <span className="u-display block whitespace-nowrap text-[clamp(1.4rem,6.2vw,4.5rem)] font-bold uppercase leading-[0.9] tracking-tight text-ink">
          {HEADLINE}
        </span>
      </div>
    </div>
  );
}
