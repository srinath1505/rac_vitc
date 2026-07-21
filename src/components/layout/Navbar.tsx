"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
import Button from "@/components/ui/Button";
import { scrollToSection } from "@/lib/lenis";
import { cn } from "@/lib/utils";

const SECTION_IDS = nav.filter((n) => n.target.startsWith("#")).map((n) => n.target.slice(1));

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const pathname = usePathname();
  const onHome = pathname === "/";
  const overDark = onHome && !scrolled && !open; // dark Ironhill hero at top

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Active-section highlight (home only)
  useEffect(() => {
    if (!onHome) return;
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome, pathname]);

  const handleAnchor = (e: React.MouseEvent, target: string) => {
    if (onHome) {
      e.preventDefault();
      scrollToSection(target);
      setActive(target.slice(1));
    }
    // if not on home, let the Link navigate to "/#id" and SmoothScroll handles it
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-all duration-500",
          scrolled || open || !onHome
            ? "border-b border-line bg-paper/85 backdrop-blur-xl"
            : "border-b border-transparent"
        )}
      >
        <nav className="u-container flex h-[var(--header-h)] items-center justify-between">
          <Link href="/" className={cn("group flex items-center gap-2.5 transition-colors", overDark ? "text-paper" : "text-ink")} data-cursor="home" aria-label={`${site.name} home`}>
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg]">
              <img src="/assets/racvitc_logo.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-display text-[1.15rem] font-semibold tracking-tight">Rotaract</span>
              <span className={cn("font-mono text-[0.58rem] uppercase tracking-[0.22em]", overDark ? "text-paper/70" : "text-ink-soft")}>VIT Chennai</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => {
              const isAnchor = item.target.startsWith("#");
              const href = isAnchor ? `/${item.target}` : item.target;
              const isActive = isAnchor ? onHome && active === item.target.slice(1) : pathname === item.target;
              return (
                <Link
                  key={item.target}
                  href={href}
                  onClick={isAnchor ? (e) => handleAnchor(e, item.target) : undefined}
                  data-cursor="link"
                  className={cn(
                    "group relative py-1 font-mono text-xs uppercase tracking-widest transition-colors",
                    overDark ? "text-paper/75 hover:text-paper" : "text-ink-soft hover:text-ink",
                    isActive && (overDark ? "text-paper" : "text-ink")
                  )}
                >
                  {item.label}
                  <span className={cn("absolute -bottom-0.5 left-0 h-px transition-all duration-300", overDark ? "bg-leaf" : "bg-fern", isActive ? "w-full" : "w-0 group-hover:w-full")} />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button href="/#join" onClick={onHome ? (() => scrollToSection("#join")) : undefined} size="sm" variant="primary" cursor="join" magnetic>
                Join Us
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:bg-ink hover:text-paper lg:hidden",
                overDark ? "border-white/30 text-paper" : "border-line text-ink"
              )}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[99] flex flex-col bg-paper px-6 pt-[var(--header-h)] transition-[opacity,transform] duration-500 lg:hidden",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
        )}
      >
        <div className="flex flex-col py-8">
          {nav.map((item) => {
            const isAnchor = item.target.startsWith("#");
            const href = isAnchor ? `/${item.target}` : item.target;
            return (
              <Link
                key={item.target}
                href={href}
                onClick={(e) => {
                  if (isAnchor && onHome) {
                    e.preventDefault();
                    scrollToSection(item.target);
                  }
                  setOpen(false);
                }}
                className="group flex items-center justify-between border-b border-line py-4 font-display text-4xl text-ink"
              >
                {item.label}
                <span className="font-mono text-xs text-ink-faint transition-transform group-hover:translate-x-1">→</span>
              </Link>
            );
          })}
        </div>
        <div className="mt-auto pb-10">
          <Button href="/#join" onClick={() => { if (onHome) scrollToSection("#join"); setOpen(false); }} variant="primary" size="lg" className="w-full">
            Become a Green Rotaractor
          </Button>
        </div>
      </div>
    </>
  );
}
