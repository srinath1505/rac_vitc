import type { Metadata } from "next";
import { rotaryFormation, whatIsRotaract, objectives, district } from "@/content/aboutRotaract";
import PageHeader from "@/components/ui/PageHeader";
import ContentBlock from "@/components/sections/ContentBlock";
import FourWayTest from "@/components/sections/FourWayTest";
import AreasOfFocus from "@/components/sections/AreasOfFocus";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About Rotaract",
  description:
    "The story of Rotary and Rotaract — a global movement of young leaders committed to Service Above Self.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Rotaract"
        title="Leadership, best learned through service."
        intro="A global network of young leaders aged 18 and above, creating sustainable solutions for the world's most pressing challenges."
      />

      <ContentBlock
        eyebrow="Formation of Rotary"
        number="01"
        title={rotaryFormation.title}
        paragraphs={rotaryFormation.paragraphs}
      />

      <ContentBlock
        eyebrow="What is Rotaract?"
        number="02"
        title={whatIsRotaract.title}
        paragraphs={whatIsRotaract.paragraphs}
        band="alt"
      />

      <Section>
        <SectionHeading
          eyebrow="Our Objectives"
          number="03"
          title="What we set out to do."
          intro={objectives.intro}
        />
        <Reveal stagger={0.06} className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {objectives.items.map((o, i) => (
            <div key={o} className="flex items-baseline gap-4 rounded-2xl border border-line bg-paper-2 p-6">
              <span className="u-display text-3xl text-leaf">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-ink">{o}</span>
            </div>
          ))}
        </Reveal>
      </Section>

      <FourWayTest />
      <AreasOfFocus />

      <ContentBlock
        eyebrow="District 3234"
        number="10"
        title={district.title}
        paragraphs={district.paragraphs}
        band="alt"
      />
    </>
  );
}
