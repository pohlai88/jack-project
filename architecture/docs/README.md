# Deprecated Engineering Docs

This folder is deprecated as an engineering authority. It is kept as historical template reference and source material for future doctrine.

Current project authority lives in:

| System                                                         | Purpose                                         |
| -------------------------------------------------------------- | ----------------------------------------------- |
| [doctrine](../doctrine)                                        | Current rules and operating principles          |
| [adr](../adr)                                                  | Architecture decision records                   |
| [atc](../atc)                                                  | Architecture test cases and acceptance checks   |
| [scripts/check-doctrine.mjs](../../scripts/check-doctrine.mjs) | Lightweight enforcement for the authority model |

## How To Use These Files

Use files in this folder only as input material. Before relying on anything here:

1. Check the current code.
2. Promote durable rules into `architecture/doctrine/`.
3. Capture consequential choices in `architecture/adr/`.
4. Convert enforceable expectations into `architecture/atc/`.

## Legacy Index

| Document                                            | Legacy content                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------- |
| [Project Structure](./PROJECT_STRUCTURE.md)         | Template-era architecture, folder organization, and feature modules |
| [Design System](./DESIGN_SYSTEM.md)                 | Design philosophy, tokens, and visual identity                      |
| [Brand Guidelines](./BRAND_GUIDELINES.md)           | Logo, color palette, typography, and brand rules                    |
| [Components & Styling](./COMPONENTS_AND_STYLING.md) | shadcn/ui and Tailwind patterns                                     |
| [shadcn/ui Components](./SHADCN_AND_COMPONENTS.md)  | Component inventory and usage notes                                 |
| [Storybook](./STORYBOOK.md)                         | Storybook setup and writing stories                                 |
| [Database](./DATABASE.md)                           | Legacy Drizzle and database notes                                   |
| [Authentication](./AUTHENTICATION.md)               | Auth.js configuration notes                                         |
| [Roles and Permissions](./ROLES_AND_PERMISSIONS.md) | Broad PBAC model, partly aspirational                               |
| [State Management](./STATE_MANAGEMENT.md)           | State handling approaches                                           |
| [Performance](./PERFORMANCE.md)                     | Optimization guidelines                                             |
| [Project Configuration](./PROJECT_CONFIGURATION.md) | Build tool and configuration notes                                  |
| [Testing Guide](./TESTING_GUIDE.md)                 | Testing patterns                                                    |
| [API Reference](./API.md)                           | Legacy REST API reference                                           |
| [Integrations](./INTEGRATIONS.md)                   | Third-party integration notes                                       |
| [Deployment](./DEPLOYMENT.md)                       | Deployment and infrastructure notes                                 |
| [GitHub Setup Guide](./GITHUB_SETUP_GUIDE.md)       | CI/CD and GitHub workflow notes                                     |
| [Glossary](./GLOSSARY.md)                           | Domain vocabulary, partly broader than current implementation       |
