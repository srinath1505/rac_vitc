"use client";

// Ironhill-style scroll word-reveal: each word fades from faint to full as the
// block scrolls through the viewport (github.com/Animmaster/Ironhill-section-rebuild).
import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";

export default function WordReveal({
  children,
  className,
  as: Tag = "h2",
}: {
  children: string;
  className?: string;
  as?: "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(el, { type: "words" });
      const words = split.words;
      gsap.set(words, { opacity: 0.12 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        end: "bottom 45%",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const total = words.length;
          words.forEach((word, i) => {
            const wp = i / total;
            const nwp = (i + 1) / total;
            let opacity = 0.12;
            if (p >= nwp) opacity = 1;
            else if (p >= wp) opacity = 0.12 + 0.88 * ((p - wp) / (nwp - wp));
            gsap.to(word, { opacity, duration: 0.1, overwrite: true });
          });
        },
      });
      return () => split.revert();
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
