import { clubTimeline } from "@/content/history";
import Reveal from "@/components/motion/Reveal";
import Placeholder from "@/components/ui/Placeholder";
import { cn } from "@/lib/utils";

/**
 * Chronological club timeline — one row per year, merging president + that
 * year's awards. Ring-age colour gradient (forest → fern → leaf). This is also
 * the reduced-motion / mobile fallback for the Growth Ring set-piece (§5.6).
 */
function ringColor(i: number, total: number) {
  const f = i / (total - 1);
  if (f < 0.4) return "var(--forest)";
  if (f < 0.75) return "var(--fern)";
  return "var(--leaf)";
}

export default function ClubTimeline() {
  const total = clubTimeline.length;

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* central vine */}
      <div className="absolute left-[19px] top-2 h-full w-px bg-line sm:left-1/2" />

      <div className="flex flex-col gap-10">
        {clubTimeline.map((ring, i) => {
          const color = ringColor(i, total);
          const hasAwards = ring.awards.length > 0;
          return (
            <Reveal
              key={ring.year}
              className={cn(
                "relative flex flex-col gap-6 pl-14 sm:pl-0",
                i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
              )}
            >
              {/* node */}
              <span
                className="absolute left-[10px] top-1 flex h-5 w-5 items-center justify-center rounded-full sm:left-1/2 sm:-translate-x-1/2"
                style={{ background: color, boxShadow: hasAwards ? "0 0 0 4px rgba(255,215,0,0.35)" : "none" }}
              >
                {hasAwards && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
              </span>

              {/* card */}
              <div className="sm:w-[calc(50%_-_2.5rem)]">
                <div className="rounded-3xl border border-line bg-paper-2 p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line">
                      <Placeholder seed={ring.year} label={ring.president} kind="person" className="h-full w-full" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs" style={{ color }}>{ring.year}</span>
                        {ring.charter && (
                          <span className="rounded-full bg-forest/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-forest">
                            Charter
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xl text-ink">{ring.president}</h3>
                    </div>
                  </div>

                  {hasAwards ? (
                    <ul className="mt-5 flex flex-col gap-2 border-t border-line pt-4">
                      {ring.awards.map((a, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <span className="mt-0.5 text-gold">🏆</span>
                          <span className="text-ink">
                            {a.title}
                            {a.recipient && <span className="text-ink-soft"> — {a.recipient}</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 border-t border-line pt-4 text-sm text-ink-faint">
                      {ring.charter ? "The year it all began." : "Building quietly, growing steadily."}
                    </p>
                  )}
                </div>
              </div>

              <div className="hidden sm:block sm:w-[calc(50%_-_2.5rem)]" />
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
