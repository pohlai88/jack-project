/**
 * Shared cookie `Domain` for session + locale when using `{slug}.{TENANT_ROOT_DOMAIN}`.
 * Edge-safe (no DB); used from `src/shared/lib/auth.ts` and `src/i18n/routing.ts`.
 *
 * @see architecture/adr/0008-cookie-domain-tenant-subdomains.md
 */

/** Strip scheme/port/path and leading dots; return a hostname suitable for Set-Cookie Domain. */
export function normalizeCookieDomainInput(input: string | null | undefined): string | undefined {
  if (!input?.trim()) return undefined;

  let host = input.trim().toLowerCase();
  host = host.replace(/^https?:\/\//, '');
  host = host.split('/')[0] ?? '';
  host = host.split(':')[0] ?? '';
  while (host.startsWith('.')) {
    host = host.slice(1);
  }

  return host || undefined;
}

/**
 * Hostnames where a shared Set-Cookie `Domain` must not be applied (preview provider roots, IPs, mDNS).
 * Bare `localhost` stays host-only in local dev because browser handling of `Domain=localhost`
 * is inconsistent, especially for cookie deletion during sign-out.
 */
export function isUnsafeSharedCookieDomain(hostname: string): boolean {
  const h = hostname.trim().toLowerCase();
  if (!h) return true;
  if (h === 'localhost') return true;
  if (h === 'vercel.app' || h.endsWith('.vercel.app')) return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return true;
  if (h.endsWith('.local') && !h.endsWith('.localhost')) return true;
  return false;
}

/** Drop unsafe hosts so callers fall back to host-only cookies. */
export function finalizeSharedCookieDomain(normalized: string | undefined): string | undefined {
  if (!normalized) return undefined;
  if (isUnsafeSharedCookieDomain(normalized)) return undefined;
  return normalized;
}

/**
 * Cookie `Domain` for cross-subdomain auth + locale cookies.
 *
 * Resolution order (first non-empty after normalization wins, then safety filter):
 * 1. `AUTH_COOKIE_DOMAIN` (server)
 * 2. `TENANT_ROOT_DOMAIN` (server)
 * 3. `NEXT_PUBLIC_COOKIE_DOMAIN` (client + server; explicit apex for cookies)
 * 4. `NEXT_PUBLIC_TENANT_ROOT_DOMAIN` (client + server; mirror of tenant root for builds)
 *
 * (3–4) exist so `src/i18n/routing.ts` can align `NEXT_LOCALE` with Auth.js without importing server `env`.
 */
export function resolveSharedCookieDomain(
  authCookieDomain: string | null | undefined,
  tenantRootDomain: string | null | undefined,
  publicCookieDomain: string | null | undefined = undefined,
  publicTenantRootDomain: string | null | undefined = undefined,
): string | undefined {
  const candidate =
    normalizeCookieDomainInput(authCookieDomain) ??
    normalizeCookieDomainInput(tenantRootDomain) ??
    normalizeCookieDomainInput(publicCookieDomain) ??
    normalizeCookieDomainInput(publicTenantRootDomain);

  return finalizeSharedCookieDomain(candidate);
}
