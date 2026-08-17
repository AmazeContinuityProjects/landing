import Link from "next/link";
import { Button } from "../Button";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0A0D14]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5C4DFF] shadow-[0_0_15px_rgba(92,77,255,0.4)]">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="text-lg font-bold tracking-wide text-white">
            AmazeSuite
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/#projects" className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
            Projects
          </Link>
          <a href="https://github.com/AmazeContinuityProjects" target="_blank" rel="noreferrer">
            <Button variant="ghost" className="border border-white/5">
              GitHub
            </Button>
          </a>
        </div>
        
      </div>
    </nav>
  );
}