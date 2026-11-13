<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Amaze Continuity Projects landing site agent notes

Before changing the landing handbook, read `grounding/README.md`,
`grounding/agent-playbook.md`, and `grounding/writing-standard.md`. Confirm site
behavior in the current source; don't assume a portfolio mockup is connected to
a production service.

This repository uses Next.js 16.3.1, React 19, static export, Cloudflare Pages
Functions, and D1. Before changing application code, follow the Next.js rule
above and consult the matching guide in `node_modules/next/dist/docs/`.
