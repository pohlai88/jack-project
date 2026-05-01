# Afenda Docs Runtime

This directory is runtime-only for docs behavior and contracts.
Fumadocs owns rendering and layout.
Afenda owns content contracts, evidence manifests, and runtime adapters.

## Canonical Boundaries

- Fumadocs shells, sidebar, TOC, breadcrumb, header/footer, search, and OpenAPI visuals come from package defaults.
- The docs app adopts `fumadocs-ui/layouts/docs` as the canonical documentation shell; see
  `architecture/doctrine/0011-fumadocs-docs-layout-adoption.md`.
- `src/app/[locale]/docs/**` owns route wiring and imports.
- `src/docs/feedback/**` owns persistence, validation, and rate-limit for page feedback.
- `src/docs/runtime/**` owns shared contracts/helpers/resolvers/clients for docs surface behavior.

## Docs content contract (Wave 3)

All MDX sources under `content/i18n/docs/en/**/*.mdx` must declare:

```mdx
docsType: "index" | "curated" | "generated-evidence" | "api" | "llm"
```

Validation is enforced by `scripts/docs-content-policy.ts` and `pnpm docs:check`.

### Type requirements

- `index`
  - Path expectation: `content/i18n/docs/en/index.mdx`
  - Purpose: route hub / entry surface.
- `curated`
  - Path patterns: `curated/**/*`
  - Required ordered headings:
    - `thesis`
    - `model`
    - `operational implication`
    - `next reading`
- `generated-evidence`
  - Path patterns: `generated/**/*`
  - Required ordered headings:
    - `overview`
    - `when to use`
    - `source contract`
    - `runtime surfaces`
    - `failure modes`
    - `source evidence`
- `api`
  - Path patterns: `openapi/**/*`
  - Use only for interface-reference pages.
- `llm`
  - Reserved for machine-only pages.

### Section heading order rule

For curated and generated-evidence docs, required headings must exist in order.
The checker accepts common aliases (for example “operational implications”).

### MDX import policy

Only approved import prefixes are allowed in docs MDX:

- `fumadocs-ui/` and sub-paths
- `fumadocs-openapi/`
- `fumadocs-typescript`
- `@/shared/components/markdown/Mermaid`
- `react`

Relative imports are intentionally blocked unless wrapped into shared shared components.

## Evidence/generator checks

Pipeline entrypoints:

- `scripts/docs-content-policy.ts`  
  Content contracts, allowed heading sets, frontmatter parsing, and MDX import policy.
- `scripts/docs-evidence-pipeline.ts`  
  Contract validation, manifest validation, OpenAPI cross-check, stale docs detection.
- `scripts/docs-validate-links.ts`  
  Internal links and route drift.

## Required doc commands

```bash
pnpm docs:source
pnpm docs:generate
pnpm docs:check
pnpm docs:links
pnpm docs:llms
pnpm docs:search
```

Use these as part of the docs CI sequence when touching route graphs or manifests:

- `pnpm docs:generate` after manifest changes.
- `pnpm docs:check` after adding/moving/removing MDX files or changing contracts.
- `pnpm docs:links` after changing docs routes/hrefs.

## Operational notes

- Keep default Fumadocs ownership. Do not create local copies of docs shell primitives.
- Use official Fumadocs component imports for documentation UI. `Accordion`, `Accordions`, `Banner`, `InlineTOC`,
  `Step`, `Steps`, `Tab`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `TypeTable`, and `AutoTypeTable` are
  registered centrally in `src/mdx-components.tsx`; do not create Afenda-local clones or visual wrappers for them.
- `AutoTypeTable` must use the shared `fumadocs-typescript` generator with a filesystem cache. MDX pages may use
  `<AutoTypeTable />` directly, but pages that need build-time transformation should prefer the configured
  `remarkAutoTypeTable` pipeline in `source.config.ts`.
- Put site-wide announcement banners at the top of the docs/root layout. Page-specific notices should avoid changing
  Fumadocs layout unless the upstream `Banner` documentation explicitly calls for it.
- Do not restore deleted local layout/layout-slot components except where explicitly documented as Afenda-owned adapters.
- If a page is intentionally exempt from heading/import rules (temporary transition), add it only through a migration plan and a time-bound override in `scripts/docs-content-policy.ts`.
- `docs:search` and `docs:llms` sample checks derive representative targets from generated evidence metadata (`generated/**/meta.json`) to remain stable when evidence pages change.

## How to author docs safely

### Before adding or editing an MDX page

1. Set `docsType` explicitly in frontmatter.
2. Use the route-derived target (`index`, `curated`, `generated-evidence`, `api`, `llm`) as source of truth.
3. Add the required section headings for that type (in order):
   - `curated`: thesis, model, operational implication, next reading
   - `generated-evidence`: overview, when to use, source contract, runtime surfaces, failure modes, source evidence
4. Keep imports policy-safe:
   - only allowed packages or whitelisted shared Markdown helpers.
5. For new evidence/API surfaces, update the owning feature `docs.manifest.ts` and regenerate: `pnpm docs:generate`.

### Required review gate before merge

Run:

```bash
pnpm docs:source
pnpm docs:generate
pnpm docs:check
pnpm docs:links
pnpm docs:llms
pnpm docs:search
```

The command block above is mandatory when any docs route, manifest, MDX frontmatter, or evidence generation artifact changed.

## Exception policy

- No permanent exception to contract checks.
- Temporary exceptions are allowed only with a dated migration note in the file owner PR and an explicit allowlist entry in `scripts/docs-content-policy.ts`.
- Any exception expires automatically when the next non-hotfix docs pipeline run is completed.
