import Image from "next/image";
import Link from "next/link";
import { CONTRIBUTORS, FINAL_CTA, JOURNEY, MISSION, OBJECTIVES, STATS, TEAMS, TECH } from "../../content/site";
import { CountUp, Reveal } from "./Reveal";
import { Ribbon } from "./Ribbon";

/** Small label with a ringed dot, then an uppercase heading whose first line is iridescent. */
export function SectionHeading({
  label,
  lines,
  id,
  align = "left",
}: {
  label: string;
  lines: readonly string[];
  id?: string;
  align?: "left" | "center";
}) {
  const [first, ...rest] = lines;
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className={`flex items-center gap-2.5 text-sm font-medium text-white/80 ${align === "center" ? "justify-center" : ""}`}>
        <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full border border-white/25">
          <span className="h-1.5 w-1.5 rounded-full bg-mint" />
        </span>
        {label}
      </p>
      <h2 id={id} className="font-display mt-5 text-4xl font-black uppercase leading-[0.95] sm:text-6xl">
        <span className="text-iridescent block">{first}</span>
        {rest.map((line, i) => (
          <span key={line} className={`block ${lines.length >= 3 && i === rest.length - 1 ? "text-outline" : "text-white"}`}>
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}

/**
 * The continuity thread between sections: a slimmer ribbon sweeping across, so
 * the line from the hero keeps running down the page.
 */
export function Thread({ id, flip = false }: { id: string; flip?: boolean }) {
  return (
    <div aria-hidden className="relative h-40 overflow-hidden sm:h-56">
      <Ribbon
        id={id}
        d={flip ? "M -60 60 C 300 40, 520 200, 820 150 S 1240 30, 1560 120" : "M -60 150 C 280 190, 560 30, 860 90 S 1260 220, 1560 70"}
        viewBox="0 0 1500 240"
        className={`absolute inset-0 h-full w-full ${flip ? "opacity-70" : "opacity-80"}`}
        from={flip ? "var(--volt)" : "var(--mint)"}
        to={flip ? "var(--lilac)" : "var(--volt)"}
        width={22}
        delayMs={0}
      />
    </div>
  );
}

export function TechMarquee() {
  const items = [...TECH, ...TECH];
  return (
    <section aria-label="What we build with" className="border-y border-white/5 py-8">
      <p className="text-center text-sm text-muted">What we build with</p>
      <div className="mask-fade-x mt-5 overflow-hidden">
        <ul className="animate-marquee flex w-max gap-12">
          {items.map((t, i) => (
            <li key={`${t}-${i}`} aria-hidden={i >= TECH.length} className="font-display whitespace-nowrap text-xl font-bold uppercase text-white/45">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section aria-label="By the numbers" className="mx-auto max-w-6xl px-6 py-16">
      <Reveal className="holo relative overflow-hidden rounded-[28px] px-6 py-12 text-ink sm:px-12">
        <div aria-hidden className="absolute inset-0 opacity-30 mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
        <dl className="relative grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col text-center">
              <dt className="order-2 mt-2 text-sm text-ink/65">{s.label}</dt>
              <dd className="font-display order-1 text-4xl font-black tracking-tight sm:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} plain={"plain" in s && s.plain} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

export function Mission() {
  return (
    <section id="mission" aria-labelledby="mission-h" className="relative mx-auto max-w-6xl scroll-mt-28 px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <Reveal>
          <SectionHeading id="mission-h" label={MISSION.label} lines={MISSION.headline} />
        </Reveal>
        <Reveal delay={120} className="space-y-5 text-lg leading-relaxed text-white/70">
          {MISSION.body.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </Reveal>
      </div>

      <ol className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OBJECTIVES.map((o, i) => (
          <Reveal as="li" key={o.n} delay={i * 90} className="group glass relative overflow-hidden rounded-3xl p-6 transition hover:border-white/30">
            <span aria-hidden className="absolute -right-6 -top-8 font-display text-[7rem] font-black leading-none text-white/[0.04] transition group-hover:text-white/[0.08]">
              {o.n}
            </span>
            <span className="font-mono text-xs text-mint">{o.n}</span>
            <h3 className="mt-6 text-xl font-semibold text-white">{o.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{o.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export function Teams() {
  return (
    <section id="teams" aria-labelledby="teams-h" className="relative mx-auto max-w-6xl scroll-mt-28 px-6 py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-end">
        <Reveal>
          <SectionHeading id="teams-h" label="The people" lines={["Four teams,", "one product"]} />
        </Reveal>
        <Reveal delay={100}>
          <p className="text-lg leading-relaxed text-white/70">
            AmazeCC is built by students across disciplines. Every team ships, every voice shapes the product, and
            everyone learns how real software gets made, reviewed and released.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {TEAMS.map((t, i) => (
          <Reveal key={t.name} delay={i * 80} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-2 p-7">
            <div aria-hidden className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(60,76,255,0.35),transparent_65%)] opacity-0 transition duration-500 group-hover:opacity-100" />
            <div className="relative flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl font-black uppercase text-white">{t.name}</h3>
              <Link href="/join" className="shrink-0 rounded-full border border-mint/40 px-3 py-1 text-xs font-semibold text-mint transition hover:bg-mint hover:text-ink">
                Hiring
              </Link>
            </div>
            <p className="relative mt-3 max-w-md text-white/65">{t.body}</p>
            <ul className="relative mt-5 flex flex-wrap gap-2">
              {t.skills.map((s) => (
                <li key={s} className="rounded-lg border border-white/10 px-2.5 py-1 font-mono text-[11px] text-white/60">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Contributors to AmazeCC</p>
        <ul className="mt-5 flex flex-wrap gap-3">
          {CONTRIBUTORS.map((c) => (
            <li key={c.login}>
              <a
                href={`https://github.com/${c.login}`}
                target="_blank"
                rel="noreferrer"
                className="glass flex items-center gap-3 rounded-2xl py-2 pl-2 pr-4 transition hover:border-white/30"
              >
                <Image
                  src={`https://avatars.githubusercontent.com/${c.login}?size=80`}
                  alt=""
                  width={36}
                  height={36}
                  className="rounded-xl"
                />
                <span>
                  <span className="block text-sm font-semibold text-white">{c.login}</span>
                  <span className="block text-xs text-muted">{c.note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function Journey() {
  return (
    <section id="journey" aria-labelledby="journey-h" className="relative scroll-mt-28 overflow-hidden py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading id="journey-h" label="Journey" lines={["How we", "got here"]} />
        </Reveal>
      </div>
      <ol className="relative mx-auto mt-16 max-w-6xl px-6">
        <span aria-hidden className="absolute left-[28px] top-2 h-[calc(100%-1rem)] w-[3px] rounded-full bg-gradient-to-b from-mint via-lilac to-volt sm:left-[calc(50%-1px)]" />
        <span aria-hidden className="absolute left-[22px] top-2 h-[calc(100%-1rem)] w-4 rounded-full bg-gradient-to-b from-mint via-lilac to-volt opacity-30 blur-md sm:left-[calc(50%-7px)]" />
        {JOURNEY.map((j, i) => {
          const right = i % 2 === 1;
          return (
            <Reveal
              as="li"
              key={j.date}
              delay={i * 70}
              className={`relative mb-10 pl-14 sm:w-1/2 sm:pl-0 ${right ? "sm:ml-auto sm:pl-12" : "sm:pr-12 sm:text-right"}`}
            >
              <span
                aria-hidden
                className={`absolute left-[21px] top-1 h-[18px] w-[18px] rounded-full border-[3px] border-ink ring-2 ${j.current ? "bg-mint ring-mint/60 animate-pulse-dot" : "bg-white ring-lilac/50"} ${right ? "sm:-left-[9px]" : "sm:left-auto sm:-right-[9px]"}`}
              />
              <p className="font-mono text-xs uppercase tracking-widest text-mint">{j.date}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{j.title}</h3>
              <p className="mt-1 text-white/60">{j.body}</p>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}

export function FinalCta() {
  const [a, b] = FINAL_CTA.headline;
  return (
    <section aria-labelledby="cta-h" className="relative isolate overflow-hidden py-32">
      <Ribbon
        id="cta"
        d="M -80 300 C 200 120, 420 460, 720 300 S 1180 80, 1580 260"
        viewBox="0 0 1500 520"
        className="absolute inset-0 -z-10 h-full w-full opacity-80"
        from="var(--volt)"
        to="var(--lilac)"
        width={60}
        delayMs={0}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div aria-hidden className="absolute inset-x-0 -inset-y-10 -z-10 bg-[radial-gradient(closest-side,rgba(6,10,10,0.92),rgba(6,10,10,0.6)_60%,transparent)]" />
        <Reveal>
          <h2 id="cta-h" className="font-display text-5xl font-black uppercase leading-[0.9] sm:text-8xl">
            <span className="block text-white">{a}</span>
            <span className="text-iridescent block">{b}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">{FINAL_CTA.body}</p>
          <Link
            href={FINAL_CTA.cta.href}
            className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-mist px-7 py-4 text-base font-semibold text-ink shadow-[0_20px_60px_-15px_rgba(237,203,255,0.6)] transition hover:bg-white active:scale-95"
          >
            {FINAL_CTA.cta.label} <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
