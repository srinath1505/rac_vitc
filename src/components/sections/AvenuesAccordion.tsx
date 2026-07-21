"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { avenues } from "@/content/avenues";
import { useIsDesktop, useHasFinePointer } from "@/hooks/useMediaQuery";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

/**
 * Avenues of Service — an expanding accordion. All four avenues stay visible at
 * all times: on desktop as a horizontal flex accordion (active panel grows,
 * others slim to a readable spine), on mobile as a vertical accordion. Clicking
 * any avenue opens a detail modal with a full write-up + "what we do" list.
 *
 * Deliberately CSS-driven (flex-grow / grid-rows transitions) rather than a
 * scroll-triggered gsap.from(opacity:0) — that shared Reveal pattern was what
 * left the old bento cards intermittently stuck invisible.
 */
export default function AvenuesAccordion() {
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState<number | null>(null);
  const isDesktop = useIsDesktop();
  const finePointer = useHasFinePointer();
  const rowRef = useRef<HTMLDivElement>(null);

  const onKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); setActive((i) => Math.min(i + 1, avenues.length - 1)); }
    if (e.key === "ArrowLeft") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
  };

  const da = detail !== null ? avenues[detail] : null;

  // ---- Desktop: horizontal expanding accordion ----
  const desktop = (
    <div
      ref={rowRef}
      onKeyDown={onKeyNav}
      onMouseLeave={() => finePointer && setActive(active)}
      className="mt-16 flex h-[clamp(24rem,58vh,34rem)] gap-3"
    >
      {avenues.map((a, i) => {
        const isOpen = active === i;
        const num = String(i + 1).padStart(2, "0");
        return (
          <button
            key={a.title}
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            data-cursor="view"
            onClick={() => { setActive(i); setDetail(i); }}
            onMouseEnter={() => finePointer && setActive(i)}
            onFocus={() => setActive(i)}
            className={cn(
              "group relative min-w-0 overflow-hidden rounded-[2rem] border text-left transition-[flex-grow,border-color,box-shadow] duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              isOpen
                ? "flex-[5] border-fern bg-paper-2 shadow-[0_40px_80px_-45px_rgba(10,89,51,0.55)]"
                : "flex-[0.7] border-line bg-paper-2 hover:border-fern/40"
            )}
          >
            {/* left accent rail — sweeps fern→leaf on the active panel */}
            <span
              className={cn(
                "absolute inset-y-0 left-0 w-1.5 origin-top bg-gradient-to-b from-fern to-leaf transition-transform duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                isOpen ? "scale-y-100" : "scale-y-0"
              )}
            />
            {/* ghost numeral */}
            <span
              className={cn(
                "pointer-events-none absolute -right-3 -top-8 font-display text-[9rem] leading-none transition-colors duration-500",
                isOpen ? "text-fern/10" : "text-ink/[0.04]"
              )}
              aria-hidden
            >
              {num}
            </span>

            {/* Collapsed spine — icon + vertical title, always readable */}
            <span
              className={cn(
                "absolute inset-0 flex flex-col items-center gap-5 py-8 transition-opacity duration-300",
                isOpen ? "pointer-events-none opacity-0" : "opacity-100 delay-150"
              )}
              aria-hidden={isOpen}
            >
              <span className="text-4xl" aria-hidden>{a.icon}</span>
              <span className="[writing-mode:vertical-rl] rotate-180 font-display text-xl tracking-tight text-ink">
                {a.title}
              </span>
              <span className="mt-auto font-mono text-xs text-ink-faint">{num}</span>
            </span>

            {/* Expanded content */}
            <span
              className={cn(
                "absolute inset-0 flex flex-col p-9 transition-opacity duration-500",
                isOpen ? "opacity-100 delay-150" : "pointer-events-none opacity-0"
              )}
              aria-hidden={!isOpen}
            >
              <span className="flex items-start justify-between">
                <span className="text-5xl transition-transform duration-500 group-hover:-translate-y-1" aria-hidden>{a.icon}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-fern/30 bg-fern/5 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-widest text-fern transition-colors group-hover:bg-fern group-hover:text-white">
                  Details <ArrowUpRight className="h-3 w-3" />
                </span>
              </span>
              <span className="mt-6 block font-display text-[2rem] leading-tight text-ink">{a.title}</span>
              <span className="mt-3 block max-w-md text-sm leading-relaxed text-ink-soft">{a.body}</span>
              <span className="mt-auto block border-t border-line pt-5">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-fern">Focus Areas</span>
                <span className="mt-3 flex flex-wrap gap-2">
                  {a.focusAreas.map((f) => (
                    <span key={f} className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-ink-soft">{f}</span>
                  ))}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );

  // ---- Mobile / touch: vertical accordion ----
  const mobile = (
    <div className="mt-12 flex flex-col gap-3">
      {avenues.map((a, i) => {
        const isOpen = active === i;
        const num = String(i + 1).padStart(2, "0");
        return (
          <div
            key={a.title}
            className={cn(
              "overflow-hidden rounded-[2rem] border transition-colors duration-300",
              isOpen ? "border-fern bg-paper-2" : "border-line bg-paper-2"
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              data-cursor="view"
              onClick={() => setActive(isOpen ? -1 : i)}
              className="flex w-full items-center gap-4 p-6 text-left"
            >
              <span className="text-4xl" aria-hidden>{a.icon}</span>
              <span className="flex flex-col">
                <span className="font-mono text-xs text-ink-faint">{num}</span>
                <span className="font-display text-2xl leading-tight text-ink">{a.title}</span>
              </span>
              <Plus
                className={cn(
                  "ml-auto h-6 w-6 shrink-0 text-fern transition-transform duration-500",
                  isOpen && "rotate-45"
                )}
              />
            </button>
            <div className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <div className="px-6 pb-7">
                  <p className="text-sm leading-relaxed text-ink-soft">{a.body}</p>
                  <div className="mt-5 border-t border-line pt-4">
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-fern">Focus Areas</span>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {a.focusAreas.map((f) => (
                        <li key={f} className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-ink-soft">{f}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetail(i)}
                    aria-haspopup="dialog"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-fern px-4 py-2 font-mono text-[0.65rem] uppercase tracking-widest text-white"
                  >
                    View full details <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {isDesktop ? desktop : mobile}

      <Modal open={detail !== null} onClose={() => setDetail(null)} title={da?.title} variant="center">
        {da && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl" aria-hidden>{da.icon}</span>
              <div className="flex flex-col">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-fern">Avenue of Service</span>
                <h3 className="font-display text-2xl text-ink">{da.title}</h3>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {da.detail.map((p, i) => (
                <p key={i} className="leading-relaxed text-ink-soft">{p}</p>
              ))}
            </div>

            <div className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-fern">What we do</span>
                <ul className="mt-3 flex flex-col gap-2">
                  {da.whatWeDo.map((w) => (
                    <li key={w} className="flex items-start gap-2 text-sm text-ink">
                      <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-fern">Focus areas</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {da.focusAreas.map((f) => (
                    <span key={f} className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-ink-soft">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
