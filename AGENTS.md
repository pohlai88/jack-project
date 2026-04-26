# Agent Instructions for afenda

## Overview

Production-ready Next.js 16 SaaS starter with AI, Auth.js, Drizzle ORM, PostgreSQL.

## Project Authority

- Current engineering doctrine lives in `architecture/doctrine/`.
- Architecture decisions live in `architecture/adr/`.
- Architecture test cases live in `architecture/atc/`.
- `architecture/docs/` is deprecated reference material and must not be treated as authoritative without promotion into doctrine, ADRs, or ATCs.

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

# Database
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Run migrations
pnpm db:push     # Push schema
pnpm db:seed     # Seed demo data

# Tests
pnpm test
pnpm test:coverage

# Repo governance
pnpm repo:guard

# Doctrine
pnpm doctrine:check
```

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
