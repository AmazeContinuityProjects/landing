import { Hero } from "../components/home/Hero";
import { ProjectGrid } from "../components/home/ProjectGrid";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <ProjectGrid />
    </div>
  );
}