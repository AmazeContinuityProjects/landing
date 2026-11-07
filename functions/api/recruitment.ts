import type { D1Database } from "@cloudflare/workers-types";
import { DEFAULT_CONFIG } from "../../src/lib/recruitment-config";

export interface Env {
  DB: D1Database;
}

const { limits, roles } = DEFAULT_CONFIG;
const backgrounds = new Set(["1", "2", "3", "4", "5", "grad", "other"]);
const roleIds = new Set(roles.map((role) => role.id));
const MAX_BODY_BYTES = 24000;

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

export const onRequestGet = async () =>
  json({ success: true, ...DEFAULT_CONFIG });

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  // The form and API are hosted together. Reject cross-origin browser submissions.
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return json({ success: false, detail: "Please submit the form from this website." }, 403);
  }
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
    return json({ success: false, detail: "Expected a JSON request." }, 415);
  }

  let data: Record<string, unknown>;
  try {
    // Bound the body even when Content-Length is missing or inaccurate.
    const reader = request.body?.getReader();
    if (!reader) return json({ success: false, detail: "Missing request body." }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return json({ success: false, detail: "Application is too large." }, 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
    data = parsed as Record<string, unknown>;
  } catch {
    return json({ success: false, detail: "Invalid request payload." }, 400);
  }

  // Silently discard submissions from the hidden spam trap.
  if (typeof data.website === "string" && data.website.trim()) {
    return json({ success: true, status: "received" });
  }
  if (!DEFAULT_CONFIG.open) {
    return json({ success: false, detail: "Applications are currently closed." }, 403);
  }

  const text = (key: string) => typeof data[key] === "string" ? data[key].trim() : "";
  const name = text("name");
  const email = text("email").toLowerCase();
  const regNo = text("regNo");
  const year = typeof data.year === "number" ? String(data.year) : text("year");
  const otherRole = text("otherRole");
  const why = text("why");
  const experience = text("experience");
  const hours = data.hoursPerWeek;
  const errors: Record<string, string> = {};

  if (!name || name.length > limits.nameMax) errors.name = `Enter a name up to ${limits.nameMax} characters.`;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
  if (data.regNo !== undefined && (typeof data.regNo !== "string" || regNo.length > 200)) errors.regNo = "Use up to 200 characters, or leave this blank.";
  if (!backgrounds.has(year)) errors.year = "Please select your year / background.";
  if (!Array.isArray(data.roles) || data.roles.length < 1 || data.roles.length > limits.maxRoles ||
      data.roles.some((role) => typeof role !== "string" || !roleIds.has(role)) ||
      new Set(data.roles).size !== data.roles.length) {
    errors.roles = `Select between 1 and ${limits.maxRoles} different roles.`;
  }
  if (Array.isArray(data.roles) && data.roles.includes("other") && (!otherRole || otherRole.length > limits.otherRoleMax)) {
    errors.otherRole = `Describe your role in up to ${limits.otherRoleMax} characters.`;
  }
  if (why.length < limits.whyMin || why.length > limits.whyMax) errors.why = `Write between ${limits.whyMin} and ${limits.whyMax} characters.`;
  if (data.experience !== undefined && (typeof data.experience !== "string" || experience.length > limits.experienceMax)) errors.experience = `Use up to ${limits.experienceMax} characters.`;
  if (typeof hours !== "number" || !Number.isFinite(hours) || hours < limits.hoursMin || hours > limits.hoursMax) {
    errors.hoursPerWeek = `Choose between ${limits.hoursMin} and ${limits.hoursMax} hours per week.`;
  }
  if (data.consent !== true) errors.consent = "Please agree to the application review.";
  if (!Array.isArray(data.links) || data.links.length > limits.maxLinks || data.links.some((link) => {
    if (typeof link !== "string" || link.length > 2048) return true;
    try { return !["http:", "https:"].includes(new URL(link).protocol); } catch { return true; }
  })) errors.links = `Provide up to ${limits.maxLinks} valid http or https links.`;

  if (Object.keys(errors).length) return json({ success: false, error: "invalid_fields", errors }, 400);

  if (!env.DB) {
    return json({ success: false, detail: "Applications are temporarily unavailable. Please try again later." }, 503);
  }
  try {
    // Unique email + cycle makes retries safe and lets applicants revise their application.
    const result = await env.DB.prepare(`
      INSERT INTO applications (
        id, cycle, name, email, reg_no, background, roles, other_role,
        motivation, experience, links, hours_per_week, consent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      ON CONFLICT(cycle, email) DO UPDATE SET
        name = excluded.name, reg_no = excluded.reg_no, background = excluded.background,
        roles = excluded.roles, other_role = excluded.other_role,
        motivation = excluded.motivation, experience = excluded.experience,
        links = excluded.links, hours_per_week = excluded.hours_per_week,
        consent = excluded.consent, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    `).bind(
      crypto.randomUUID(), DEFAULT_CONFIG.cycle, name, email, regNo || null, year,
      JSON.stringify(data.roles), (data.roles as string[]).includes("other") ? otherRole : null,
      why, experience || null, JSON.stringify(data.links), hours,
    ).run();
    if (!result.success) throw new Error("D1 write failed");
    return json({ success: true, status: "received" });
  } catch {
    // Do not log applicants' personal information or expose database details.
    console.error("Recruitment database write failed");
    return json({ success: false, detail: "We couldn't save your application. Please try again." }, 503);
  }
};
