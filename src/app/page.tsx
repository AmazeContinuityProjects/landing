import { Hero } from "../components/home/Hero";
import { FocusAccordion } from "../components/home/FocusAccordian";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <FocusAccordion />
    </div>
  );
}