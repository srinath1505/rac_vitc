import type { Metadata } from "next";
import { contactPage } from "@/content/partner";
import { site, socials } from "@/content/site";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import Reveal from "@/components/motion/Reveal";
import { Mail, Phone, MapPin } from "lucide-react";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/SocialIcons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Rotaract Club of VIT Chennai.",
};

export default function ContactPage() {
  const mapSrc = `https://maps.google.com/maps?q=${site.address.mapsQuery}&z=15&output=embed`;

  return (
    <>
      <PageHeader eyebrow="Contact Us" title="Let's connect." intro={contactPage.intro} />

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <Reveal stagger={0.1} className="flex flex-col gap-6 lg:col-span-5">
            <div className="rounded-3xl border border-line bg-paper-2 p-8">
              <span className="font-mono text-xs uppercase tracking-widest text-fern">Get in touch</span>
              <div className="mt-4 flex flex-col gap-3">
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-ink hover:text-fern">
                  <Mail className="h-5 w-5 text-fern" /> {site.email}
                </a>
                {site.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="flex items-center gap-3 text-ink hover:text-fern">
                    <Phone className="h-5 w-5 text-fern" /> {p}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-paper-2 p-8">
              <span className="font-mono text-xs uppercase tracking-widest text-fern">Visit us</span>
              <div className="mt-4 flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-fern" />
                <address className="not-italic text-ink">
                  {site.address.lines.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                </address>
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-paper-2 p-8">
              <span className="font-mono text-xs uppercase tracking-widest text-fern">Connect with us</span>
              <p className="mt-2 text-sm text-ink-soft">{contactPage.connectLead}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={socials.instagram.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink hover:border-fern hover:text-fern">
                  <InstagramIcon className="h-4 w-4" /> {socials.instagram.handle}
                </a>
                <a href={socials.linkedin.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink hover:border-fern hover:text-fern">
                  <LinkedInIcon className="h-4 w-4" /> LinkedIn
                </a>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="h-full min-h-[400px] w-full overflow-hidden rounded-3xl border border-line">
              <iframe
                title="VIT Chennai location"
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[400px] w-full"
              />
            </div>
          </div>
        </div>

        <p className="mx-auto mt-16 max-w-3xl text-center text-lg text-ink-soft">{contactPage.outro}</p>
      </Section>
    </>
  );
}
