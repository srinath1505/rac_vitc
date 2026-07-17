"use client";

import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Clock, MapPin, ArrowUpRight } from "lucide-react";
import { events } from "@/content/events";
import type { ClubEvent } from "@/content/types";
import Placeholder from "@/components/ui/Placeholder";
import EventPopover from "@/components/sections/EventPopover";
import { cn, clamp } from "@/lib/utils";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Pop { event: ClubEvent; x: number; y: number; placement: "top" | "bottom"; }

/** Rich month calendar: coloured event chips (leaf = upcoming, gold = past),
 *  hover rich-preview popover, a bold detail card, and a "next up" rail. */
export default function EventsCalendar() {
  const [cursor, setCursor] = useState(new Date(2026, 6, 1));
  const [selected, setSelected] = useState<ClubEvent | null>(events.find((e) => e.id === "kadal-karai-jul") ?? null);
  const [pop, setPop] = useState<Pop | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = typeof document !== "undefined";

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const byDate = useMemo(() => { const m = new Map<string, ClubEvent>(); events.forEach((e) => m.set(e.date, e)); return m; }, []);
  const upcoming = useMemo(() => events.filter((e) => e.type === "upcoming").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3), []);
  const keyFor = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const openPop = (ev: ClubEvent, el: HTMLElement) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const r = el.getBoundingClientRect();
    const placement: "top" | "bottom" = r.top > 300 ? "top" : "bottom";
    setPop({ event: ev, x: clamp(r.left + r.width / 2, 170, window.innerWidth - 170), y: placement === "top" ? r.top - 10 : r.bottom + 10, placement });
  };
  const scheduleClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setPop(null), 160); };
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Calendar */}
      <div className="overflow-hidden rounded-[2rem] border border-line bg-paper-2 lg:col-span-7">
        <div className="flex items-center justify-between border-b border-line bg-paper px-8 py-6">
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-3xl text-ink">{MONTHS[month]}</h3>
            <span className="font-mono text-sm text-ink-faint">{year}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label="Previous month" data-cursor="link" className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:bg-ink hover:text-paper"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label="Next month" data-cursor="link" className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:bg-ink hover:text-paper"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-3 grid grid-cols-7 gap-2 text-center">
            {DOW.map((d, i) => <span key={i} className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">{d.slice(0, 2)}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const ev = byDate.get(keyFor(day));
              const isSel = selected && ev && selected.id === ev.id;
              return (
                <button
                  key={day}
                  disabled={!ev}
                  onClick={() => ev && setSelected(ev)}
                  onMouseEnter={(e) => ev && openPop(ev, e.currentTarget)}
                  onMouseLeave={() => ev && scheduleClose()}
                  onFocus={(e) => ev && openPop(ev, e.currentTarget)}
                  onBlur={() => ev && scheduleClose()}
                  data-cursor={ev ? "view" : undefined}
                  aria-label={ev ? `${ev.title} on ${ev.date}` : undefined}
                  className={cn(
                    "relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm transition-all duration-300",
                    !ev && "text-ink-faint",
                    ev && !isSel && ev.type === "upcoming" && "bg-leaf/12 font-bold text-forest ring-1 ring-leaf/40 hover:-translate-y-0.5 hover:bg-leaf/25 hover:shadow-lg",
                    ev && !isSel && ev.type === "past" && "bg-gold/12 font-semibold text-ink ring-1 ring-gold/40 hover:-translate-y-0.5 hover:bg-gold/25",
                    isSel && "-translate-y-0.5 bg-fern font-bold text-white shadow-[0_12px_28px_-10px_rgba(11,143,63,0.7)]"
                  )}
                >
                  {day}
                  {ev && <span className={cn("mt-0.5 h-1 w-1 rounded-full", isSel ? "bg-white" : ev.type === "upcoming" ? "bg-leaf" : "bg-gold")} />}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-5 border-t border-line pt-5 text-xs text-ink-soft">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-leaf ring-2 ring-leaf/30" /> Upcoming</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-gold/80" /> Past</span>
            <span className="ml-auto hidden font-mono uppercase tracking-widest text-ink-faint sm:block">Hover a date</span>
          </div>
        </div>
      </div>

      {/* Detail + upcoming rail */}
      <div className="flex flex-col gap-6 lg:col-span-5">
        {selected && (
          <article className="group overflow-hidden rounded-[2rem] border border-line bg-paper-2">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Placeholder seed={selected.id} label={selected.title} kind="scene" className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
              <span className={cn("absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest", selected.type === "upcoming" ? "bg-leaf text-forest" : "bg-gold text-ink")}>{selected.type}</span>
              <span className="absolute bottom-4 left-4 font-mono text-xs text-paper/90">{selected.date}</span>
            </div>
            <div className="flex flex-col gap-3 p-7">
              <h4 className="font-display text-2xl text-ink">{selected.title}</h4>
              <p className="text-sm leading-relaxed text-ink-soft">{selected.description}</p>
              <div className="mt-1 flex flex-col gap-2 border-t border-line pt-4 text-sm text-ink-soft">
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-fern" /> {selected.time}</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-fern" /> {selected.location}</span>
              </div>
            </div>
          </article>
        )}

        <div className="rounded-[2rem] border border-line bg-paper p-7">
          <span className="font-mono text-xs uppercase tracking-widest text-fern">Next up</span>
          <div className="mt-4 flex flex-col">
            {upcoming.map((e) => (
              <button key={e.id} onClick={() => setSelected(e)} data-cursor="view" className="group flex items-center justify-between gap-4 border-b border-line py-4 text-left last:border-0">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-leaf/15 font-mono text-forest">
                    <span className="text-sm font-bold leading-none">{e.date.slice(8)}</span>
                    <span className="text-[0.55rem] uppercase leading-none">{MONTHS[Number(e.date.slice(5, 7)) - 1].slice(0, 3)}</span>
                  </span>
                  <span className="font-medium text-ink transition-colors group-hover:text-fern">{e.title}</span>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fern" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {mounted && pop && createPortal(<EventPopover event={pop.event} x={pop.x} y={pop.y} placement={pop.placement} onEnter={cancelClose} onLeave={scheduleClose} />, document.body)}
    </div>
  );
}
