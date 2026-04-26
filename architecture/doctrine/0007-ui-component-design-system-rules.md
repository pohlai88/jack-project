# 0007: UI Component and Design System Rules

## Rule

UI implementation must follow the repo's existing design system and component ownership model.

Shared UI primitives live under `@/shared/components/ui`. Feature-specific composition belongs inside the owning feature.

## Design System Rules

- Tailwind v4 theme tokens are CSS-first and live in global CSS, not in broad JavaScript theme objects.
- Prefer semantic tokens and shared UI primitives over hardcoded colors and one-off component styles.
- Use shadcn/Radix patterns for reusable primitives and keep accessibility behavior intact.
- Client-only interaction glue should be feature-owned when it exists to support a feature route or workflow.
- Do not create broad shared abstractions until repeated cross-feature use proves the abstraction.

## Implications

- Shared UI remains pragmatic and subpath-based.
- Feature-owned client wrappers are allowed when they protect server/client bundle boundaries.
- Visual and component rules should become enforceable only where a reliable static check exists.
