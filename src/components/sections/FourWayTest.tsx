"use client";

import { fourWayTest, fourWayIntro } from "@/content/focus";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useGsapContext } from "@/hooks/useGsapContext";
import { cn } from "@/lib/utils";

const accents = ["#0a5933", "#0b8f3f", "#7ac943", "#f5c518"];

/**
 * The Four-Way Test — sticky stacking cards. Each card locks into place and
 * scales back as the next one covers it. Sticky still works under reduced
 * motion; only the scrubbed scale is gated off.
 */
export default function FourWayTest() {
  const scope = useGsapContext(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = gsap.utils.toArray<HTMLElement>(".fw-card");
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      // Note: no CSS `filter` here — an SVG-filter grain background (u-grain on
      // Section) compositing with a CSS-filtered sticky card renders black in
      // Chrome. The scale alone gives the stacked-depth effect.
      gsap.to(card, {
        scale: 0.92,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 24%",
          end: "+=" + window.innerHeight * 0.7,
          scrub: true,
        },
      });
    });
    return () => ScrollTrigger.refresh();
  });

  return (
    <Section id="four-way-test">
      <div ref={scope} className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow="The Four-Way Test"
              number="04"
              title="A timeless test of integrity."
              intro={fourWayIntro}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          {fourWayTest.map((item, i) => (
            <div
              key={item.n}
              className="fw-card sticky rounded-3xl border border-line bg-paper-2 p-8 shadow-[0_20px_60px_-40px_rgba(26,26,26,0.5)] sm:p-12"
              style={{ top: `${120 + i * 20}px` }}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
                <span className="u-display text-[clamp(4rem,10vw,8rem)] leading-none" style={{ color: accents[i] }}>
                  {item.n}
                </span>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">Is it…</span>
                  <h3 className={cn("font-display text-[clamp(2rem,4vw,3.5rem)] text-ink")}>{item.keyword}?</h3>
                  <p className="text-ink-soft">{item.question}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
