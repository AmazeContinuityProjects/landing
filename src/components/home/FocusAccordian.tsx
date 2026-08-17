"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../Button";
import { cn } from "../../lib/utils";

interface AccordionProject {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  modulesCount: string;
  status: string;
  accentColor: string;
  hoverGlow: string;
  tags: string[];
}

const PROJECTS: AccordionProject[] = [
  {
    slug: "amazecc",
    name: "AmazeCC",
    tagline: "VIT Unified Student Operating System",
    description:
      "All-in-one student portal replacing fragmented university portals. Real-time attendance prediction, academic hubs, FFCS planner, mess menu tracking, and room counseling.",
    modulesCount: "11 Modules Active",
    status: "Operational",
    accentColor: "border-indigo-500/50 text-indigo-400",
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]",
    tags: ["Student Hub", "FFCS Planner", "Academic Analytics"],
  },
  {
    slug: "amazesort",
    name: "AmazeSort",
    tagline: "Algorithm & Memory Allocation Visualizer",
    description:
      "Interactive engine demonstrating sorting, graph algorithms, and low-level memory allocation routines with real-time execution controls.",
    modulesCount: "Interactive Canvas",
    status: "Operational",
    accentColor: "border-purple-500/50 text-purple-400",
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    tags: ["Algorithms", "WebAssembly", "Data Visualizer"],
  },
  {
    slug: "amazetrack",
    name: "AmazeTrack",
    tagline: "IoT Environmental Telemetry Engine",
    description:
      "Hardware telemetry pipeline streaming temperature, pH, and turbidity metrics directly from ESP32 sensors to a Supabase cloud database.",
    modulesCount: "Hardware Linked",
    status: "Syncing",
    accentColor: "border-emerald-500/50 text-emerald-400",
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    tags: ["ESP32", "Supabase", "Telemetry"],
  },
  {
    slug: "gorobo",
    name: "GoRobo",
    tagline: "Hardware Procurement Platform",
    description:
      "Ecommerce dashboard for procuring hardware components",
    modulesCount: "ROS Pipeline",
    status: "Standby",
    accentColor: "border-amber-500/50 text-amber-400",
    hoverGlow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    tags: ["ROS2", "Path Planning", "Robotics"],
  },
];

export function FocusAccordion() {
  const [activeSlug, setActiveSlug] = useState<string>("amazecc");

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 pb-32">
      <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Ecosystem Modules
          </h2>
          <p className="text-sm text-slate-400">
            Hover to expand system parameters
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          SYSTEM_ONLINE
        </div>
      </div>

      {/* Accordion Container */}
      <div className="flex flex-col gap-4">
        {PROJECTS.map((project) => {
          const isExpanded = activeSlug === project.slug;

          return (
            <div
              key={project.slug}
              onMouseEnter={() => setActiveSlug(project.slug)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border bg-white/[0.02] p-6 transition-all duration-500 ease-out cursor-pointer",
                project.hoverGlow,
                isExpanded
                  ? "border-white/15 bg-white/[0.04] py-8"
                  : "border-white/5 opacity-70 hover:opacity-100"
              )}
            >
              {/* Header Line - Always Visible */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      "font-mono text-xs font-semibold px-2.5 py-1 rounded-md border bg-black/40",
                      project.accentColor
                    )}
                  >
                    {project.name}
                  </span>
                  <h3 className="text-lg font-bold text-white sm:text-xl">
                    {project.tagline}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden md:inline-block font-mono text-xs text-slate-400">
                    {project.modulesCount}
                  </span>
                  <div className="flex items-center gap-2 rounded-full border border-white/5 bg-black/30 px-3 py-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    <span className="font-mono text-xs text-slate-300">
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expandable Content Body */}
              <div
                className={cn(
                  "grid transition-all duration-500 ease-in-out",
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-white/5"
                    : "grid-rows-[0fr] opacity-0 mt-0 border-transparent"
                )}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
                      {project.description}
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-white/5 bg-white/5 px-2.5 py-1 text-xs font-mono text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <Link href={`/projects/${project.slug}`}>
                        <Button
                          variant="accent"
                          className="w-full sm:w-auto text-xs whitespace-nowrap"
                        >
                          Launch Dashboard →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}