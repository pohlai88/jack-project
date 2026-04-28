# Locale Activation Readiness Checklist 0010

Date: 2026-04-27
Status: Runtime activation includes `en`, `zh-CN`, `vi`, `ms`, `es`, `id`, and `th` (see `src/i18n/locale-registry.ts`). `RG-I18N-001` governs warn-only readiness reporting and snapshot review.

## Summary

This checklist operationalizes the rollout rules defined in [Locale Coverage Expansion Plan 0008](./LOCALE_COVERAGE_EXPANSION_PLAN_0008.md).

It remains subordinate to Expansion Plan 0008. The entries below now capture implementation evidence for the active rollout slice as well as the remaining governance fields that still require human completion.

The authoritative readiness contract is now [ATC-0010: Locale Activation Readiness](../atc/ATC-0010-locale-activation-readiness.md). Reviewed status evidence is captured in [I18N Locale Activation Snapshot](./evidence/i18n/I18N_LOCALE_ACTIVATION_SNAPSHOT.md). Generated reports under `.artifacts/i18n/` are non-committed artifacts only.

Git is the authoritative translation operating system. Human translations live in `src/i18n/catalogs/fallback/*.json` (optional machine exports in `catalogs/generated`); repository validation and merge decide acceptance.

## Activation Identity

Record the following for each locale activation candidate:

- locale code
- language name
- rollout phase
- business owner
- translation reviewer
- technical owner
- approval date

## Required Assets Checklist

Before adding any locale to **`activeLocales`** in `src/i18n/locale-registry.ts` (and ensuring `src/i18n/config.ts` stays in sync via `locales = activeLocales` and `localeNames`), confirm all of the following:

- `src/i18n/catalogs/generated/<locale>.json` exists, or a protected fallback catalog is explicitly approved
- `src/i18n/messages/<locale>.json` is produced by `pnpm i18n:compile`
- `src/i18n/catalogs/fallback/MANIFEST.json` contains the protected fallback hash when fallback is used
- generated docs evidence exists under `content/i18n/docs/generated`
- language name exists in `localeNames`

## Full Validation Gate

Run all of the following:

```bash
pnpm docs:ci
pnpm i18n:compile --check
pnpm i18n:validate
pnpm i18n:coverage
pnpm i18n:fallback-check
pnpm doctrine:check
pnpm repo:guard
pnpm lint
pnpm type-check
pnpm test
pnpm build
git diff --check
```

## No Partial Activation Checklist

Do not:

- add a locale to `activeLocales` before messages and docs are ready
- expose a locale in UI before checks pass
- manually edit generated or compiled runtime message files
- add messages without generated docs evidence
- add locale-specific docs folders

## Verdict Taxonomy

Locale activation verdicts must be derived algorithmically using the strict readiness taxonomy:

- `canonical`
- `active_ready`
- `active_fallback`
- `inactive_draft`

## Activation Evidence

### `vi` — Vietnamese

Status: `Derived verdict: active_fallback. Runtime activation is implemented with generated docs evidence; governance ownership confirmation remains pending.`

Activation identity:

- locale code: `vi`
- language name: `Tiếng Việt`
- rollout phase: `Phase 1`
- business owner: pending
- translation reviewer: pending
- technical owner: pending
- approval date: pending

Required assets:

- `src/i18n/messages/vi.json`: completed
- docs evidence: completed via generated Fumadocs evidence pipeline
- `localeNames.vi`: completed

Evidence:

- `src/i18n/locale-registry.ts` / `config.ts` expose `vi` in `activeLocales`
- landing and selector copy are localized for `vi`

### `ms` — Malay

Status: `Derived verdict: active_fallback. Runtime activation is implemented with generated docs evidence; governance ownership confirmation remains pending.`

Activation identity:

- locale code: `ms`
- language name: `Bahasa Melayu`
- rollout phase: `Phase 1`
- business owner: pending
- translation reviewer: pending
- technical owner: pending
- approval date: pending

Required assets:

- `src/i18n/messages/ms.json`: completed
- docs evidence: completed via generated Fumadocs evidence pipeline
- `localeNames.ms`: completed

Evidence:

- `src/i18n/locale-registry.ts` / `config.ts` expose `ms` in `activeLocales`
- landing and selector copy are localized for `ms`

### `zh-CN` — Simplified Chinese

Status: `Derived verdict: active_fallback. Runtime activation is implemented with generated docs evidence; visual validation remains the main follow-up risk surface.`

Activation identity:

- locale code: `zh-CN`
- language name: `简体中文`
- rollout phase: `Priority activation follow-up`
- business owner: pending
- translation reviewer: pending
- technical owner: pending
- approval date: pending

Required assets:

- `src/i18n/messages/zh-CN.json`: completed
- docs evidence: completed via generated Fumadocs evidence pipeline
- `localeNames['zh-CN']`: completed

Evidence:

- `src/i18n/locale-registry.ts` / `config.ts` expose `zh-CN` in `activeLocales`
- landing and selector copy are localized for `zh-CN`

## Current derived baseline

- `en`: `canonical`
- `es`, `vi`, `ms`, `zh-CN`, `id`, `th`: typically `active_fallback` until snapshot records `active_ready` (messages + docs evidence + UI QA + owners + approval per [ATC-0010](../atc/ATC-0010-locale-activation-readiness.md))

Run `pnpm i18n:readiness:report` for the live derived verdicts table.

## Documentation Improvement Readiness

The i18n runtime and catalog ecosystem supports documentation improvement work; most locales remain `active_fallback` until governance fields in the snapshot are completed.

Documentation improvement should focus on product-truth coverage in generated docs evidence:

- keep runtime messages under the i18n pipeline
- keep docs authority in feature manifests and generated evidence
- do not add locale-specific docs Markdown folders (runtime i18n only)
- update the readiness snapshot and `source_artifact_hash` after material governance or readiness changes (`pnpm i18n:readiness:report`, then copy **Markdown SHA-256** into the snapshot frontmatter)

Minimum verification for each documentation slice:

```bash
pnpm docs:ci
pnpm i18n:readiness:report
pnpm i18n:validate
pnpm i18n:fallback-check
```
