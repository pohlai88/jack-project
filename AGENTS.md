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
pnpm env:sync
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
```

## Internationalization (i18n)

- **Single source of truth:** `src/i18n/locale-registry.ts` (`activeLocales`, `inactiveLocales`, `localeAliases`). `src/i18n/config.ts` mirrors `locales` from the registry; do not maintain parallel locale lists in features.
- **Operator reference:** catalog layers, compile order, CI commands, and **how Node scripts parse `locale-registry.ts` / `config.ts`** (including `parseExportLiteral` + `vm` for `as const` literals) live in `src/i18n/README.md`.
- **Protected fallbacks & drift:** to normalize `en.json` + all fallback key order, refresh manifest hashes, compile `messages/`, and validate, run `pnpm i18n:sync`. If you only update hashes, `pnpm i18n:fallback-check --write-manifest` then `pnpm i18n:validate` still works.
- **Readiness snapshot hash:** after material readiness changes, run `pnpm i18n:readiness:report` and sync `source_artifact_hash` in `architecture/governance/evidence/i18n/I18N_LOCALE_ACTIVATION_SNAPSHOT.md` with the printed Markdown SHA-256.

## Repo Hygiene Guardrails

- `env.config` is the maintained local environment source; `.env.local` is generated from it.
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
