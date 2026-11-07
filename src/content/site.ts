/**
 * Every word and number on the homepage lives here, so the copy can be edited
 * without touching the design. Numbers are real (taken from the repos on
 * 2026-11-07); update them as they grow.
 *
 * The site focuses on AmazeCC, with GoRobo as the second project.
 */

export const ORG = {
  name: "Amaze Continuity Projects",
  short: "ACP",
  github: "https://github.com/AmazeContinuityProjects",
  app: "https://amazecc.com",
  gorobo: "https://gorobo.amazecc.com",
  campus: "VIT Chennai",
};

export const HERO = {
  eyebrow: "Amaze Continuity Projects · VIT Chennai",
  // Three lines: iridescent, solid, outline.
  lines: ["Software", "that outlives", "its batch"] as const,
  lede:
    "We're the students behind AmazeCC, the app VIT students run their semester on, and GoRobo, parts for campus makers. We build them in the open and hand them down, so every batch inherits something better.",
  primary: { label: "Explore AmazeCC", href: "#amazecc" },
  secondary: { label: "Join the team", href: "/join" },
};

export const TECH = [
  "Next.js",
  "TypeScript",
  "React",
  "Kotlin",
  "Jetpack Compose",
  "PostgreSQL",
  "Cloudflare Workers",
  "Tailwind CSS",
  "Vercel",
  "Supabase",
  "PWA",
  "Cheerio",
];

export const STATS = [
  { value: 1269, suffix: "", label: "Commits on AmazeCC" },
  { value: 215, suffix: "+", label: "API routes behind the app" },
  { value: 2295, suffix: "", label: "Automated tests" },
  { value: 2025, suffix: "", label: "Building since", plain: true },
];

export const MISSION = {
  label: "Our aim",
  headline: ["Make campus life", "effortless,", "for every batch."] as const,
  body: [
    "Student life at VIT runs through a dozen portals that don't talk to each other. Our aim is one place, fast and pleasant, that answers the questions students actually have: can I skip this class, what's my timetable, who's in my section, when's my exam.",
    "And because students graduate, we build for continuity. Code that's documented, tested and handed over, so a project started by one batch is improved by the next instead of abandoned.",
  ],
};

export const OBJECTIVES = [
  {
    n: "01",
    title: "One app for campus",
    body: "Attendance, marks, timetables, FFCS, hostel, transport, library and events, in one fast app instead of a dozen slow portals.",
  },
  {
    n: "02",
    title: "Built in the open",
    body: "Our code is public. Anyone can read it, file an issue or open a pull request, and learn by shipping something real.",
  },
  {
    n: "03",
    title: "Private by default",
    body: "Identity comes from VTOP, sensitive work happens on the server, and we store as little as we can. No PINs, no guesswork.",
  },
  {
    n: "04",
    title: "Made to last",
    body: "Design docs, thousands of tests and clean handovers, so what we build outlives the batch that started it.",
  },
];

/* ── AmazeCC ─────────────────────────────────────────────────────────── */

export type FeatureVisual =
  | "attendance"
  | "ffcs"
  | "classmates"
  | "timetable"
  | "exams"
  | "hostel"
  | "transport"
  | "library"
  | "events"
  | "pwa";

export type Feature = {
  title: string;
  body: string;
  visual: FeatureVisual;
  /** Bento size: "xl" spans two columns and two rows. */
  size: "xl" | "wide" | "tall" | "md";
};

export const AMAZECC = {
  label: "The flagship",
  name: "AmazeCC",
  headline: ["The student", "operating system"] as const,
  lede:
    "Everything VTOP does, and a lot it doesn't, in one fast app. Log in with your VTOP account and your whole semester is there: attendance, marks, timetable, FFCS, hostel, buses, library and events. Install it on your phone like an app; it keeps working offline.",
  link: { label: "Open AmazeCC", href: "https://amazecc.com" },
  code: { label: "Read the code", href: "https://github.com/AmazeContinuityProjects/AmazeCC" },
  features: [
    {
      title: "Attendance that thinks ahead",
      body: "Colour-coded percentages per course, and a predictor that tells you how many classes you can skip, or need to attend, to stay above the line.",
      visual: "attendance",
      size: "xl",
    },
    {
      title: "FFCS planner",
      body: "Pick courses and faculty, see clashes instantly, and let the generator search thousands of timetables ranked by gaps, half-days and faculty reviews.",
      visual: "ffcs",
      size: "wide",
    },
    {
      title: "Find classmates",
      body: "See who picked the same sections as you. Verified through VTOP, matched on the server, private by default.",
      visual: "classmates",
      size: "md",
    },
    {
      title: "Timetable & calendar",
      body: "Your week at a glance with the academic calendar overlaid. Export to iCal or an image, or share it as a link.",
      visual: "timetable",
      size: "tall",
    },
    {
      title: "Marks, grades & exams",
      body: "Marks breakdowns, CGPA history, a GPA predictor with what-if simulations, and CAT/FAT schedules with venues.",
      visual: "exams",
      size: "md",
    },
    {
      title: "Hostel life",
      body: "Mess menus, laundry slots and leave management, without logging in to three different places.",
      visual: "hostel",
      size: "md",
    },
    {
      title: "Buses & transport",
      body: "Find your day-scholar bus route and boarding points in seconds.",
      visual: "transport",
      size: "md",
    },
    {
      title: "Library",
      body: "Search the catalogue, check what's issued to you and when it's due.",
      visual: "library",
      size: "md",
    },
    {
      title: "Events & clubs",
      body: "Discover what's happening on campus and register for events in a couple of taps.",
      visual: "events",
      size: "wide",
    },
    {
      title: "Fast, offline, yours",
      body: "Installable PWA with offline support and push notifications. Light, dark and midnight themes, custom accents, and a Ctrl+K command palette.",
      visual: "pwa",
      size: "md",
    },
  ] satisfies Feature[],
  underTheHood: [
    { value: "215+", label: "API routes", body: "One backend that talks to VTOP, Moodle, the library and EventHub, and serves clean JSON." },
    { value: "Edge", label: "Cached worldwide", body: "Cloudflare Workers keep it fast in registration rushes, when everyone logs in at once." },
    { value: "VTOP", label: "Verified identity", body: "Who you are comes from VTOP itself. Sensitive work happens on the server, not in your browser." },
    { value: "Android", label: "Coming native", body: "A Kotlin and Jetpack Compose version of AmazeCC is in development." },
  ],
};

/* ── GoRobo ──────────────────────────────────────────────────────────── */

export const GOROBO = {
  label: "For makers",
  name: "GoRobo",
  headline: ["Parts for", "campus makers"] as const,
  lede:
    "A robotics and DIY electronics catalogue for students building hardware. Find the sensor, board or motor you need, add it to your cart, and ask the team directly over WhatsApp or email.",
  link: { label: "Visit GoRobo", href: "https://gorobo.amazecc.com" },
  total: 317,
  categories: [
    { name: "Sensors & Modules", count: 112 },
    { name: "Accessories & Cables", count: 39 },
    { name: "Power & Converters", count: 29 },
    { name: "Displays & LEDs", count: 22 },
    { name: "ESP Boards & Shields", count: 16 },
    { name: "Motors & Actuators", count: 16 },
    { name: "Drones", count: 11 },
    { name: "Arduino & STM32", count: 7 },
  ],
  points: ["Search by name or browse by category", "A cart for your project's parts list", "Inquire about any part, straight to the team"],
};

/* ── People & history ───────────────────────────────────────────────── */

export const TEAMS = [
  {
    name: "Developers",
    body: "Web, backend, scraping and Android. You'll ship features thousands of students open every day.",
    skills: ["TypeScript", "Next.js", "Kotlin", "APIs"],
  },
  {
    name: "Design / UI-UX",
    body: "Product and interface design. You'll decide how AmazeCC looks and feels.",
    skills: ["Figma", "Design systems", "Motion"],
  },
  {
    name: "Non-technical",
    body: "Marketing, content, social media, events and outreach. You'll tell the story and grow the community.",
    skills: ["Content", "Events", "Social"],
  },
  {
    name: "Maintainers",
    body: "Reviews, releases and keeping things healthy. The people who make continuity real.",
    skills: ["Code review", "Releases", "Mentoring"],
  },
];

/** From AmazeCC's public commit history on GitHub. */
export const CONTRIBUTORS = [
  { login: "SugeethJSA", note: "Maintainer" },
  { login: "Anasarfeen123", note: "Contributor" },
  { login: "DumbTempest", note: "Contributor" },
  { login: "dhivyanj", note: "Contributor" },
  { login: "Scorpiozo", note: "Contributor" },
  { login: "Arya4930", note: "UniCC, where it began" },
];

export const JOURNEY = [
  {
    date: "Sep 2025",
    title: "First commit",
    body: "AmazeCC starts life as a fork of UniCC, with a captcha solver adapted from ViBoot-Enhanced.",
  },
  {
    date: "Jun 2026",
    title: "Amaze Continuity Projects",
    body: "The team organises around AmazeCC, with the app and its backend as separate, maintained projects.",
  },
  {
    date: "Jul 2026",
    title: "AmazeCC goes native",
    body: "Work begins on a Kotlin and Jetpack Compose version of AmazeCC for Android.",
  },
  {
    date: "Sep 2026",
    title: "GoRobo launches",
    body: "A parts catalogue for campus makers, with 300+ robotics and electronics components.",
  },
  {
    date: "Nov 2026",
    title: "Faster, and more social",
    body: "Edge caching for registration rushes, and the FFCS friend finder lands in AmazeCC.",
  },
  {
    date: "2026–27",
    title: "Your chapter",
    body: "Recruitments are open. The next batch builds what comes after.",
    current: true,
  },
];

export const FINAL_CTA = {
  headline: ["Build the", "next chapter"] as const,
  body: "Developers, designers, organisers, and whatever you bring. Applications for 2026-27 are open.",
  cta: { label: "Apply to join", href: "/join" },
};
