# Rotaract Club of VIT Chennai — Website

The official website for the Rotaract Club of VIT Chennai (RI District 3234) — a cinematic, scroll-driven marketing site built with Next.js 16, GSAP, and a WebGL "ink flower" cursor field.

Full design/content rationale, palette, and phased build plan live in [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** for styling, with a custom green/gold brand palette (see `src/app/globals.css`)
- **GSAP** (`ScrollTrigger`, `SplitText`, `Flip`) as the single animation authority, synced to **Lenis** smooth scroll
- **Three.js** / **@react-three/fiber** / **drei** for the WebGL flower-field cursor effect
- **Embla Carousel** for the team coverflow and gallery sliders

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server uses Turbopack by default.

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint     # eslint
```

## Project structure

```
src/
├─ app/            # routes (App Router)
├─ components/
│  ├─ layout/      # Navbar, Footer, Preloader, SmoothScroll, CustomCursor, PageTransition
│  ├─ motion/      # reusable GSAP-driven primitives (Reveal, Counter, Parallax, ...)
│  ├─ webgl/        # the ink-flower cursor field (Three.js)
│  ├─ sections/     # one-off homepage section components
│  ├─ club/         # the "Growth Tree" showpiece (About Club)
│  ├─ gallery/       # the Yearbook/Polaroid gallery wall
│  └─ ui/           # design-system primitives (Button, Section, Modal, ...)
├─ content/         # typed content data (site copy, team, events, gallery, history, ...)
├─ lib/             # GSAP setup, Lenis setup, utilities
└─ hooks/           # useReducedMotion, useMediaQuery, useGsapContext, ...
```

Content (copy, stats, team roster, timeline, events, gallery items) is centralized under `src/content/` as typed data — swapping in real assets/text is a data change, not a component change.

## Notes

- Real media (team photos, event/gallery images, president portraits) is still placeholder — see the asset checklist in `docs/IMPLEMENTATION_PLAN.md` §10.
- Motion respects `prefers-reduced-motion` throughout; heavier set-pieces (Growth Tree, WebGL flower field) degrade to static/lightweight fallbacks automatically.
