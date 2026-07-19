import { partner } from "@/content/partner";
import { partnerContact } from "@/content/site";
import { stats } from "@/content/stats";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Counter from "@/components/motion/Counter";
import { ArrowRight, Check, Mail, Phone, Megaphone, Leaf, Users, Sparkles } from "lucide-react";

/** Reach counters — reuse the same curated numbers from the Stats section (§stats.ts). */
const REACH = [
  stats.find((s) => s.label === "Active members"),
  stats.find((s) => s.label === "Projects delivered"),
  stats.find((s) => s.label === "District & regional awards"),
].filter(Boolean) as typeof stats;

const PARTNERSHIP_TYPES = [
  {
    icon: Megaphone,
    title: "Sponsor an event",
    body: "Put your brand in front of one of Chennai's most active student communities at our signature drives and flagship events.",
  },
  {
    icon: Leaf,
    title: "Support a cause",
    body: "Back a community or environmental initiative — like Kadal Karai — and see your CSR investment turn into visible, on-ground impact.",
  },
  {
    icon: Users,
    title: "Collaborate on a project",
    body: "Co-create programmes, workshops, or campaigns with a hundred-strong team of young leaders ready to execute.",
  },
  {
    icon: Sparkles,
    title: "Engage talent",
    body: "Connect with a diverse, driven student community for internships, campus outreach, and early talent engagement.",
  },
];

/** Partner With Us — Home teaser (§5.12). An interactive pitch: reach
 *  counters, four partnership-type cards, and a compact gradient CTA. */
export default function PartnerTeaser() {
  return (
    <Section>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <SectionHeading
            eyebrow="Partner With Us"
            number="08"
            title="Impact is built through partnership."
            intro={partner.paragraphs[0]}
          />

          {/* Reach counters */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 border-y border-line py-6">
            {REACH.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="font-display text-3xl text-fern">
                  <Counter to={s.value} suffix={s.suffix} />
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Button href="/contact" variant="primary" magnetic cursor="view">
              Get in touch <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex flex-col gap-1 text-sm text-ink-soft">
              <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-fern" /> {partnerContact.email}</span>
              <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-fern" /> {partnerContact.phone} · {partnerContact.name}</span>
            </div>
          </div>
        </div>

        {/* Partnership-type cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
          {PARTNERSHIP_TYPES.map((t) => (
            <div
              key={t.title}
              data-cursor="view"
              className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-paper-2 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-fern hover:shadow-[0_30px_60px_-35px_rgba(10,89,51,0.5)]"
            >
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-fern to-leaf transition-transform duration-500 group-hover:scale-x-100" />
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-fern/10 text-fern transition-colors duration-500 group-hover:bg-fern group-hover:text-white">
                <t.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg text-ink">{t.title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{t.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why partner — compact pill row */}
      <div className="mt-10 flex flex-wrap gap-2.5">
        {partner.why.map((w) => (
          <span key={w} className="flex items-center gap-2 rounded-full border border-line bg-paper-2 px-4 py-2 text-xs text-ink-soft">
            <Check className="h-3.5 w-3.5 shrink-0 text-fern" /> {w}
          </span>
        ))}
      </div>

      {/* Compact gradient CTA */}
      <div
        className="relative mt-10 overflow-hidden rounded-3xl px-8 py-10 text-center text-white sm:px-12"
        style={{ background: "linear-gradient(135deg,#0a5933,#0b8f3f 60%,#7ac943 140%)" }}
      >
        <p className="mx-auto max-w-2xl font-display text-xl leading-snug sm:text-2xl">{partner.outro}</p>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">{partner.contactLead}</p>
        <div className="mt-6">
          <Button href="/contact" variant="gold" size="lg" magnetic cursor="view">
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Section>
  );
}
