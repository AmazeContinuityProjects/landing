# Product brief: Amaze Continuity Projects landing site

## Product

This repository contains the public website for Amaze Continuity Projects, a
student engineering collective. The homepage describes the team and its
projects. The recruitment route accepts applications and saves them through a
Cloudflare Pages Function to D1. Two project routes provide additional
showcase pages.

## Readers

- Prospective contributors considering the recruitment form.
- Students and visitors learning about AmazeCC and GoRobo.
- Developers maintaining the site, its recruitment form, or deployment.

The internal handbook's main reader is a junior developer who knows HTML but
is new to TypeScript, React, Next.js, HTTP, Cloudflare Functions, and SQL.

## Architecture as checked in

- Next.js 16.3.1 with React 19 and TypeScript.
- Static export writes the website to `out/`.
- Cloudflare Pages serves static files and `functions/api/recruitment.ts` for
  `/api/recruitment`.
- A D1 binding named `DB` stores applications in the `applications` table.
- GitHub Actions deploys pushes to `main` using Wrangler and runs tests,
  typechecking, the static build, and the remote D1 migration.

## Content boundaries

- The recruitment form and API are real and must be documented precisely.
- The project showcase pages must be checked in source before calling them
  live integrations. `/projects/gorobo/` currently has local sample catalog,
  order, and identity data.
- Do not claim there is a public application-list endpoint. The current
  Function exposes a configuration GET and a write-only application POST.
- Treat applicant information as sensitive. Use fictional examples and never
  add an applicant browser or public export to the handbook.
- Do not copy Cloudflare tokens, applicant records, or private account details
  into examples.

## Documentation experience

Organize the handbook around learning the site, understanding its marketing
sections, understanding recruitment from form to database, and maintaining
Cloudflare deployment. Prefer source-path code tours and plain-language
explanations over claims unsupported by code. Keep the site handbook under the
`landing/` prefix when aggregated into the parent docs site.
