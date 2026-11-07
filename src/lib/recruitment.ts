/**
 * Talks to amazecc-api's recruitment endpoints. The roles, limits and whether
 * applications are open all come from the server (`GET /api/recruitment`), so
 * changing what we recruit for never needs a redeploy of this site.
 */

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.amazecc.com").replace(/\/+$/, "");

export type RecruitmentRole = { id: string; label: string; description: string };

export type RecruitmentConfig = {
  open: boolean;
  cycle: string;
  deadline: string | null;
  roles: RecruitmentRole[];
  emailDomains: string[];
  limits: {
    nameMax: number;
    maxRoles: number;
    otherRoleMax: number;
    whyMin: number;
    whyMax: number;
    experienceMax: number;
    maxLinks: number;
    hoursMin: number;
    hoursMax: number;
  };
};

export type ApplicationInput = {
  name: string;
  email: string;
  regNo: string;
  year: number;
  roles: string[];
  otherRole?: string;
  why: string;
  experience?: string;
  links: string[];
  hoursPerWeek: number;
  consent: boolean;
  /** Hidden spam trap; real people leave it empty. */
  website?: string;
};

export type SubmitResult =
  | { ok: true; status: "created" | "updated" | "received" }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export async function fetchRecruitmentConfig(): Promise<RecruitmentConfig> {
  const res = await fetch(`${API_BASE}/api/recruitment`, { cache: "no-store" });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success || !Array.isArray(json.roles)) {
    throw new Error("Couldn't load the application form. Please try again in a bit.");
  }
  return json as RecruitmentConfig;
}

export async function submitApplication(input: ApplicationInput): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/recruitment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    return { ok: false, message: "Couldn't reach the server. Check your connection and try again." };
  }
  const json = await res.json().catch(() => null);
  if (res.ok && json?.success) return { ok: true, status: json.status };
  if (json?.error === "invalid_fields" && json.errors) {
    return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: json.errors };
  }
  if (res.status === 429) {
    return { ok: false, message: json?.detail || "Too many attempts. Please wait a minute and try again." };
  }
  return { ok: false, message: json?.detail || "Something went wrong. Please try again." };
}
