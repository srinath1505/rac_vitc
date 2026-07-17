"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ArrowDown } from "lucide-react";
import { site } from "@/content/site";
import SplitReveal from "@/components/motion/SplitReveal";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { gsap, EASE } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { scrollToSection } from "@/lib/lenis";
import { isIntroDone } from "@/lib/intro";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

// Ironhill dissolve (github.com/Animmaster/Ironhill-section-rebuild) — a noise
// edge wipes the hero to our cream as you scroll into the body.
const FRAG = /* glsl */ `
  uniform float uProgress; uniform vec2 uResolution; uniform vec3 uColor; uniform float uSpread;
  varying vec2 vUv;
  float Hash(vec2 p){ vec3 p2=vec3(p.xy,1.0); return fract(sin(dot(p2,vec3(37.1,61.7,12.4)))*3758.5453123); }
  float noise(in vec2 p){ vec2 i=floor(p); vec2 f=fract(p); f*=f*(3.0-2.0*f);
    return mix(mix(Hash(i+vec2(0.,0.)),Hash(i+vec2(1.,0.)),f.x), mix(Hash(i+vec2(0.,1.)),Hash(i+vec2(1.,1.)),f.x), f.y); }
  float fbm(vec2 p){ float v=0.0; v+=noise(p*1.0)*0.5; v+=noise(p*2.0)*0.25; v+=noise(p*4.0)*0.125; return v; }
  void main(){
    vec2 uv=vUv; float aspect=uResolution.x/uResolution.y;
    vec2 c=(uv-0.5)*vec2(aspect,1.0);
    float dissolveEdge = uv.y - uProgress*1.2;
    float n = fbm(c*15.0);
    float d = dissolveEdge + n*uSpread;
    float px = 1.0/uResolution.y;
    float alpha = 1.0 - smoothstep(-px, px, d);
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export default function IronhillHero() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // twig parallax + title reveal
  useIsomorphicLayoutEffect(() => {
    if (!heroRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let cleanup: (() => void) | undefined;
    const ctx = gsap.context(() => {
      gsap.to(".ih-twig-left", { yPercent: -70, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".ih-twig-right", { yPercent: -95, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } });
      const run = () => gsap.from(".ih-fade", { y: 26, opacity: 0, duration: 1, ease: EASE.out, stagger: 0.12, delay: 0.15 });
      if (isIntroDone()) run();
      else { window.addEventListener("preloader:done", run, { once: true }); cleanup = () => window.removeEventListener("preloader:done", run); }
    }, heroRef);
    return () => { cleanup?.(); ctx.revert(); };
  }, []);

  // dissolve shader
  useEffect(() => {
    const canvas = canvasRef.current, hero = heroRef.current;
    if (!canvas || !hero) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const paper = new THREE.Color("#fff6e3");
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, transparent: true,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uColor: { value: new THREE.Vector3(paper.r, paper.g, paper.b) },
        uSpread: { value: 0.5 },
      },
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      mat.uniforms.uResolution.value.set(w, h);
    };
    resize();
    window.addEventListener("resize", resize);
    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);
      const r = hero.getBoundingClientRect();
      const denom = hero.offsetHeight - window.innerHeight;
      const progress = denom > 0 ? Math.min(Math.max(-r.top / denom, 0), 1.1) : 0;
      mat.uniforms.uProgress.value = progress;
      renderer.render(scene, camera);
    };
    render();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); mat.dispose(); renderer.dispose(); };
  }, []);

  return (
    <section ref={heroRef} className="ih-hero relative bg-paper" style={{ height: "165vh" }}>
      {/* pinned hero visual */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <img src="/hero/hero-bg.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
        {/* legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/20 to-ink/40" />

        <img src="/hero/twig-left.webp" alt="" aria-hidden className="ih-twig-left pointer-events-none absolute -bottom-4 -left-8 z-[2] w-[30vw] max-w-[440px] opacity-70 mix-blend-screen" />
        <img src="/hero/twig-right.webp" alt="" aria-hidden className="ih-twig-right pointer-events-none absolute -bottom-4 -right-8 z-[2] w-[34vw] max-w-[520px] opacity-70 mix-blend-screen" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-[16vh] pt-[var(--header-h)] text-center">
          <div className="ih-fade">
            <Eyebrow className="text-leaf">{site.shortName} · {site.district}</Eyebrow>
          </div>
          <h1 className="u-display mt-4 max-w-[15ch] text-[clamp(2.25rem,6.4vw,6rem)] leading-[0.95] text-paper" style={{ textShadow: "0 2px 30px rgba(0,0,0,0.4)" }}>
            <SplitReveal type="words" trigger="preloader" stagger={0.08} as="span">Service Above Self.</SplitReveal>
            <SplitReveal type="words" trigger="preloader" stagger={0.08} delay={0.15} as="span">
              <span className="text-leaf">Leadership</span> Beyond Limits.
            </SplitReveal>
          </h1>
          <p className="ih-fade mt-6 max-w-xl text-lg text-paper/85">{site.subtitle}</p>
          <div className="ih-fade mt-8 flex flex-col gap-4 sm:flex-row">
            <Button href="/#join" onClick={() => scrollToSection("#join")} size="lg" variant="primary" magnetic cursor="join">Join Rotaract</Button>
            <Button href="/#projects" onClick={() => scrollToSection("#projects")} size="lg" variant="gold" magnetic cursor="view">Explore Projects</Button>
          </div>
          <span className="ih-fade absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-paper/70">
            Scroll <ArrowDown className="h-4 w-4 animate-float" />
          </span>
        </div>
      </div>
    </section>
  );
}
