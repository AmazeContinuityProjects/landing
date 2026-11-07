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
  emailDomains?: string[];
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
      description: "High-throughput scrapers, session handlers, PostgreSQL, and caching pipelines.",
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
  emailDomains: [], // Open to all email domains
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

