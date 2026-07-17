# Rotaract Club of VIT Chennai — Awwwards-Level Website

## Master Implementation Plan (Research + Build Blueprint)

> **Status:** Planning complete. No production code written yet.
> **Owner decisions locked:** Light-editorial + **green/gold brand palette v2** (full replacement — see §1.1) · Hybrid architecture (immersive home + dedicated routes) · Placeholder content layer (swap real assets later) · Fresh rebuild on top of existing config.
> **Content-strategy decisions locked (this revision):** About Club = **Growth Ring** radial timeline (§5.6) · Gallery = **Yearbook / Polaroid Wall** (§5.14) · Events = **hover-preview month calendar** with auto-carousel (§5.13) · Team = **15-person roster** plan (§5.7). Section order and grouping deliberately do **not** mirror the source docx's structure — see §5 intro.
> **Source of truth for copy:** `docs/RAC_VITC_Website.docx` (extracted verbatim into this plan; the docx's structure/ordering is not binding — see §5).

---

## 0. TL;DR — What we are building

A cinematic, brand-accurate website for the Rotaract Club of VIT Chennai that can credibly be submitted to Awwwards. It combines:

- A **Truus-style preloader** (0→100 counter + clip-path reveal into the hero).
- A **WebGL "ink flower" cursor field** (Ksenia-K ping-pong FBO shader) that blooms in empty space on pointer move — recolored to brand ink (green petals, gold centers) on the warm-cream canvas, and reused in a handful of other spots beyond the hero (§4.1).
- **GSAP + ScrollTrigger + Lenis** choreography: split-text reveals, number counters, horizontal-pin storytelling, image-mask reveals, pinned parallax project scenes.
- **Embla Carousel** coverflow for the team, with a custom "DRAG" cursor.
- A rigorous **performance + accessibility + reduced-motion** layer so the spectacle never breaks the experience.

The whole thing is a **hybrid**: the home page is a scroll-driven narrative that teases each pillar; deep content lives on dedicated routes.

---

## 1. Design Direction (locked: Light Editorial + Brand)

### 1.1 Palette — v2 (client-supplied, full replacement)

This revision **fully replaces** the original Cranberry/Azure/Royal system with the client's own 7-color palette. It reads as "growth" — greens deepening like tree rings, gold like sunlight — which also gives the WebGL flower field (§4) a literal, on-brand meaning instead of an arbitrary tint. On a warm cream editorial canvas:

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FFF6E3` | Page background (warm cream) |
| `--paper-2` | `#FFFFFF` | Alternating section band / cards / lightbox surfaces |
| `--ink` | `#1A1A1A` | Primary text (near-black); doubles as the deep/dark band color (footer, Growth Ring backdrop) |
| `--ink-soft` | `rgba(26,26,26,0.62)` | Secondary/muted text — derived from `--ink` (not a separate client hex) |
| `--forest` | `#0A5933` | Deepest brand green — headline emphasis, high-contrast text-on-cream, oldest ring (2019) |
| `--fern` | `#0B8F3F` | **Primary brand accent** — CTAs, links, buttons (fills the old Cranberry role) |
| `--leaf` | `#7AC943` | Bright accent — hover pop, active states, newest ring (current year), brightest flower petals |
| `--gold` | `#FFD700` | Highlights, awards, stat emphasis; the "glow" marker for award-winning years |
| `--line` | `rgba(26,26,26,0.12)` | Hairlines, borders |

Contrast: keep body copy on `--ink` (passes AA on cream). `--fern` is used for **large text, buttons, and non-text accents**; verify AA-large against the actual `#FFF6E3` cream in Phase 0 and adjust weight/size if it falls short — don't lighten the brand green to "fix" contrast. Reserve `--leaf` and `--gold` for accents/highlights, not body copy (both are too light for AA on cream at body size). WebGL flowers use `--fern`/`--leaf`/`--gold` ink tints (green petals, gold centers) at low opacity so they read as "drawing on paper," not neon.

> **Exception:** §5.9 Kadal Karai is the one section allowed to break this system with its own ocean/beach sub-palette (deep ocean blue → seafoam, sandy beige) — a deliberate editorial break for the flagship cinematic moment, not a precedent for other sections.

> The current `globals.css` dark tokens (`#050508` background, plus `#e31b6d`/`#8a2be2`/`#ffb703` baked into the pre-existing prototype components) get fully replaced by this light system. Keep the file's structure (`@theme`, Lenis rules, utility classes) — swap the values.

### 1.2 Typography

Editorial contrast = an expressive display face + a clean workhorse + a mono for labels. All available free via `next/font/google`:

- **Display / headings:** `Fraunces` (optical serif, "editorial magazine" energy) — used big, tight leading. *Alt if a grotesk is preferred: `Space Grotesk`.*
- **Body / UI:** `Inter` (already installed) — 16–18px base, generous measure.
- **Labels / eyebrows / stats:** `JetBrains Mono` or `Geist Mono` — uppercase, letter-spaced, for section kickers ("01 — ABOUT ROTARACT") and counters.

Type scale (fluid, `clamp()`): display `clamp(2.75rem, 7vw, 7.5rem)`, h2 `clamp(2rem, 4.5vw, 4rem)`, h3 `clamp(1.35rem, 2.5vw, 2rem)`, body `clamp(1rem, 1.1vw, 1.15rem)`.

### 1.3 Layout language

- 12-column grid, `max-w-[1440px]`, generous side gutters (`clamp(1.25rem, 5vw, 6rem)`).
- Big whitespace between sections (the "empty space" is where flowers bloom — it's intentional canvas, not filler).
- Alternating `--paper` / `--paper-2` bands to segment the narrative.
- Hairline rules + mono eyebrows as the editorial connective tissue.

### 1.4 Motion principles

1. **Motion has meaning** — reveals track reading order; scrubbed motion is tied to scroll progress, never gratuitous.
2. **One hero moment per section** — each section gets a single signature move, not five competing ones.
3. **Ease + timing consistency** — shared easing tokens (`power3.out` for entrances, `expo.inOut` for transitions), stagger `0.04–0.08s`.
4. **Degrade gracefully** — every animation has a final resting state that is correct with JS/WebGL off.

---

## 2. Tech Stack

### 2.1 Already installed (keep)

`next@16.2.10` (App Router) · `react@19.2.4` / `react-dom` · `tailwindcss@4` (PostCSS) · `gsap@3.15` (ScrollTrigger **and SplitText are free in 3.13+**) · `lenis@1.3` · `lucide-react`.

### 2.2 To add

| Package | Why |
|---|---|
| `embla-carousel-react` | Team coverflow, gallery sliders |
| `embla-carousel-autoplay` | Gentle auto-advance (pauses on interaction) |
| `embla-carousel-wheel-gestures` | Trackpad/wheel horizontal scroll |
| `three` | WebGL flower shader |
| `@react-three/fiber` | React renderer for Three (declarative canvas) |
| `@react-three/drei` | `useFBO`, helpers for the ping-pong render targets |
| `split-type` *(optional)* | Fallback text splitter if we prefer it over GSAP SplitText for SSR-safety |

> Do **not** add Framer Motion. GSAP is the single animation authority to avoid two competing rAF loops. Use GSAP for everything except the WebGL canvas (its own `useFrame` loop) and Embla (its own engine, synced via API).

### 2.3 ⚠️ Next.js 16 — read the docs before coding (this is NOT the Next.js in your training data)

`AGENTS.md` is explicit. Before writing each area, read the matching file in `node_modules/next/dist/docs/`. Verified breaking changes that affect us:

- **Async Request APIs are fully enforced.** `params` and `searchParams` are **Promises** — any dynamic route (`/projects/[slug]`, `/team/[id]`) must `await` them. Run `npx next typegen` for `PageProps<'/route'>` helpers. (`02-guides/upgrading/version-16.md`)
- **`middleware` → `proxy`.** If we add redirects/headers, use the `proxy` convention, not `middleware`. (`.../file-conventions/proxy.md`)
- **Turbopack is the default bundler.** Affects any custom webpack/alias config. (`version-16.md`)
- **React 19.2 + React Compiler support** — all interactive/animation components must be `"use client"`. Server Components stay for static content/data loading.
- **`next/image`, `next/font`, CSS** each have their own current guide — read `12-images.md`, `13-fonts.md`, `11-css.md` before touching them.
- **`revalidateTag` needs a `cacheLife` arg** (only if we add ISR later).

Because this is essentially a static marketing site, most dynamic-API pain is avoided by keeping pages static and pushing interactivity into client components.

---

## 3. Global Architecture

### 3.1 File / folder structure (target)

```
src/
├─ app/
│  ├─ layout.tsx                 # fonts, metadata, providers, Preloader, Cursor, FlowerCanvas, Lenis
│  ├─ page.tsx                   # HOME — the scroll narrative
│  ├─ globals.css                # brand tokens + Lenis + utilities (rewritten light)
│  ├─ about/page.tsx             # About Rotaract (movement)
│  ├─ club/page.tsx              # About Club VITC (history, vision, awards, presidents, parent club, district)
│  ├─ team/page.tsx              # Full team + past presidents
│  ├─ projects/page.tsx          # Signature Projects (Kadal Karai lead)
│  ├─ avenues/page.tsx           # Avenues of Service (or a home section only — see §5.8)
│  ├─ events/page.tsx            # Upcoming / Past / Calendar
│  ├─ gallery/page.tsx           # Photos / Videos / Albums / Awards
│  ├─ join/page.tsx              # Green Rotaractors + registration
│  ├─ partner/page.tsx           # Partner With Us
│  └─ contact/page.tsx           # Contact + map + socials
├─ components/
│  ├─ layout/   Navbar, Footer, Preloader, SmoothScroll, CustomCursor, PageTransition, MenuOverlay
│  ├─ motion/   SplitReveal, Counter, MagneticButton, RevealImage, HorizontalPin, Parallax, Marquee
│  ├─ webgl/    FlowerCanvas, flower.vert, flower.frag, display.frag (ping-pong)
│  ├─ sections/ Hero, Stats, AboutRotaract, FourWayTest, AreasOfFocus, ClubHistory,
│  │            TeamCarousel, KadalKarai, Avenues, GreenCTA, PartnerTeaser, FAQ, EventsCalendar
│  ├─ club/     GrowthRing, RootSystem, YearPanel               (§5.6 — About Club showpiece)
│  ├─ gallery/  CorkboardWall, Polaroid, AlbumStack, AwardStamp, VideoCard, Lightbox (§5.14)
│  └─ ui/       Button, Badge, SectionHeading, Card, Eyebrow, Accordion, Modal
├─ content/     site.ts, stats.ts, focus.ts, fourway.ts, avenues.ts, achievements.ts,
│               presidents.ts, history.ts, team.ts, projects.ts, faq.ts, events.ts,
│               gallery.ts, socials.ts
├─ lib/         gsap.ts (register plugins once), lenis.ts, cursor-context.tsx, utils.ts
└─ hooks/       useIsomorphicLayoutEffect.ts, useReducedMotion.ts, useMediaQuery.ts, useGsapContext.ts
```

**Content layer principle (placeholder decision):** every section reads from a typed file in `src/content/`. Images are referenced by path into `/public/…` slots. Swapping real assets later = replace files + edit a data object; **zero component changes**. Example:

```ts
// src/content/team.ts
export const coreTeam: Member[] = [
  { name: "Surajiv Arul",      role: "President",       year: "2026–27", img: "/team/surajiv.jpg" },
  { name: "Iniyaa S",          role: "Secretary",       year: "2026–27", img: "/team/iniyaa.jpg" },
  { name: "S G Anjana",        role: "Vice President",  year: "2026–27", img: "/team/anjana.jpg" },
  { name: "N V Tejaharshini",  role: "Joint Secretary", year: "2026–27", img: "/team/tejaharshini.jpg" },
];
```

### 3.2 The global providers stack (in `layout.tsx`)

Order matters. A single client `<Providers>` wrapper mounts:

1. **`<SmoothScroll>`** — Lenis instance, synced to GSAP's ticker (§3.3).
2. **`<FlowerCanvas>`** — fixed, full-screen, `z-index:0`, `pointer-events:none`, behind DOM (§4).
3. **`<Preloader>`** — fixed, `z-index:9999`, blocks scroll until done (§3.5).
4. **`<CustomCursor>`** — fixed dot/label following pointer (desktop, fine-pointer only).
5. **`<Navbar>` / `{children}` / `<Footer>`** — content at `z-index:10`, on `--paper` so flowers show only through gaps.

### 3.3 Lenis ↔ GSAP sync (the backbone)

This one wiring detail makes every scroll animation feel native. Replace the current `LenisScroll.tsx` with:

```ts
const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
ScrollTrigger.defaults({ /* markers off in prod */ });
```

- One rAF loop (GSAP's), Lenis driven from it — no jank, no double loop.
- `lenis.stop()` during preloader and when a modal is open; `lenis.start()` after.
- On route change, `ScrollTrigger.refresh()` + scroll to top.

### 3.4 GSAP setup discipline

- `lib/gsap.ts` registers `ScrollTrigger`, `SplitText` **once**, guarded for client only.
- Every animated component uses `useGsapContext` (wraps `gsap.context()` + `useIsomorphicLayoutEffect`) so animations are **scoped and auto-reverted on unmount** (critical in React 19 / App Router with fast route changes).
- Central easing/duration tokens in `lib/gsap.ts`.

### 3.5 Preloader (inspiration: Truus)

The Truus repo (`M-Jawad338211/truus-clone`: Next 15 + React 19 + GSAP ScrollTrigger/Inertia + Lenis, modular CSS) uses a choreographed intro. Our version:

1. On first load, fixed overlay in brand paper color covers the viewport; `lenis.stop()`.
2. A **mono counter 000 → 100** animates while critical assets preload (fonts via `document.fonts.ready`, hero image, WebGL shader compile). Counter speed is tied to real load progress where possible, eased to 100.
3. At 100: GSAP timeline — the number and a thin progress rule scale/blur out; the overlay **clip-path wipe** (`polygon()` sweep, or split-panel reveal) uncovers the hero.
4. `onComplete`: `lenis.start()`, dispatch a `"preloader:done"` event; the Hero's SplitText entrance fires immediately after.
5. **Session guard:** show full sequence once per session (`sessionStorage`); subsequent client navigations use the lighter `PageTransition` instead.
6. **SSR-safe:** overlay renders in initial HTML (no flash of content), hidden via CSS until hydration confirms; respects `prefers-reduced-motion` (instant reveal, no counter theatrics).

### 3.6 Custom cursor & page transitions

- **CustomCursor:** a GSAP-tracked dot + expanding ring; swaps to contextual labels ("DRAG" on the carousel, "VIEW" on project cards, "OPEN" on FAQ). Only on `(pointer: fine)` devices; native cursor hidden there. (Mirrors Truus `CursorBubble`.)
- **PageTransition:** a brand-colored panel wipe between routes (fern → forest sweep) using a layout-level overlay + `router` events, so navigation feels intentional, not a hard cut.

---

## 4. The WebGL "Ink Flower" Cursor Field (inspiration: Ksenia-K `WNYJOrO`)

**How the original works** (confirmed via research): Three.js, **one full-screen plane + two render targets (ping-pong FBO)**. A fragment shader stamps procedural flowers (simplex `snoise`, distance-field petals, inner white ring, time-based bloom) at the pointer UV into a persistent texture; each frame reads the previous target, decays it, and adds the new stamp — so flowers **trail and fade** as you move. "Click to add" + freeze toggle are extras.

**Our React Three Fiber port:**

- `<FlowerCanvas>` = `<Canvas>` fixed behind DOM, `pointer-events:none`, `dpr={[1, 2]}`, `frameloop` gated.
- Two `useFBO` render targets, swapped each `useFrame`.
- **Simulation pass:** shader material reads `prevTarget`, multiplies by a decay factor, adds a flower stamp at `uMouse` (uv) whose size/rotation scales with **pointer velocity**; writes to `nextTarget`.
- **Display pass:** fullscreen quad samples the current target and composites brand-ink flowers over transparent background so the paper shows through.
- **Uniforms:** `uMouse`, `uMouseVel`, `uTime`, `uRatio`, `uPrev`, `uColorA/B/C` (`--fern`/`--leaf`/`--gold` — green petals with a gold center; `--forest` used at low opacity for petal-edge shadow), `uDecay`.
- **Brand recolor:** tint petals with the brand inks by hashing flower id → subtle, low-opacity, "drawing on paper" not neon.

**Guardrails (non-negotiable):**

- `pointer-events:none` so buttons/links stay clickable.
- **Pause rendering** when tab hidden (`visibilitychange`) and when pointer is idle > ~1.5s (freeze loop → 0 GPU).
- **Disable entirely** on `prefers-reduced-motion`, coarse pointers (touch/mobile), and when `navigator.hardwareConcurrency`/deviceMemory signal a low-end device → fall back to a static subtle paper texture.
- Lazy-load the whole canvas (`next/dynamic`, `ssr:false`) so it never blocks first paint or the preloader.

### 4.1 Where else the flower field shows up

The brief said "hero-only is fine, but something new elsewhere is welcome too." Beyond the full pointer-reactive field on Home, reuse the same shader in cheaper, purpose-built ways rather than bolting the full field onto every section:

| Placement | Mode | Why |
|---|---|---|
| **Hero** (HOME) | Full pointer-reactive field, all three colors | The primary showcase moment — most empty canvas, most impact. |
| **Green Rotaractors CTA band** (§5.10, → `/join`) | Full pointer-reactive field, intensified (faster bloom, denser stamps) | Literal pun payoff — "Green" Rotaractors is the one place the field is allowed to feel like the whole point of the section, not a background detail. |
| **Growth Ring backdrop** (§5.6, `/club`) | Scroll-reactive, not pointer-reactive — a single stem/bloom grows in sync with scroll progress through the rings, frozen otherwise | Ties the metaphor (growth) to the mechanism (scroll), reusing the shader's stamp/decay logic with `uMouse` driven by scroll progress instead of pointer position. |
| **Footer** | Static single low-opacity bloom (no live simulation) behind the magnetic links | Closes the site on the same visual signature at ~0 GPU cost — a static texture, not a running shader instance. |
| **Gallery lightbox open** (§5.14) | One-shot stamp (single bloom, no persistent field) on opening a photo/video | Cheap reuse of the existing shader as a "stamp" primitive instead of a new asset — a nice-to-have, not required for launch. |

Everything outside Hero and the Join CTA band either runs the shader in a cheaper one-shot/static mode or doesn't run a live WebGL context at all — the full ping-pong FBO simulation stays confined to the two places it earns its GPU cost.

---

## 5. Section-by-Section Blueprint

Copy is taken verbatim from the docx, but **grouping and presentation are ours** — the client asked for the content to be present, not for the docx's section order or format to be preserved. Three subsections depart furthest from a literal docx read: About Club (§5.6, redesigned around one radial "Growth Ring" mechanism instead of four separate lists), Events (§5.13, one hover-preview calendar instead of separate Upcoming/Past lists), and Gallery (§5.14, a pannable Yearbook/Polaroid Wall instead of four tabbed grids). Each section notes: **route/placement**, **content**, **signature motion**, **reference**.

### 5.1 Hero — HOME
- **Content:** H1 "Service Above Self. Leadership Beyond Limits." · Sub "Building Leaders, Creating Impact, Transforming Communities." · Buttons **Join Rotaract** (→ `/join`) and **Explore Projects** (→ `/projects`). Eyebrow: "Rotaract Club of VIT Chennai · RI District 3234".
- **Motion:** GSAP **SplitText** on the H1 → words/chars rise with `y` + slight rotation, staggered `0.05s`, fired on `preloader:done`. Sub + CTAs fade-up after. Buttons are **MagneticButton**s. Flower field is most visible here (lots of whitespace).
- **Reference:** Truus intro hand-off.

### 5.2 Live Club Statistics — HOME
- **Content:** ❤️ Blood donated **2000+** units · 👨‍🎓 Members **100+** · 🏆 Awards **10+** · 📅 Projects **50+**.
- **Motion:** `<Counter>` component — ScrollTrigger fires when in view; GSAP tweens a value object 0→target with easing, formatted with "+". Numbers set in big mono/display; gold emphasis. Stagger the four.
- **Reference:** classic scrub-in counters.

### 5.3 About Rotaract — HOME teaser → `/about`
- **Content (home teaser):** condensed "What is Rotaract?" + "Rotary empowers experienced professionals to serve; Rotaract empowers young leaders to grow through service, leadership, and fellowship." CTA → `/about`.
- **`/about` full:** Formation of Rotary (Paul P. Harris, 1905, Chicago) · What is Rotaract? · Our Objectives (7 bullets) · **The Four-Way Test** · **Seven Areas of Focus**.
- **Signature motion (home):** **Horizontal-scroll pin** — pin the "About Rotaract" container and drive `xPercent` panels via vertical scroll (Formation → What is Rotaract → Objectives). **Reference:** Dragon-Scroll-Effect (GSAP ScrollTrigger pin + scrub). On mobile this un-pins into a normal vertical stack.

### 5.4 The Four-Way Test — within `/about`, teased on HOME
- **Content:** Intro line + 1) Is it the **TRUTH**? 2) Is it **FAIR** to all concerned? 3) Will it build **GOODWILL** and **BETTER FRIENDSHIPS**? 4) Will it be **BENEFICIAL** to all concerned?
- **Motion:** four large **overlapping cards**; as horizontal/vertical scroll progresses each scales up and locks into place, number counting 01→04. Big editorial numerals in forest/fern/leaf/gold — one token per card.

### 5.5 The Seven Areas of Focus — `/about`, teased on HOME
- **Content:** 🕊️ Promoting Peace · ❤️ Fighting Disease · 💧 Water, Sanitation & Hygiene · 👩‍👧 Maternal & Child Health · 📚 Basic Education & Literacy · 💼 Community Economic Development · 🌱 Supporting the Environment (each with its description from docx).
- **Motion:** responsive grid; **staggered fade/clip-in** on scroll; on hover — icon float + border/`border-radius` expansion + subtle card lift. Icons can be lucide-react equivalents or the emoji set.

### 5.6 About Club (VITC) — the site's showpiece · HOME teaser → `/club`

This is deliberately the most ambitious section on the site — the one a prospective client should point at and say "I want that." It fuses four previously-separate content blocks (History, Achievements & Awards, Past Presidents, Parent Club/District) into **one mechanism** instead of four static lists, because that fusion is the idea, not just a decoration on top of the docx's content order.

- **Content (unchanged from the docx, just recomposed):** History (chartered **2019**, Charter President Rtr. Parvathi Suresh 2019–20) · **Vision** · **Mission** · **Achievements & Awards** (2025–26, 2024–25, 2023–24 — see `AchievementsSection.tsx` for the existing data, which carries over) · **Past Presidents** (2019→2027) · **Parent Club** (Rotary Club of Chennai Spotlight) · **RI District 3234**.

- **Concept — "Growth Ring":** the club's history rendered as literal tree rings. Every year is a concentric ring; rings grow outward from the charter year at the center to the current year at the rim — the same way a tree's rings record its life, one per year.

  1. **Seed (page open, no scroll required):** Vision + Mission are shown first, centered, minimal — framed as "the seed everything below grew from." No motion theatrics here; this is the calm beat before the set-piece.
  2. **Pinned radial timeline:** a `ScrollTrigger`-pinned SVG/Canvas diagram takes over the viewport. Scroll progress **rotates and expands** the ring group (same pin-and-scrub family of technique as `HorizontalPin`, but driving `rotation`/`scale` instead of `xPercent`). One ring is "active" at a time; inactive rings recede in opacity. Ring order: **2019 (innermost, `--forest`) → mid years (`--fern`) → 2026–27 current (outermost, `--leaf`)** — the same three greens used everywhere else, now doing double duty as a literal age gradient.
  3. **Per-ring reveal:** as each ring activates, a side panel swaps in (GSAP timeline labels keyed to scroll-progress breakpoints) showing **that year's President** (portrait + name, sourced from the Past Presidents list) and **that year's Achievements & Awards**. A ring with award wins gets a visible `--gold` glow/tick-mark — so a strong year is legible from the diagram alone, before reading any text.
  4. **Root system:** below/behind the ring cluster, the **Parent Club** (Rotary Club of Chennai Spotlight) and **RI District 3234** render as literal branching root-lines feeding the ring stack from underneath — the visual argument that the club's growth is fed by these two relationships, not just a "see also" footnote.
  - **Not every ring has awards, and that's correct:** current achievement data (`AchievementsSection.tsx`) only covers 2023–24 through 2025–26. Rings for 2019–20 through 2022–23 show president + year with no gold glow — an empty ring is a true "quiet year," not a placeholder gap to fill with filler content.
  5. **Exit:** the rings resolve on the current year, which hands off (shared-element-style morph) into the Meet the Team teaser (§5.7) — "here's who's growing it now."

- **Reduced-motion / accessibility fallback:** no rotation, no pin. Renders as a plain vertical list — one card per year, in order, each showing president + that year's achievements — identical content, zero motion. This is not a degraded experience, it's the same information read top-to-bottom instead of radially.
- **Mobile (< `md`):** rings collapse to a vertical "growth ladder" — stacked horizontal bars, one per year, bar length/glow scaled by that year's achievement count — keeps the color-coding and gold-glow signal without requiring a pin/rotate interaction that doesn't work well on touch.
- **HOME teaser:** a single frozen frame of the ring diagram (current year ring only, fully rendered, others ghosted) with a "See the full 8-year story →" CTA into `/club` — the teaser should read as a still from the real thing, not a generic photo-and-text card.
- **New components:** `components/club/GrowthRing.tsx` (the pinned radial diagram), `RootSystem.tsx` (parent club/district roots), `YearPanel.tsx` (the per-ring side panel). New content file `src/content/history.ts` — a single `clubTimeline: YearRing[]` merging what `AchievementsSection.tsx` and the Past Presidents data currently hold separately.
- **Reference:** Ironhill-section-rebuild's mask/scale reveal technique is retained, but demoted — it now dresses the **president portraits inside each `YearPanel`** and reused for Team/Gallery photo reveals, rather than being About Club's headline technique (Growth Ring is).

### 5.7 Meet Our Team — HOME teaser → `/team`
- **Content — 15-person board, not 4:** the docx only names the top 4 officers. Real clubs this size run a ~15-person board, so the content layer plans for all 15 from the start (placeholder role-holders now, real names/photos swapped in later — zero component changes, per §3.1's content principle). The existing `TeamParallax.tsx` prototype already sketched a plausible 15-person roster; carry it forward as the seed data for `src/content/team.ts`:

  | # | Role | Name (docx-confirmed / placeholder) |
  |---|---|---|
  | 1 | President | **Surajiv Arul** (confirmed) |
  | 2 | Secretary | **Iniyaa S** (confirmed) |
  | 3 | Vice President | **S G Anjana** (confirmed) |
  | 4 | Joint Secretary | **N V Tejaharshini** (confirmed) |
  | 5 | Treasurer | placeholder |
  | 6 | Club Service Director | placeholder |
  | 7 | Community Service Director | placeholder |
  | 8 | Professional Development Director | placeholder |
  | 9 | International Service Director | placeholder |
  | 10 | Public Relations Officer | placeholder |
  | 11 | Design Head | placeholder |
  | 12 | Editor-in-Chief | placeholder |
  | 13 | Photography Head | placeholder |
  | 14 | Women Empowerment Head | placeholder |
  | 15 | Webmaster | placeholder |

  Roles 6–9 deliberately mirror the four Avenues of Service (§5.8), so the team roster and the avenues content visibly connect ("who runs Community Service" has a face). Flag to the client: confirm real names/photos for roles 5–15 when available; until then each placeholder card is visually marked as a filled seat, not a blank one.

- **Home teaser vs. `/team` full roster:** HOME shows only the 4 confirmed officers (keeps the teaser tight and avoids shipping placeholder faces on the first impression). `/team` shows the full 15-person coverflow plus the separate Past Presidents roster (2019→2027).
- **Motion:** **Embla Carousel** coverflow. Read `emblaApi.scrollProgress()` + `scrollSnapList()` in an `on('scroll')` handler to apply **scale + parallax + opacity** to off-center slides (center card largest/sharpest). Custom **"DRAG" cursor** over the track. Plugins: `Autoplay` (pauses on pointer), `WheelGestures`. `dragFree:false`, `loop:true`, `align:'center'`.
- **Reference:** 21st.dev + Embla.

### 5.8 Avenues of Service — HOME section (optionally `/avenues`)
- **Content:** Intro + 💙 Club Service · 🌍 Community Service · 💼 Professional Development · 🤝 International Service (each with description + Focus Areas list) + the "special committees" paragraph + pull-quote **"One Club. Many Avenues. Infinite Possibilities."**
- **Motion:** **Bento-box cards.** On hover a card expands (FLIP or scale), the siblings dim, and the **Focus Areas list slides up** from the card bottom. The pull-quote gets a full-width SplitText reveal.

### 5.9 Signature Projects — HOME cinematic → `/projects`
- **Content:** **Kadal Karai** — flagship coastal clean-up initiative (3 paragraphs from docx). `/projects` can list more signature projects over time.
- **Palette exception (intentional):** this is the one section allowed to step outside the site-wide green/gold system (§1.1) — a deep ocean-blue → seafoam gradient overlay and warm sandy-beige card surfaces, standing in for real beach photography until it's shot. It's a deliberate editorial break for the flagship cinematic moment, not a precedent for other sections to follow.
- **Signature motion:** **Pinned parallax scene.** Pin "KADAL KARAI" title center-screen; full-width beach backgrounds scroll past at a different speed; a **scrubbed color overlay** (deep ocean-blue → transparent) reveals the photos as you scroll. Stats/impact numbers count in (gold, matching the rest of the site's stat-emphasis convention).
- **Reference:** scroll-section-animation (GSAP pin + parallax + scrub).

### 5.10 Green Rotaractors (Recruitment) — HOME band → `/join`
- **Content:** "About Green Rotaractors" + the four opportunity bullets + "Become Green Rotaractor" CTA + the registration Google Form: `https://forms.gle/vsjSHSti5qAb8yVD7`.
- **Motion:** bold oversized-typography band ("BECOME A GREEN ROTARACTOR") with a sticky-reveal. On `/join`, the form opens in a **slide-in modal / expanding panel** (styled iframe wrapper with `data-lenis-prevent`), not a bare embed. This is the primary conversion zone — the most prominent CTA site-wide.

### 5.11 FAQs — `/join` (and/or HOME accordion)
- **Content:** the 12 Q&As from the docx.
- **Motion:** custom **accordion** animating `height 0 → auto` via GSAP (measure then tween, no layout snap); fern active state; "OPEN/CLOSE" cursor label.

### 5.12 Partner With Us — HOME teaser → `/partner`
- **Content:** full "Partner With Us" copy + "Why Partner With Us?" bullets + contact Rtr. Surajiv Arul 📞 +91 8072 808 036 📧 rotaractclubvitcc@gmail.com.
- **Motion:** editorial two-column; magnetic contact links; subtle parallax on the supporting imagery.

### 5.13 Events — `/events`

The docx's "Upcoming Events / Past Events" split is a **content requirement, not a layout requirement** — both need to be present and distinguishable, but they don't need separate pages or stacked list sections. One calendar carries both.

- **Content:** club events (real dates TBD by client; `InteractiveCalendar.tsx`'s existing sample data — Club Installation, Kadal Karai Beach Cleanup, Blood Donation Camp, "Threads of Magic" workshop, RYLA — is a good placeholder set to build against).
- **Concept — month-view calendar with hover-preview, not click-to-select:** builds on the existing `InteractiveCalendar.tsx` month-grid/prev-next-arrow logic, but replaces its click-then-side-panel interaction with a richer hover-preview:
  1. **Month grid**, navigated with prev/next arrow buttons (kept from the existing component).
  2. **Event days are highlighted** directly in the grid: a `--leaf` dot/ring for upcoming events, a muted gold-dust dot (`--gold` at low opacity) for past events — so "upcoming vs. past" reads at a glance without needing separate tabs. A small legend beneath the grid explains the two dot colors.
  3. **Hover (desktop, `pointer:fine`)** over a highlighted day opens a floating rich-preview popover, collision-aware so it never clips the viewport edge, containing: an **auto-advancing photo carousel** (Embla `Autoplay`, ~3.5s/slide, crossfade, pauses the instant the pointer enters the popover itself) plus the event's title, date, time, location, and a 1–2 line description.
  4. **Touch and keyboard:** no hover on touch, so a tap (or `Tab`-focus, for keyboard users) opens the same popover pinned open; tapping outside, `Esc`, or blur closes it. Reduced-motion disables carousel autoplay in favor of manual arrows.
  5. **Multiple events on one day:** the day cell shows a small stacked-count badge; the popover becomes a mini switcher (small dots/tabs inside it) — each one loads its own carousel + content.
  6. **Accessibility/scan-ability net:** a compact "next 3 upcoming" list rendered beside or below the calendar, so the next event is discoverable without hunting through a grid — matters most on mobile and for screen-reader users.
- **Data:** `src/content/events.ts`; extend the existing `ClubEvent` type's single `imageColor` placeholder into an `images: string[]` array (3–5 slots) to back the carousel.
- **Component:** rebuild `InteractiveCalendar.tsx` on the new design tokens (its month-math and day-highlighting logic carries over almost as-is; the click→side-panel interaction is replaced by the hover-popover above).

### 5.14 Gallery — `/gallery`

- **Content:** Photos / Videos / Event Albums / Awards — all four need to be present; they don't need to be four separate tabs or pages.
- **Concept — "Yearbook / Polaroid Wall":** a pannable corkboard/scrapbook canvas instead of a rigid tabbed grid — fitting for a community club's memories, and distinct from the generic masonry-grid gallery every other site does.
  - **Board, not tabs:** one long horizontally-scrollable (vertically on mobile) corkboard, informally divided into labeled "spreads" (2025–26, Kadal Karai, RYLA, etc.) — like yearbook chapters. Drag-to-pan on desktop (click-drag / trackpad), native touch-scroll on mobile. A minimap/progress rail at the bottom shows position on the board.
  - **Photos** render as polaroid cards: a deterministic per-item slight rotation (seeded by id, so it's stable across re-renders, never re-randomized), a small caption in a handwritten-style accent, a "pinned/taped" corner detail, soft drop-shadow.
  - **Videos** render as filmstrip/cassette cards with a play-button overlay; hovering auto-scrubs a short muted preview (a genuinely useful interaction independent of the scrapbook skin); click opens full playback in the lightbox.
  - **Event Albums** render as a fanned photo-stack card; clicking one enters a focused sub-board for that album, with a breadcrumb back to the main wall.
  - **Awards** render as wax-seal/medal stamp cards, pinned into the same board as the photos/videos rather than isolated in their own tab — the wall reads as one continuous life of the club, awards included, not four disconnected content buckets.
  - **Filter chips** (Photos / Videos / Albums / Awards) act as "jump to nearest + dim others," not "remove others" — keeps the shared-board feeling instead of collapsing into a filtered grid.
  - **Lightbox:** opening any item is a GSAP FLIP scale-up from its exact board position (not a generic modal fade); arrow keys/swipe move to the next item within the same category.
  - **Entrance motion:** cards "land" onto the board with a soft drop + slight over-rotate settle, staggered by proximity to viewport — sells the "physically placed" feeling instead of a generic fade-up.
  - **Reduced motion:** cards render in a static, unrotated, evenly-aligned grid — rotation and drag-pan are flourish, not content-bearing, so they collapse cleanly.
  - **Optional flourish:** opening a lightbox item can fire the flower-field's one-shot petal stamp (§4.1) — a cheap reuse of the existing WebGL asset, not a new one.
- **New components:** `components/gallery/CorkboardWall.tsx`, `Polaroid.tsx`, `AlbumStack.tsx`, `AwardStamp.tsx`, `VideoCard.tsx`, `Lightbox.tsx`. New content file `src/content/gallery.ts` (`GalleryItem[]` with `type: 'photo' | 'video' | 'album' | 'award'`, seeded `rotation`, `caption`, `year`/`tag`).

### 5.15 Footer — global
- **Content:** big "Partner With Us" / "Contact Us" type · Email `rotaractclubvitcc@gmail.com` · Phones +91 80728 08036, +91 99624 09445 · Address (VIT Chennai, Vandalur–Kelambakkam Rd, Chennai 600127) · **Interactive Google Map** · Instagram `@rotaractclubvitcc`, LinkedIn `rotaract-club-vitcc`.
- **Motion:** screen-filling typography on the `--ink` deep band (fills the old Royal footer-field role); **magnetic** social/email links; a marquee tagline; map embed lazy-loaded; static low-opacity flower bloom behind the links (§4.1).

---

## 6. Reusable Motion Component Contracts

| Component | Prop shape | Behavior |
|---|---|---|
| `SplitReveal` | `as`, `stagger`, `y`, `trigger` | Splits text (SplitText), animates on view or event; reverts on unmount |
| `Counter` | `to`, `suffix`, `duration` | ScrollTrigger-gated 0→to tween |
| `MagneticButton` | `strength` | Pointer-follow translate + spring-back on leave |
| `RevealImage` | `src`, `from` (`clip`\|`scale`) | Masked reveal in `overflow:hidden` frame |
| `HorizontalPin` | `children[]` | Pins section, scrubs `xPercent`; un-pins < `md` |
| `Parallax` | `speed` | ScrollTrigger `y` on `scrub` |
| `Accordion` | `items[]` | GSAP height 0→auto |
| `Modal` | `open`, `onClose` | Focus-trap, `lenis.stop()`, `data-lenis-prevent` |

All are `"use client"`, use `useGsapContext`, and check `useReducedMotion()` to short-circuit to final state.

---

## 7. Performance, Accessibility, Responsiveness

### 7.1 Performance budget (Lighthouse ≥ 90 mobile target)
- All raster imagery via `next/image` (AVIF/WebP, sized, `priority` only on hero).
- WebGL canvas: lazy `ssr:false`, DPR cap 2, freeze on idle/hidden/offscreen, disabled on low-power/touch.
- One rAF loop (GSAP ticker) drives Lenis; no competing loops.
- Code-split heavy sections; `ScrollTrigger.refresh()` after image load to avoid layout drift.
- Fonts: `next/font` self-hosted, `display:swap`, preload display face only.
- Kill all `ScrollTrigger`/`gsap.context` on unmount to prevent leaks across route changes.

### 7.2 Accessibility
- Full **`prefers-reduced-motion`** path: no scrub, no split theatrics, no WebGL — everything renders in its correct final state.
- Semantic landmarks, one `h1`/page, logical heading order, visible focus rings, skip-to-content link.
- Carousel: keyboard arrows, `aria-roledescription`, live region for slide changes; autoplay pauses on focus/hover and respects reduced-motion.
- Form/modal: labeled controls, focus trap, `Esc` to close, restore focus.
- Color contrast checked (fern reserved for large text/non-text; leaf and gold never used for body copy).
- Custom cursor never removes keyboard operability; native focus states retained.

### 7.3 Responsiveness
- Mobile-first. Horizontal-pin & pinned-parallax sections **degrade to vertical stacks** under `md`.
- Touch: Embla native drag; disable custom cursor and WebGL; larger tap targets.
- Test matrix: 360 / 768 / 1024 / 1440 / 1920.

---

## 8. Phased Execution Plan

Each phase ends with a **demoable, deployable** state.

**Phase 0 — Foundations (design system + plumbing)**
- Rewrite `globals.css` with light brand tokens; wire `next/font` (Fraunces + Inter + mono).
- `lib/gsap.ts` (register plugins), `SmoothScroll` (Lenis↔ticker), `useGsapContext`, `useReducedMotion`, `useMediaQuery`.
- Build `src/content/*` typed data from the docx; stub `/public` asset slots + placeholders.
- **Done when:** app boots on the new design tokens, smooth scroll works, one `SplitReveal` proves the GSAP pipeline.

**Phase 1 — Static skeleton (all sections, no heavy motion)**
- Build every section/route with real copy + placeholder images + `ui/` primitives, fully responsive.
- Navbar (with menu overlay), Footer, route map, PageTransition shell.
- **Done when:** the whole site reads correctly and responsively with JS-light animation only.

**Phase 2 — Carousels + core scroll choreography**
- Embla team coverflow (15-person roster, scale/parallax via `scrollProgress`), custom "DRAG" cursor.
- `Counter`s, `Parallax`, staggered grids (Areas of Focus), Avenues bento hover, FAQ accordion, Join modal.
- Events calendar hover-preview popovers (auto-carousel + collision-aware placement) on top of the Phase-1 static month grid.
- Gallery corkboard drag-to-pan interaction on top of the Phase-1 static grid; video hover-scrub.
- **Done when:** every section has its signature scroll move; reduced-motion path verified.

**Phase 3 — Signature set-pieces**
- **Growth Ring** (About Club, §5.6) — pinned radial timeline, per-ring side panels, root system; this is the flagship "wow" moment and gets the most polish/QA time.
- Horizontal-pin About Rotaract (Dragon-Scroll), pinned Kadal Karai parallax scene (scroll-section), Four-Way Test lock-in cards, oversized Green Rotaractor band, footer magnetics.
- Gallery lightbox FLIP-from-board-position; optional petal-stamp flourish on open (§4.1).
- **Done when:** the four "wow" moments (Growth Ring, About Rotaract pin, Kadal Karai pin, Four-Way Test) land at 60fps on a mid laptop.

**Phase 4 — WebGL flower field**
- R3F ping-pong FBO shader, brand recolor, pointer-velocity stamping, all guardrails (idle/hidden/low-power/reduced-motion).
- **Done when:** flowers bloom in empty space, never block clicks, and cost ~0 when idle.

**Phase 5 — Preloader + transitions + polish**
- Truus-style counter/clip-path preloader tied to real asset progress; session guard; route PageTransition wipes; tab-title easter egg.
- **Done when:** first load is a choreographed intro; navigations feel intentional.

**Phase 6 — Audit + deploy**
- Lighthouse (perf/a11y/SEO/best-practices), cross-browser (Chrome/Safari/Firefox), device matrix, image optimization pass, metadata/OG images, `robots`/`sitemap`.
- Deploy to Vercel.
- **Done when:** all targets green and real assets can drop into the content layer without code changes.

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Next.js 16 API surprises (async params, proxy, Turbopack) | Read `node_modules/next/dist/docs` per area **before** coding it; keep pages static; `npx next typegen` for any dynamic route |
| WebGL cost / mobile battery | Lazy, DPR-capped, idle/hidden/offscreen freeze, disabled on touch & low-power & reduced-motion |
| ScrollTrigger + Lenis jank | Single rAF (GSAP ticker drives Lenis); `refresh()` after images; scoped `gsap.context` cleanup |
| Pin/scrub breaking on mobile | Un-pin to vertical stacks under `md`; test the matrix |
| SplitText/DOM re-split on resize | Debounced re-init inside `gsap.context`; revert on unmount |
| Real assets differ from placeholders (sizes) | Content layer + fixed aspect-ratio frames + `next/image` `fill`; asset checklist (§10) |
| Route-change memory leaks | Kill all triggers/contexts on unmount; verify with repeated navigation |
| Growth Ring / Corkboard Wall are bespoke (no reference repo to lean on) | Build the reduced-motion fallback (plain vertical list / static grid) **first** — it's the real content contract; layer the pinned-rotation and drag-pan mechanics on top once the fallback is correct |
| 11 of 15 team seats and 4 of 8 Growth Ring years have no client-confirmed data yet | Ship with clearly-marked placeholder roles/years now (§5.7, §5.6); track down real names/photos/achievements as a follow-up, not a launch blocker |

---

## 10. Asset Checklist (for swapping placeholders later)

| Asset | Count | Spec |
|---|---|---|
| Club logo (Rotaract + VITC lockup) | 1–2 | SVG preferred, transparent |
| Parent club / District 3234 marks | 2 | SVG/PNG transparent |
| Hero background / texture | 1 | 2400×1400, optimizable |
| Core team headshots | 15 (full board, §5.7) — 4 confirmed, 11 placeholder | 800×1000 portrait, consistent crop/bg |
| Past presidents portraits | up to 9 (also feeds Growth Ring `YearPanel`s, §5.6) | 600×750 portrait |
| Kadal Karai / project photos | 6–10 | 1600×900 landscape |
| Areas of Focus / avenue imagery | 7 + 4 | 800×800 or icon set |
| Gallery — photos | 20+ for a convincing wall | mixed aspect, lightbox-ready |
| Gallery — videos | 4–8 | landscape, muted-autoplay-safe |
| Gallery — event albums | as available | 4–8 photos per album |
| Gallery — award stamps | matches Achievements data (§5.6) | square/circular crop |
| Favicon / OG image | 1 each | 512×512 / 1200×630 |

Everything wires through `src/content/*` + `/public/*`; **no component edits needed** to go live with real media.

---

## 11. Open Assumptions (flag if any are wrong)

1. **Registration** stays the Google Form (`forms.gle/vsjSHSti5qAb8yVD7`), presented in a styled modal — not a rebuilt native form.
2. **Events/Gallery** data is hand-maintained in `src/content` (no CMS) unless you want one later; their motion now spans Phases 1–3 rather than being Phase-2-only (§8).
3. **`/about` vs `/club`** split as above; the home page teases both. Can be merged into one `/about` if preferred.
4. **Fonts** = Fraunces + Inter + JetBrains Mono. Swap the display face if brand guidelines specify a licensed typeface.
5. **Contact map** = embedded Google Map iframe (lazy-loaded).
6. **11 of 15 team seats** (§5.7) and **4 of 8 Growth Ring years** (§5.6) ship with placeholder roles/no-award-data respectively — flag if the real names/photos/achievements exist somewhere and just weren't in the docx.
7. **Kadal Karai's ocean/beach sub-palette** (§5.9) is described qualitatively (deep ocean-blue → seafoam, sandy beige) rather than as fixed hex values, since it should ultimately be tuned to the real beach photography once shot.

---

### Appendix A — Reference → Technique map

| Reference | We use it for | Technique |
|---|---|---|
| `truus-clone` (M-Jawad338211) | Preloader, custom cursor, smooth-scroll feel, page transition | GSAP + Lenis, counter + clip-path reveal, cursor blob |
| Ksenia-K `WNYJOrO` | Empty-space flower cursor field | Three.js ping-pong FBO, GLSL snoise + SDF petals, velocity stamping |
| Embla Carousel + 21st.dev | Team coverflow, gallery sliders | `useEmblaCarousel`, `scrollProgress()`/`scrollSnapList()` parallax/scale, Autoplay + WheelGestures |
| Dragon-Scroll-Effect (Animmaster) | About Rotaract horizontal storytelling | GSAP ScrollTrigger pin + `xPercent` scrub |
| Ironhill-section-rebuild (Animmaster) | President portrait reveals inside Growth Ring panels; Team/Gallery photo reveals | GSAP clip-path/scale reveals (repo itself uses WebGL/Three + GSAP) |
| scroll-section-animation (Animmaster) | Kadal Karai pinned parallax scene | GSAP pin + multi-speed parallax + scrubbed overlay |
| *Bespoke — no reference repo* | **Growth Ring** (§5.6, About Club) | `ScrollTrigger`-pinned SVG/Canvas radial diagram; scroll progress drives ring `rotation`/`scale` + per-ring side-panel timeline labels |
| *Bespoke — no reference repo* | **Yearbook / Polaroid Wall** (§5.14, Gallery) | Pannable corkboard layout, seeded per-item rotation, GSAP FLIP lightbox from board position |
