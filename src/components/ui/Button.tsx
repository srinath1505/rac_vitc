"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import MagneticButton from "@/components/motion/MagneticButton";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "gold" | "ink";
type Size = "sm" | "md" | "lg";

interface Props {
  children: ReactNode;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  className?: string;
  cursor?: string;
  ariaLabel?: string;
}

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fern focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

const variants: Record<Variant, string> = {
  primary: "bg-fern text-white hover:bg-fern-deep",
  gold: "bg-gold text-ink hover:brightness-95",
  ink: "bg-ink text-paper hover:bg-forest",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink hover:text-fern",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

export default function Button({
  children,
  href,
  external,
  onClick,
  variant = "primary",
  size = "md",
  magnetic = false,
  className,
  cursor,
  ariaLabel,
}: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);
  const cursorAttr = cursor ? { "data-cursor": cursor } : {};

  const inner = href ? (
    external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls} aria-label={ariaLabel} {...cursorAttr}>
        {children}
      </a>
    ) : (
      <Link href={href} onClick={onClick} className={cls} aria-label={ariaLabel} {...cursorAttr}>
        {children}
      </Link>
    )
  ) : (
    <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel} {...cursorAttr}>
      {children}
    </button>
  );

  return magnetic ? <MagneticButton strength={0.4}>{inner}</MagneticButton> : inner;
}
