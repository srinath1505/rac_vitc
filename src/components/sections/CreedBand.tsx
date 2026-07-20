import SplitReveal from "@/components/motion/SplitReveal";

/**
 * A calm, dark editorial "creed" band — replaces the old scrolling marquee.
 * One oversized statement on ink, breaking the cream flow (contrast + type
 * drama) with a line-reveal on scroll.
 */
export default function CreedBand() {
  return (
    <section className="u-grain relative overflow-hidden border-y border-white/10 bg-ink py-24 text-paper sm:py-32">
      {/* faint gold + leaf glow */}
      <span className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-fern/20 blur-3xl" aria-hidden />
      <span className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden />

      <div className="relative z-10 u-container text-center">
        <span className="u-eyebrow text-leaf">Our creed</span>
        <SplitReveal as="h2" type="lines" className="u-display mx-auto mt-5 max-w-5xl text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.92] text-paper">
          Service <span className="text-leaf">above</span> self.
          Leadership <span className="italic text-gold">beyond</span> limits.
        </SplitReveal>
        <p className="mx-auto mt-8 max-w-xl text-paper/65">
          The two ideas everything on this page grows from — one club, many avenues, infinite possibilities.
        </p>
      </div>
    </section>
  );
}
