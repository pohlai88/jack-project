import { describe, expect, it } from 'vitest';

import { defaultLocale, locales } from '@/i18n/config';
import { buildLocaleCookie, resolveLocaleCookie } from '@/i18n/locale-cookie';

import {
  buildTenantHostRewritePathname,
  parseTenantSubdomainSlugFromHost,
  pickLocaleFromAcceptLanguage,
  resolveTenantSlugFromIncomingRequest,
  stripLeadingLocaleSegment,
  stripLeadingTenantPathPrefix,
} from '../tenant-subdomain-host';

/** Mirrors `src/proxy.ts` subdomain branch locale + rewrite (pure helpers only). */
function rewritePathForSubdomainHost(input: {
  host: string;
  pathname: string;
  tenantRootDomain: string;
  cookieHeader: string | undefined;
  acceptLanguage: string | null | undefined;
}) {
  const incoming = resolveTenantSlugFromIncomingRequest({
    host: input.host,
    pathname: input.pathname,
    tenantRootDomain: input.tenantRootDomain,
    locales,
  });
  const hostSlug = incoming.source === 'subdomain' && incoming.slug ? incoming.slug : null;
  if (!hostSlug)
    return {
      hostSlug: null as string | null,
      newPathname: null as string | null,
      resolvedLocale: null as string | null,
    };

  const cookieLocale = resolveLocaleCookie(input.cookieHeader);
  const resolvedLocale = cookieLocale ?? pickLocaleFromAcceptLanguage(input.acceptLanguage, locales, defaultLocale);
  const newPathname = buildTenantHostRewritePathname({
    hostSlug,
    pathname: input.pathname,
    locales,
    resolvedLocale,
  });

  return {
    hostSlug,
    resolvedLocale,
    newPathname: newPathname !== input.pathname ? newPathname : null,
  };
}

describe('parseTenantSubdomainSlugFromHost', () => {
  it('returns slug for tenant root domain', () => {
    expect(parseTenantSubdomainSlugFromHost('acme.example.com', 'example.com')).toBe('acme');
  });

  it('returns null for apex and www', () => {
    expect(parseTenantSubdomainSlugFromHost('example.com', 'example.com')).toBeNull();
    expect(parseTenantSubdomainSlugFromHost('www.example.com', 'example.com')).toBeNull();
  });

  it('returns null for vercel preview host', () => {
    expect(parseTenantSubdomainSlugFromHost('myapp-git-main-foo.vercel.app', 'example.com')).toBeNull();
  });

  it('strips port', () => {
    expect(parseTenantSubdomainSlugFromHost('acme.localhost:3000', 'localhost')).toBe('acme');
  });

  it('returns null when root unset', () => {
    expect(parseTenantSubdomainSlugFromHost('acme.example.com', undefined)).toBeNull();
  });

  it('rejects nested subdomain labels', () => {
    expect(parseTenantSubdomainSlugFromHost('a.b.example.com', 'example.com')).toBeNull();
  });

  it('normalizes uppercase host and root', () => {
    expect(parseTenantSubdomainSlugFromHost('ACME.EXAMPLE.COM', 'EXAMPLE.COM')).toBe('acme');
  });

  it('accepts root domain with scheme in config', () => {
    expect(parseTenantSubdomainSlugFromHost('acme.example.com', 'https://example.com')).toBe('acme');
  });

  it('accepts root domain with trailing slash in config', () => {
    expect(parseTenantSubdomainSlugFromHost('acme.example.com', 'example.com/')).toBe('acme');
  });

  it('returns single-label slug when not www', () => {
    expect(parseTenantSubdomainSlugFromHost('x.example.com', 'example.com')).toBe('x');
  });
});

describe('resolveTenantSlugFromIncomingRequest', () => {
  const locales = ['en', 'es'] as const;

  it('prefers subdomain over path when both present', () => {
    expect(
      resolveTenantSlugFromIncomingRequest({
        host: 'acme.example.com',
        pathname: '/en/t/other/dashboard',
        tenantRootDomain: 'example.com',
        locales,
      }),
    ).toEqual({ slug: 'acme', source: 'subdomain' });
  });

  it('resolves from path when no tenant host', () => {
    expect(
      resolveTenantSlugFromIncomingRequest({
        host: 'example.com',
        pathname: '/en/t/acme/settings',
        tenantRootDomain: 'example.com',
        locales,
      }),
    ).toEqual({ slug: 'acme', source: 'path' });
  });

  it('resolves path tenant without locale prefix', () => {
    expect(
      resolveTenantSlugFromIncomingRequest({
        host: 'example.com',
        pathname: '/t/acme',
        tenantRootDomain: 'example.com',
        locales,
      }),
    ).toEqual({ slug: 'acme', source: 'path' });
  });

  it('returns null when neither applies', () => {
    expect(
      resolveTenantSlugFromIncomingRequest({
        host: 'example.com',
        pathname: '/en/about',
        tenantRootDomain: 'example.com',
        locales,
      }),
    ).toEqual({ slug: null, source: null });
  });

  it('treats empty host like missing tenant host and still resolves path tenant', () => {
    expect(
      resolveTenantSlugFromIncomingRequest({
        host: '',
        pathname: '/en/t/acme',
        tenantRootDomain: 'example.com',
        locales,
      }),
    ).toEqual({ slug: 'acme', source: 'path' });
  });

  it('returns null slug when host is unrelated and path has no /t/', () => {
    expect(
      resolveTenantSlugFromIncomingRequest({
        host: 'other.com',
        pathname: '/en/about',
        tenantRootDomain: 'example.com',
        locales,
      }),
    ).toEqual({ slug: null, source: null });
  });
});

describe('stripLeadingLocaleSegment', () => {
  it('strips known locale', () => {
    expect(stripLeadingLocaleSegment('/en/t/acme', ['en', 'es'])).toEqual({
      localeFromPath: 'en',
      restPath: '/t/acme',
    });
  });

  it('returns null locale when missing', () => {
    expect(stripLeadingLocaleSegment('/t/acme', ['en'])).toEqual({
      localeFromPath: null,
      restPath: '/t/acme',
    });
  });
});

describe('stripLeadingTenantPathPrefix', () => {
  it('removes /t/slug prefix', () => {
    expect(stripLeadingTenantPathPrefix('/t/wrong/dashboard')).toBe('/dashboard');
    expect(stripLeadingTenantPathPrefix('/t/acme')).toBe('/');
  });

  it('leaves path without tenant prefix', () => {
    expect(stripLeadingTenantPathPrefix('/skills')).toBe('/skills');
  });
});

describe('pickLocaleFromAcceptLanguage', () => {
  it('respects exact tag', () => {
    expect(pickLocaleFromAcceptLanguage('zh-CN,en;q=0.9', ['en', 'zh-CN'], 'en')).toBe('zh-CN');
  });

  it('falls back', () => {
    expect(pickLocaleFromAcceptLanguage(undefined, ['en', 'es'], 'en')).toBe('en');
  });
});

describe('buildTenantHostRewritePathname', () => {
  it('builds home path', () => {
    expect(
      buildTenantHostRewritePathname({
        hostSlug: 'acme',
        pathname: '/',
        locales: ['en', 'es'],
        resolvedLocale: 'en',
      }),
    ).toBe('/en/t/acme/');
  });

  it('rewrites path under tenant host', () => {
    expect(
      buildTenantHostRewritePathname({
        hostSlug: 'acme',
        pathname: '/skills',
        locales: ['en', 'es'],
        resolvedLocale: 'en',
      }),
    ).toBe('/en/t/acme/skills');
  });

  it('replaces conflicting path tenant with host slug', () => {
    expect(
      buildTenantHostRewritePathname({
        hostSlug: 'acme',
        pathname: '/en/t/other/page',
        locales: ['en', 'es'],
        resolvedLocale: 'en',
      }),
    ).toBe('/en/t/acme/page');
  });

  it('builds tenant home when pathname is only a locale prefix', () => {
    expect(
      buildTenantHostRewritePathname({
        hostSlug: 'acme',
        pathname: '/en',
        locales: ['en', 'es'],
        resolvedLocale: 'en',
      }),
    ).toBe('/en/t/acme/');
  });

  it('normalizes tenant-only path to home under host slug', () => {
    expect(
      buildTenantHostRewritePathname({
        hostSlug: 'acme',
        pathname: '/en/t/other/',
        locales: ['en', 'es'],
        resolvedLocale: 'en',
      }),
    ).toBe('/en/t/acme/');
  });
});

describe('proxy-aligned locale chain (matches src/proxy.ts subdomain branch)', () => {
  const tenantRoot = 'example.com';

  it('uses NEXT_LOCALE cookie over Accept-Language when both present', () => {
    const cookieHeader = buildLocaleCookie('vi');
    const out = rewritePathForSubdomainHost({
      host: 'acme.example.com',
      pathname: '/pricing',
      tenantRootDomain: tenantRoot,
      cookieHeader,
      acceptLanguage: 'en-US,en;q=0.9',
    });
    expect(out.hostSlug).toBe('acme');
    expect(out.resolvedLocale).toBe('vi');
    expect(out.newPathname).toBe('/vi/t/acme/pricing');
  });

  it('uses Accept-Language when cookie absent', () => {
    const out = rewritePathForSubdomainHost({
      host: 'acme.example.com',
      pathname: '/app',
      tenantRootDomain: tenantRoot,
      cookieHeader: undefined,
      acceptLanguage: 'vi,en;q=0.8',
    });
    expect(out.resolvedLocale).toBe('vi');
    expect(out.newPathname).toBe('/vi/t/acme/app');
  });

  it('uses defaultLocale when cookie and Accept-Language do not select a locale', () => {
    const out = rewritePathForSubdomainHost({
      host: 'acme.example.com',
      pathname: '/',
      tenantRootDomain: tenantRoot,
      cookieHeader: undefined,
      acceptLanguage: undefined,
    });
    expect(out.resolvedLocale).toBe(defaultLocale);
    expect(out.newPathname).toBe(`/${defaultLocale}/t/acme/`);
  });

  it('cookie locale wins over locale prefix in pathname when rewriting', () => {
    const cookieHeader = buildLocaleCookie('es');
    const out = rewritePathForSubdomainHost({
      host: 'acme.example.com',
      pathname: '/en/dashboard',
      tenantRootDomain: tenantRoot,
      cookieHeader,
      acceptLanguage: 'en',
    });
    expect(out.resolvedLocale).toBe('es');
    expect(out.newPathname).toBe('/es/t/acme/dashboard');
  });

  it('rewrites path tenant to host slug using resolved locale', () => {
    const out = rewritePathForSubdomainHost({
      host: 'acme.example.com',
      pathname: '/en/t/other/page',
      tenantRootDomain: tenantRoot,
      cookieHeader: undefined,
      acceptLanguage: 'en',
    });
    expect(out.resolvedLocale).toBe('en');
    expect(out.newPathname).toBe('/en/t/acme/page');
  });

  it('returns no rewrite when not a tenant subdomain', () => {
    const out = rewritePathForSubdomainHost({
      host: 'example.com',
      pathname: '/en/t/acme',
      tenantRootDomain: tenantRoot,
      cookieHeader: undefined,
      acceptLanguage: 'en',
    });
    expect(out.hostSlug).toBeNull();
    expect(out.newPathname).toBeNull();
  });
});
