import { Hero } from "../components/site/Hero";
import { FinalCta, Journey, Mission, Stats, Teams, TechMarquee, Thread } from "../components/site/Sections";
import { AmazeCCShowcase } from "../components/site/Showcase";
import { CollaboratorCursors } from "../components/site/CollaboratorCursors";

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <Stats />
      <Mission />
      <Thread id="thread-a" />
      <AmazeCCShowcase />
      <Teams />
      <Thread id="thread-b" flip />
      <Journey />
      <FinalCta />
      {/* Homepage only: ambient teammates, kept off the application form. */}
      <CollaboratorCursors />
    </>
  );
}
