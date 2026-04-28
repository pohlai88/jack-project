# Tenant Language Settings Alignment Plan 0009

Date: 2026-04-26
Status: Partially executed — tenant `defaultLanguage` and admin selectors derive from `activatedLocaleValues` / `locale-registry` active set; this document remains for `pt` remediation and audit notes.

See also: [Open production control matrix](../evidence/OPEN_PRODUCTION_CONTROL_MATRIX.md).

## Summary

This governance record documents how tenant/admin language settings must align to the activated runtime locale model without prematurely exposing future locales in product settings.

## Runtime Authority

The runtime locale authority remains [src/i18n/config.ts](../../src/i18n/config.ts).

Tenant/admin language settings must eventually derive selectable locales from the activated configured locale set, not from separate hard-coded enums or selector lists.

## Resolved alignment (runtime)

- **Runtime locales** are `activeLocales` from [src/i18n/locale-registry.ts](../../src/i18n/locale-registry.ts) (currently `en`, `zh-CN`, `vi`, `ms`, `es`, `id`, `th`; `inactiveLocales` is empty).
- [src/shared/lib/tenant-settings.ts](../../src/shared/lib/tenant-settings.ts) uses `z.enum(activatedLocaleValues)` so tenant `defaultLanguage` cannot drift from the activated set.
- Admin/branding language selectors should use the same activated list (e.g. `activatedLocaleOptions` from [src/i18n/locale-options.ts](../../src/i18n/locale-options.ts)), not ad hoc `en | es | pt` literals.

## Remaining drift

- **Portuguese (`pt`)**: if any stored tenant rows still contain `pt`, migrate them to a supported locale or add `pt` through the full locale pipeline (registry + catalogs + compile + snapshot).

## No partial activation (for _new_ locales)

When adding a **new** locale not yet in `activeLocales`:

- Follow the gates in [Locale Coverage Expansion Plan 0008](./LOCALE_COVERAGE_EXPANSION_PLAN_0008.md) and [Locale Activation Readiness Checklist 0010](./LOCALE_ACTIVATION_READINESS_CHECKLIST_0010.md).
- Tenant/admin selectors must not diverge from the activated locale set once the locale is promoted.

## Future Implementation Path

A later execution PR must:

- replace the tenant hard-coded language enum/source with activated locale config
- derive admin selector options from the same activated locale list
- prevent persistence of tenant `defaultLanguage` values outside the configured locale set
- define migration/remediation for existing unsupported saved values such as `pt`
- preserve the governed activation model so **new** locales stay out of `activeLocales` until activation gates pass

## Governance Chain

This plan is subordinate to the current localization governance chain:

- [Locale Coverage Expansion Plan 0008](./LOCALE_COVERAGE_EXPANSION_PLAN_0008.md)
- the no-partial-activation rule established there
- the runtime locale authority defined in [src/i18n/config.ts](../../src/i18n/config.ts)

## Validation Gate Before Implementation

Before any runtime alignment work begins, run:

```bash
pnpm i18n:check
pnpm docs:check
pnpm doctrine:check
pnpm repo:guard
pnpm lint
pnpm type-check
pnpm test
pnpm build
git diff --check
```
