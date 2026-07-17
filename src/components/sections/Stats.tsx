import { stats } from "@/content/stats";
import Counter from "@/components/motion/Counter";
import Reveal from "@/components/motion/Reveal";

const TICKER = ["Service Above Self", "Kadal Karai", "Green Rotaractors", "District 3234", "Since 2019"];

/** Live Club Statistics — bold band with a marquee ticker + oversized counters. */
export default function Stats() {
  return (
    <section className="relative border-y border-line bg-ink text-paper">
      {/* marquee ticker */}
      <div className="overflow-hidden border-b border-white/10 py-2.5">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee flex shrink-0 items-center gap-6 pr-6">
            {Array.from({ length: 4 }).flatMap((_, k) =>
              TICKER.map((t) => (
                <span key={`${k}-${t}`} className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                  {t} <span className="text-leaf">✦</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <Reveal stagger={0.08} className="u-container grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative flex flex-col gap-2 bg-ink p-6 transition-colors duration-500 hover:bg-forest sm:p-7"
          >
            <span className="text-2xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" aria-hidden>
              {s.icon}
            </span>
            <span className="u-display text-[clamp(1.75rem,4vw,3rem)] leading-[0.95] text-paper transition-colors group-hover:text-leaf">
              <Counter to={s.value} suffix={s.suffix} />
            </span>
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-white/50">{s.label}</span>
            <span className="absolute inset-x-6 top-0 h-0.5 origin-left scale-x-0 bg-leaf transition-transform duration-500 group-hover:scale-x-100" />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
