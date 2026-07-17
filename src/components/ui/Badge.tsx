import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  tone?: "fern" | "gold" | "ink" | "leaf";
  className?: string;
}

const tones = {
  fern: "border-fern/30 bg-fern/10 text-fern-deep",
  gold: "border-gold/40 bg-gold/15 text-ink",
  ink: "border-ink/15 bg-ink/5 text-ink",
  leaf: "border-leaf/40 bg-leaf/15 text-forest",
};

export default function Badge({ children, tone = "fern", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex w-max items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-widest",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
