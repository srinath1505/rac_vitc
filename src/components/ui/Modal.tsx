"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { stopScroll, startScroll } from "@/lib/lenis";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: "side" | "center";
  className?: string;
}

/** Accessible modal: focus-trapped, Esc/backdrop close, locks smooth scroll. */
export default function Modal({ open, onClose, title, children, variant = "side", className }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
  }, []);

  useEffect(() => {
    if (!open) return;
    stopScroll();
    document.body.style.overflow = "hidden";
    const prevFocus = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,select,textarea,iframe,[tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      startScroll();
      prevFocus?.focus();
    };
  }, [open, onClose]);

  if (!mounted.current && typeof window === "undefined") return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[300] transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        data-lenis-prevent
        className={cn(
          "absolute overflow-y-auto bg-paper shadow-2xl outline-none transition-transform duration-500 ease-[cubic-bezier(0.83,0,0.17,1)]",
          variant === "side"
            ? cn(
                "right-0 top-0 h-full w-full max-w-xl",
                open ? "translate-x-0" : "translate-x-full"
              )
            : cn(
                "left-1/2 top-1/2 max-h-[90vh] w-[min(92vw,900px)] -translate-x-1/2 rounded-3xl",
                open ? "-translate-y-1/2 scale-100" : "-translate-y-[45%] scale-95"
              ),
          className
        )}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/90 px-6 py-4 backdrop-blur">
          <span className="font-display text-lg text-ink">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:bg-ink hover:text-paper"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
