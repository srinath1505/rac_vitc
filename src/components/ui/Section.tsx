import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  id?: string;
  band?: "paper" | "alt" | "ink";
  className?: string;
  container?: boolean;
}

/** Consistent vertical rhythm + optional band background. */
export default function Section({
  children,
  id,
  band = "paper",
  className,
  container = true,
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 sm:py-28 lg:py-36",
        band === "alt" && "bg-paper-2",
        band === "ink" && "bg-ink text-paper",
        className
      )}
    >
      {container ? <div className="u-container">{children}</div> : children}
    </section>
  );
}
