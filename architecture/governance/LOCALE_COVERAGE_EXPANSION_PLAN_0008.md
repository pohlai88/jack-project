# Locale Coverage Expansion Plan 0008

Date: 2026-04-26

## Status

Planned only. This record defines locale expansion targets and rollout gates. It does not activate locales, add locale files, add docs folders, or change runtime behavior.

## Approved Target Locale Set

- `vi` — Vietnamese
- `id` — Indonesian
- `ms` — Malay
- `th` — Thai
- `zh-CN` — Mandarin Simplified Chinese

## Rollout Phases

### Phase 1

- `vi`
- `ms`

### Phase 2

- `id`
- `th`

### Phase 3

- `zh-CN`

## Activation Gate

A locale is not allowed into `src/i18n/config.ts` unless all of the following are true:

- `pnpm i18n:check` passes
- `pnpm i18n:compile --check` passes
- `pnpm i18n:validate` passes
- `pnpm i18n:fallback-check` passes
- `pnpm docs:check` passes
- docs fallback is visible in UI
- generated Crowdin output or protected fallback provenance exists
- translation metadata exists for localized docs
- reviewer approval is recorded
- for `zh-CN`, UI layout validation is completed

## No Partial Activation Rule

A locale must not be partially activated.

Do not:

- add a locale to `config.ts` without its required messages and docs state being ready
- add locale messages without docs coverage unless fallback is explicitly allowed and visibly surfaced
- manually edit generated Crowdin catalogs or compiled runtime message files
- expose a locale in UI selectors before the activation gate passes

## Mandarin Special Validation Note

`zh-CN` is not just another SEA locale.

It introduces:

- CJK script behavior
- different text density
- possible typography/rendering differences

Before activation, validate:

- layout overflow
- typography compatibility
- truncation handling

## Repo-Specific Blockers

The current codebase has blockers that must be resolved before locale activation:

- `src/i18n/request.ts` currently strips region subtags, so `zh-CN` cannot resolve correctly until locale matching preserves configured regional locales
- `src/shared/lib/tenant-settings.ts` and the current admin language selectors still hard-code `en | es | pt`, so settings schema and UI must be aligned before locale activation
- exact configured locale identifiers must be used for future files and folders, including `src/i18n/messages/zh-CN.json` and `src/features/docs/content/zh-CN/`

## Validation Commands

These commands validate repository readiness only. They do not activate any locale by themselves.

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

## Execution Boundary

This PR is governance-only.

It must not:

- add any new locale to `src/i18n/config.ts`
- create new message files
- create new docs locale folders
- change runtime behavior

Locale activation work will come later in separate execution PRs, starting with Phase 1 locales only after the documented gate passes.
