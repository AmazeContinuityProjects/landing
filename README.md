# Amaze Continuity Projects

Next.js static site with a Cloudflare Pages Function for recruitment and Cloudflare D1 for application storage. Applicants may use any valid email address. College, organization, and registration details are optional; graduate and independent-builder backgrounds are supported.

## Cloudflare setup

Production: [acp.amazecc.com](https://acp.amazecc.com), with recruitment at [acp.amazecc.com/join/](https://acp.amazecc.com/join/). The Cloudflare fallback URL is [acp-landing-29v.pages.dev](https://acp-landing-29v.pages.dev). The Pages project and production D1 database are provisioned, the schema is applied, and the real database ID is saved in `wrangler.json`. The steps below also describe how to reproduce the setup.

Target account: `5abd6d7c8175ba56c3058e34db158aa8` (Sugeethjayaraj2007@outlook.com).
Pages project: `acp-landing`. D1 database: `acp-recruitment`, bound as `DB`.

Custom domain: `acp.amazecc.com` is attached to the Pages project. Its DNS must have a CNAME named `acp` targeting `acp-landing-29v.pages.dev` (Proxied, TTL Auto). The recruitment page and its API have been verified over HTTPS at `https://acp.amazecc.com/join/`.
If using an existing project with another name, update `wrangler.json`, the deployment script, and the workflow first.

1. Install packages with `npm ci` and sign in using `npx wrangler login`.
2. Check for an existing database using `npx wrangler d1 list`. If absent, create it with `npx wrangler d1 create acp-recruitment`.
3. Replace the all-zero `database_id` in `wrangler.json` with the returned database UUID. Alternatively, set `CLOUDFLARE_D1_DATABASE_ID` and run `node scripts/configure-cloudflare.mjs`.
4. Check `npx wrangler pages project list`. If absent, create the project with `npx wrangler pages project create acp-landing --production-branch main`.
5. Run `npm run deploy`. It validates the database ID, tests and builds the site, applies remote D1 migrations, and deploys both `out/` and `functions/` to the production branch.

Use Wrangler for uploads; a dashboard drag-and-drop of `out/` alone does not deploy the Function. No Supabase, external API, or Next.js server is required for this site's recruitment flow. `NEXT_PUBLIC_API_URL` should be unset for this setup. If deliberately hosting the static site elsewhere, configure a Cloudflare API endpoint and an explicit CORS allowlist before setting that override.

## Automatic deployments

The workflow in `.github/workflows/deploy-cloudflare.yml` deploys pushes to `main`, or can be run manually. Configure these in the GitHub repository settings:

- Secret `CLOUDFLARE_API_TOKEN`: an account-scoped token with Cloudflare Pages Edit and D1 Edit permissions for the target account.
- Variable `CLOUDFLARE_D1_DATABASE_ID`: the production D1 UUID (optional if the real ID is committed in `wrangler.json`).

Create the Pages project and D1 database once before the workflow runs. GitHub Actions performs the build; all site hosting, API execution, and database storage stay in Cloudflare. Use this workflow as the deployment mechanism rather than enabling a second automatic deployment in the Pages dashboard.

## Local development

```bash
npm ci
npm run db:migrate:local
npm run preview
```

Open the local URL printed by Wrangler. This serves the exported site and the real Pages Function against a local D1 database in `.wrangler/`. The placeholder database UUID is sufficient for local use. `npm run dev` is a faster UI-only Next.js preview; it does not run the Pages Function. `npm start` is not used with static exports.

```bash
npm test
npm run typecheck
npm run build
```

## Application storage

The migration in `migrations/0001_applications.sql` creates the applications table. The API validates submissions and uses a parameterized D1 write. Email plus recruitment cycle is unique; submitting again updates that cycle's application. Registration details may be omitted and are stored as nullable text without VIT-specific validation.

Only a successful database write returns an application confirmation. API failures keep the form visible with its current answers for retry; they never produce a local-only success. The public GET endpoint exposes recruitment configuration only, not applications. Review submissions in the Cloudflare D1 console with account access. Preview deployments should use a separate D1 binding before use with real applicant data.

Cloudflare references: [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/), [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/), and [CI deployment](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).
