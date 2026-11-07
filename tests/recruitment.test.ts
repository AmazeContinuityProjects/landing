import assert from "node:assert/strict";
import { test } from "node:test";
import { onRequestGet, onRequestPost, type Env } from "../functions/api/recruitment";
import { submitApplication } from "../src/lib/recruitment";

const valid = {
  name: "Independent Builder", email: "builder@gmail.com", year: "other",
  roles: ["dev-web"], why: "I want to build useful open source tools and contribute to this community.",
  links: ["https://github.com/example"], hoursPerWeek: 5, consent: true,
};

function database(mode: "ok" | "throw" | "unsuccessful" = "ok") {
  const writes: unknown[][] = [];
  const DB = {
    prepare(sql: string) {
      assert.match(sql, /ON CONFLICT\(cycle, email\) DO UPDATE/);
      return {
        bind(...values: unknown[]) {
          return { async run() {
            if (mode === "throw") throw new Error("Unavailable");
            if (mode === "unsuccessful") return { success: false };
            writes.push(values);
            return { success: true };
          } };
        },
      };
    },
  } as unknown as Env["DB"];
  return { DB, writes };
}

async function post(body: unknown, options: { db?: Env["DB"]; origin?: string; raw?: string; contentType?: string } = {}) {
  const request = new Request("https://acp-landing.pages.dev/api/recruitment", {
    method: "POST",
    headers: { "Content-Type": options.contentType ?? "application/json", ...(options.origin ? { Origin: options.origin } : {}) },
    body: options.raw ?? JSON.stringify(body),
  });
  return onRequestPost({ request, env: { DB: options.db } } as unknown as Parameters<typeof onRequestPost>[0]);
}

test("configuration allows every email domain", async () => {
  const response = await onRequestGet();
  assert.deepEqual((await response.json()).emailDomains, []);
});

test("a general email and no registration number persist before confirmation", async () => {
  const { DB, writes } = database();
  const response = await post(valid, { db: DB, origin: "https://acp-landing.pages.dev" });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(writes.length, 1);
  assert.equal(writes[0][3], "builder@gmail.com");
  assert.equal(writes[0][4], null);
  assert.equal(writes[0][5], "other");
});

test("optional organization text and professional background are accepted", async () => {
  const { DB, writes } = database();
  assert.equal((await post({ ...valid, regNo: "Independent studio", year: "grad", email: " Builder@Outlook.com " }, { db: DB })).status, 200);
  assert.equal(writes[0][3], "builder@outlook.com");
  assert.equal(writes[0][4], "Independent studio");
});

test("invalid fields never reach the database", async () => {
  const { DB, writes } = database();
  const response = await post({ ...valid, email: "invalid", consent: "yes", year: "unknown", roles: ["bad"], hoursPerWeek: 41, links: ["javascript:alert(1)"] }, { db: DB });
  assert.equal(response.status, 400);
  const body = await response.json();
  for (const field of ["email", "consent", "year", "roles", "hoursPerWeek", "links"]) assert.ok(body.errors[field]);
  assert.equal(writes.length, 0);
});

test("bounds, duplicate roles and missing specialized role are validated", async () => {
  for (const fields of [
    { roles: ["other"] }, { roles: ["dev-web", "dev-web"] },
    { roles: ["dev-web", "dev-android", "design", "non-tech"] },
    { name: "x".repeat(101) }, { regNo: "x".repeat(201) },
    { why: "too short" }, { why: "x".repeat(1501) },
    { experience: "x".repeat(1501) }, { hoursPerWeek: "5" },
    { hoursPerWeek: 2 }, { links: Array(6).fill("https://example.com") },
  ]) {
    assert.equal((await post({ ...valid, ...fields })).status, 400, JSON.stringify(fields));
  }
});

test("unconfigured and failing storage never acknowledge an application", async () => {
  for (const db of [undefined, database("throw").DB, database("unsuccessful").DB]) {
    const response = await post(valid, { db });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).success, false);
  }
});

test("malformed, oversized, and cross-origin requests are rejected", async () => {
  assert.equal((await post(null, { raw: "{" })).status, 400);
  assert.equal((await post(null)).status, 400);
  assert.equal((await post([])).status, 400);
  assert.equal((await post(valid, { contentType: "text/plain" })).status, 415);
  assert.equal((await post(valid, { origin: "https://elsewhere.example" })).status, 403);
  assert.equal((await post({ ...valid, why: "x".repeat(24001) })).status, 413);
});

test("honeypot submissions are discarded", async () => {
  const { DB, writes } = database();
  assert.equal((await post({ ...valid, website: "spam" }, { db: DB })).status, 200);
  assert.equal(writes.length, 0);
});

test("client reports API, non-JSON and network failures without fake success", async () => {
  const original = globalThis.fetch;
  try {
    for (const mock of [
      async () => Response.json({ success: false }, { status: 503 }),
      async () => new Response("<html>Not found</html>", { status: 404 }),
      async () => { throw new Error("Offline"); },
    ]) {
      globalThis.fetch = mock as typeof fetch;
      assert.equal((await submitApplication(valid)).ok, false);
    }
    globalThis.fetch = (async () => Response.json({ success: true, status: "received" })) as typeof fetch;
    assert.equal((await submitApplication(valid)).ok, true);
  } finally {
    globalThis.fetch = original;
  }
});
