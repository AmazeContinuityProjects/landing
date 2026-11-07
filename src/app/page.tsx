import { Hero } from "../components/site/Hero";
import { FinalCta, Journey, Mission, Stats, Teams, TechMarquee } from "../components/site/Sections";
import { AmazeCCShowcase, GoRoboSection } from "../components/site/Showcase";

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <Stats />
      <Mission />
      <AmazeCCShowcase />
      <GoRoboSection />
      <Teams />
      <Journey />
      <FinalCta />
    </>
  );
}
