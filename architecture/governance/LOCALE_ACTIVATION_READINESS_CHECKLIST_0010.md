# Locale Activation Readiness Checklist 0010

Date: 2026-04-27
Status: Runtime activation evidence recorded for `vi`, `ms`, and `zh-CN`; `RG-I18N-001` now governs warn-only readiness reporting and snapshot review.

## Summary

This checklist operationalizes the rollout rules defined in [Locale Coverage Expansion Plan 0008](./LOCALE_COVERAGE_EXPANSION_PLAN_0008.md).

It remains subordinate to Expansion Plan 0008. The entries below now capture implementation evidence for the active rollout slice as well as the remaining governance fields that still require human completion.

The authoritative readiness contract is now [ATC-0010: Locale Activation Readiness](../atc/ATC-0010-locale-activation-readiness.md). Reviewed status evidence is captured in [I18N Locale Activation Snapshot](./evidence/i18n/I18N_LOCALE_ACTIVATION_SNAPSHOT.md). Generated reports under `.artifacts/i18n/` are non-committed artifacts only.

Crowdin is the authoritative translation operating system. Translation tools may propose changes only through generated catalog pull requests; repository validation and merge decide acceptance.

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

Before adding any locale to `src/i18n/config.ts`, confirm all of the following:

- `src/i18n/catalogs/generated/<locale>.json` exists, or a protected fallback catalog is explicitly approved
- `src/i18n/messages/<locale>.json` is produced by `pnpm i18n:compile`
- `src/i18n/catalogs/fallback/MANIFEST.json` contains the protected fallback hash when fallback is used
- `src/features/docs/content/<locale>/` exists, or missing docs are explicitly fallback-allowed
- all localized docs include translation metadata
- fallback banner messages exist
- language name exists in `localeNames`

## Full Validation Gate

Run all of the following:

```bash
pnpm docs:hash
pnpm docs:check
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

- add a locale to `config.ts` before messages and docs are ready
- expose a locale in UI before checks pass
- manually edit generated or compiled runtime message files
- add messages without docs coverage or explicit fallback
- add docs without translation metadata

## Verdict Taxonomy

Locale activation verdicts must be derived algorithmically using the strict readiness taxonomy:

- `canonical`
- `active_ready`
- `active_fallback`
- `inactive_draft`

## Activation Evidence

### `vi` — Vietnamese

Status: `Derived verdict: active_fallback. Runtime activation is implemented with visible English docs fallback; governance ownership confirmation remains pending.`

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
- `src/features/docs/content/vi/` or explicit fallback allowances: completed via canonical English `fallbackAllowedLocales`
- translation metadata coverage: completed for existing localized docs; no Vietnamese docs added in this slice
- fallback banner messages: completed
- `localeNames.vi`: completed

Evidence:

- `src/i18n/config.ts` now activates `vi`
- `src/features/docs/content/en/**` explicitly allows visible Vietnamese fallback
- landing, selector, and docs fallback copy are localized for `vi`

### `ms` — Malay

Status: `Derived verdict: active_fallback. Runtime activation is implemented with visible English docs fallback; governance ownership confirmation remains pending.`

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
- `src/features/docs/content/ms/` or explicit fallback allowances: completed via canonical English `fallbackAllowedLocales`
- translation metadata coverage: completed for existing localized docs; no Malay docs added in this slice
- fallback banner messages: completed
- `localeNames.ms`: completed

Evidence:

- `src/i18n/config.ts` now activates `ms`
- `src/features/docs/content/en/**` explicitly allows visible Malay fallback
- landing, selector, and docs fallback copy are localized for `ms`

### `zh-CN` — Simplified Chinese

Status: `Derived verdict: active_fallback. Runtime activation is implemented with visible English docs fallback; visual validation remains the main follow-up risk surface.`

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
- `src/features/docs/content/zh-CN/` or explicit fallback allowances: completed via canonical English `fallbackAllowedLocales`
- translation metadata coverage: completed for existing localized docs; no Simplified Chinese docs added in this slice
- fallback banner messages: completed
- `localeNames['zh-CN']`: completed

Evidence:

- `src/i18n/config.ts` now activates `zh-CN`
- `src/features/docs/content/en/**` explicitly allows visible Simplified Chinese fallback
- landing, selector, and docs fallback copy are localized for `zh-CN`

## Current Derived Baseline

- `en`: `canonical`
- `es`: `active_fallback` until governance owners and approval are recorded in the reviewed snapshot
- `vi`: `active_fallback`
- `ms`: `active_fallback`
- `zh-CN`: `active_fallback`
- `id`: `inactive_draft`
- `th`: `inactive_draft`
