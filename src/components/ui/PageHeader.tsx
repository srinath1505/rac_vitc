import type { ReactNode } from "react";
import Eyebrow from "./Eyebrow";
import SplitReveal from "@/components/motion/SplitReveal";

interface Props {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
}

/** Consistent hero band for interior routes. */
export default function PageHeader({ eyebrow, title, intro }: Props) {
  return (
    <header className="u-container flex flex-col gap-6 pb-16 pt-36 sm:pb-24 sm:pt-52">
      <Eyebrow>{eyebrow}</Eyebrow>
      <SplitReveal
        as="h1"
        type="words"
        trigger="preloader"
        className="u-display max-w-[18ch] text-[clamp(2.5rem,7vw,6rem)] text-ink"
      >
        {title}
      </SplitReveal>
      {intro && <p className="max-w-2xl text-lg text-ink-soft">{intro}</p>}
    </header>
  );
}
