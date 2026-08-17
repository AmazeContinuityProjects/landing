import { Button } from "../Button";

export function Hero() {
  return (
    <section className="relative px-6 pt-32 pb-20 text-center overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 bg-[#5C4DFF]/15 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          Unified <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5C4DFF] to-indigo-400">Student Ecosystem</span>
        </h1>
        <p className="mt-6 text-lg text-slate-400 leading-relaxed">
          A robust suite of engineering tools, telemetry platforms, and execution environments curated for seamless campus integration. Maintained by Prateet Gogia.
        </p>
        
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="primary" className="w-full sm:w-auto px-8">
            Explore Ecosystem
          </Button>
          <Button variant="ghost" className="w-full sm:w-auto px-8 border border-white/5">
            View System Architecture
          </Button>
        </div>
      </div>
    </section>
  );
}