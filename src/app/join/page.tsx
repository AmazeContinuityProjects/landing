import type { Metadata } from "next";
import { JoinForm } from "../../components/join/JoinForm";

export const metadata: Metadata = {
  title: "Join Amaze Continuity Projects · Recruitments",
  description:
    "Join the engineering collective behind AmazeCC. Applications are open to students, professionals, and independent builders everywhere.",
};

const PILLARS = [
  {
    category: "Scale",
    title: "Real Campus Scale",
    desc: "Production deployments serving thousands of daily active users across attendance, timetable synthesis, and peak traffic surges.",
    icon: (
      <svg className="h-5 w-5 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="3" />
        <circle cx="4" cy="6" r="2" />
        <circle cx="20" cy="6" r="2" />
        <circle cx="4" cy="18" r="2" />
        <circle cx="20" cy="18" r="2" />
        <path d="M6 7l4 3.5M18 7l-4 3.5M6 17l4-3.5M18 17l-4-3.5" strokeOpacity="0.5" />
      </svg>
    ),
  },
  {
    category: "Continuity",
    title: "Engineered to Last",
    desc: "Clean handovers, comprehensive API specifications, and automated test pipelines ensuring code survives graduation cycles.",
    icon: (
      <svg className="h-5 w-5 text-sky" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" strokeOpacity="0.7" />
        <path d="M2 12l10 5 10-5" strokeOpacity="0.4" />
      </svg>
    ),
  },
  {
    category: "Open Source",
    title: "Public by Default",
    desc: "All repositories are open source. Peer-reviewed pull requests, transparent roadmaps, and verifiable contributions for your portfolio.",
    icon: (
      <svg className="h-5 w-5 text-lilac" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        <path d="M14 4l-4 16" strokeOpacity="0.6" />
      </svg>
    ),
  },
  {
    category: "Security",
    title: "Zero Compromise",
    desc: "Server-side credential isolation, minimal client-side persistence, and end-to-end security designed for student privacy.",
    icon: (
      <svg className="h-5 w-5 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" strokeOpacity="0.9" />
      </svg>
    ),
  },
];

const PIPELINE = [
  {
    step: "01",
    title: "Application",
    body: "Select your areas of interest, share your background, and tell us what you'd like to build.",
  },
  {
    step: "02",
    title: "Technical Review",
    body: "Our maintainers review your GitHub, design portfolio, or past projects with zero bias.",
  },
  {
    step: "03",
    title: "Friendly Conversation",
    body: "A brief, casual chat about your technical interests, workflow, and expectations.",
  },
  {
    step: "04",
    title: "Team Onboarding",
    body: "Receive write access to repositories, join the team channels, and ship your first pull request.",
  },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "Curiosity over credentials",
    body: "First years and self-taught developers are welcome. A hunger to learn and dive into real codebases matters far more than past titles.",
  },
  {
    n: "02",
    title: "Proof of work",
    body: "Show us what you've tinkered with — personal repos, Figma sketches, bots, scripts, or write-ups. We care about what you make.",
  },
  {
    n: "03",
    title: "Autonomous ownership",
    body: "We operate like modern open-source projects: thoughtful discussions, well-scoped PRs, and high trust in your implementation.",
  },
];

export default function JoinPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden pt-32 pb-28 sm:pt-40">
      {/* Background Matrix Dot Pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-30 opacity-25 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* Background Lighting & Glow Gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(85%_60%_at_50%_0%,rgba(60,76,255,0.18),transparent_70%),radial-gradient(55%_45%_at_85%_20%,rgba(157,245,180,0.08),transparent_65%),radial-gradient(40%_40%_at_15%_40%,rgba(237,203,255,0.06),transparent_60%)]"
      />

      {/* Topological Contour Line Art (matching the security art illustration) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-28 top-6 -z-10 h-[680px] w-[960px] opacity-40"
        viewBox="0 0 960 680"
        fill="none"
      >
        <path
          d="M60 100 C 240 20, 360 200, 500 150 S 740 30, 880 160 S 820 400, 920 540"
          stroke="url(#contour-grad-1)"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        <path
          d="M20 320 C 200 220, 340 420, 560 310 S 760 240, 920 380"
          stroke="white"
          strokeOpacity="0.16"
          strokeWidth="1.5"
        />
        <path
          d="M80 500 C 300 440, 460 620, 700 500 S 860 420, 940 600"
          stroke="white"
          strokeOpacity="0.1"
          strokeWidth="1.2"
        />
        {/* Reticle / target nodes */}
        <circle cx="760" cy="220" r="28" stroke="var(--mint)" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx="760" cy="220" r="3" fill="var(--mint)" />
        <line x1="748" y1="220" x2="772" y2="220" stroke="var(--mint)" strokeOpacity="0.6" strokeWidth="1" />
        <line x1="760" y1="208" x2="760" y2="232" stroke="var(--mint)" strokeOpacity="0.6" strokeWidth="1" />

        <circle cx="340" cy="420" r="16" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
        <circle cx="340" cy="420" r="2" fill="white" strokeOpacity="0.4" />

        <defs>
          <linearGradient id="contour-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--mint)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="var(--sky)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--lilac)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mx-auto max-w-5xl px-6">
        {/* Header Section */}
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-black uppercase leading-[0.88] tracking-tight text-white sm:text-6xl lg:text-7xl">
            <span className="text-iridescent block">Software</span>
            <span className="block text-white">that outlives</span>
            <span className="text-outline block">its creators</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Amaze Continuity Projects is the independent student engineering collective behind{" "}
            <span className="text-white font-semibold">AmazeCC</span>. We build software in the open that outlives its creators — applications are open to passionate engineers and designers everywhere.
          </p>
        </header>

        {/* Technical Pillars Grid */}
        <section aria-labelledby="pillars-heading" className="mt-16">
          <h2 id="pillars-heading" className="sr-only">Technical Pillars</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-ink-2/60 p-5 backdrop-blur-md transition duration-300 hover:border-white/25 hover:bg-ink-2/90"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03]">
                      {p.icon}
                    </div>
                    <span className="font-mono text-[11px] text-white/50">{p.category}</span>
                  </div>
                  <h3 className="font-display mt-4 text-base font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/60">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Evaluation Principles */}
        <section aria-labelledby="principles-heading" className="mt-16">
          <div className="glass rounded-3xl border border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-mint">Our approach</p>
                <h2 id="principles-heading" className="font-display mt-1 text-xl font-bold uppercase text-white sm:text-2xl">
                  What we look for
                </h2>
              </div>
              <span className="font-mono text-xs text-white/50">Zero gatekeeping</span>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {PRINCIPLES.map((pr) => (
                <div key={pr.n} className="space-y-2">
                  <span className="font-mono text-xs font-bold text-mint">{pr.n}</span>
                  <h3 className="font-display text-base font-bold text-white">{pr.title}</h3>
                  <p className="text-xs leading-relaxed text-white/60">{pr.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Flow */}
        <section aria-labelledby="pipeline-heading" className="mt-16">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-mint">The process</p>
              <h2 id="pipeline-heading" className="font-display mt-1 text-2xl font-bold uppercase text-white sm:text-3xl">
                How it works
              </h2>
            </div>
            <span className="hidden font-mono text-xs text-white/50 sm:block">Rolling review</span>
          </div>

          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PIPELINE.map((item) => (
              <li
                key={item.step}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition duration-200 hover:border-mint/30 hover:bg-white/[0.04]"
              >
                <span className="font-mono text-lg font-black text-mint">{item.step}</span>
                <h3 className="font-display mt-3 text-sm font-bold uppercase tracking-wide text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{item.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Form Container */}
        <section id="apply" aria-labelledby="form-heading" className="mt-20 scroll-mt-28">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <p className="font-mono text-xs uppercase tracking-widest text-mint">Recruitments</p>
            <h2 id="form-heading" className="font-display mt-1 text-3xl font-black uppercase text-white sm:text-4xl">
              Apply to join
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Applications are reviewed continuously on a rolling basis. All fields marked with an asterisk are required.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <JoinForm />
          </div>
        </section>

        {/* Verification Footer */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            <span>Amaze Continuity Projects · Open Source Initiative</span>
          </div>
          <div className="text-xs text-white/60">
            Questions? Inquire via{" "}
            <a
              href="https://github.com/AmazeContinuityProjects"
              target="_blank"
              rel="noreferrer"
              className="text-mint hover:underline"
            >
              GitHub Repositories ↗
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
