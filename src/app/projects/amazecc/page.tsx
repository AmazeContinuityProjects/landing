"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";

// 1. Module List Data
const AMAZECC_MODULES = [
  { id: "attendance", name: "Attendance Tracker", icon: "⚡", desc: "Predict safety margins and skip limits instantly." },
  { id: "academics", name: "Academics Hub", icon: "🎓", desc: "Access courses, grade lists, and schedules." },
  { id: "cgpa", name: "CGPA Predictor", icon: "📈", desc: "Set target grades and calculate SGPA distributions." },
  { id: "faculty", name: "Faculty Explorer", icon: "👤", desc: "Search professor cabinets, designations, and emails." },
  { id: "hostel", name: "Hostel & Logistics", icon: "🏠", desc: "Check daily mess menus and counseling slots." },
  { id: "qbank", name: "Question Bank", icon: "📄", desc: "Search and download previous years' exam papers." },
  { id: "wishlist", name: "FFCS Wishlist", icon: "❤️", desc: "Draft mock wishlist classes for course registration." },
  { id: "payments", name: "Payments Ledger", icon: "💳", desc: "Track tuition transactions and invoice records." },
  { id: "library", name: "Libraries Search", icon: "📖", desc: "Search the OPAC catalog books and view checkouts." },
  { id: "planner", name: "FFCS Planner", icon: "📅", desc: "Design draft schedules and check slot collisions." },
  { id: "events", name: "Event Hub", icon: "✨", desc: "View upcoming club events and secure passes." },
];

const TEAM_MEMBERS = [
  { 
    name: "Prateet Gogia", 
    role: "Lead Developer", 
    id: "25BCE1452", 
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Prateet&backgroundColor=5c4dff" 
  },
  { 
    name: "Sumit", 
    role: "UI/UX Engineer", 
    id: "25BCE1453", 
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sumit&backgroundColor=10b981" 
  },
  { 
    name: "Naruto", 
    role: "Backend Architect", 
    id: "25BCE1454", 
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Naruto&backgroundColor=f59e0b" 
  },
  { 
    name: "Sasuke", 
    role: "Systems Engineer", 
    id: "25BCE1455", 
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sasuke&backgroundColor=ef4444" 
  },
];

export default function AmazeCCDashboard() {
  // 2. Attendance Interactive Sandbox State
  const [attended, setAttended] = useState(17);
  const [total, setTotal] = useState(20);
  const [activeModule, setActiveModule] = useState("attendance");

  // Calculations
  const percentage = Math.round((attended / total) * 100);
  const safeSkips = Math.max(0, Math.floor((attended - 0.75 * total) / 0.75));
  const isSafe = percentage >= 75;

  const handleAttend = () => {
    setAttended((prev) => prev + 1);
    setTotal((prev) => prev + 1);
  };

  const handleSkip = () => {
    setTotal((prev) => prev + 1);
  };

  const handleReset = () => {
    setAttended(17);
    setTotal(20);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] pb-24 text-slate-200">
      
      {/* Navigation Header */}
      <div className="border-b border-white/5 bg-black/20 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xs font-mono text-slate-400 hover:text-white transition-colors">
            ← Back to Ecosystem
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs text-slate-300">VTOP Gateway: Connected</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-12 space-y-16">
        
        {/* Title & Introduction */}
        <div>
          <span className="font-mono text-xs font-bold text-[#5C4DFF] uppercase tracking-wider">
            Student Operating System
          </span>
          <h1 className="mt-2 text-4xl font-extrabold text-white sm:text-5xl">
            AmazeCC Dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400 leading-relaxed">
            The unified interface replacing fragmented university portals. Manage attendance, track academic progress, evaluate mess menus, and plan schedules from a single glassmorphic workspace.
          </p>
        </div>

        {/* --- INTERACTIVE SECTION 1: ATTENDANCE SIMULATOR --- */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="font-mono text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              Predictive Calculator
            </span>
            <h2 className="text-3xl font-bold text-white">
              Simulate attendance margins live
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Calculate safe margins before skipping classes. Adjust the live simulator to evaluate real-time safety limits, percentage ratios, and safe skip counts instantly.
            </p>
            
            <div className="flex items-center gap-6 pt-2 font-mono text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                75% Safety Guard
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#5C4DFF]" />
                Dynamic Percentage
              </span>
            </div>
          </div>

          {/* Interactive Sandbox Card */}
          <div className="lg:col-span-6">
            <Card className="border-white/10 bg-black/40 p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                    Attendance Preview
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-wide">PREDICTOR SANDBOX</h3>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs font-mono text-slate-500 hover:text-white transition-colors"
                  title="Reset Sandbox"
                >
                  ↻ Reset
                </button>
              </div>

              {/* Course & Progress Ring Row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-slate-400 uppercase">CSE3002 - Compiler Design</p>
                  <p className="mt-1 text-2xl font-extrabold text-white">
                    Attended: {attended} / {total}
                  </p>
                </div>

                {/* Simulated Radial Progress */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-indigo-500/30 bg-black/60 font-mono text-xs font-bold text-white">
                  {percentage}%
                </div>
              </div>

              {/* Safety Margin Pill */}
              <div className={`rounded-xl border p-3.5 text-center font-mono text-xs font-semibold transition-all ${
                isSafe 
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}>
                {isSafe 
                  ? `Safe to skip: Yes (${safeSkips} ${safeSkips === 1 ? 'class' : 'classes'})`
                  : "Warning: Attendance below 75% limit!"}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  onClick={handleAttend}
                  variant="ghost" 
                  className="border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                >
                  + ATTEND
                </Button>
                <Button 
                  onClick={handleSkip}
                  variant="ghost" 
                  className="border border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  — SKIP
                </Button>
              </div>

            </Card>
          </div>

        </section>

        {/* --- INTERACTIVE SECTION 2: MODULE DRAWER --- */}
        <section className="space-y-8 pt-8 border-t border-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white">Unified System Modules</h2>
            <p className="mt-1 text-sm text-slate-400">Select any module to inspect its core capabilities</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AMAZECC_MODULES.map((mod) => {
              const isActive = activeModule === mod.id;
              return (
                <Card
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={`cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "border-[#5C4DFF] bg-[#5C4DFF]/10 shadow-[0_0_20px_rgba(92,77,255,0.15)]"
                      : "hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{mod.icon}</span>
                    <div>
                      <h3 className="font-bold text-white text-base">{mod.name}</h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* --- INTERACTIVE SECTION 3: TEAM MARQUEE --- */}
        <section className="space-y-8 pt-16 mt-16 border-t border-white/5 pb-12 overflow-hidden">
          <div className="text-center">
            <span className="font-mono text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Core Maintainers
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white">The Engineering Team</h2>
          </div>

          {/* Injecting raw CSS for the infinite scroll animation */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes infinite-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-infinite-scroll {
              animation: infinite-scroll 25s linear infinite;
              width: max-content;
            }
            .animate-infinite-scroll:hover {
              animation-play-state: paused;
            }
            );
            }
          `}} />

          {/* Marquee Track Container */}
          <div className="relative flex w-full overflow-hidden mask-horizontal-fades">
            
            {/* The Scrolling Track (Rendered twice for seamless looping) */}
            <div className="flex animate-infinite-scroll items-center gap-6 py-4 px-3">
              
              {[...TEAM_MEMBERS, ...TEAM_MEMBERS].map((member, idx) => (
                <Card 
                  key={`${member.id}-${idx}`} 
                  className="flex w-72 shrink-0 items-center gap-4 border-white/10 bg-black/40 p-4 transition-colors hover:border-[#5C4DFF]/50 hover:bg-white/[0.04]"
                >
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="h-14 w-14 rounded-full border-2 border-white/10 bg-black object-cover" 
                  />
                  <div>
                    <h4 className="font-bold text-white">{member.name}</h4>
                    <p className="font-mono text-[10px] text-indigo-400">{member.role}</p>
                    <p className="mt-1 font-mono text-[10px] text-slate-500">ID: {member.id}</p>
                  </div>
                </Card>
              ))}

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}