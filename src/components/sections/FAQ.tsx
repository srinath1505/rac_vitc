"use client";

import { faqs } from "@/content/faq";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

interface Props {
  limit?: number;
  band?: "paper" | "alt";
}

/** FAQ — uses the ported vengenceui accordion (brand-adapted). */
export default function FAQ({ limit, band = "paper" }: Props) {
  const items = (limit ? faqs.slice(0, limit) : faqs).map((f) => ({
    question: f.q,
    answer: (
      <div>
        <p className="leading-relaxed">{f.a}</p>
        {f.bullets && (
          <ul className="mt-3 flex flex-col gap-1.5">
            {f.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-fern">—</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    ),
  }));

  return (
    <Section id="faq" band={band}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="FAQs" number="09" title="Questions, answered." />
        </div>
        <div className="lg:col-span-8">
          <FaqAccordion items={items} />
        </div>
      </div>
    </Section>
  );
}
