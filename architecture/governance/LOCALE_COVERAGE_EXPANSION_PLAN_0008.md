# Locale Coverage Expansion Plan 0008

Date: 2026-04-26

## Status

Originally **governance-only** (no direct code changes). **Runtime is now authoritative:** the live locale set is `activeLocales` in [`src/i18n/locale-registry.ts`](../../src/i18n/locale-registry.ts) (currently `en`, `zh-CN`, `vi`, `ms`, `es`, `id`, `th`). The phases and gates below remain the **quality bar** for adding the next locale or tightening readiness; they are not a description of which locales are still “off” in production routing.

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
- `pnpm docs:ci` passes
- generated docs evidence exists
- optional generated catalog output or protected fallback provenance exists
- reviewer approval is recorded
- for `zh-CN`, UI layout validation is completed

## No Partial Activation Rule

A locale must not be partially activated.

Do not:

- add a locale to `config.ts` without its required messages and generated docs evidence being ready
- add locale messages without generated docs evidence
- manually edit generated catalogs or compiled runtime message files
- create locale-specific docs Markdown folders
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

## Repo notes (keep current)

- **Regional tags**: configured identifiers use full tags where needed (e.g. `zh-CN`); cookie/path aliases (`ms-MY` → `ms`, `id-ID` → `id`) are handled in locale matching — do not “simplify” registry codes without updating fallbacks and compile output.
- **Tenant admin UI**: default language must stay aligned with `activatedLocaleValues` / `activeLocales` (see [Tenant Language Settings Alignment Plan 0009](./TENANT_LANGUAGE_SETTINGS_ALIGNMENT_PLAN_0009.md)).
- **Message paths**: compiled files must match registry codes exactly (e.g. `src/i18n/messages/zh-CN.json`).

## Validation Commands

These commands validate repository readiness only. They do not activate any locale by themselves.

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

## Execution boundary (original PR)

The first PR that introduced this document was governance-only. Subsequent work has updated `locale-registry.ts`, catalogs, and compiled `messages/*.json` under the same gates. Any **new** locale still requires a normal execution PR that satisfies the [Activation Gate](#activation-gate) and updates the [I18N Locale Activation Snapshot](./evidence/i18n/I18N_LOCALE_ACTIVATION_SNAPSHOT.md) plus `pnpm i18n:fallback-check --write-manifest` when fallbacks change.
