import type { Metadata } from "next";
import { JoinForm } from "../../components/join/JoinForm";

export const metadata: Metadata = {
  title: "Join AmazeCC | Recruitments",
  description: "Join the AmazeCC community: developers, designers, and everyone who wants to build for VIT students.",
};

const STEPS = [
  { title: "Apply", body: "Fill in the form below. It takes about five minutes." },
  { title: "Review", body: "The team reads every application." },
  { title: "Chat", body: "If it's a fit, we'll set up a short, friendly conversation." },
  { title: "Welcome", body: "You join the team and start building with us." },
];

export default function JoinPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-24 pt-36">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#8B80FF]">Recruitments</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Join AmazeCC</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          AmazeCC is the student-built app that VIT students use every day for attendance, timetables, FFCS and more.
          We&apos;re looking for developers, designers and organisers who want to build things their friends actually
          use.
        </p>
      </header>

      <section aria-labelledby="process" className="mt-14">
        <h2 id="process" className="sr-only">
          How it works
        </h2>
        <ol className="grid gap-4 sm:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <span className="text-xs font-semibold text-[#8B80FF]">Step {i + 1}</span>
              <p className="mt-1 font-semibold text-white">{step.title}</p>
              <p className="mt-1 text-sm text-slate-400">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="apply" className="mt-14">
        <h2 id="apply" className="mb-5 text-2xl font-bold text-white">
          Apply
        </h2>
        <JoinForm />
      </section>
    </div>
  );
}
