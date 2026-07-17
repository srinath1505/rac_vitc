"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site, socials, nav } from "@/content/site";
import MagneticButton from "@/components/motion/MagneticButton";
import { scrollToSection } from "@/lib/lenis";
import { cn } from "@/lib/utils";

function BigLink({ href, children, external, section }: { href: string; children: React.ReactNode; external?: boolean; section?: string }) {
  const cls =
    "group inline-flex items-center gap-3 font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.05] text-paper transition-colors hover:text-leaf";
  const content = (
    <>
      {children}
      <ArrowUpRight className="h-[0.7em] w-[0.7em] shrink-0 text-leaf transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
    </>
  );
  const onClick = section
    ? (e: React.MouseEvent) => {
        if (typeof document !== "undefined" && document.querySelector(section)) {
          e.preventDefault();
          scrollToSection(section);
        }
      }
    : undefined;
  return (
    <MagneticButton strength={0.25}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} data-cursor="open">
          {content}
        </a>
      ) : (
        <Link href={href} onClick={onClick} className={cls} data-cursor="open">
          {content}
        </Link>
      )}
    </MagneticButton>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const mapSrc = `https://maps.google.com/maps?q=${site.address.mapsQuery}&z=15&output=embed`;

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      {/* Marquee tagline */}
      <div className="relative z-10 border-b border-white/10 py-6">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8 font-display text-2xl text-white/30">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8">
                Service Above Self <span className="text-leaf">✦</span> Leadership Beyond Limits{" "}
                <span className="text-leaf">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 u-container grid grid-cols-1 gap-16 py-20 lg:grid-cols-12">
        {/* Big CTAs */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <span className="u-eyebrow text-leaf">Let&apos;s build impact</span>
          <div className="flex flex-col gap-2">
            <BigLink href="/#partner" section="#partner">Partner With Us</BigLink>
            <BigLink href="/contact">Contact Us</BigLink>
            <BigLink href={`mailto:${site.email}`} external>
              Email
            </BigLink>
          </div>
        </div>

        {/* Contact details */}
        <div className="flex flex-col gap-10 lg:col-span-5">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-white/40">Visit us</span>
            {site.address.lines.map((l) => (
              <span key={l} className="text-white/80">{l}</span>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-white/40">Reach us</span>
            <a href={`mailto:${site.email}`} className="text-white/80 hover:text-leaf">{site.email}</a>
            {site.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="text-white/80 hover:text-leaf">{p}</a>
            ))}
          </div>

          <div className="flex gap-4">
            <a href={socials.instagram.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition-colors hover:border-leaf hover:text-leaf" data-cursor="open">
              Instagram
            </a>
            <a href={socials.linkedin.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition-colors hover:border-leaf hover:text-leaf" data-cursor="open">
              LinkedIn
            </a>
          </div>

          <div className="h-40 w-full overflow-hidden rounded-2xl border border-white/10 grayscale">
            <iframe
              title="VIT Chennai location"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="u-container flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/40 sm:flex-row">
          <span>© {year} {site.name}. Service Above Self.</span>
          <span className="font-mono uppercase tracking-widest">{site.district} · Sponsored by {site.parentClub}</span>
          <div className="flex gap-4">
            {nav.slice(0, 4).map((n) => {
              const href = n.target.startsWith("#") ? `/${n.target}` : n.target;
              return (
                <Link key={n.target} href={href} className={cn("hover:text-leaf")}>{n.label}</Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
