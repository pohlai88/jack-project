# 0002: Feature Public API Boundaries

## Rule

Feature consumers must import feature code only through the feature root public API:

- allowed: `@/features/<feature>`
- forbidden: `@/features/<feature>/*`

Files inside `src/features/<feature>/` must not import their own feature root or their own deep feature alias. Same-feature internals must use relative imports.

Shared infrastructure remains pragmatic and subpath-based:

- `@/shared/components/ui`
- `@/shared/lib`
- `@/shared/db`
- `@/shared/providers`

Feature root `index.ts` files are explicit public APIs. They may export only the externally consumed surface and must not act as dumping grounds for internal folders or test utilities.

## Implications

- Every first-level directory under `src/features/` must contain a root `index.ts`.
- App routes and cross-feature consumers must depend on feature roots, not feature internals.
- Feature internals must prefer relative imports to avoid cycles and self-coupling through their own barrel.
- `repo:guard` is the canonical CI verdict for these rules. ESLint mirrors them for local feedback only.
