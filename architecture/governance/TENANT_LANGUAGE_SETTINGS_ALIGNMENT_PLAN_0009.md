# Tenant Language Settings Alignment Plan 0009

Date: 2026-04-26
Status: Planned only

## Summary

This governance record documents how tenant/admin language settings must align to the activated runtime locale model without prematurely exposing future locales in product settings.

## Runtime Authority

The runtime locale authority remains [src/i18n/config.ts](../../src/i18n/config.ts).

Tenant/admin language settings must eventually derive selectable locales from the activated configured locale set, not from separate hard-coded enums or selector lists.

## Current Drift

Current repo state is inconsistent:

- Runtime configured locales are `en` and `es`.
- [src/shared/lib/tenant-settings.ts](../../src/shared/lib/tenant-settings.ts) still allows `en | es | pt` for `defaultLanguage`.
- [src/features/admin/components/SettingsClient.tsx](../../src/features/admin/components/SettingsClient.tsx) hard-codes `en | es | pt` in the admin settings selector.
- [src/features/admin/components/settings/BrandingSettings.tsx](../../src/features/admin/components/settings/BrandingSettings.tsx) hard-codes `en | es | pt` in the branding settings selector.

`pt` is treated as unsupported drift unless formal Portuguese activation is separately approved.

## No Partial Activation

Tenant/admin language settings must follow the same no-partial-activation rule already established by [Locale Coverage Expansion Plan 0008](./LOCALE_COVERAGE_EXPANSION_PLAN_0008.md).

- Do not expose `vi`, `id`, `ms`, `th`, or `zh-CN` in tenant settings until each locale passes the activation gate.
- Tenant/admin selectors must not diverge from the activated locale set.
- Future locales must remain hidden in tenant/admin settings until activation is complete.

## Future Implementation Path

A later execution PR must:

- replace the tenant hard-coded language enum/source with activated locale config
- derive admin selector options from the same activated locale list
- prevent persistence of tenant `defaultLanguage` values outside the configured locale set
- define migration/remediation for existing unsupported saved values such as `pt`
- preserve the governed activation model so future locales stay hidden until activation gates pass

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
