import { DEFAULT_CONFIG, type RecruitmentConfig } from "./recruitment-config";
export type { RecruitmentConfig } from "./recruitment-config";

// The default API is the Cloudflare Pages Function on this site's own origin.
const API_URL = `${(process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "")}/api/recruitment`;

export type ApplicationInput = {
  name: string;
  email: string;
  regNo?: string;
  year: number | string;
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
  try {
    const res = await fetch(API_URL, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    const json = await res.json();
    if (res.ok && json?.success && Array.isArray(json.roles) && json.limits) {
      return json as RecruitmentConfig;
    }
  } catch {
    // Static defaults allow browsing the form while the API is unavailable.
  }
  return DEFAULT_CONFIG;
}

export async function submitApplication(input: ApplicationInput): Promise<SubmitResult> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(15000),
    });
    const json = await res.json().catch(() => null);
    if (res.ok && json?.success) {
      return { ok: true, status: json.status || "received" };
    }
    if (json?.error === "invalid_fields" && json.errors) {
      return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: json.errors };
    }
    return {
      ok: false,
      message: json?.detail || "We couldn't submit your application. Your answers are still here; please try again.",
    };
  } catch {
    return {
      ok: false,
      message: "We couldn't reach the application service. Your answers are still here; please try again.",
    };
  }
}
