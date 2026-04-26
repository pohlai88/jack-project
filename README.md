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

> **Local setup note:** Create `env.config` from `env.config.example`, then run `pnpm env:sync`. `env.config` is the file you maintain; `.env.local` is generated from it for Next.js.

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
- 🌍 **i18n** — next-intl with English and Spanish out of the box
- 📚 **Storybook** — component development and visual testing
- ⚡ **GitHub Actions CI** — build, lint, type-check, tests, mega-linter
- 🧩 **Feature template** — `_feature-template_` scaffold for adding new features

---

## 🛠️ Tech Stack

| Category     | Technology                                            |
| ------------ | ----------------------------------------------------- |
| Framework    | Next.js 15 (App Router, RSC, Turbopack)               |
| Language     | TypeScript 5+ (strict)                                |
| Styling      | Tailwind CSS v4 + shadcn/ui                           |
| Database     | PostgreSQL 17 + pgvector + Drizzle ORM                |
| Auth         | Auth.js v5 + Auth0 (SSO) + database sessions          |
| AI           | OpenAI / Anthropic via Vercel AI SDK + RAG/embeddings |
| File Storage | AWS S3 (production) / MinIO (local dev)               |
| i18n         | next-intl (EN + ES)                                   |
| Testing      | Jest + React Testing Library                          |
| Linting      | ESLint 9 (flat config) + Prettier + Mega Linter       |
| CI/CD        | GitHub Actions                                        |
| Dev Env      | DevContainer or `env.config` + generated `.env.local` |

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
└── i18n/                  # Translations (EN, ES)
```

Feature boundaries are strict:

- import features only as `@/features/<feature>`
- keep same-feature internals relative
- keep shared imports under stable `@/shared/*` subpaths

---

## 📜 Scripts

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `pnpm dev`        | Start development server      |
| `pnpm build`      | Build for production          |
| `pnpm lint`       | Run ESLint                    |
| `pnpm type-check` | Run TypeScript check          |
| `pnpm test`       | Run tests                     |
| `pnpm storybook`  | Start Storybook (port 6006)   |
| `pnpm db:push`    | Push schema to database (dev) |
| `pnpm db:migrate` | Run pending migrations        |
| `pnpm db:studio`  | Open Drizzle Studio           |

---

## 📖 Documentation

Engineering authority now lives in the architecture doctrine system:

- **Doctrine:** [architecture/doctrine/README.md](./architecture/doctrine/README.md)
- **Architecture decisions:** [architecture/adr/README.md](./architecture/adr/README.md)
- **Architecture test cases:** [architecture/atc/README.md](./architecture/atc/README.md)
- **Deprecated template docs:** [architecture/docs/README.md](./architecture/docs/README.md)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---

_Part of the [Create-Node-App](https://github.com/Create-Node-App) ecosystem — spin up production-ready applications with best practices baked in._
