import type { Metadata } from "next";
import { rotaryFormation, whatIsRotaract, objectives, district, parentClub } from "@/content/aboutRotaract";
import PageHeader from "@/components/ui/PageHeader";
import ContentBlock from "@/components/sections/ContentBlock";
import FourWayTest from "@/components/sections/FourWayTest";
import AreasOfFocus from "@/components/sections/AreasOfFocus";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import InkFlowerField from "@/components/webgl/InkFlowerField";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About Rotaract",
  description:
    "The story of Rotary and Rotaract — a global movement of young leaders committed to Service Above Self.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero over the auto-blooming ink-flower field */}
      <div className="relative overflow-hidden">
        <InkFlowerField auto autoInterval={1000} />
        <div className="relative z-10">
          <PageHeader
            eyebrow="About Rotaract"
            title={<>Leadership, best learned through <span className="text-fern">service</span>.</>}
            intro="A global network of young leaders aged 18 and above, creating sustainable solutions for the world's most pressing challenges."
          />
        </div>
      </div>

      <ContentBlock
        eyebrow="Formation of Rotary"
        number="01"
        title={rotaryFormation.title}
        paragraphs={rotaryFormation.paragraphs}
        band="alt"
      />

      <ContentBlock
        eyebrow="What is Rotaract?"
        number="02"
        title={whatIsRotaract.title}
        paragraphs={whatIsRotaract.paragraphs}
      />

      <Section band="alt">
        <SectionHeading
          eyebrow="Our Objectives"
          number="03"
          title="What we set out to do."
          intro={objectives.intro}
        />
        <Reveal stagger={0.06} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {objectives.items.map((o, i) => (
            <div
              key={o}
              className="group relative flex items-start gap-5 overflow-hidden rounded-2xl border border-line bg-paper p-6 transition-all duration-500 hover:-translate-y-1 hover:border-fern hover:shadow-[0_24px_50px_-32px_rgba(10,89,51,0.5)]"
            >
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-fern to-leaf transition-transform duration-500 group-hover:scale-x-100" />
              <span className="u-display text-4xl leading-none text-transparent [-webkit-text-stroke:1px_var(--fern)] transition-colors duration-500 group-hover:text-fern">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pt-1 text-ink">{o}</span>
            </div>
          ))}
        </Reveal>
      </Section>

      <FourWayTest />
      <AreasOfFocus />

      {/* Parent Club — a gold-accented highlight */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-paper-2 p-8 sm:p-12">
            <span className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-gold/30" aria-hidden />
            <span className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-gold/15" aria-hidden />
            <span className="inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest text-gold">
              <Sparkles className="h-3.5 w-3.5" /> Our Parent Club
            </span>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight text-ink">{parentClub.title}</h2>
            <p className="mt-6 max-w-3xl leading-relaxed text-ink-soft">{parentClub.body}</p>
          </div>
        </Reveal>
      </Section>

      <ContentBlock
        eyebrow="District 3234"
        number="11"
        title={district.title}
        paragraphs={district.paragraphs}
        band="alt"
      />
    </>
  );
}
