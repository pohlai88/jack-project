# Nexuscanon Release Rollout Evidence

Rollout checklist and execution ledger. **Not** architecture doctrine — see linked ADR and evidence below.

## Authority (do not duplicate here)

- Cookie domain and tenant subdomains: [architecture/adr/0008-cookie-domain-tenant-subdomains.md](../../adr/0008-cookie-domain-tenant-subdomains.md)
- DNS, Vercel domains, env variable roles: [tenants/TENANT_SUBDOMAIN_VERCEL_DNS.md](tenants/TENANT_SUBDOMAIN_VERCEL_DNS.md)
- Copy-ready production env keys: [env.config.example](../../../env.config.example) (section “Production — nexuscanon.com”)

## Open Control Matrix

For current open production controls, owner type, status, next action, and blockers, see:

- [OPEN_PRODUCTION_CONTROL_MATRIX.md](OPEN_PRODUCTION_CONTROL_MATRIX.md)

This file does **not** restate cookie-domain matrices or full env tables.

## Runtime change policy

This rollout slice (manifest coverage + this evidence doc) does **not** change `src/proxy.ts`, tenant host resolution behavior, cookie-domain doctrine, OAuth callback policy, or local development domain behavior in code. It closes **docs manifest** coverage for discovered App Router surfaces and records **operator** rollout steps.

Operator work (Vercel env, DNS, IdP, secret rotation, deploy) is **not** performed inside the repository by this slice.

## Vercel CLI (optimize before deploy)

From repo root, scope **`jacks-projects-7b3cfe94`**, project **`afenda-node`** (see [package.json](../../../package.json) scripts):

| Script                            | Purpose                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------ |
| `pnpm vercel:link`                | Link working copy to the project (creates local `.vercel/`; gitignored).             |
| `pnpm vercel:project`             | Show project settings (framework, Node version on platform).                         |
| `pnpm vercel:env:production`      | List **Production** env var **names** (values not printed).                          |
| `pnpm vercel:env:push-production` | Push `env.config` (+ prod URL overrides) to Vercel Production.                       |
| `pnpm vercel:env:report`          | Compare local merged preview vs Vercel Production keys (no push).                    |
| `pnpm vercel:domain:remove-apex`  | Remove bare apex `nexuscanon.com` from the Vercel project (`VERCEL_TOKEN` required). |
| `pnpm vercel:deployments`         | Recent deployments and URLs.                                                         |

**Operator:** Populate Production env from `env.config` before deploy (`pnpm vercel:env:push-production`). Prefer **www + wildcard** project domains only; remove stray apex binding with `pnpm vercel:domain:remove-apex` per [TENANT_SUBDOMAIN_VERCEL_DNS.md](tenants/TENANT_SUBDOMAIN_VERCEL_DNS.md).

Optional debugging: `pnpm exec vercel inspect <deployment-hostname> --logs --scope jacks-projects-7b3cfe94`.

Repo optimizations for uploads: [`.vercelignore`](../../../.vercelignore); install/build parity: [`vercel.json`](../../../vercel.json).

## Stream A — Operator (production)

Stream A is operator-owned production execution. In-repo scripts support environment/domain hygiene, but they do not replace DNS, IdP, secret rotation, deploy, or post-deploy operator verification.

**Status:** Pending — execute on Vercel / DNS / IdP; not automated from this repo.

1. Set Vercel **Production** environment variables from [env.config.example](../../../env.config.example) (www + `nexuscanon.com` tenant root + public mirrors + secrets).
2. DNS: `www` and `*.nexuscanon.com` to Vercel per [TENANT_SUBDOMAIN_VERCEL_DNS.md](tenants/TENANT_SUBDOMAIN_VERCEL_DNS.md). Do **not** add bare apex `nexuscanon.com` as a project domain unless required; remove with `pnpm vercel:domain:remove-apex` if present.
3. Identity provider: callback / logout / web origins for `https://www.nexuscanon.com` only (match `AUTH_URL`).
4. Rotate credentials after cutover (database, `AUTH_SECRET`, tokens) per your security process.
5. Deploy when pre-deploy verification passes: `pnpm deploy:vercel:production` (see [AGENTS.md](../../../AGENTS.md)).

## Stream B — Repository (docs evidence pipeline)

**Debt:** Every discovered app surface must appear in some feature `docs.manifest.ts` `routes` array (see `validateModel` in `scripts/docs-evidence-pipeline.ts`).

**Surfaces and manifest ownership (this slice):**

| Route                          | Manifest owner                            | Notes                                                                                                  |
| ------------------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `/`                            | `src/features/dashboard/docs.manifest.ts` | Root redirect into default locale ([`src/app/page.tsx`](../../../src/app/page.tsx)).                   |
| `/login`                       | `src/features/auth/docs.manifest.ts`      | Non-locale entry ([`src/app/login/page.tsx`](../../../src/app/login/page.tsx)).                        |
| `/select-tenant`               | `src/features/auth/docs.manifest.ts`      | Non-locale entry ([`src/app/select-tenant/page.tsx`](../../../src/app/select-tenant/page.tsx)).        |
| `/api/internal/tenant-by-host` | `src/features/admin/docs.manifest.ts`     | Internal GET; Bearer `MIDDLEWARE_TENANT_LOOKUP_SECRET`; stable API id `admin.internal.tenant-by-host`. |

**Stream B status (repository):** Implemented. Generated docs include evidence for the new surfaces (e.g. `/en/docs/generated/api/admin.internal.tenant-by-host`). Supporting fixes so `pnpm docs:ci` passes: extensionless dynamic `import('./docs-validate-links')` in `scripts/docs-evidence-pipeline.ts` (TS5097); filter undefined `path` before `validateFiles` in `scripts/docs-validate-links.ts`; Tolgee core tests import `@scripts-lib/tolgee-normalize-core` with matching `tsconfig` paths + `vitest` alias + `scripts/tolgee-normalize-core.d.ts` (TS7016).

## Pre-deploy verification (merge gate)

- `pnpm docs:generate`
- `pnpm docs:ci` (if used as CI gate)
- `pnpm type-check`
- `pnpm test`
- `pnpm build`
- Review generated `docs/content/en/generated/**` diff for intent
- Confirm `src/proxy.ts` unchanged for this slice

## Post-deploy verification (operator)

- `https://www.nexuscanon.com` loads
- OAuth login redirects back to `https://www.nexuscanon.com`
- Logout returns to approved production URL
- `https://{tenant}.nexuscanon.com` resolves (wildcard DNS → Vercel)
- Tenant host rewrite resolves expected tenant context
- Cookie behavior matches ADR 0008

## Non-goals

- No new ADR
- No duplicate ADR 0008 or full DNS/cookie matrices in this file
- No second env source of truth (production values on Vercel; local `env.config` stays dev-oriented per [env.config.example](../../../env.config.example))
- No Vercel/DNS/OAuth execution from CI for this evidence slice alone
