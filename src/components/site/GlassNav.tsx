"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ORG } from "../../content/site";

const LINKS = [
  { href: "/#mission", label: "Mission" },
  { href: "/#amazecc", label: "AmazeCC" },
  { href: "/#teams", label: "Teams" },
  { href: "/#journey", label: "Journey" },
];

/** The floating glass nav pill. Becomes more frosted/opaque once you scroll. */
export function GlassNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <nav
        aria-label="Main"
        className={`nav-frost mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-3 py-2 transition-[background-color,border-color,box-shadow] duration-300 sm:px-4 ${
          scrolled ? "nav-frost-scrolled" : ""
        }`}
      >
        <Link href="/" className="group flex items-center gap-3 transition hover:opacity-90" aria-label={`${ORG.name} home`}>
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black/70 shadow-sm transition group-hover:border-white/30 sm:h-9 sm:w-9">
            <Image
              src="/logo.png"
              alt="Amaze Continuity Projects Logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-bold tracking-tight text-white">
              amaze <span className="font-light text-white/70">continuity</span>
            </span>
            <span className="hidden font-mono text-[9px] uppercase tracking-wider text-muted sm:block">
              projects
            </span>
          </div>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="rounded-lg px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={ORG.github}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-xl px-3 py-2 text-sm text-white/70 transition hover:text-white sm:inline"
          >
            GitHub
          </a>
          <Link
            href="/join"
            className="rounded-xl bg-mist px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white active:scale-95"
          >
            Join us
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-white md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 top-0 h-px w-4 bg-current transition ${open ? "top-1.5 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1.5 h-px w-4 bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-3 h-px w-4 bg-current transition ${open ? "top-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      {open ? (
        <div className="nav-frost-menu mx-auto mt-2 max-w-6xl rounded-2xl p-2 md:hidden">
          {[...LINKS, { href: ORG.github, label: "GitHub" }].map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-base text-white/80 hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
        </div>
      ) : null}
    </header>
  );
}
