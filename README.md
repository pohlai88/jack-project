# Afenda

> AI-native skills management platform built on Next.js, Auth.js, Drizzle ORM, and PostgreSQL

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

</div>

Afenda is a multi-tenant SaaS application for managing people, skills, integrations, permissions, audit trails, and AI-assisted workflows.

---

## 🚀 Getting Started

Start the local development environment with the checked-in environment source.

**Prerequisites:** [Docker](https://www.docker.com/) + IDE with Dev Containers support (VS Code, Cursor)

```bash
pnpm env:sync
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Local setup note:** Create `env.config` from `env.config.example`, then run `pnpm env:sync`. `env.config` is the file you maintain; **`.env.local`** (dev) and **`.env.production`** (production-shaped merge + Vercel key checklist) are generated — both gitignored.

### Production (nexuscanon.com)

Tenant workspaces use `{slug}.nexuscanon.com`; canonical app and Auth.js origin is `https://www.nexuscanon.com`. Sync vars with **`pnpm vercel:env:push-production`** from `env.config`, use **`pnpm vercel:env:report`** to compare local vs Vercel, and align DNS per **`architecture/governance/evidence/tenants/TENANT_SUBDOMAIN_VERCEL_DNS.md`** (see **`AGENTS.md`** for scripts).

---

## ✨ Features

- 🏢 **Multi-tenant architecture** — tenant-scoped routes (`/t/[tenant]`), full tenant isolation in DB
- 🔐 **Auth.js v5 + Auth0** — SSO, database sessions, development credentials provider
- 🗄️ **PostgreSQL 17 + pgvector + Drizzle ORM** — type-safe queries, vector similarity search
- 🤖 **AI assistant** — OpenAI/Anthropic via Vercel AI SDK, RAG with embeddings
- 🔑 **Permission-Based Access Control (PBAC)** — roles are bundles of permissions, multi-role support
- 🔗 **Integration architecture** — GitHub OAuth2 example, extensible via `integration_sync_control`
- 🛡️ **Admin panel** — member management, roles, settings, webhooks, bulk import
- 📣 **Outbound webhooks** — configurable with delivery tracking
- 📋 **Audit logging** — all sensitive operations are tracked
- 📁 **File uploads** — AWS S3 in production, MinIO for local dev
- 📦 **`env.config` source + generated `.env.local`** — single-source local environment setup
- 🌍 **i18n** — next-intl runtime with Git-managed source/fallback catalogs
- 📚 **Storybook** — component development and visual testing
- ⚡ **GitHub Actions CI** — build, lint, type-check, tests, mega-linter
- 🧩 **Feature template** — `_feature-template_` scaffold for adding new features

---

## 🛠️ Tech Stack

| Category     | Technology                                                              |
| ------------ | ----------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, RSC, Turbopack)                                 |
| Language     | TypeScript 5+ (strict)                                                  |
| Styling      | Tailwind CSS v4 + shadcn/ui                                             |
| Database     | PostgreSQL 17 + pgvector + Drizzle ORM                                  |
| Auth         | Auth.js v5 + Auth0 (SSO) + database sessions                            |
| AI           | OpenAI / Anthropic via Vercel AI SDK + RAG/embeddings                   |
| File Storage | AWS S3 (production) / MinIO (local dev)                                 |
| i18n         | next-intl + Git-managed source / optional generated / fallback catalogs |
| Testing      | Vitest + React Testing Library                                          |
| Linting      | ESLint 9 (flat config) + Prettier + Mega Linter                         |
| CI/CD        | GitHub Actions                                                          |
| Dev Env      | DevContainer or `env.config` + generated `.env.local`                   |

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, tenant selection)
│   ├── (tenant)/t/[tenant]/ # Tenant-scoped routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── features/              # Feature modules
│   ├── admin/             # Admin panel
│   ├── assistant/         # AI assistant
│   ├── auth/              # Authentication
│   └── _feature-template_/ # Template for new features
├── shared/                # Shared infrastructure
│   ├── components/ui/     # shadcn/ui components
│   ├── db/                # Database (Drizzle + pgvector)
│   └── lib/               # Utilities (auth, permissions, env)
└── i18n/                  # next-intl + catalogs; active locales in locale-registry.ts (see src/i18n/README.md)
```

Feature boundaries are strict:

- import features only as `@/features/<feature>`
- keep same-feature internals relative
- keep shared imports under stable `@/shared/*` subpaths

---

## 📜 Scripts

| Command                      | Description                                                         |
| ---------------------------- | ------------------------------------------------------------------- |
| `pnpm env:sync`              | Generate `.env.local` from `env.config`                             |
| `pnpm dev`                   | Start Next.js dev server on port 3000                               |
| `pnpm build`                 | Build for production                                                |
| `pnpm start`                 | Start the production server                                         |
| `pnpm format`                | Format files with Prettier                                          |
| `pnpm lint`                  | Run ESLint                                                          |
| `pnpm lint:fix`              | Run ESLint with auto-fix                                            |
| `pnpm lint:a11y`             | Run strict lint/a11y pass with warnings treated as errors           |
| `pnpm repo:guard`            | Validate repo hygiene and module-boundary rules                     |
| `pnpm type-check`            | Run TypeScript check                                                |
| `pnpm doctrine:check`        | Validate doctrine/documentation authority rules                     |
| `pnpm i18n:extract`          | Validate the English source catalog                                 |
| `pnpm i18n:compile`          | Compile runtime `src/i18n/messages/*.json` output                   |
| `pnpm i18n:validate`         | Validate source, optional generated, fallback, and runtime catalogs |
| `pnpm i18n:coverage`         | Report optional generated vs fallback locale coverage               |
| `pnpm i18n:fallback-check`   | Validate protected fallback catalogs and locale fallbacks           |
| `pnpm i18n:check`            | Backward-compatible alias for `i18n:validate`                       |
| `pnpm i18n:inventory:check`  | Backward-compatible catalog inventory validation                    |
| `pnpm i18n:readiness:report` | Generate warn-only locale readiness and coverage report             |
| `pnpm test`                  | Run Vitest once                                                     |
| `pnpm test:watch`            | Run Vitest in watch mode                                            |
| `pnpm test:coverage`         | Run Vitest with coverage                                            |
| `pnpm test:unit:stable`      | Run Vitest in stable single-worker fork mode                        |
| `pnpm test:workspace`        | Fast local confidence gate                                          |
| `pnpm test:quality`          | Deterministic full local quality gate                               |
| `pnpm test:release`          | Quality gate plus production Lighthouse gate                        |
| `pnpm test:e2e:auth`         | Run deterministic end-to-end auth lifecycle coverage                |
| `pnpm test:e2e:smoke`        | Run Playwright smoke coverage; reuses local port 3000 when running  |
| `pnpm test:e2e:oauth-live`   | Run opt-in live OAuth browser smoke with provider test credentials  |
| `pnpm test:lighthouse`       | Run production-build Lighthouse gate                                |
| `pnpm db:generate`           | Generate Drizzle migrations from schema changes                     |
| `pnpm db:migrate`            | Run pending Drizzle migrations                                      |
| `pnpm db:push`               | Alias to `db:migrate`; direct push is intentionally gated           |
| `pnpm db:push:unsafe`        | Force Drizzle push; local/dev use only                              |
| `pnpm db:studio`             | Open Drizzle Studio                                                 |
| `pnpm db:seed`               | Seed demo data                                                      |
| `pnpm db:reset`              | Reset app data after confirmation                                   |
| `pnpm db:fresh`              | Reset and seed demo data                                            |
| `pnpm embeddings:generate`   | Generate AI embeddings                                              |
| `pnpm embeddings:recreate`   | Recreate AI embeddings                                              |
| `pnpm storybook`             | Start Storybook on port 6006                                        |
| `pnpm build-storybook`       | Build static Storybook                                              |

Test bundle tiers:

- `test:workspace` = fast local confidence
- `test:quality` = deterministic full local quality gate
- `test:release` = quality + production Lighthouse gate

Use `test:quality` before PR/release candidate validation. Use `test:release` only when Lighthouse evidence is required.

---

## 📖 Documentation

Engineering authority now lives in the architecture doctrine system:

- **Doctrine:** [architecture/doctrine/README.md](./architecture/doctrine/README.md)
- **Architecture decisions:** [architecture/adr/README.md](./architecture/adr/README.md)
- **Architecture test cases:** [architecture/atc/README.md](./architecture/atc/README.md)
- **Deprecated docs tombstone:** [architecture/docs/README.md](./architecture/docs/README.md)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)
- **i18n operating model:** [src/i18n/README.md](./src/i18n/README.md)

Brand implementation references:

- **Afenda brand guideline docs:** `/docs/curated/brand-guidelines`
- **Public icon assets:** [public/brand/afenda](./public/brand/afenda)
- **Frontend logo API:** `AppLogo placement="nav" | "sidebar" | "footer" | "auth" | "tenant-login" | "favicon" | "error"`
- **Doctrine:** [architecture/doctrine/0010-afenda-icon-placement.md](./architecture/doctrine/0010-afenda-icon-placement.md)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---
