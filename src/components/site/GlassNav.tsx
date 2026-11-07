"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ORG } from "../../content/site";

const LINKS = [
  { id: "mission", label: "Mission" },
  { id: "amazecc", label: "AmazeCC" },
  { id: "teams", label: "Teams" },
  { id: "journey", label: "Journey" },
];

/** The same three teammates as the collaborator cursors. */
const TEAM = [
  { initial: "D", name: "Design", color: "#edcbff" },
  { initial: "F", name: "Frontend", color: "#9df5b4" },
  { initial: "B", name: "Backend", color: "#8fd3ff" },
];

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/70";

function GitHubMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden fill="currentColor">
      <path d="M8 0a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38v-1.35c-2.23.49-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.22 1.88.87 2.34.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82a7.6 7.6 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.66 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 008 0z" />
    </svg>
  );
}

/**
 * The floating frosted top bar.
 *
 * - Scroll spy: the section you're reading is highlighted by a pill that
 *   slides between links.
 * - A reading-progress line along the bottom edge.
 * - Slides away while you scroll down, returns as soon as you scroll up.
 * - A small team-presence stack, matching the collaborator cursors.
 * - Mobile menu that closes on Esc and outside taps and locks page scroll.
 */
export function GlassNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const progress = useRef<HTMLSpanElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const menu = useRef<HTMLDivElement | null>(null);

  // Scroll: opacity step, hide-on-down / show-on-up, reading progress.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (Math.abs(y - lastY) > 6) {
          setHidden(y > lastY && y > 480);
          lastY = y;
        }
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      });
    };
    raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll spy: the section crossing the upper-middle of the screen is "active".
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
        else if (window.scrollY < window.innerHeight * 0.6) setActive(null);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Move the pill under the active link (and keep it right on resize).
  const placePill = useCallback(() => {
    // Measure the list item: it's positioned within the <ul>, the pill's container.
    const li = active ? linkRefs.current[active]?.parentElement : null;
    setPill(li ? { left: li.offsetLeft, width: li.offsetWidth } : null);
  }, [active]);
  useLayoutEffect(() => {
    const raf = requestAnimationFrame(placePill);
    window.addEventListener("resize", placePill);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", placePill);
    };
  }, [placePill]);

  // Mobile menu: Esc and outside taps close it; the page doesn't scroll behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element;
      if (menu.current && !menu.current.contains(t) && !t.closest?.("[data-menu-toggle]")) setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    menu.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const isHidden = hidden && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.1,1)] sm:px-6 sm:pt-5 ${
        isHidden ? "-translate-y-[130%]" : "translate-y-0"
      }`}
    >
      <nav
        aria-label="Main"
        className={`nav-frost relative mx-auto flex max-w-6xl items-center justify-between gap-3 overflow-hidden rounded-2xl px-3 py-2 transition-[background-color,border-color,box-shadow] duration-300 sm:px-4 ${
          scrolled ? "nav-frost-scrolled" : ""
        }`}
      >
        <Link href="/" className={`flex shrink-0 items-center rounded-lg transition hover:opacity-90 ${FOCUS}`} aria-label={`${ORG.name} home`}>
          <Image src="/logo-mark.png" alt="amaze continuity projects" width={412} height={250} className="h-9 w-auto sm:h-10" priority />
        </Link>

        <ul className="relative hidden items-center gap-1 md:flex">
          {/* Sliding active pill */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 rounded-lg border border-white/10 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.2,0.7,0.1,1)]"
            style={{ width: pill?.width ?? 0, transform: `translateX(${pill?.left ?? 0}px)`, opacity: pill ? 1 : 0 }}
          />
          {LINKS.map((l) => (
            <li key={l.id} className="relative">
              <Link
                href={`/#${l.id}`}
                ref={(el) => {
                  linkRefs.current[l.id] = el;
                }}
                aria-current={active === l.id ? "true" : undefined}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${FOCUS} ${
                  active === l.id ? "text-white" : "text-white/65 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Team presence, as in a multiplayer editor */}
          <div className="mr-1 hidden -space-x-1.5 lg:flex" title="Design, Frontend and Backend teams">
            {TEAM.map((m) => (
              <span
                key={m.name}
                aria-hidden
                className="grid h-7 w-7 place-items-center rounded-full border-2 border-ink text-[10px] font-black text-ink"
                style={{ background: m.color }}
              >
                {m.initial}
              </span>
            ))}
          </div>
          <a
            href={ORG.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={`hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:inline-flex ${FOCUS}`}
          >
            <GitHubMark />
            <span className="hidden lg:inline">GitHub</span>
          </a>
          <Link
            href="/join"
            data-cursor="Apply"
            className={`group inline-flex items-center gap-2 rounded-xl bg-mist px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-white active:scale-95 sm:px-4 ${FOCUS}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" aria-hidden />
            Join us
            <span aria-hidden className="hidden transition group-hover:translate-x-0.5 sm:inline">
              →
            </span>
          </Link>
          <button
            type="button"
            data-menu-toggle
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className={`grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white md:hidden ${FOCUS}`}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-current transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-px w-4 bg-current transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>

        {/* Reading progress */}
        <span
          ref={progress}
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[linear-gradient(90deg,var(--mint),var(--sky),var(--lilac))]"
          style={{ transform: "scaleX(0)" }}
        />
      </nav>

      {open ? (
        <div id="mobile-menu" ref={menu} className="nav-frost-menu animate-rise mx-auto mt-2 max-w-6xl rounded-2xl p-2 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-base ${FOCUS} ${
                active === l.id ? "bg-white/[0.08] text-white" : "text-white/80 hover:bg-white/5"
              }`}
            >
              {l.label}
              <span aria-hidden className="text-white/30">
                →
              </span>
            </a>
          ))}
          <a
            href={ORG.github}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-2 rounded-xl px-4 py-3.5 text-base text-white/80 hover:bg-white/5 ${FOCUS}`}
          >
            <GitHubMark /> GitHub
          </a>
          <Link
            href="/join"
            onClick={() => setOpen(false)}
            className={`mt-1 flex items-center justify-center gap-2 rounded-xl bg-mint px-4 py-3.5 text-base font-semibold text-ink ${FOCUS}`}
          >
            Apply for 2026–27 <span aria-hidden>→</span>
          </Link>
        </div>
      ) : null}
    </header>
  );
}
