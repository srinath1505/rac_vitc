"use client";

// Ported from vengenceui.com/r/faq-accordion.json — adapted to our brand tokens.
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const toggle = (i: number) => setActiveIndex(activeIndex === i ? null : i);

  return (
    <div className={cn("w-full", className)}>
      <ul className="m-0 flex w-full list-none flex-col p-0">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <li key={index} className="relative w-full border-b border-line last:border-b-0">
              <button
                onClick={() => toggle(index)}
                aria-expanded={isActive}
                data-cursor={isActive ? "close" : "open"}
                className={cn(
                  "relative m-0 flex min-h-[68px] w-full cursor-pointer flex-row items-center justify-start py-5 pl-14 pr-12 text-left text-lg outline-none transition-colors duration-200 md:pl-16 md:text-xl",
                  "border-l-[6px] md:border-l-[10px]",
                  isActive
                    ? "border-l-fern bg-fern/5 font-semibold text-ink"
                    : "border-l-line bg-transparent text-ink-soft hover:border-l-fern/50 hover:bg-paper-3 hover:text-ink"
                )}
              >
                <span
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 font-display leading-none transition-all duration-200 md:left-5",
                    isActive ? "text-[36px] text-fern md:text-[42px]" : "text-[26px] text-ink-faint md:text-[32px]"
                  )}
                >
                  {isActive ? "−" : "+"}
                </span>
                <span className="font-display">{item.question}</span>
                <span
                  className={cn(
                    "absolute right-6 block h-2 w-2 border-r-[3px] border-t-[3px] transition-transform duration-300 ease-in-out",
                    isActive ? "rotate-[-44deg] border-fern" : "rotate-[133deg] border-ink-faint"
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid w-full border-l-[6px] transition-all duration-300 ease-in-out md:border-l-[10px]",
                  isActive ? "grid-rows-[1fr] border-l-fern bg-fern/5" : "grid-rows-[0fr] border-l-line bg-transparent"
                )}
              >
                <div className="overflow-hidden">
                  <div className="w-full px-4 pb-6 pl-14 pt-1 text-base leading-relaxed text-ink-soft md:pl-16 md:text-lg">
                    {item.answer}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FaqAccordion;
