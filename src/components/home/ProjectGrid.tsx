import Link from "next/link";
import { Card } from "../Card";
import { Button } from "../Button";

// Centralized data for the 4 projects
const projects = [
  {
    slug: "amazecc",
    name: "AmazeCC",
    tagline: "Code Execution Engine",
    description: "Secure, client-side verified sandbox environment designed to handle multi-language compilation with sub-millisecond overhead.",
    status: "Online",
    statusColor: "bg-emerald-500",
  },
  {
    slug: "amazesort",
    name: "AmazeSort",
    tagline: "Algorithm Visualizer",
    description: "Interactive real-time visualizer for sorting, searching, and memory allocation patterns across diverse datasets.",
    status: "Online",
    statusColor: "bg-emerald-500",
  },
  {
    slug: "amazetrack",
    name: "AmazeTrack",
    tagline: "Telemetry Engine",
    description: "Environmental data pipeline integrating an ESP32 chip and sensor array syncing real-time directly to a Supabase cloud backend.",
    status: "Syncing",
    statusColor: "bg-[#5C4DFF]", // Accent purple
  },
  {
    slug: "gorobo",
    name: "GoRobo",
    tagline: "Robotics Framework",
    description: "Autonomous path planning, sensor fusion, and real-time remote telemetry execution for hardware automation.",
    status: "Offline",
    statusColor: "bg-red-500",
  },
];

export function ProjectGrid() {
  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 pb-32">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.slug} className="group relative flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
            
            {/* Top Section: Title & Status */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">{project.name}</h3>
                  <p className="mt-1 text-sm font-medium text-[#5C4DFF]">{project.tagline}</p>
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center gap-2 rounded-full border border-white/5 bg-black/20 px-3 py-1">
                  <span className={`h-2 w-2 rounded-full ${project.statusColor} shadow-[0_0_8px_currentColor]`} />
                  <span className="text-xs font-semibold text-slate-300">{project.status}</span>
                </div>
              </div>
              
              <p className="mt-5 text-sm text-slate-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Bottom Section: Action */}
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
              <Link href={`/projects/${project.slug}`}>
                <Button variant="ghost" className="px-4 py-2 hover:bg-[#5C4DFF]/10 hover:text-[#5C4DFF]">
                  View Dashboard →
                </Button>
              </Link>
            </div>
            
          </Card>
        ))}
      </div>
    </section>
  );
}