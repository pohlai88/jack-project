# ADR 0008: Cookie domain for tenant subdomains (Auth.js + next-intl)

## Status

Accepted.

## Context

Tenant hosts use `{slug}.{TENANT_ROOT_DOMAIN}` while Auth.js and next-intl set cookies. `src/i18n/routing.ts` is imported from **client** bundles; server-only validated `env` from `@t3-oss/env-nextjs` must not be read there (runtime guard + bundle correctness).

## Decision (COOKIE-DOMAIN-001)

Cookie domain resolution has **two surfaces**:

1. **Server / Auth.js session cookies** (see `src/shared/lib/auth.ts`), in order:
   - `AUTH_COOKIE_DOMAIN`
   - `TENANT_ROOT_DOMAIN`
   - `NEXT_PUBLIC_COOKIE_DOMAIN`
   - `NEXT_PUBLIC_TENANT_ROOT_DOMAIN`

2. **Shared / client-safe next-intl locale cookie** (`src/i18n/routing.ts`), in order:
   - `NEXT_PUBLIC_COOKIE_DOMAIN`
   - `NEXT_PUBLIC_TENANT_ROOT_DOMAIN`

`NEXT_PUBLIC_*` values are **public deploy-time configuration** (bundled into browser JS); they are not secrets. Changing them requires **rebuild/redeploy** for the client bundle to pick up new values.

**Server-only env must never be imported into shared routing modules** used on the client.

## Cookie `Domain` safety

Shared cookie `Domain` must not be applied to **unsafe** host contexts (for example `*.vercel.app`, IPv4 literals, typical mDNS `.local` names). Finalization is centralized in `finalizeSharedCookieDomain` / `isUnsafeSharedCookieDomain` in `src/shared/lib/auth-cookie-domain.ts`.

## Consequences

- Operators may duplicate `TENANT_ROOT_DOMAIN` into `NEXT_PUBLIC_TENANT_ROOT_DOMAIN` when they need aligned `NEXT_LOCALE` + session cookies across subdomains.
- `pnpm env:sync` prints **warnings** when server and public tenant/cookie vars look mismatched (see `collectTenantCookieEnvWarnings` in `scripts/env-config.mjs`).

## References

- Operator checklist: `architecture/governance/evidence/tenants/TENANT_SUBDOMAIN_VERCEL_DNS.md` (includes **nexuscanon.com** production wiring and DNS)
- Doctrine: `architecture/doctrine/0006-api-auth-tenant-boundaries.md` (cookie alignment bullets)
