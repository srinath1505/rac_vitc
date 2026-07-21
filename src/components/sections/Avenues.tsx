import { avenuesIntro, avenuesOutro, avenuesQuote } from "@/content/avenues";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitReveal from "@/components/motion/SplitReveal";
import AvenuesAccordion from "@/components/sections/AvenuesAccordion";
import InkFlowerField from "@/components/webgl/InkFlowerField";
import { Sparkles } from "lucide-react";

/**
 * Avenues of Service — an expanding accordion over the interactive ink-flower
 * field (click empty space or hover still ~0.5s to bloom). All four avenues
 * stay visible at all times; the active one expands to reveal its focus areas.
 */
export default function Avenues() {
  return (
    <Section id="avenues" band="paper" container={false}>
      <InkFlowerField dwell={500} />

      <div className="relative z-10 u-container">
      <SectionHeading eyebrow="Avenues of Service" number="02" title="One club. Many avenues." intro={avenuesIntro} />

      <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-fern/70">
        <Sparkles className="h-3 w-3" /> Psst — move or click around to watch it bloom
      </p>

      <AvenuesAccordion />

      <p className="mx-auto mt-16 max-w-3xl text-center text-ink-soft">{avenuesOutro}</p>

      <SplitReveal as="blockquote" type="words" className="u-display mx-auto mt-12 max-w-4xl text-center text-[clamp(2rem,5vw,3.75rem)] text-ink">
        “{avenuesQuote}”
      </SplitReveal>
      </div>
    </Section>
  );
}
