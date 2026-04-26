# 0002: Strict Feature Public APIs, Pragmatic Shared Subpaths

## Status

Accepted

## Decision

Adopt strict root-only public APIs for `src/features/*`:

- app-to-feature imports must use `@/features/<feature>`
- cross-feature imports must use `@/features/<feature>`
- no consumer may import `@/features/<feature>/*`
- files inside a feature must not import their own root barrel or deep feature alias

Keep shared infrastructure pragmatic and subpath-based instead of forcing a single shared root barrel.

## Consequences

- Each feature root `index.ts` becomes the deliberate external API for that feature.
- Deep feature imports become enforceable architecture violations instead of informal style issues.
- Internal feature code stays decoupled from its own barrel and avoids circular import pressure.
- Shared code can keep stable subpaths that match existing Next.js and application ergonomics.
