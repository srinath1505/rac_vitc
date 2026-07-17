import { partner } from "@/content/partner";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import { ArrowRight, Check } from "lucide-react";

/** Partner With Us — Home teaser (§5.12) → /partner. */
export default function PartnerTeaser() {
  return (
    <Section id="partner">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <SectionHeading
            eyebrow="Partner With Us"
            number="08"
            title="Impact is built through partnership."
            intro={partner.paragraphs[0]}
          />
          <div className="mt-2">
            <Button href="/contact" variant="primary" magnetic cursor="view">
              Get in touch <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Reveal stagger={0.07} className="flex flex-col gap-3 lg:col-span-6">
          <span className="font-mono text-xs uppercase tracking-widest text-fern">
            {partner.whyTitle}
          </span>
          {partner.why.map((w) => (
            <div key={w} className="flex items-start gap-3 border-b border-line py-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-fern" />
              <span className="text-ink">{w}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
