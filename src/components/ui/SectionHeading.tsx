import type { ReactNode } from "react";
import Eyebrow from "./Eyebrow";
import SplitReveal from "@/components/motion/SplitReveal";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  number?: string;
  title: ReactNode;
  intro?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export default function SectionHeading({
  eyebrow,
  number,
  title,
  intro,
  align = "left",
  className,
  titleClassName,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <Eyebrow number={number}>{eyebrow}</Eyebrow>
      )}
      <SplitReveal
        as="h2"
        className={cn(
          "u-display text-[clamp(2rem,4.5vw,4rem)] text-ink",
          align === "center" && "mx-auto max-w-4xl",
          titleClassName
        )}
      >
        {title}
      </SplitReveal>
      {intro && (
        <p
          className={cn(
            "max-w-2xl text-ink-soft leading-relaxed",
            align === "center" && "mx-auto"
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
