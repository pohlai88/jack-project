/**
 * Pure helpers: map tenant host (subdomain of ROOT_DOMAIN) → internal pathname.
 * Edge-safe — no DB imports (safe for `src/proxy.ts`).
 *
 * `tenantRootDomain` / `rootDomain` are normalized like cookie apex input: strip optional `https?://`, path, and port
 * so misconfigured env still resolves consistently with `auth-cookie-domain` expectations.
 */

/**
 * Extract tenant slug from `Host` when it is `{slug}.{rootDomain}`.
 * Returns null for apex, www, preview hosts, or when unset/mismatch.
 */
export type TenantSlugResolutionSource = 'subdomain' | 'path' | null;

/**
 * Resolve the tenant **slug** from an incoming request without DB I/O.
 * Used by `src/proxy.ts` and tests; `slug` from the path is still untrusted until verified with `getTenantBySlug` / PBAC on the server.
 */
export function resolveTenantSlugFromIncomingRequest(input: {
  host: string | null | undefined;
  pathname: string;
  tenantRootDomain: string | null | undefined;
  locales: readonly string[];
}): { slug: string | null; source: TenantSlugResolutionSource } {
  const fromHost = parseTenantSubdomainSlugFromHost(input.host, input.tenantRootDomain);
  if (fromHost) return { slug: fromHost, source: 'subdomain' };

  const { restPath } = stripLeadingLocaleSegment(input.pathname || '/', input.locales);
  const pathMatch = restPath.match(/^\/t\/([^/]+)/);
  if (pathMatch?.[1]) return { slug: pathMatch[1], source: 'path' };

  return { slug: null, source: null };
}

export function parseTenantSubdomainSlugFromHost(
  hostHeader: string | null | undefined,
  rootDomain: string | null | undefined,
): string | null {
  if (!hostHeader?.trim() || !rootDomain?.trim()) return null;

  const hostname = hostHeader.split(':')[0].toLowerCase();
  // Match cookie-domain normalization: strip scheme before `:`, then path/port segments.
  const root = rootDomain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split('/')[0]!
    .split(':')[0]!
    .replace(/\/$/, '');

  if (!hostname || !root) return null;

  // Plan: no host-tenant on default Vercel preview host (avoid collision with deployment URL).
  if (hostname.endsWith('.vercel.app')) return null;

  if (hostname === root || hostname === `www.${root}`) return null;

  const suffix = `.${root}`;
  if (!hostname.endsWith(suffix)) return null;

  const sub = hostname.slice(0, -suffix.length);
  if (!sub || sub === 'www' || sub.includes('.')) return null;

  return sub;
}

/**
 * Strip `/{locale}` prefix when `locale` is in the allowed list.
 */
export function stripLeadingLocaleSegment(
  pathname: string,
  locales: readonly string[],
): { localeFromPath: string | null; restPath: string } {
  if (!pathname.startsWith('/')) {
    return { localeFromPath: null, restPath: pathname };
  }

  const firstSlash = pathname.indexOf('/', 1);
  const seg = firstSlash === -1 ? pathname.slice(1) : pathname.slice(1, firstSlash);
  const rest = firstSlash === -1 ? '/' : pathname.slice(firstSlash) || '/';

  if (seg && locales.includes(seg)) {
    return { localeFromPath: seg, restPath: rest };
  }

  return { localeFromPath: null, restPath: pathname };
}

/**
 * Remove a leading `/t/{anySlug}` segment so host slug can replace path tenant.
 */
export function stripLeadingTenantPathPrefix(restPath: string): string {
  const m = restPath.match(/^\/t\/[^/]+(\/.*)?$/);
  if (!m) return restPath || '/';
  const tail = m[1];
  if (!tail || tail === '') return '/';
  return tail;
}

export function pickLocaleFromAcceptLanguage(
  acceptLanguage: string | null | undefined,
  locales: readonly string[],
  fallback: string,
): string {
  if (!acceptLanguage?.trim()) return fallback;

  for (const part of acceptLanguage.split(',')) {
    const tag = part.trim().split(';')[0]?.trim().toLowerCase();
    if (!tag) continue;

    const exact = locales.find((l) => l.toLowerCase() === tag);
    if (exact) return exact;

    const base = tag.split('-')[0];
    if (base) {
      const baseMatch = locales.find((l) => l.toLowerCase() === base);
      if (baseMatch) return baseMatch;
    }
  }

  return fallback;
}

/**
 * Build internal pathname for rewrite: `/{locale}/t/{hostSlug}{tail}`.
 */
export function buildTenantHostRewritePathname(input: {
  hostSlug: string;
  pathname: string;
  locales: readonly string[];
  resolvedLocale: string;
}): string {
  const { hostSlug, pathname, locales, resolvedLocale } = input;
  const { restPath } = stripLeadingLocaleSegment(pathname, locales);
  const tail = stripLeadingTenantPathPrefix(restPath);

  if (tail === '/') {
    return `/${resolvedLocale}/t/${hostSlug}/`;
  }

  return `/${resolvedLocale}/t/${hostSlug}${tail}`;
}
