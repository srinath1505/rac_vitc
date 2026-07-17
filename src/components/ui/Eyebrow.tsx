import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  number?: string;
}

/** Mono, letter-spaced kicker with an optional index like "01 —". */
export default function Eyebrow({ children, className, number }: Props) {
  return (
    <span className={cn("u-eyebrow inline-flex items-center gap-2", className)}>
      {number && <span className="text-ink-faint">{number} —</span>}
      <span>{children}</span>
    </span>
  );
}
