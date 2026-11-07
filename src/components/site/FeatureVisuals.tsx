/**
 * Small illustrative mock-ups of AmazeCC features for the bento grid. They are
 * drawings of the UI, not live data, so they use plausible example values.
 */
import type { FeatureVisual } from "../../content/site";

const COURSES = [
  { code: "BACSE203", pct: 82, note: "Skip 2", tone: "text-emerald-700 bg-emerald-100" },
  { code: "BAMAT207", pct: 76, note: "Attend 1", tone: "text-amber-700 bg-amber-100" },
  { code: "BAENG101", pct: 91, note: "Skip 4", tone: "text-emerald-700 bg-emerald-100" },
  { code: "BACSE104", pct: 74, note: "Attend 2", tone: "text-rose-700 bg-rose-100" },
];

function Attendance() {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div className="grid h-full grid-cols-1 items-center gap-4 sm:grid-cols-[auto_1fr]">
      <div className="grid place-items-center self-center justify-self-center rounded-2xl bg-white p-5 text-ink shadow-2xl">
        <svg width="132" height="132" viewBox="0 0 120 120" aria-hidden>
          <circle cx="60" cy="60" r={r} stroke="#e8e6ef" strokeWidth="12" fill="none" />
          <circle
            cx="60"
            cy="60"
            r={r}
            stroke="url(#att)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${c * 0.81} ${c}`}
            transform="rotate(-90 60 60)"
          />
          <defs>
            <linearGradient id="att" x1="0" x2="1">
              <stop offset="0" stopColor="#3c4cff" />
              <stop offset="1" stopColor="#edcbff" />
            </linearGradient>
          </defs>
          <text x="60" y="58" textAnchor="middle" className="font-display" fontSize="24" fontWeight="900" fill="#060a0a">
            81%
          </text>
          <text x="60" y="76" textAnchor="middle" fontSize="9" fill="#6b7280">
            overall
          </text>
        </svg>
      </div>
      <ul className="space-y-2.5 self-center">
        {COURSES.map((c) => (
          <li key={c.code} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-white/80">{c.code}</span>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${c.tone}`}>{c.note}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--volt),var(--lilac))]" style={{ width: `${c.pct}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Ffcs() {
  const filled: Record<string, string> = {
    "0-0": "#3c4cff", "2-0": "#3c4cff", "1-1": "#9df5b4", "3-1": "#9df5b4", "0-2": "#edcbff",
    "2-2": "#edcbff", "4-3": "#8fd3ff", "1-4": "#8fd3ff", "3-4": "#3c4cff", "4-5": "#9df5b4",
  };
  return (
    <div className="flex h-full flex-col justify-end gap-3">
      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: 5 * 6 }, (_, i) => {
          const key = `${Math.floor(i / 6)}-${i % 6}`;
          return <span key={key} className="h-5 rounded-md border border-white/5" style={{ background: filled[key] ?? "rgb(255 255 255 / 0.04)" }} />;
        })}
      </div>
      <div className="flex flex-wrap gap-2 font-mono text-[11px]">
        <span className="rounded-lg bg-mint/15 px-2 py-1 text-mint">0 clashes</span>
        <span className="rounded-lg bg-white/5 px-2 py-1 text-white/70">2,480 timetables found</span>
      </div>
    </div>
  );
}

function Classmates() {
  return (
    <div className="flex h-full flex-col justify-end">
      <div className="flex -space-x-2">
        {["#9df5b4", "#8fd3ff", "#edcbff", "#3c4cff", "#f5c46b"].map((c, i) => (
          <span key={c} className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink-2 text-[10px] font-bold text-ink" style={{ background: c }}>
            {["AR", "BM", "KV", "DL", "RS"][i]}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm text-white/80">
        <span className="font-semibold text-white">12 people</span> in your BAMAT207 section
      </p>
    </div>
  );
}

function Timetable() {
  const rows = [
    { t: "08:00", c: "BACSE203", v: "AB3-208", color: "#3c4cff" },
    { t: "09:50", c: "BAMAT207", v: "AB1-509", color: "#9df5b4" },
    { t: "14:00", c: "BACSE104 Lab", v: "AB2-403", color: "#edcbff" },
    { t: "15:50", c: "BAENG101", v: "ADB-605", color: "#8fd3ff" },
  ];
  return (
    <div className="flex h-full flex-col justify-end gap-2">
      <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">Today · Monday</p>
      {rows.map((r) => (
        <div key={r.t} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
          <span className="font-mono text-[11px] text-white/50">{r.t}</span>
          <span className="h-8 w-1 rounded-full" style={{ background: r.color }} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">{r.c}</span>
            <span className="block text-[11px] text-white/50">{r.v}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function Exams() {
  return (
    <div className="flex h-full items-end justify-between gap-3">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">CGPA</p>
        <p className="font-display text-4xl font-black text-white">8.74</p>
      </div>
      <svg width="120" height="52" viewBox="0 0 120 52" aria-hidden>
        <path d="M2 44 L28 36 L52 40 L76 22 L98 26 L118 8" stroke="url(#cg)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="cg" x1="0" x2="1">
            <stop offset="0" stopColor="#9df5b4" />
            <stop offset="1" stopColor="#edcbff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Hostel() {
  return (
    <div className="flex h-full items-end gap-2">
      {[["Breakfast", "Dosa"], ["Lunch", "Biryani"], ["Dinner", "Chapati"]].map(([meal, dish]) => (
        <div key={meal} className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
          <p className="text-[10px] uppercase tracking-wider text-white/45">{meal}</p>
          <p className="mt-1 text-sm font-semibold text-white">{dish}</p>
        </div>
      ))}
    </div>
  );
}

function Transport() {
  return (
    <div className="flex h-full items-end">
      <svg viewBox="0 0 220 70" className="w-full" aria-hidden>
        <path d="M10 50 C 60 10, 110 70, 160 30 S 210 20, 212 20" stroke="var(--sky)" strokeWidth="3" fill="none" strokeDasharray="1 7" strokeLinecap="round" />
        {[[10, 50], [80, 38], [150, 36], [212, 20]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 3 ? 7 : 5} fill={i === 3 ? "var(--mint)" : "white"} />
        ))}
      </svg>
    </div>
  );
}

function Library() {
  return (
    <div className="flex h-full flex-col justify-end gap-3">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/60">
        <span aria-hidden>⌕</span> Operating Systems
      </div>
      <div className="flex items-end gap-1.5">
        {["#3c4cff", "#edcbff", "#9df5b4", "#8fd3ff", "#f5c46b", "#3c4cff"].map((c, i) => (
          <span key={i} className="w-5 rounded-t-sm" style={{ background: c, height: `${28 + ((i * 13) % 22)}px` }} />
        ))}
      </div>
    </div>
  );
}

function Events() {
  return (
    <div className="flex h-full items-end gap-3 overflow-hidden">
      {[["Hackathon", "Sat · 10 AM", "#3c4cff"], ["Music night", "Fri · 7 PM", "#edcbff"], ["Robotics expo", "Sun · 2 PM", "#9df5b4"]].map(([n, w, c]) => (
        <div key={n} className="relative min-w-[150px] overflow-hidden rounded-2xl bg-white p-3 text-ink">
          <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: c }} />
          <p className="pl-2 text-sm font-semibold">{n}</p>
          <p className="pl-2 text-xs text-ink/60">{w}</p>
          <p className="mt-2 pl-2 text-[11px] font-semibold text-[var(--volt)]">Register →</p>
        </div>
      ))}
    </div>
  );
}

function Pwa() {
  return (
    <div className="flex h-full items-end justify-between gap-3">
      <div className="flex gap-1.5">
        {["#ffffff", "#1a1d23", "#000000"].map((c) => (
          <span key={c} className="h-8 w-8 rounded-full border border-white/20" style={{ background: c }} />
        ))}
      </div>
      <kbd className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 font-mono text-xs text-white/80">Ctrl K</kbd>
    </div>
  );
}

export function FeatureVisualView({ visual }: { visual: FeatureVisual }) {
  switch (visual) {
    case "attendance": return <Attendance />;
    case "ffcs": return <Ffcs />;
    case "classmates": return <Classmates />;
    case "timetable": return <Timetable />;
    case "exams": return <Exams />;
    case "hostel": return <Hostel />;
    case "transport": return <Transport />;
    case "library": return <Library />;
    case "events": return <Events />;
    case "pwa": return <Pwa />;
  }
}
