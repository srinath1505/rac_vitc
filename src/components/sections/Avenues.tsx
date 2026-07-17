import { avenues, avenuesIntro, avenuesOutro, avenuesQuote } from "@/content/avenues";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitReveal from "@/components/motion/SplitReveal";
import Reveal from "@/components/motion/Reveal";
import InkFlowerField from "@/components/webgl/InkFlowerField";
import { ArrowUpRight } from "lucide-react";

/**
 * Avenues of Service — bold bento cards over the interactive ink-flower field
 * (click empty space or hover still ~0.5s to bloom).
 */
export default function Avenues() {
  return (
    <Section id="avenues" band="paper" container={false}>
      <InkFlowerField dwell={500} />

      <div className="relative z-10 u-container">
      <SectionHeading eyebrow="Avenues of Service" number="02" title="One club. Many avenues." intro={avenuesIntro} />

      <Reveal stagger={0.08} className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
        {avenues.map((a, i) => (
          <article
            key={a.title}
            data-cursor="view"
            className="group relative flex min-h-[22rem] flex-col overflow-hidden rounded-[2rem] border border-line bg-paper-2 p-9 transition-all duration-500 hover:-translate-y-1.5 hover:border-fern hover:shadow-[0_40px_80px_-45px_rgba(10,89,51,0.55)]"
          >
            {/* growing top accent */}
            <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-fern transition-transform duration-500 group-hover:scale-x-100" />
            {/* ghost numeral */}
            <span className="pointer-events-none absolute -right-2 -top-6 font-display text-[9rem] leading-none text-ink/[0.04] transition-colors duration-500 group-hover:text-fern/10">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="relative flex items-start justify-between">
              <span className="text-5xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" aria-hidden>{a.icon}</span>
              <ArrowUpRight className="h-6 w-6 -translate-y-1 translate-x-1 text-ink-faint opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-fern group-hover:opacity-100" />
            </div>

            <h3 className="relative mt-6 font-display text-[2rem] leading-tight text-ink">{a.title}</h3>
            <p className="relative mt-3 max-w-md text-sm leading-relaxed text-ink-soft">{a.body}</p>

            {/* Focus areas — visible on touch; slide up on hover (desktop) */}
            <div className="relative mt-auto overflow-hidden pt-6 transition-[max-height,opacity] duration-500 max-h-[300px] opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-[300px] md:group-hover:opacity-100">
              <div className="border-t border-line pt-5">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-fern">Focus Areas</span>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {a.focusAreas.map((f) => (
                    <li key={f} className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-ink-soft">{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </Reveal>

      <p className="mx-auto mt-16 max-w-3xl text-center text-ink-soft">{avenuesOutro}</p>

      <SplitReveal as="blockquote" type="words" className="u-display mx-auto mt-12 max-w-4xl text-center text-[clamp(2rem,5vw,3.75rem)] text-ink">
        “{avenuesQuote}”
      </SplitReveal>
      </div>
    </Section>
  );
}
