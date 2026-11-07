import { AMAZECC, GOROBO, type Feature } from "../../content/site";
import { FeatureVisualView } from "./FeatureVisuals";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./Sections";

const SIZE: Record<Feature["size"], string> = {
  xl: "lg:col-span-2 lg:row-span-2",
  wide: "lg:col-span-2",
  tall: "lg:row-span-2",
  md: "",
};

function FeatureCard({ feature, delay }: { feature: Feature; delay: number }) {
  const big = feature.size === "xl";
  return (
    <Reveal
      as="li"
      delay={delay}
      className={`group relative flex min-h-[250px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-2 p-6 transition duration-500 hover:-translate-y-1 hover:border-white/25 ${SIZE[feature.size]}`}
    >
      {/* Hover glow follows the ribbon palette. */}
      <div aria-hidden className="pointer-events-none absolute -inset-px rounded-3xl bg-[radial-gradient(60%_50%_at_50%_0%,rgba(237,203,255,0.12),transparent_70%)] opacity-0 transition duration-500 group-hover:opacity-100" />
      <h3 className={`relative font-semibold text-white ${big ? "text-2xl sm:text-3xl" : "text-lg"}`}>{feature.title}</h3>
      <p className={`relative mt-2 text-white/60 ${big ? "max-w-lg text-base" : "text-sm"}`}>{feature.body}</p>
      <div className="relative mt-6 flex-1">
        <FeatureVisualView visual={feature.visual} />
      </div>
    </Reveal>
  );
}

export function AmazeCCShowcase() {
  return (
    <section id="amazecc" aria-labelledby="amazecc-h" className="relative mx-auto max-w-6xl scroll-mt-28 px-6 py-24">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <Reveal>
          <SectionHeading id="amazecc-h" label={`${AMAZECC.label} · ${AMAZECC.name}`} lines={AMAZECC.headline} />
        </Reveal>
        <Reveal delay={120}>
          <p className="text-lg leading-relaxed text-white/70">{AMAZECC.lede}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={AMAZECC.link.href}
              className="inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-110 active:scale-95"
            >
              {AMAZECC.link.label} <span aria-hidden>↗</span>
            </a>
            <a
              href={AMAZECC.code.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              {AMAZECC.code.label}
            </a>
          </div>
        </Reveal>
      </div>

      <ul className="mt-16 grid auto-rows-[minmax(250px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AMAZECC.features.map((f, i) => (
          <FeatureCard key={f.title} feature={f} delay={(i % 4) * 80} />
        ))}
      </ul>

      {/* Under the hood, on a fluted glass panel. */}
      <Reveal className="ribbed relative mt-6 overflow-hidden rounded-3xl border border-white/10">
        <div className="grid divide-y divide-white/10 bg-ink/70 backdrop-blur-sm sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
          {AMAZECC.underTheHood.map((u) => (
            <div key={u.label} className="p-6">
              <p className="font-display text-3xl font-black uppercase text-iridescent">{u.value}</p>
              <p className="mt-1 text-sm font-semibold text-white">{u.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{u.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function GoRoboSection() {
  const max = Math.max(...GOROBO.categories.map((c) => c.count));
  return (
    <section id="gorobo" aria-labelledby="gorobo-h" className="relative scroll-mt-28 overflow-hidden py-24">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_50%,rgba(157,245,180,0.08),transparent_70%)]" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHeading id="gorobo-h" label={`${GOROBO.label} · ${GOROBO.name}`} lines={GOROBO.headline} />
          <p className="mt-6 text-lg leading-relaxed text-white/70">{GOROBO.lede}</p>
          <ul className="mt-6 space-y-2.5">
            {GOROBO.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-white/75">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                {p}
              </li>
            ))}
          </ul>
          <a
            href={GOROBO.link.href}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-mist active:scale-95"
          >
            {GOROBO.link.label} <span aria-hidden>↗</span>
          </a>
        </Reveal>

        {/* The catalogue, as a glass panel with category bars. */}
        <Reveal delay={150} className="glass relative rounded-3xl p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">Catalogue</p>
              <p className="font-display mt-1 text-5xl font-black text-white">{GOROBO.total}</p>
              <p className="text-sm text-white/60">components and counting</p>
            </div>
            <span className="rounded-full border border-mint/40 px-3 py-1 font-mono text-[11px] text-mint">● In stock</span>
          </div>
          <ul className="mt-7 space-y-3">
            {GOROBO.categories.map((c, i) => (
              <li key={c.name}>
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">{c.name}</span>
                  <span className="font-mono text-white/50">{c.count}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full origin-left rounded-full bg-[linear-gradient(90deg,var(--mint),var(--sky))]"
                    style={{ width: `${(c.count / max) * 100}%`, animation: `grow 1.2s cubic-bezier(0.2,0.7,0.1,1) ${200 + i * 80}ms both` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
