import type { ReactNode } from "react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  number?: string;
  title: string;
  paragraphs?: string[];
  band?: "paper" | "alt" | "ink";
  children?: ReactNode;
  narrow?: boolean;
}

/** Generic title + prose block for interior routes. */
export default function ContentBlock({
  eyebrow,
  number,
  title,
  paragraphs = [],
  band = "paper",
  children,
  narrow,
}: Props) {
  return (
    <Section band={band}>
      <div className={cn("grid grid-cols-1 gap-10 lg:grid-cols-12")}>
        <div className="lg:col-span-5">
          <SectionHeading eyebrow={eyebrow ?? ""} number={number} title={title} />
        </div>
        <Reveal
          stagger={0.1}
          className={cn("flex flex-col gap-5 lg:col-span-7", narrow && "lg:col-span-6")}
        >
          {paragraphs.map((p, i) => (
            <p key={i} className={cn("leading-relaxed", band === "ink" ? "text-white/75" : "text-ink-soft")}>
              {p}
            </p>
          ))}
          {children}
        </Reveal>
      </div>
    </Section>
  );
}
