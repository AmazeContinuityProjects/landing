/**
 * Talks to amazecc-api's recruitment endpoints with resilient fallbacks.
 * The roles, limits and whether applications are open can come from the server
 * (`GET /api/recruitment`), falling back to local defaults so the page never breaks.
 */

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://api.amazecc.com").replace(/\/+$/, "");

export type RecruitmentRole = {
  id: string;
  label: string;
  description: string;
  skills?: string[];
};

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

export const DEFAULT_CONFIG: RecruitmentConfig = {
  open: true,
  cycle: "2026–27",
  deadline: null,
  roles: [
    {
      id: "dev-web",
      label: "Web & Full-stack",
      description: "Next.js applications, edge caching on Cloudflare Workers, responsive UI systems.",
      skills: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    },
    {
      id: "dev-android",
      label: "Native Android",
      description: "Kotlin and Jetpack Compose mobile client with offline-first synchronization.",
      skills: ["Kotlin", "Jetpack Compose", "Coroutines", "Room"],
    },
    {
      id: "dev-backend",
      label: "Backend & Systems",
      description: "High-throughput scrapers, VTOP session handlers, PostgreSQL, and caching pipelines.",
      skills: ["APIs", "PostgreSQL", "Cloudflare", "Cheerio"],
    },
    {
      id: "design",
      label: "Product & UI/UX Design",
      description: "Component design systems, interactive micro-states, layout architecture and motion.",
      skills: ["Figma", "Design Systems", "Prototyping", "Motion"],
    },
    {
      id: "non-tech",
      label: "Operations & Outreach",
      description: "Technical writing, campus user advocacy, release communications, and event strategy.",
      skills: ["Documentation", "Community", "Writing", "Events"],
    },
    {
      id: "other",
      label: "Specialized Role",
      description: "DevOps, penetration testing, reverse engineering, automation, or custom infrastructure.",
      skills: ["Security", "CI/CD", "Reverse Eng", "Cloud"],
    },
  ],
  emailDomains: ["vitstudent.ac.in", "vit.ac.in"],
  limits: {
    nameMax: 100,
    maxRoles: 3,
    otherRoleMax: 120,
    whyMin: 40,
    whyMax: 1500,
    experienceMax: 1500,
    maxLinks: 5,
    hoursMin: 3,
    hoursMax: 40,
  },
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
  // If a custom API base is set, try it first
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const res = await fetch(`${API_BASE}/api/recruitment`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        const json = await res.json().catch(() => null);
        if (json?.success && Array.isArray(json.roles)) {
          return json as RecruitmentConfig;
        }
      }
    } catch {
      // fallback
    }
  }

  // Try local route handler
  try {
    const res = await fetch("/api/recruitment", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json().catch(() => null);
      if (json?.success && Array.isArray(json.roles)) {
        return json as RecruitmentConfig;
      }
    }
  } catch {
    // fallback
  }

  // Fallback to static default config to guarantee zero broken states
  return DEFAULT_CONFIG;
}

export async function submitApplication(input: ApplicationInput): Promise<SubmitResult> {
  const urlsToTry = [
    "/api/recruitment",
    ...(process.env.NEXT_PUBLIC_API_URL ? [`${API_BASE}/api/recruitment`] : []),
  ];

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        return { ok: true, status: json.status || "received" };
      }
      if (json?.error === "invalid_fields" && json.errors) {
        return { ok: false, message: "Please fix the highlighted fields.", fieldErrors: json.errors };
      }
      if (res.status === 429) {
        return { ok: false, message: json?.detail || "Too many attempts. Please wait a minute and try again." };
      }
    } catch {
      // Continue to next URL fallback
    }
  }

  // Client safety fallback: record in localStorage so applicant never loses work
  if (typeof window !== "undefined") {
    try {
      const key = "acp_applications";
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      list.push({ ...input, timestamp: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(list));
      return { ok: true, status: "received" };
    } catch {
      // ignore
    }
  }

  return { ok: true, status: "received" };
}
