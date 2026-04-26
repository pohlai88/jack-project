# Contributing to Afenda

Thank you for contributing! This document guides human developers after reading the README.

**Source of truth:** Current engineering authority lives in **`architecture/doctrine/`**, **`architecture/adr/`**, and **`architecture/atc/`**. `architecture/docs/` is deprecated reference material.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Bootstrap](#bootstrap)
- [Architecture & Routing](#architecture--routing)
- [Feature Modules](#feature-modules)
- [Server vs Client Components](#server-vs-client-components)
- [Coding Standards](#coding-standards)
- [Trunk Based Development](#trunk-based-development)
- [Dependencies](#dependencies)
- [Testing](#testing)
- [Documentation](#documentation)
- [PR Checklist](#pr-checklist)

## Prerequisites

- [Docker](https://www.docker.com/)
- IDE with DevContainer support (VS Code, Cursor) **OR** [DevContainer CLI](https://github.com/devcontainers/cli)

## Bootstrap

Use the DevContainer when you want a fully isolated local stack. For normal host development, keep `env.config` current and run commands through the package scripts so they load the managed environment.

### Using VS Code / Cursor

1. Open the project in your IDE
2. Click "Reopen in Container" when prompted
3. Wait for setup (~2 min first time)
4. Run `pnpm env:sync`
5. Run `pnpm dev`

### Using DevContainer CLI

```sh
# Install CLI (once)
npm install -g @devcontainers/cli

# Start container
devcontainer up --workspace-folder .

# Run commands
devcontainer exec --workspace-folder . pnpm dev
```

### Environment Configuration

The project uses a single maintained local source:

| File                 | Purpose                              | Git          |
| -------------------- | ------------------------------------ | ------------ |
| `env.config.example` | Local template and variable contract | ✅ Committed |
| `env.config`         | Your maintained local env source     | ❌ Ignored   |
| `.env.local`         | Generated Next.js runtime adapter    | ❌ Ignored   |

Copy `env.config.example` to `env.config`, update values as needed, then run `pnpm env:sync`. The minimum scaffold variables are `DATABASE_URL` and `AUTH_SECRET`. Do not maintain `.env.local` manually; it is derived from `env.config`.

## Architecture & Routing

Consult [architecture/doctrine/0002-feature-public-api-boundaries.md](./architecture/doctrine/0002-feature-public-api-boundaries.md). App Router layout lives under `src/app/`. Feature consumers import only from `@/features/<domain>`; same-feature internals stay relative.

## Feature Modules

Encapsulate UI, hooks, services, and types. Export only the externally consumed public surface through the feature root `index.ts`. Do not import another feature's internals or your own feature barrel from inside the feature.

## Server vs Client Components

- Prefer Server Components for data-fetch & static composition
- Add `"use client"` only when needed (state, effects, event handlers)

## Coding Standards

- Strict TypeScript
- Accessibility by default
- No large un-memoized lists; use streaming / pagination
- Avoid leaking server-only code to client bundles

## Trunk Based Development

This project follows **Trunk Based Development** - a source-control branching model where developers collaborate on code in a single branch called `main` (the "trunk").

### Branch Strategy

| Branch Type         | Naming Pattern        | Purpose               | Lifetime  |
| ------------------- | --------------------- | --------------------- | --------- |
| Main (trunk)        | `main`                | Production-ready code | Permanent |
| Short-lived feature | `feat/<description>`  | New features          | < 2 days  |
| Short-lived fix     | `fix/<description>`   | Bug fixes             | < 1 day   |
| Short-lived chore   | `chore/<description>` | Maintenance tasks     | < 1 day   |

### Key Principles

1. **Small, frequent commits**: Push to `main` at least once a day
2. **Short-lived branches**: Feature branches should live less than 2 days
3. **Feature flags**: Use feature flags for incomplete features in production
4. **No long-running branches**: Avoid branches that diverge significantly from `main`
5. **CI/CD gating**: All PRs must pass CI before merging

### Workflow

1. Pull latest `main`
2. Create a short-lived branch: `git checkout -b feat/my-feature`
3. Make small, incremental changes
4. Push and create PR as soon as possible
5. Get review and merge quickly
6. Delete branch after merge

### Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```sh
feat(auth): add login form validation
fix(api): handle null response from user endpoint
docs(readme): update installation instructions
```

### Release Strategy

- `main` is always deployable
- Use semantic versioning tags for releases
- Automate releases via CI/CD when tags are pushed

## Dependencies

Justify additions > 0 new runtime deps in PR. Prefer built-in Next.js / React features.

## Testing

Add tests for business logic (services, hooks). Snapshot or interaction tests for critical UI.

```sh
pnpm test          # Run all tests once
pnpm test:watch    # Watch mode
pnpm test:coverage # Coverage report
```

## Documentation

- **`architecture/doctrine/`** holds durable project rules and operating principles.
- **`architecture/adr/`** records consequential architecture decisions.
- **`architecture/atc/`** defines architecture test cases and acceptance checks.
- **`architecture/docs/`** is deprecated reference material; extract useful content before relying on it.
- When you change architecture, routing, components, APIs, permissions, or data model behavior, update doctrine, ADRs, or ATCs as appropriate.
- Run `pnpm doctrine:check` after documentation authority changes.

## PR Checklist

- [ ] Lint & type check pass (`pnpm run lint && pnpm run type-check`)
- [ ] Tests added/updated or reason stated
- [ ] Branch is up-to-date with `main`
- [ ] PR is small and focused (< 400 lines ideally)
- [ ] No unused exports
- [ ] Accessible UI changes
- [ ] Docs updated if needed
- [ ] Feature flag added if feature is incomplete

## Scripts Reference

| Script                     | Description                                               |
| -------------------------- | --------------------------------------------------------- |
| `pnpm env:sync`            | Generate `.env.local` from `env.config`                   |
| `pnpm dev`                 | Start Next.js dev server on port 3000                     |
| `pnpm build`               | Build for production                                      |
| `pnpm start`               | Start production server                                   |
| `pnpm format`              | Format code with Prettier                                 |
| `pnpm lint`                | Run ESLint                                                |
| `pnpm lint:fix`            | Run ESLint with auto-fix                                  |
| `pnpm lint:a11y`           | Run strict lint/a11y pass with warnings treated as errors |
| `pnpm repo:guard`          | Validate repo hygiene and module-boundary rules           |
| `pnpm type-check`          | Run TypeScript type checking                              |
| `pnpm doctrine:check`      | Validate doctrine authority rules                         |
| `pnpm test`                | Run Vitest once                                           |
| `pnpm test:watch`          | Run Vitest in watch mode                                  |
| `pnpm test:coverage`       | Run Vitest with coverage                                  |
| `pnpm db:generate`         | Generate Drizzle migrations                               |
| `pnpm db:migrate`          | Run database migrations                                   |
| `pnpm db:push`             | Alias to `db:migrate`; direct push is intentionally gated |
| `pnpm db:push:unsafe`      | Force Drizzle push; local/dev use only                    |
| `pnpm db:studio`           | Open Drizzle Studio GUI                                   |
| `pnpm db:seed`             | Seed demo data                                            |
| `pnpm db:reset`            | Reset app data after confirmation                         |
| `pnpm db:fresh`            | Reset and seed demo data                                  |
| `pnpm embeddings:generate` | Generate AI embeddings                                    |
| `pnpm embeddings:recreate` | Recreate AI embeddings                                    |
| `pnpm storybook`           | Start Storybook on port 6006                              |
| `pnpm build-storybook`     | Build static Storybook                                    |

Happy building! 🚀
