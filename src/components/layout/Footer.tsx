import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0A0D14] py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        
        {/* Left/Center Links */}
        <div className="flex gap-6 text-sm text-slate-500">
          <Link href="/privacy" className="transition-colors hover:text-slate-300">Privacy</Link>
          <Link href="/terms" className="transition-colors hover:text-slate-300">Terms</Link>
          <Link href="https://github.com/AmazeContinuityProjects" className="transition-colors hover:text-slate-300">GitHub</Link>
        </div>

        {/* Right Disclaimer */}
        <p className="text-xs font-medium text-slate-500">
          Made with <span className="text-red-500">❤️</span> by students. Not affiliated with VIT.
        </p>
        
      </div>
    </footer>
  );
}