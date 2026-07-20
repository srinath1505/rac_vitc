"use client";

import { useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { greenRotaractors } from "@/content/join";
import { site } from "@/content/site";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

/**
 * Green Rotaractor registration (§5.10). The Google Form opens in a slide-in
 * modal rather than a bare embed; a new-tab fallback covers frame-blocking.
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
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => setOpen(true)} size="lg" variant="gold" magnetic cursor="join">
            Open registration form <ArrowUpRight className="h-5 w-5" />
          </Button>
          <Button href={site.registrationForm} external size="lg" variant="ink">
            Open in new tab <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Green Rotaractor Registration" variant="side">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-soft">
            Fill in the form below to begin your Rotaract journey. Trouble loading?{" "}
            <a href={site.registrationForm} target="_blank" rel="noopener noreferrer" className="text-fern underline">
              open it in a new tab
            </a>
            .
          </p>
          <div className="h-[70vh] w-full overflow-hidden rounded-2xl border border-line">
            <iframe
              title="Green Rotaractor Registration Form"
              src={site.registrationForm}
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      </Modal>
    </section>
  );
}
