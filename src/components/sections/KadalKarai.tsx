import { signatureProject } from "@/content/projects";
import Eyebrow from "@/components/ui/Eyebrow";
import SplitReveal from "@/components/motion/SplitReveal";
import Counter from "@/components/motion/Counter";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

/**
 * Signature Project — Kadal Karai (§5.9). Home cinematic teaser with the one
 * sanctioned palette break (ocean → seafoam → sand). The pinned parallax scene
 * with scrubbed reveal is built in Phase 3 on /projects.
 */
export default function KadalKarai() {
  const p = signatureProject;
  return (
    <section
      id="kadal-karai"
      className="relative overflow-hidden py-28 text-white sm:py-36"
      style={{
        background:
          "linear-gradient(180deg,#06273a 0%,#0a3d5c 45%,#116a72 80%,#3a8f86 100%)",
      }}
    >
      {/* seafoam glow + sand base */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[#5fd0c5]/20 blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(180deg,transparent,#e8d9b5)" }}
      />

      <div className="u-container relative z-10">
        <Eyebrow className="text-[#8fe9dd]">Signature Project</Eyebrow>

        <SplitReveal
          as="h2"
          type="chars"
          stagger={0.03}
          className="u-display mt-6 text-[clamp(3rem,12vw,10rem)] leading-[0.9] text-white"
        >
          Kadal Karai
        </SplitReveal>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <p className="text-lg leading-relaxed text-white/80 lg:col-span-7">
            {p.paragraphs[0]}
          </p>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <Reveal stagger={0.1} className="grid grid-cols-3 gap-4">
              {p.stats?.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span className="u-display text-4xl text-[#8fe9dd]">
                    <Counter to={s.value} suffix={s.suffix} />
                  </span>
                  <span className="text-xs text-white/60">{s.label}</span>
                </div>
              ))}
            </Reveal>
            <Button href="/#join" variant="gold" magnetic cursor="join" className="w-max">
              Join a cleanup <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
