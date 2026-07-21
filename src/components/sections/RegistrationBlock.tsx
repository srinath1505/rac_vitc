"use client";

import { useState } from "react";
import { ArrowUpRight, Clock, LogIn, Sparkles } from "lucide-react";
import { greenRotaractors } from "@/content/join";
import { site } from "@/content/site";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

const LAUNCH_POINTS = [
  { icon: Clock, text: "Takes about 2 minutes to complete." },
  { icon: LogIn, text: "You'll sign in with your Google account (VIT email preferred)." },
  { icon: Sparkles, text: "We'll follow up with orientation details soon after." },
];

/**
 * Green Rotaractor registration (§5.10). The club's Google Form is sign-in
 * restricted, so it can't be embedded in an iframe (Google blocks framing of
 * its auth pages). Instead a branded "launch" modal sets expectations and opens
 * the form in a new tab, where sign-in works reliably.
 */
export default function RegistrationBlock() {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="u-grain relative overflow-hidden py-24 text-white"
      style={{ background: "linear-gradient(135deg,#0a5933,#0b8f3f 60%,#7ac943 140%)" }}
    >
      {/* floating leaves + gold flourish (decorative) */}
      <span className="animate-float pointer-events-none absolute left-[8%] top-[18%] text-3xl opacity-30" aria-hidden style={{ animationDelay: "0s" }}>🌿</span>
      <span className="animate-float pointer-events-none absolute right-[10%] top-[30%] text-2xl opacity-25" aria-hidden style={{ animationDelay: "1.5s" }}>🍃</span>
      <span className="animate-float pointer-events-none absolute bottom-[16%] left-[16%] text-2xl opacity-20" aria-hidden style={{ animationDelay: "0.8s" }}>🌱</span>
      <span className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-gold/25" aria-hidden />
      <span className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full border border-white/10" aria-hidden />

      <div className="relative z-10 u-container flex flex-col items-center gap-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" /> Rolling intake · takes 2 minutes
        </span>
        <h2 className="u-display u-gold-foil text-[clamp(2rem,6vw,4.5rem)] uppercase leading-[0.9]">
          {greenRotaractors.ctaTitle}
        </h2>
        <p className="max-w-2xl text-lg text-white/85">{greenRotaractors.ctaBody}</p>
        <div className="mt-2">
          <Button onClick={() => setOpen(true)} size="lg" variant="gold" magnetic cursor="join">
            Register now <ArrowUpRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Branded launch modal — sets expectations, then opens the form in a new tab */}
      <Modal open={open} onClose={() => setOpen(false)} title="Become a Green Rotaractor" variant="center" className="max-w-lg">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-fern/10 text-3xl">
            🌱
            <span className="absolute inset-0 rounded-full ring-2 ring-fern/20" />
          </span>

          <div>
            <h3 className="font-display text-2xl text-ink">You&rsquo;re one step away.</h3>
            <p className="mt-2 text-ink-soft">The registration form opens in a new tab — here&rsquo;s what to expect.</p>
          </div>

          <ul className="flex w-full flex-col gap-3 text-left">
            {LAUNCH_POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 rounded-2xl border border-line bg-paper-2 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fern/10 text-fern">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="pt-1 text-sm text-ink-soft">{text}</span>
              </li>
            ))}
          </ul>

          <Button
            href={site.registrationForm}
            external
            onClick={() => setOpen(false)}
            size="lg"
            variant="primary"
            magnetic
            cursor="join"
            className="w-full justify-center"
          >
            Open the registration form <ArrowUpRight className="h-5 w-5" />
          </Button>
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-faint">Opens Google Forms in a new tab</p>
        </div>
      </Modal>
    </section>
  );
}
