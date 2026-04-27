import { describe, expect, it } from 'vitest';

import {
  buildTenantHostRewritePathname,
  parseTenantSubdomainSlugFromHost,
  pickLocaleFromAcceptLanguage,
  stripLeadingLocaleSegment,
  stripLeadingTenantPathPrefix,
} from '../tenant-subdomain-host';

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
});
