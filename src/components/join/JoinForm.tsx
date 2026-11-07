"use client";

/**
 * The application form for /join. Kept deliberately plain for now: the visual
 * template comes later, so this file owns behaviour (loading the roles from
 * the server, validation feedback, submission) and the styling is ordinary
 * Tailwind on the site's existing Card and Button.
 */

import { useEffect, useMemo, useState } from "react";
import { Button } from "../Button";
import { Card } from "../Card";
import { cn } from "../../lib/utils";
import {
  fetchRecruitmentConfig,
  submitApplication,
  type RecruitmentConfig,
} from "../../lib/recruitment";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-[#5C4DFF] focus:ring-2 focus:ring-[#5C4DFF]/30";
const labelCls = "block text-sm font-medium text-slate-200";
const hintCls = "mt-1 text-xs text-slate-500";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs text-red-400">
      {message}
    </p>
  );
}

const YEARS = [1, 2, 3, 4, 5];

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
  const [website, setWebsite] = useState(""); // spam trap

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
      current.includes(id) ? current.filter((r) => r !== id) : current.length >= maxRoles ? current : [...current, id],
    );

  const linkList = useMemo(
    () =>
      links
        .split(/[\s,]+/)
        .map((l) => l.trim())
        .filter(Boolean),
    [links],
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
      <Card className="text-center">
        <p className="text-slate-300">{loadError}</p>
        <Button variant="ghost" className="mt-4 border border-white/10" onClick={() => location.reload()}>
          Try again
        </Button>
      </Card>
    );
  }

  if (!config) {
    return (
      <Card aria-busy="true" className="space-y-4">
        <div className="h-5 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="h-10 animate-pulse rounded-xl bg-white/5" />
        <div className="h-10 animate-pulse rounded-xl bg-white/5" />
        <div className="h-24 animate-pulse rounded-xl bg-white/5" />
      </Card>
    );
  }

  if (!config.open) {
    return (
      <Card className="text-center">
        <h2 className="text-lg font-semibold text-white">Applications are closed</h2>
        <p className="mt-2 text-sm text-slate-400">We&apos;re not recruiting right now. Check back next cycle.</p>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-2xl">✓</div>
        <h2 className="mt-4 text-xl font-semibold text-white">
          {done === "updated" ? "Application updated" : "Application received"}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Thanks for applying to AmazeCC. We&apos;ll review it and get back to you at your VIT email. Need to change
          something? Submit the form again with the same email before we review it.
        </p>
      </Card>
    );
  }

  const { limits } = config;
  return (
    <Card>
      <form onSubmit={submit} noValidate className="space-y-6">
        {message ? (
          <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {message}
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelCls}>
              Full name
            </label>
            <input id="name" className={cn(field, "mt-1.5")} value={name} onChange={(e) => setName(e.target.value)} maxLength={limits.nameMax} autoComplete="name" required />
            <FieldError message={fieldErrors.name} />
          </div>
          <div>
            <label htmlFor="email" className={labelCls}>
              VIT email
            </label>
            <input
              id="email"
              type="email"
              className={cn(field, "mt-1.5")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`you@${config.emailDomains[0]}`}
              autoComplete="email"
              required
            />
            <FieldError message={fieldErrors.email} />
          </div>
          <div>
            <label htmlFor="regNo" className={labelCls}>
              Registration number
            </label>
            <input
              id="regNo"
              className={cn(field, "mt-1.5 uppercase")}
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="25BCE1234"
              autoComplete="off"
              required
            />
            <FieldError message={fieldErrors.regNo} />
          </div>
          <div>
            <label htmlFor="year" className={labelCls}>
              Year of study
            </label>
            <select id="year" className={cn(field, "mt-1.5")} value={year} onChange={(e) => setYear(e.target.value)} required>
              <option value="" disabled>
                Select…
              </option>
              {YEARS.map((y) => (
                <option key={y} value={y} className="bg-[#0A0D14]">
                  Year {y}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors.year} />
          </div>
        </div>

        <fieldset>
          <legend className={labelCls}>Which roles interest you?</legend>
          <p className={hintCls}>Pick up to {limits.maxRoles}.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {config.roles.map((role) => {
              const checked = roles.includes(role.id);
              const disabled = !checked && roles.length >= limits.maxRoles;
              return (
                <label
                  key={role.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-xl border p-4 transition",
                    checked ? "border-[#5C4DFF] bg-[#5C4DFF]/10" : "border-white/10 hover:border-white/20",
                    disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[#5C4DFF]"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleRole(role.id)}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-white">{role.label}</span>
                    <span className="mt-0.5 block text-xs text-slate-400">{role.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          <FieldError message={fieldErrors.roles} />
          {roles.includes("other") ? (
            <div className="mt-3">
              <label htmlFor="otherRole" className={labelCls}>
                What would you like to do?
              </label>
              <input
                id="otherRole"
                className={cn(field, "mt-1.5")}
                value={otherRole}
                onChange={(e) => setOtherRole(e.target.value)}
                maxLength={limits.otherRoleMax}
                placeholder="e.g. Cybersecurity"
              />
              <FieldError message={fieldErrors.otherRole} />
            </div>
          ) : null}
        </fieldset>

        <div>
          <label htmlFor="why" className={labelCls}>
            Why do you want to join AmazeCC?
          </label>
          <textarea
            id="why"
            className={cn(field, "mt-1.5 min-h-32")}
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            maxLength={limits.whyMax}
            required
          />
          <p className={hintCls}>
            {why.trim().length < limits.whyMin
              ? `At least ${limits.whyMin} characters (${why.trim().length} so far).`
              : `${why.trim().length}/${limits.whyMax}`}
          </p>
          <FieldError message={fieldErrors.why} />
        </div>

        <div>
          <label htmlFor="experience" className={labelCls}>
            Relevant experience <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <textarea
            id="experience"
            className={cn(field, "mt-1.5 min-h-24")}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            maxLength={limits.experienceMax}
            placeholder="Projects, clubs, things you've built or designed or organised."
          />
          <FieldError message={fieldErrors.experience} />
        </div>

        <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
          <div>
            <label htmlFor="links" className={labelCls}>
              Links <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <input
              id="links"
              className={cn(field, "mt-1.5")}
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              placeholder="https://github.com/you https://behance.net/you"
            />
            <p className={hintCls}>GitHub, portfolio, LinkedIn… up to {limits.maxLinks}, separated by spaces.</p>
            <FieldError message={fieldErrors.links} />
          </div>
          <div>
            <label htmlFor="hours" className={labelCls}>
              Hours per week
            </label>
            <input
              id="hours"
              type="number"
              inputMode="numeric"
              min={limits.hoursMin}
              max={limits.hoursMax}
              className={cn(field, "mt-1.5")}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="5"
              required
            />
            <FieldError message={fieldErrors.hoursPerWeek} />
          </div>
        </div>

        {/* Spam trap: hidden from people and assistive tech; bots fill it in. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[#5C4DFF]"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              I agree that AmazeCC can store this application so the review team can read it. It&apos;s only visible to
              the review team.
            </span>
          </label>
          <FieldError message={fieldErrors.consent} />
        </div>

        <Button type="submit" variant="accent" className="w-full py-3 text-base" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit application"}
        </Button>
      </form>
    </Card>
  );
}
