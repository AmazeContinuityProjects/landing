import Link from "next/link";
import { ORG } from "../../content/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-ink pt-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-bold uppercase text-white">{ORG.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Student-built software for {ORG.campus}, made to be handed down. Open source, privacy-first, and not
            affiliated with VIT.
          </p>
          <Link
            href="/join"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-mist px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Join the team <span aria-hidden>→</span>
          </Link>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Projects</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={ORG.app} className="text-white/70 transition hover:text-white">AmazeCC</a></li>
            <li><a href={ORG.gorobo} className="text-white/70 transition hover:text-white">GoRobo</a></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Community</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={ORG.github} className="text-white/70 transition hover:text-white">GitHub</a></li>
            <li><Link href="/join" className="text-white/70 transition hover:text-white">Recruitments</Link></li>
            <li><Link href="/privacy" className="text-white/70 transition hover:text-white">Privacy</Link></li>
            <li><Link href="/terms" className="text-white/70 transition hover:text-white">Terms</Link></li>
          </ul>
        </div>
      </div>

      {/* Oversized outline wordmark, bleeding off the bottom edge. */}
      <p
        aria-hidden="true"
        className="text-outline font-display pointer-events-none mt-16 select-none whitespace-nowrap text-center text-[12.4vw] font-black uppercase leading-[0.8] opacity-60"
      >
        Continuity
      </p>
      <p className="relative mx-auto max-w-6xl px-6 pb-8 pt-6 text-xs text-muted">
        © {new Date().getFullYear()} {ORG.name}. Made with care by students.
      </p>
    </footer>
  );
}
