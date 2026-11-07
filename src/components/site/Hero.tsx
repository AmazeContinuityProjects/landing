import Link from "next/link";
import { HERO } from "../../content/site";
import { Ribbon } from "./Ribbon";

const RIBBON =
  "M -60 520 C 120 470, 220 600, 380 560 S 560 380, 700 470 S 820 690, 980 610 S 1180 300, 1320 360 S 1480 520, 1560 470";

/** A cursor arrow with a fading trail, as in an editor. */
function CursorTrail() {
  return (
    <div className="flex items-center gap-1 text-white" aria-hidden="true">
      {[0.15, 0.25, 0.4, 0.6].map((o, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" style={{ opacity: o }}>
          <path d="M2 1l11 6-5 1.5L6 14z" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      ))}
      <svg width="22" height="22" viewBox="0 0 16 16">
        <path d="M2 1l11 6-5 1.5L6 14z" fill="var(--volt)" stroke="white" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

export function Hero() {
  const [l1, l2, l3] = HERO.lines;
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden pb-16 pt-32 sm:pt-40">
      {/* Atmosphere: a teal-black wash with two soft glows. */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(80%_60%_at_70%_10%,rgba(60,76,255,0.18),transparent_60%),radial-gradient(60%_50%_at_10%_30%,rgba(157,245,180,0.08),transparent_60%)]" />
      {/* Fine line art, like the contour lines in the security shot. */}
      <svg aria-hidden className="absolute -right-40 top-10 -z-10 h-[620px] w-[900px] opacity-40" viewBox="0 0 900 620" fill="none">
        <path d="M120 80c180-60 320 40 300 160s-200 140-140 260 300 60 420-40 60-260 180-300" stroke="white" strokeOpacity=".35" />
        <path d="M60 300c120-20 140 120 260 110s120-160 260-170 180 120 300 60" stroke="white" strokeOpacity=".18" />
        <circle cx="760" cy="200" r="22" stroke="white" strokeOpacity=".35" />
      </svg>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div>
          <p className="animate-rise font-mono text-[11px] uppercase tracking-[0.25em] text-white/60" style={{ animationDelay: "80ms" }}>
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-mint align-middle animate-pulse-dot" />
            {HERO.eyebrow}
          </p>
          <h1 className="font-display mt-6 text-[11.2vw] font-black uppercase leading-[0.86] sm:text-[10vw] lg:text-[6.4rem]">
            <span className="animate-rise text-iridescent block" style={{ animationDelay: "150ms" }}>
              {l1}
            </span>
            <span className="animate-rise block text-white" style={{ animationDelay: "260ms" }}>
              {l2}
            </span>
            <span className="animate-rise text-outline block" style={{ animationDelay: "370ms" }}>
              {l3}
            </span>
          </h1>
        </div>

        <div className="animate-rise lg:pb-4" style={{ animationDelay: "520ms" }}>
          <p className="max-w-md text-lg leading-relaxed text-white/75">{HERO.lede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={HERO.primary.href}
              data-cursor="Explore"
              className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-ink transition hover:brightness-110 active:scale-95"
            >
              {HERO.primary.label}
              <span aria-hidden className="transition group-hover:translate-x-0.5">↓</span>
            </Link>
            <Link
              href={HERO.secondary.href}
              data-cursor="Apply"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-ink active:scale-95"
            >
              {HERO.secondary.label}
            </Link>
          </div>
        </div>
      </div>

      {/* The stage: ribbon, a fluted glass pane and floating product fragments. */}
      {/* Decorative only: it overlaps the CTAs above (negative margin), so it must not take clicks. */}
      <div className="pointer-events-none relative mx-auto mt-6 h-[420px] max-w-[1500px] sm:-mt-10 sm:h-[520px]">
        <div aria-hidden className="ribbed absolute right-[6%] top-[12%] hidden h-[78%] w-[26%] rounded-sm opacity-70 md:block" />

        {/* An editor window behind the ribbon, as if the page were being designed live. */}
        <div aria-hidden className="absolute left-[4%] top-[22%] hidden h-[70%] w-[42%] rounded-xl border border-white/10 bg-white/[0.015] md:block">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[var(--volt)]" />
            <span className="h-2 w-2 rounded-full bg-lilac" />
            <span className="h-2 w-2 rounded-full bg-white/60" />
          </div>
          <div className="flex items-center gap-1 border-b border-white/10 px-2 py-1.5">
            {["M3 2l9 5-4 1-2 5z", "M2 4h10v8H2z", "M7 2l5 3v5l-5 3-5-3V5z", "M2 7a5 5 0 1010 0A5 5 0 002 7z", "M7 1v3M7 10v3M1 7h3M10 7h3", "M2 3h4l1 2h5v6H2z"].map((d, i) => (
              <span key={d} className={`grid h-6 w-6 place-items-center rounded-md ${i === 0 ? "bg-[var(--volt)]" : ""}`}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="white" strokeOpacity={i === 0 ? 1 : 0.55} strokeWidth="1.2">
                  <path d={d} />
                </svg>
              </span>
            ))}
          </div>
          <div className="w-1/3 space-y-3 border-r border-white/10 p-3">
            {[64, 80, 52].map((w, i) => (
              <div key={w} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full border ${i === 2 ? "border-white bg-white" : "border-white/40"}`} />
                <span className="h-1.5 rounded-full bg-white/15" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>

        {/* A glossy torus floating beside the fluted pane. */}
        <div aria-hidden className="animate-float absolute right-[31%] top-[30%] hidden lg:block" style={{ animationDelay: "-3s", "--r": "-12deg" } as React.CSSProperties}>
          <svg width="150" height="150" viewBox="0 0 150 150">
            <defs>
              <radialGradient id="torus-shade" cx="35%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#edcbff" />
                <stop offset="75%" stopColor="#3c4cff" />
                <stop offset="100%" stopColor="#141a4d" />
              </radialGradient>
              <filter id="torus-grain">
                <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" result="n" />
                <feColorMatrix in="n" type="saturate" values="0" result="m" />
                <feComposite in="m" in2="SourceGraphic" operator="in" result="g" />
                <feBlend in="SourceGraphic" in2="g" mode="overlay" />
              </filter>
            </defs>
            <ellipse cx="75" cy="118" rx="44" ry="8" fill="black" opacity="0.45" filter="blur(6px)" />
            <path
              fillRule="evenodd"
              d="M75 18a52 44 0 110 88 52 44 0 110-88zm0 26a24 18 0 100 36 24 18 0 100-36z"
              fill="url(#torus-shade)"
              filter="url(#torus-grain)"
            />
            <ellipse cx="58" cy="34" rx="16" ry="6" fill="white" opacity="0.55" transform="rotate(-18 58 34)" />
          </svg>
        </div>
        <Ribbon
          id="hero"
          d={RIBBON}
          viewBox="0 0 1500 760"
          className="absolute inset-x-0 -bottom-16 -top-6 h-[calc(100%+5.5rem)] w-full"
          nodes={[[380, 560], [700, 470], [1320, 360]]}
        />

        {/* Attendance fragment */}
        <div className="animate-float absolute left-[6%] top-[8%] w-56 rounded-2xl bg-white p-4 text-ink shadow-2xl sm:left-[14%] sm:w-64" style={{ "--r": "-4deg" } as React.CSSProperties}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50">Attendance · BACSE203</p>
          <div className="mt-2 flex items-end justify-between">
            <span className="font-display text-4xl font-black">82%</span>
            <span className="rounded-md bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-700">Can skip 2</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full w-[82%] rounded-full bg-[linear-gradient(90deg,var(--volt),var(--lilac))]" />
          </div>
        </div>

        {/* Find classmates fragment */}
        <div className="animate-float glass absolute right-[5%] top-[2%] hidden w-64 rounded-2xl p-4 sm:block" style={{ animationDelay: "-2s", "--r": "3deg" } as React.CSSProperties}>
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">Find classmates</p>
          <p className="mt-1 text-sm font-semibold text-white">BAMAT207 · Probability</p>
          <div className="mt-3 flex -space-x-2">
            {["#9df5b4", "#8fd3ff", "#edcbff", "#3c4cff"].map((c, i) => (
              <span key={c} className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink text-[10px] font-bold text-ink" style={{ background: c }}>
                {["AR", "BM", "KV", "DL"][i]}
              </span>
            ))}
            <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-white/10 text-[10px] text-white">+9</span>
          </div>
        </div>

        {/* Shipped comment with cursor trail */}
        <div className="absolute bottom-[10%] left-[30%] hidden md:block">
          <CursorTrail />
          <div className="animate-float mt-2 w-64 rounded-2xl bg-white p-4 text-ink shadow-2xl" style={{ animationDelay: "-4s" }}>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--volt)] text-[10px] font-bold text-white">SJ</span>
              <span className="text-sm font-semibold">Merged into main</span>
            </div>
            <p className="mt-2 text-sm text-ink/70">Timetable generator is 3× faster now 🔥</p>
          </div>
        </div>

        {/* FFCS slot chip */}
        <div className="animate-float absolute bottom-[14%] right-[12%] rounded-xl border border-white/15 bg-ink-2/80 px-3 py-2 font-mono text-xs text-white shadow-xl backdrop-blur" style={{ animationDelay: "-1s" }}>
          <span className="text-mint">●</span> FFCS · A1+TA1 · no clash
        </div>
      </div>
    </section>
  );
}
