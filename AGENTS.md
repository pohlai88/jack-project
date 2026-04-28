# Agent Instructions for afenda

## Overview

Production-ready Next.js 16 SaaS starter with AI, Auth.js, Drizzle ORM, PostgreSQL.

## Project Authority

- Current engineering doctrine lives in `architecture/doctrine/`.
- Architecture decisions live in `architecture/adr/`.
- Architecture test cases live in `architecture/atc/`.
- `architecture/docs/` is a deprecated tombstone and must not be treated as authoritative without promotion into doctrine, ADRs, or ATCs.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- PostgreSQL + Drizzle ORM
- Auth.js v5 (next-auth)
- Tailwind CSS v4
- pnpm 10+

## Key Commands

```bash
# Development
pnpm env:sync          # generates .env.local + .env.production from env.config (prod URL overrides in .env.production)
pnpm dev

# Build
pnpm build

# Quality
pnpm lint
pnpm type-check

# Database
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Run migrations
pnpm db:push      # Alias to db:migrate
pnpm db:seed     # Seed demo data
pnpm db:reset    # Reset app data after confirmation

# Tests
pnpm test
pnpm test:coverage

# Repo governance
pnpm repo:guard

# Doctrine
pnpm doctrine:check

# Deploy (after local `pnpm build` succeeds)
pnpm deploy:vercel:production

# Vercel CLI — link, inspect, Production env, deployments
pnpm vercel:link
pnpm vercel:project
pnpm vercel:env:production
pnpm vercel:deployments

# Vercel Production env from env.config (push + gap reports)
pnpm vercel:env:push-production   # sync secrets/vars to Vercel Production (uses scripts/production-env-plan.mjs)
pnpm vercel:env:report            # local .env.production preview vs Vercel key list (no push)

# Remove bare apex from project (optional; reduces duplicate domains / noise). Requires VERCEL_TOKEN.
pnpm vercel:domain:remove-apex
```

## Production host (nexuscanon.com)

- For open production controls, owner type, status, next action, and blockers, start with `architecture/governance/evidence/OPEN_PRODUCTION_CONTROL_MATRIX.md`.
- **Tenant subdomains:** `{slug}.nexuscanon.com` via `TENANT_ROOT_DOMAIN=nexuscanon.com` (`src/proxy.ts`, ADR 0008).
- **Canonical app URL + Auth.js:** `https://www.nexuscanon.com` (`AUTH_URL`, `NEXT_PUBLIC_APP_URL`).
- **Vercel project domains:** prefer **`www`** + **`*.nexuscanon.com`** only; **do not** attach bare apex **`nexuscanon.com`** to the project unless you explicitly need it — otherwise remove with **`pnpm vercel:domain:remove-apex`** (see `architecture/governance/evidence/tenants/TENANT_SUBDOMAIN_VERCEL_DNS.md`).
- **Env template:** `env.config.example` → section “Production — nexuscanon.com”; operator DNS/Vercel notes: `architecture/governance/evidence/tenants/TENANT_SUBDOMAIN_VERCEL_DNS.md`.
- **Auth0 / OAuth (Auth.js):** configure **`AUTH0_*`** (or other providers) in `env.config`, then **`pnpm env:sync`** and **`pnpm vercel:env:push-production`** when ready — deferred until IdP URLs align with **`AUTH_URL`**.
- **Rollout checklist (evidence, not doctrine):** `architecture/governance/evidence/NEXUSCANON_RELEASE_ROLLOUT.md` — pre/post-deploy verification; links ADR 0008 and tenant DNS evidence without duplicating matrices.

## Internationalization (i18n)

- **Single source of truth:** `src/i18n/locale-registry.ts` (`activeLocales`, `inactiveLocales`, `localeAliases`). `src/i18n/config.ts` mirrors `locales` from the registry; do not maintain parallel locale lists in features.
- **Git-native catalogs:** English in `src/i18n/catalogs/source/en.json`; non-English in `src/i18n/catalogs/fallback/*.json` (optional machine output in `catalogs/generated`). Run `pnpm i18n:compile` / `pnpm i18n:validate` after catalog changes. See `src/i18n/README.md` and ADR-0005.
- **Runtime locale authority (I18N-RUNTIME-001):** For `src/app/[locale]/`, the URL `[locale]` segment is the sole runtime authority; `next-intl` carries it through `request.ts` and the root locale layout. Cookies, tenant defaults, headers, and profile may influence **redirects / entrypoints** only, not silent override of an already localized route. See `architecture/doctrine/0009-i18n-runtime-locale-authority.md` and ADR-0009.
- **Operator reference:** catalog layers, compile order, CI commands, and **how Node scripts parse `locale-registry.ts` / `config.ts`** (including `parseExportLiteral` + `vm` for `as const` literals) live in `src/i18n/README.md`.
- **Protected fallbacks & drift:** to normalize `en.json` + all fallback key order, refresh manifest hashes, compile `messages/`, and validate, run `pnpm i18n:sync`. If you only update hashes, `pnpm i18n:fallback-check --write-manifest` then `pnpm i18n:validate` still works.
- **Readiness snapshot hash:** after material readiness changes, run `pnpm i18n:readiness:report` and sync `source_artifact_hash` in `architecture/governance/evidence/i18n/I18N_LOCALE_ACTIVATION_SNAPSHOT.md` with the printed Markdown SHA-256.
- **Tolgee CI (optional TMS):** repository secret **`TOLGEE_API_KEY`** → workflow **`tolgee-i18n`** runs **`pnpm i18n:tolgee:ci`**; locally same command with env set. Until the secret exists, CI skips — intentional. Engineering track is complete; remaining steps are **operating model closure** (see same evidence note).

## Repo Hygiene Guardrails

- `env.config` is the maintained local environment source; **`pnpm env:sync`** generates **`.env.local`** (dev) and **`.env.production`** (production merge + full Vercel key catalog with commented gaps). Both are gitignored.
- Generated outputs that can be configured must go under `.artifacts/`; keep framework/runtime defaults like `.next/` and `node_modules/` on their standard paths.
- Reports are local/CI artifacts and must not be committed.
- Co-located tests stay beside source under `src/**/__tests__`.
- Root `tests/` is only for shared test support, types, and truly shared fixtures.
- Production source must not import `@tests/*`.
- Legacy source test-helper imports are forbidden; use `@tests/support/*`.
- Feature consumers must import only `@/features/<feature>`.
- Deep feature imports like `@/features/<feature>/*` are forbidden.
- Files inside a feature must use relative imports for same-feature internals and must not import their own root barrel.
- Shared remains subpath-based under `@/shared/*`.

## Code Style

- ESLint flat config
- Prettier for formatting
- Conventional commits

## Codex Caveman

- Caveman is available in this environment as a Codex response-style overlay plus helper skills.
- Use `/caveman lite` for terse but normal sentence structure.
- Use `/caveman` for full terse mode.
- Use `/caveman ultra` for maximum compression.
- Use `stop caveman` or `normal mode` to disable it.
- Use `/caveman-help` to show the installed caveman quick reference.
- Use `/caveman-commit` to generate terse Conventional Commit messages.
- Use `/caveman-review` to generate one-line review comments with location, problem, and fix.
- Use `/caveman:compress <file>` only for prose-heavy `.md` or `.txt` files when token reduction matters.
- `caveman-compress` overwrites the target file and saves a backup as `<file>.original.md`.
- `caveman-commit` and `caveman-review` generate text only; they do not run git, edit code, or change review state.
