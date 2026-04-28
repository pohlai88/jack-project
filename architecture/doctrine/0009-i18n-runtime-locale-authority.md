# 0009: I18N runtime locale authority

## I18N-RUNTIME-001 — Runtime locale authority

For App Router runtime pages, the `[locale]` URL segment is the sole runtime locale authority.

`next-intl` resolves, validates, binds, and distributes that locale through request configuration, the root locale layout, server helpers, and client providers.

Cookies, tenant defaults, headers, user profile preferences, and browser language hints may influence entrypoint redirects or initial path construction only. They must not silently override an already resolved localized route inside request rendering.

## Related authority

- **Translation supply chain** (catalogs, compile, validation): [ADR-0005](../adr/0005-continuous-localization-operating-model.md).
- **Architecture decision** (scope, consequences, `explicitRequestLocale`): [ADR-0009](../adr/0009-runtime-locale-authority-app-router.md).

## Spine (consume, do not duplicate)

Runtime reads should flow through:

`[locale]` URL → [`src/i18n/routing.ts`](../../src/i18n/routing.ts) + [`src/proxy.ts`](../../src/proxy.ts) (entrypoint / redirect shaping) → [`src/i18n/request.ts`](../../src/i18n/request.ts) (`getRequestConfig`) → [`src/app/[locale]/layout.tsx`](../../src/app/[locale]/layout.tsx) (`setRequestLocale`, provider) → `useLocale` / `getLocale` / `useTranslations` / `getTranslations`.
