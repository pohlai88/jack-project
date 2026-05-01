# Implementation Plan

[Overview]
Normalize the full localized marketing landing page into a harmonious, human-readable, standardized design system without changing product behavior.

The landing page lives under `src/app/[locale]/(marketing)`, is composed by `page.tsx`, wrapped by `layout.tsx`, and styled by `src/shared/styles/landing.css`. The implementation should preserve this route-owned CSS architecture, the persistent nav/footer shell, the truth-instrument providers, and the existing design-system verifier.

The main inconsistency is repeated section header/action layout implemented with inline `style` props in several sections while other sections use `marketing-frame` and bespoke visual panels. The implementation should introduce small static-class primitives, migrate repeated layouts to those primitives, and refine shared CSS tokens/selectors for balanced rhythm, line length, panel spacing, responsive behavior, and focus visibility.

[Types]
Type changes should be limited to reusable React prop types for marketing composition primitives.

In `src/app/[locale]/(marketing)/_components/landing-primitives.tsx`, keep `PrimitiveProps<T extends ElementType> = ComponentPropsWithoutRef<T> & { className?: string }`.

Add `MarketingSectionIntroProps` with readonly fields: `eyebrow: ReactNode`, `title: ReactNode`, `copy?: ReactNode`, `titleId: string`, `audiences?: ReactNode`, `action?: ReactNode`, and `className?: string`.

Add `MarketingSectionBodyProps` as `PrimitiveProps<'div'> & { readonly spacing?: 'default' | 'compact' | 'loose' }` if CSS spacing variants are implemented. Do not add `any`, mutable arrays, global design config types, or dependency-driven type systems.

[Files]
File changes should stay scoped to landing route components and `landing.css`.

Modify `src/app/[locale]/(marketing)/_components/landing-primitives.tsx` to add `MarketingSectionIntro` and `MarketingSectionBody` using static `marketing-*` class names.

Modify these section files to remove inline header styles and use the shared primitives: `OntologySection.tsx`, `ProcurementSection.tsx`, `OperationsSection.tsx`, and `ArchitectureSection.tsx`.

Modify `SecuritySection.tsx`, `EvidenceSection.tsx`, and `ModularSection.tsx` to align their text/action rhythm with the same shared primitive structure while preserving their visual panels.

Modify `src/shared/styles/landing.css` to add `.marketing-section__intro`, `.marketing-section__intro-main`, `.marketing-section__intro-action`, `.marketing-section__body`, `.marketing-section__body--compact`, and `.marketing-section__body--loose`, then refine shared section, frame, panel, and responsive spacing.

Only adjust `HeroSection.tsx` or `MarketingFooter.tsx` if page-wide rhythm requires it. Keep `MarketingFooter` jurisdiction-neutral and do not reintroduce Malaysia-specific footer blocks. Do not modify `layout.tsx`, `page.tsx`, or `scripts/verify-landing-design-system.ts` unless absolutely necessary.

No new production files, deletes, moves, dependency manifests, Tailwind config, Next config, ESLint config, or TypeScript config changes are required.

[Functions]
Function changes should extract repeated section layout behavior and preserve existing section logic.

Add `MarketingSectionIntro(props: MarketingSectionIntroProps)` in `_components/landing-primitives.tsx`. It should render a standardized intro/action row with static classes, an eyebrow, `h2`, optional copy, optional audience region, and optional action region.

Add `MarketingSectionBody({ className, spacing = 'default', ...props }: MarketingSectionBodyProps)` in `_components/landing-primitives.tsx`. It should map spacing variants to static classes without dynamic structural class interpolation that would fail `verify-landing-design-system`.

Modify `OntologySection`, `ProcurementSection`, `OperationsSection`, and `ArchitectureSection` to use the new primitives and remove inline `style` wrappers.

Modify `SecuritySection`, `EvidenceSection`, and `ModularSection` to use the same intro/action rhythm or equivalent static classes while preserving `SecurityCertificate`, `EvidenceTermsPanel`, and `ModularTypographyPanel`.

Keep `MarketingSectionHeader` for backwards compatibility, optionally as a thin wrapper around `MarketingSectionIntro`. Remove no exported functions unless all usages are migrated and the removal is clearly safe.

[Classes]
No TypeScript or JavaScript classes should be added; CSS class selectors should be standardized and tokenized.

Add CSS selectors in `landing.css`: `.marketing-section__intro`, `.marketing-section__intro-main`, `.marketing-section__intro-action`, `.marketing-section__body`, `.marketing-section__body--compact`, and `.marketing-section__body--loose`.

Refine these existing selectors for rhythm and readability: `.marketing-section`, `.marketing-section--tall`, `.marketing-section__inner`, `.marketing-section__header`, `.marketing-section__title`, `.marketing-section__copy`, `.marketing-h1`, `.marketing-lead`, `.marketing-frame`, `.security-section__frame`, `.security-section__actions`, `.evidence-section__frame`, `.evidence-section__actions`, `.modular-section__frame`, and `.modular-section__actions`.

Small CSS-only refinements may be made to procurement, operations, architecture, security, evidence, modular, and footer panel selectors to harmonize spacing, borders, radius, and responsive behavior. Do not remove selectors required by `scripts/verify-landing-design-system.ts`; do not use CSS imports, global selectors, `!important`, negative letter spacing, or `vw` font sizes.

[Dependencies]
No dependency changes are required.

Use existing React 19, Next.js App Router, Next Intl helpers, existing project utilities, Tailwind CSS v4 through existing CSS, and existing scripts. Do not import the provided Launch UI footer dependencies or add a new UI library.

[Testing]
Validation should combine static design-system checks, type checking, linting, formatting, and visual review.

Required commands: `pnpm verify-landing-design-system`, `pnpm type-check`, `pnpm lint`, and `pnpm exec prettier --check "src/app/[locale]/(marketing)/**/*.tsx" "src/app/[locale]/(marketing)/**/*.ts" "src/shared/styles/landing.css"`.

Manual review should cover desktop, tablet, and mobile widths; no horizontal overflow; readable line lengths; balanced section header/action alignment; panel spacing; keyboard focus visibility; reduced-motion behavior; and no truth-ledger/header collision with hero content. If port 3000 is busy, use an alternate dev port such as 3001.

[Implementation Order]
Implement primitives first, migrate repeated sections, refine CSS, then validate.

1. Add `MarketingSectionIntro` and `MarketingSectionBody` to `landing-primitives.tsx`.
2. Add corresponding static selectors and spacing tokens in `landing.css`.
3. Migrate `OntologySection`, `ProcurementSection`, `OperationsSection`, and `ArchitectureSection` away from inline header wrappers.
4. Align `SecuritySection`, `EvidenceSection`, and `ModularSection` to the same intro/action/body rhythm.
5. Refine shared and section-specific CSS spacing, line lengths, panel gaps, border/radius consistency, and responsive behavior.
6. Confirm `MarketingFooter` remains jurisdiction-neutral and visually balanced.
7. Run Prettier on touched files.
8. Run `pnpm verify-landing-design-system` and fix static-class/token issues.
9. Run `pnpm type-check` and fix TypeScript issues.
10. Run `pnpm lint` and fix lint/accessibility issues.
11. Perform responsive and keyboard visual review and make final CSS-only adjustments if needed.
