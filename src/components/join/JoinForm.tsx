"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import {
  fetchRecruitmentConfig,
  submitApplication,
  type RecruitmentConfig,
} from "../../lib/recruitment";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition duration-200 focus:border-mint focus:bg-white/[0.06] focus:ring-1 focus:ring-mint/30";
const labelCls = "block text-xs font-semibold text-white/80";
const hintCls = "mt-1.5 text-xs text-white/50";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
      <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-rose-400" />
      {message}
    </p>
  );
}

const YEARS = [
  { value: 1, label: "1st Year (Fresher)" },
  { value: 2, label: "2nd Year" },
  { value: 3, label: "3rd Year" },
  { value: 4, label: "4th Year" },
  { value: 5, label: "5th Year (Integrated)" },
];

export function JoinForm() {
  const [config, setConfig] = useState<RecruitmentConfig | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [regNo, setRegNo] = useState("");
  const [year, setYear] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [otherRole, setOtherRole] = useState("");
  const [why, setWhy] = useState("");
  const [experience, setExperience] = useState("");
  const [links, setLinks] = useState("");
  const [hours, setHours] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot spam trap

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<"created" | "updated" | "received" | null>(null);

  useEffect(() => {
    fetchRecruitmentConfig()
      .then(setConfig)
      .catch((e: Error) => setLoadError(e.message));
  }, []);

  const maxRoles = config?.limits.maxRoles ?? 3;
  const toggleRole = (id: string) =>
    setRoles((current) =>
      current.includes(id)
        ? current.filter((r) => r !== id)
        : current.length >= maxRoles
        ? current
        : [...current, id]
    );

  const linkList = useMemo(
    () =>
      links
        .split(/[\s,]+/)
        .map((l) => l.trim())
        .filter(Boolean),
    [links]
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMessage(null);
    setFieldErrors({});

    const result = await submitApplication({
      name,
      email,
      regNo,
      year: Number(year),
      roles,
      otherRole: roles.includes("other") ? otherRole : undefined,
      why,
      experience: experience || undefined,
      links: linkList,
      hoursPerWeek: Number(hours),
      consent,
      website,
    });

    setSubmitting(false);
    if (result.ok) {
      setDone(result.status);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setMessage(result.message);
    setFieldErrors(result.fieldErrors ?? {});
  };

  if (loadError) {
    return (
      <div className="glass rounded-3xl border border-white/10 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/10 text-rose-400">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="font-display mt-4 text-lg font-bold text-white">Temporary connection issue</h3>
        <p className="mt-2 text-xs text-white/60">{loadError}</p>
        <button
          type="button"
          onClick={() => location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-ink transition hover:bg-mist active:scale-95"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!config) {
    return (
      <div aria-busy="true" className="glass rounded-3xl border border-white/10 p-8 space-y-6 sm:p-12">
        <div className="flex items-center justify-between">
          <div className="h-4 w-1/4 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-16 animate-pulse rounded bg-white/5" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
          <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        </div>
        <div className="h-32 animate-pulse rounded-xl bg-white/5" />
        <div className="h-12 animate-pulse rounded-xl bg-white/10" />
      </div>
    );
  }

  if (!config.open) {
    return (
      <div className="glass rounded-3xl border border-white/10 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white/60">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h3 className="font-display mt-4 text-xl font-bold uppercase text-white">Applications closed</h3>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-white/60">
          The recruitment cycle for this batch has closed. Follow our GitHub repositories for the next announced contribution window.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-2.5 text-xs font-semibold text-ink transition hover:brightness-110 active:scale-95"
        >
          Return to homepage
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="glass relative overflow-hidden rounded-3xl border border-mint/30 bg-ink-2/95 p-8 text-center shadow-2xl sm:p-14">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-mint/40 bg-mint/10 text-mint shadow-[0_0_30px_-5px_rgba(157,245,180,0.3)]">
          <svg className="h-7 w-7 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-mint">
          {done === "updated" ? "Application updated" : "Application received"}
        </p>
        <h2 className="font-display mt-2 text-2xl font-black uppercase text-white sm:text-3xl">
          Thank you for applying
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/70">
          Your application has been received by the maintainers. If your background aligns with our active roadmap, we will reach out to your student email address (<span className="text-white font-medium">{email || "provided email"}</span>).
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-3 text-xs font-bold text-ink transition hover:brightness-110 active:scale-95"
          >
            Back to homepage
          </Link>
          <a
            href="https://github.com/AmazeContinuityProjects"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-95"
          >
            Explore our GitHub ↗
          </a>
        </div>
      </div>
    );
  }

  const { limits } = config;
  const whyLength = why.trim().length;
  const whyProgress = Math.min(100, Math.round((whyLength / limits.whyMin) * 100));

  return (
    <div className="glass relative rounded-3xl border border-white/10 p-6 shadow-2xl sm:p-10">
      <form onSubmit={submit} noValidate className="space-y-8">
        {message ? (
          <div role="alert" className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
            <svg className="h-4 w-4 shrink-0 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{message}</span>
          </div>
        ) : null}

        {/* Section 1: Candidate Identification */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-mint">01</span>
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">Your details</h3>
            </div>
            <span className="text-xs text-white/40">Step 1 of 4</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelCls}>
                Full name <span className="text-mint">*</span>
              </label>
              <input
                id="name"
                className={cn(inputCls, "mt-1.5")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={limits.nameMax}
                placeholder="Alex Sharma"
                autoComplete="name"
                required
              />
              <FieldError message={fieldErrors.name} />
            </div>

            <div>
              <label htmlFor="email" className={labelCls}>
                Official student email <span className="text-mint">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={cn(inputCls, "mt-1.5")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="firstname.lastname2024@vitstudent.ac.in"
                autoComplete="email"
                required
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div>
              <label htmlFor="regNo" className={labelCls}>
                Registration number <span className="text-mint">*</span>
              </label>
              <input
                id="regNo"
                className={cn(inputCls, "mt-1.5 uppercase font-mono tracking-wider")}
                value={regNo}
                onChange={(e) => setRegNo(e.target.value.toUpperCase())}
                placeholder="24BCE1001"
                autoComplete="off"
                required
              />
              <FieldError message={fieldErrors.regNo} />
            </div>

            <div>
              <label htmlFor="year" className={labelCls}>
                Year of study <span className="text-mint">*</span>
              </label>
              <div className="relative mt-1.5">
                <select
                  id="year"
                  className={cn(inputCls, "appearance-none pr-10 cursor-pointer")}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  <option value="" disabled className="bg-ink-2 text-white/50">
                    Select your current year…
                  </option>
                  {YEARS.map((y) => (
                    <option key={y.value} value={y.value} className="bg-ink-2 text-white">
                      {y.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40">
                  <svg className="h-3 w-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              <FieldError message={fieldErrors.year} />
            </div>
          </div>
        </div>

        {/* Section 2: Roles of Interest */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-mint">02</span>
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">Roles of interest</h3>
            </div>
            <span className="text-xs text-white/60">
              Selected: <strong className="text-mint">{roles.length}</strong> of {limits.maxRoles}
            </span>
          </div>

          <p className={hintCls}>Pick up to {limits.maxRoles} areas you would like to contribute towards.</p>

          <div className="grid gap-3 sm:grid-cols-2">
            {config.roles.map((role) => {
              const checked = roles.includes(role.id);
              const disabled = !checked && roles.length >= limits.maxRoles;
              return (
                <label
                  key={role.id}
                  className={cn(
                    "group relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition-all duration-200 select-none",
                    checked
                      ? "border-mint/60 bg-mint/[0.08] shadow-[0_0_24px_-6px_rgba(157,245,180,0.22)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]",
                    disabled && "cursor-not-allowed opacity-35 hover:border-white/10 hover:bg-white/[0.02]"
                  )}
                >
                  <div>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleRole(role.id)}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("block font-display text-sm font-bold uppercase tracking-wide transition", checked ? "text-mint" : "text-white")}>
                        {role.label}
                      </span>
                      <div
                        className={cn(
                          "grid h-5 w-5 place-items-center rounded-md border text-[11px] transition duration-200 shrink-0",
                          checked
                            ? "border-mint bg-mint text-ink font-bold shadow-sm"
                            : "border-white/20 bg-white/5 group-hover:border-white/40"
                        )}
                      >
                        {checked && (
                          <svg className="h-3 w-3 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{role.description}</p>
                  </div>
                  {role.skills && role.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      {role.skills.map((s) => (
                        <span
                          key={s}
                          className={cn(
                            "rounded-md px-1.5 py-0.5 font-mono text-[10px]",
                            checked ? "bg-mint/15 text-mint" : "bg-white/5 text-white/50"
                          )}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </label>
              );
            })}
          </div>
          <FieldError message={fieldErrors.roles} />

          {roles.includes("other") ? (
            <div className="mt-3 animate-rise">
              <label htmlFor="otherRole" className={labelCls}>
                Tell us what you would like to work on <span className="text-mint">*</span>
              </label>
              <input
                id="otherRole"
                className={cn(inputCls, "mt-1.5")}
                value={otherRole}
                onChange={(e) => setOtherRole(e.target.value)}
                maxLength={limits.otherRoleMax}
                placeholder="e.g. DevOps pipelines, security audits, campus outreach"
              />
              <FieldError message={fieldErrors.otherRole} />
            </div>
          ) : null}
        </div>

        {/* Section 3: Technical Motivation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-mint">03</span>
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">Your motivation</h3>
            </div>
            <span className="text-xs text-white/40">Step 3 of 4</span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="why" className={labelCls}>
                Why do you want to join Amaze Continuity Projects? <span className="text-mint">*</span>
              </label>
              <span className={cn("font-mono text-xs", whyLength >= limits.whyMin ? "text-mint" : "text-white/40")}>
                {whyLength}/{limits.whyMax} chars
              </span>
            </div>
            <textarea
              id="why"
              className={cn(inputCls, "mt-2 min-h-[130px] leading-relaxed resize-y")}
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              maxLength={limits.whyMax}
              placeholder="Tell us what problems with campus tools you'd like to fix, what you hope to build, or what software continuity means to you."
              required
            />
            <div className="mt-2 flex items-center justify-between gap-3 text-xs">
              <p className={hintCls}>
                {whyLength < limits.whyMin ? (
                  <span className="text-amber-300/80">
                    At least {limits.whyMin} characters needed ({limits.whyMin - whyLength} more to go).
                  </span>
                ) : (
                  <span className="text-mint">Minimum length reached</span>
                )}
              </p>
              {whyLength < limits.whyMin ? (
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-mint transition-all duration-300"
                    style={{ width: `${whyProgress}%` }}
                  />
                </div>
              ) : null}
            </div>
            <FieldError message={fieldErrors.why} />
          </div>

          <div>
            <label htmlFor="experience" className={labelCls}>
              Relevant experience or projects <span className="font-normal text-white/40">(optional)</span>
            </label>
            <textarea
              id="experience"
              className={cn(inputCls, "mt-2 min-h-[100px] leading-relaxed resize-y")}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              maxLength={limits.experienceMax}
              placeholder="Briefly describe any side projects, tools you built, design work, or technical challenges you enjoyed."
            />
            <FieldError message={fieldErrors.experience} />
          </div>
        </div>

        {/* Section 4: Proof of Work & Availability */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-mint">04</span>
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">Links & time</h3>
            </div>
            <span className="text-xs text-white/40">Step 4 of 4</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
            <div>
              <label htmlFor="links" className={labelCls}>
                Portfolio, GitHub or profile links <span className="font-normal text-white/40">(optional)</span>
              </label>
              <input
                id="links"
                className={cn(inputCls, "mt-1.5")}
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                placeholder="https://github.com/handle https://behance.net/handle"
              />
              <p className={hintCls}>Up to {limits.maxLinks} links separated by spaces or commas.</p>
              <FieldError message={fieldErrors.links} />
            </div>

            <div>
              <label htmlFor="hours" className={labelCls}>
                Hours per week <span className="text-mint">*</span>
              </label>
              <input
                id="hours"
                type="number"
                inputMode="numeric"
                min={limits.hoursMin}
                max={limits.hoursMax}
                className={cn(inputCls, "mt-1.5")}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="5"
                required
              />
              <p className={hintCls}>Minimum {limits.hoursMin} hours/week</p>
              <FieldError message={fieldErrors.hoursPerWeek} />
            </div>
          </div>
        </div>

        {/* Hidden Honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {/* Consent & Submit */}
        <div className="pt-2 border-t border-white/10 space-y-6">
          <label className="group flex cursor-pointer items-start gap-3 select-none text-xs leading-relaxed text-white/70">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-mint cursor-pointer"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              I agree that Amaze Continuity Projects can review my submission to evaluate my application.
            </span>
          </label>
          <FieldError message={fieldErrors.consent} />

          <button
            type="submit"
            disabled={submitting}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-mint px-6 py-4 text-sm font-semibold text-ink transition duration-200 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_12px_28px_-6px_rgba(157,245,180,0.35)]"
          >
            {submitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                Submitting application…
              </>
            ) : (
              <>
                <span>Submit application</span>
                <span aria-hidden className="transition group-hover:translate-x-1">→</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs text-white/40">
            <span>Amaze Continuity Projects</span>
            <span>VIT Chennai · Not affiliated with VIT</span>
          </div>
        </div>
      </form>
    </div>
  );
}
