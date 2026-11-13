# Agent playbook

## Source-of-truth order

When two descriptions differ, use this order:

1. Runtime source: `src/`, `functions/`, `migrations/`, and `public/`.
2. Build and deployment configuration: `package.json`, `next.config.ts`,
   `wrangler.json`, `.github/workflows/`, `scripts/`, and `tsconfig.json`.
3. Tests in `tests/`, which document expected cases but cannot prove every
   runtime behavior.
4. `README.md`, then the Mintlify handbook, then this grounding.

Check current source before documenting an endpoint, database field, browser
interaction, accessible behavior, deployment command, or security property.

## Reading a UI change

For a route or section, trace its imports, props, local state, effects, event
handlers, derived values, and JSX in that order. For styles, inspect both the
component's Tailwind classes and `src/app/globals.css`. Search for the component
use sites so you understand its surrounding layout and event ownership.

The Next.js version is pinned in `package.json`. Before changing application
code, obey the generated Next.js instruction at the top of `AGENTS.md` and
read the matching installed guide under `node_modules/next/dist/docs/`.

## Reading recruitment behavior

Trace a submission across this chain:

`JoinForm` → `submitApplication` → same-origin `/api/recruitment` Pages
Function → request validation → prepared D1 statement → `applications` row →
JSON result → success or retry state in the form.

The GET route publishes `DEFAULT_CONFIG`, not applicant records. POST checks
origin/content type/body size and validates values on the server before writing
to D1. A success message must only follow a successful D1 result. Never add a
public read endpoint for applications without an explicit product/security
design.

The test file uses a mock D1 binding and tests rejection, persistence, retries,
and client failures. Preserve the tests' personally identifying data as
fictional test fixtures only.

## Documentation rules

- Keep API inputs, limits, statuses, route names, and database columns in sync
  with source.
- Separate server guarantees from UI hints and visual text.
- Describe `/projects/gorobo/` as the in-repository static sample unless the
  implementation is replaced with a live integration.
- If a fact isn't verifiable, mark it as an open question instead of guessing.
- Keep the root README intact when writing the Mintlify handbook; do not treat
  documentation setup as permission to change the website or database.
- Before PR, validate the Mintlify build and links, inspect the workflow diff,
  then verify the aggregate and published site after merge.
