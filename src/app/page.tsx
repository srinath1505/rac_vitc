import { greenRotaractors } from "@/content/join";
import IronhillHero from "@/components/sections/IronhillHero";
import Stats from "@/components/sections/Stats";
import Avenues from "@/components/sections/Avenues";
import TeamScroll from "@/components/sections/TeamScroll";
import KadalKaraiScene from "@/components/sections/KadalKaraiScene";
import BeforeAfterSlider from "@/components/sections/BeforeAfterSlider";
import EventsCalendar from "@/components/sections/EventsCalendar";
import GalleryWall from "@/components/gallery/GalleryWall";
import GrowthTree from "@/components/club/GrowthTree";
import RegistrationBlock from "@/components/sections/RegistrationBlock";
import PartnerTeaser from "@/components/sections/PartnerTeaser";
import FAQ from "@/components/sections/FAQ";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ScrollMarquee from "@/components/motion/ScrollMarquee";
import { ImageScatter } from "@/components/ui/ImageScatter";
import { DiagonalCarousel } from "@/components/ui/DiagonalCarousel";
import { AnimatedTooltip } from "@/components/ui/AnimatedTooltip";
import Button from "@/components/ui/Button";
import { scatterSets } from "@/content/gallery";
import { events, nextKadalKaraiEvent } from "@/content/events";
import { signatureProject } from "@/content/projects";
import { sceneUrl, formatEventDate } from "@/lib/utils";
import { Leaf, Calendar, Award, Waves, ArrowRight } from "lucide-react";

const eventSlides = events.map((e) => ({ src: sceneUrl(e.id), title: e.title }));

export default function Home() {
  return (
    <>
      <IronhillHero />

      <Stats />

      {/* CLUB — Growth Tree showpiece */}
      <Section id="club" band="alt" container={false}>
        <div className="u-container">
          <SectionHeading
            eyebrow="About the Club"
            number="01"
            title="Eight years, root to canopy."
            intro="Chartered in 2019 and growing ever since — watch the seed we planted become the tree we are today, one year at a time."
            align="center"
          />
        </div>
        <div className="mt-16">
          <GrowthTree />
        </div>
      </Section>

      {/* Scroll-driven marquee transition */}
      <div className="border-y border-line bg-ink py-8 text-paper sm:py-12">
        <ScrollMarquee>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="u-display flex items-center gap-8 pr-8 text-[clamp(2.25rem,7vw,6rem)] text-paper">
              Service Above Self <span className="text-leaf">✦</span> Leadership Beyond Limits <span className="text-leaf">✦</span>
            </span>
          ))}
        </ScrollMarquee>
      </div>

      {/* AVENUES */}
      <Avenues />

      {/* TEAM — pinned horizontal scroll */}
      <section id="team">
        <TeamScroll />
      </section>

      {/* PROJECTS — Kadal Karai cinematic + detail */}
      <section id="projects">
        <KadalKaraiScene />
        <Section band="paper">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal stagger={0.12} className="flex flex-col gap-5 lg:col-span-7">
              {signatureProject.paragraphs.slice(1).map((para, i) => (
                <p key={i} className="leading-relaxed text-ink-soft">{para}</p>
              ))}
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink"><Calendar className="h-4 w-4 text-fern" /> Every alternate weekend</span>
                <span className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink"><Award className="h-4 w-4 text-gold" /> South Asia award winner</span>
                <span className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink"><Waves className="h-4 w-4 text-fern" /> Chennai coastline</span>
              </div>

              {nextKadalKaraiEvent && (
                <div className="mt-2 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-paper-2 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fern/10 text-fern">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-fern">Next cleanup</span>
                    <span className="text-ink">
                      {formatEventDate(nextKadalKaraiEvent.date)} · {nextKadalKaraiEvent.time} · {nextKadalKaraiEvent.location}
                    </span>
                  </div>
                  <Button href="/#events" variant="outline" size="sm" className="sm:ml-auto">
                    Reserve your spot <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="mt-2">
                <Button href="/#join" variant="primary" magnetic cursor="join">Join a cleanup <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </Reveal>
            <div className="lg:col-span-5">
              <BeforeAfterSlider
                beforeSeed="kadal-before"
                afterSeed="kadal-after"
                beforeLabel="Before the drive"
                afterLabel="After the drive"
              />
            </div>
          </div>
        </Section>
      </section>

      {/* EVENTS — diagonal carousel of highlights + calendar */}
      <Section id="events" band="alt">
        <SectionHeading eyebrow="Events" number="05" title="What's happening at the club." intro="Browse the calendar for upcoming drives and past highlights. Hover a marked date for details." />
        <div className="mt-12 h-[62vh] w-full">
          <DiagonalCarousel items={eventSlides} slideSize={280} />
        </div>
        <div className="mt-14">
          <EventsCalendar />
        </div>
      </Section>

      {/* GALLERY — image-scatter preview + polaroid wall */}
      <Section id="gallery" container={false}>
        <div className="u-container">
          <SectionHeading eyebrow="Gallery" number="06" title="A scrapbook of our journey." intro="Photos, films, albums, and awards — pinned to one wall, the way memories should be." />
        </div>
        <div className="mt-10 h-[70vh] w-full">
          <ImageScatter data={scatterSets} />
        </div>
        <div className="u-container mt-6">
          <GalleryWall />
        </div>
      </Section>

      {/* JOIN — Green Rotaractors */}
      <section id="join">
        <Section band="alt">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Green Rotaractors" number="07" title="Every journey begins here." />
              <p className="mt-6 max-w-md text-ink-soft">
                New here? A{" "}
                <AnimatedTooltip variant="dori" content="Our newest members — you start here, learn the culture, join projects, and grow into leadership.">
                  Green Rotaractor
                </AnimatedTooltip>{" "}
                is where it all begins.
              </p>
              <p className="mt-4 max-w-md text-ink-soft">{greenRotaractors.closing}</p>
            </div>
            <Reveal stagger={0.09} className="flex flex-col gap-4 lg:col-span-7">
              {greenRotaractors.opportunities.map((o) => (
                <div key={o} className="flex items-start gap-4 rounded-2xl border border-line bg-paper p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fern/10 text-fern">
                    <Leaf className="h-5 w-5" />
                  </span>
                  <p className="text-ink">{o}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </Section>
        <RegistrationBlock />
      </section>

      {/* PARTNER */}
      <div id="partner">
        <PartnerTeaser />
      </div>

      <FAQ limit={6} />
    </>
  );
}
