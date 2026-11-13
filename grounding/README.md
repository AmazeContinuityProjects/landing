# Landing site documentation grounding

This directory explains the source repository to future contributors and AI
agents. The Mintlify handbook is in `docs/`; this grounding folder is the
editorial and code-reading context used to keep it accurate.

## Audience

Write for a junior developer who knows HTML but may not know JavaScript,
TypeScript, React, Next.js, browser APIs, HTTP, serverless functions, SQL, or
Cloudflare. Explain the vocabulary first, then follow the value/request through
the relevant files. Use small examples from this repository.

## What this repository is

The project is the Amaze Continuity Projects public landing site. It is a
Next.js 16.3.1 application statically exported to `out/` and hosted on
Cloudflare Pages. A Pages Function under `functions/api/` serves the
recruitment API and binds a Cloudflare D1 database as `DB`.

The source has several distinct surfaces:

- `/`: the marketing homepage and its section components.
- `/join/`: the real recruitment form, backed by the Pages Function and D1.
- `/projects/amazecc/`: a project showcase page; confirm its current source
  before describing interactivity or live service connections.
- `/projects/gorobo/`: a local demonstration cart in this repository; its
  arrays and WhatsApp checkout are not the GoRobo production store API.

## Grounding files

| File | Purpose |
|---|---|
| `agent-playbook.md` | Source-of-truth order, safe inspection, code-reading workflow, and publishing boundaries. |
| `writing-standard.md` | Audience, page structure, terminology, and content QA checklist. |

## Handbook and publishing

`docs/docs.json` defines the child handbook's theme and navigation. Add every
new visible page to its navigation. The parent Mintlify site in the sibling
`docs` repository aggregates this repository into the `/landing` path.

The intended distribution flow is:

1. Author pages under `docs/` in this repository.
2. A push to `main` changing `docs/**` sends `docs-updated` to the parent docs
   repository with `DOCS_DISPATCH_TOKEN`.
3. The parent `Aggregate docs` workflow copies this repo's `docs/` to
   `landing/`, rewrites paths, and merges the child nav through a `sourceRef`.
4. Mintlify deploys the generated parent site.

The parent repository must list `AmazeContinuityProjects/landing` in
`.github/mintlify-multirepo.yml` and `docs.base.json`. A successful dispatch
alone does not prove that the pages were included or deployed; inspect the
aggregate run and load a published page.

## Important boundaries

- Recruitment application data is personal information. Use fictional values
  in examples; never copy a real submission into docs, logs, or screenshots.
- The API validates requests on the server. Client-side validation improves
  usability but is not a security boundary.
- `NEXT_PUBLIC_API_URL` is public configuration and must not contain secrets.
- The D1 database ID is a resource identifier, not an API credential. Never
  document or commit Cloudflare API tokens.
- Database admin access is for authorized maintainers. The public API has no
  application-list endpoint.
- `README.md` includes setup notes. Verify command names, environments, and
  behavior against `package.json`, workflow YAML, `wrangler.json`, migrations,
  and executable source before editing it.
