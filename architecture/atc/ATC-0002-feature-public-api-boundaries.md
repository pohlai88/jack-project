# ATC-0002: Feature Public API Boundaries

## Acceptance Criteria

- Every first-level directory under `src/features/` contains `index.ts`.
- No tracked source file imports `@/features/<feature>/*`.
- No file inside `src/features/<feature>/` imports `@/features/<feature>` or `@/features/<feature>/*`.
- Feature root barrels do not use forbidden wildcard dump patterns such as `export * from "./components"` or `export * from "./services"`.
- `pnpm repo:guard` passes.
- `pnpm lint` passes.
