import { areasOfFocus, areasIntro } from "@/content/focus";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

/** The Seven Areas of Focus — staggered grid with hover lift (§5.5). */
export default function AreasOfFocus() {
  return (
    <Section id="focus" band="alt">
      <SectionHeading
        eyebrow="The Seven Areas of Focus"
        number="03"
        title="Seven global causes. One measurable mission."
        intro={areasIntro}
      />

      <Reveal
        stagger={0.06}
        className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {areasOfFocus.map((area, i) => (
          <article
            key={area.title}
            data-cursor="link"
            className="group relative flex min-h-[17rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-line bg-paper-2 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-forest hover:bg-forest hover:shadow-[0_36px_70px_-38px_rgba(10,89,51,0.6)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-5xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" aria-hidden>
                {area.icon}
              </span>
              <span className="font-mono text-sm text-ink-faint transition-colors duration-500 group-hover:text-leaf">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-6">
              <h3 className="font-display text-[1.7rem] leading-tight text-ink transition-colors duration-500 group-hover:text-paper">
                {area.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft transition-colors duration-500 group-hover:text-paper/75">
                {area.body}
              </p>
            </div>
          </article>
        ))}
      </Reveal>
    </Section>
  );
}
