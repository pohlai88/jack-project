import { describe, expect, it } from 'vitest';

import {
  finalizeSharedCookieDomain,
  isUnsafeSharedCookieDomain,
  normalizeCookieDomainInput,
  resolveSharedCookieDomain,
} from '../auth-cookie-domain';

describe('normalizeCookieDomainInput', () => {
  it('normalizes bare hostname', () => {
    expect(normalizeCookieDomainInput('example.com')).toBe('example.com');
  });

  it('strips leading dot', () => {
    expect(normalizeCookieDomainInput('.example.com')).toBe('example.com');
  });

  it('strips scheme and port', () => {
    expect(normalizeCookieDomainInput('https://example.com:443/path')).toBe('example.com');
    expect(normalizeCookieDomainInput('http://tenant.example.com')).toBe('tenant.example.com');
  });

  it('preserves multi-label tenant apex used as cookie domain', () => {
    expect(normalizeCookieDomainInput('tenant.example.com')).toBe('tenant.example.com');
  });

  it('returns undefined for empty', () => {
    expect(normalizeCookieDomainInput('')).toBeUndefined();
    expect(normalizeCookieDomainInput('   ')).toBeUndefined();
  });
});

describe('isUnsafeSharedCookieDomain', () => {
  it('flags vercel.app and subhosts', () => {
    expect(isUnsafeSharedCookieDomain('vercel.app')).toBe(true);
    expect(isUnsafeSharedCookieDomain('my-app.vercel.app')).toBe(true);
  });

  it('flags IPv4 literals', () => {
    expect(isUnsafeSharedCookieDomain('127.0.0.1')).toBe(true);
    expect(isUnsafeSharedCookieDomain('10.0.0.1')).toBe(true);
  });

  it('flags localhost and mDNS .local but not tenant localhost hosts', () => {
    expect(isUnsafeSharedCookieDomain('machine.local')).toBe(true);
    expect(isUnsafeSharedCookieDomain('afenda.localhost')).toBe(false);
    expect(isUnsafeSharedCookieDomain('localhost')).toBe(true);
  });
});

describe('finalizeSharedCookieDomain', () => {
  it('clears unsafe hosts', () => {
    expect(finalizeSharedCookieDomain('vercel.app')).toBeUndefined();
    expect(finalizeSharedCookieDomain('127.0.0.1')).toBeUndefined();
    expect(finalizeSharedCookieDomain('localhost')).toBeUndefined();
  });

  it('keeps safe hosts', () => {
    expect(finalizeSharedCookieDomain('example.com')).toBe('example.com');
    expect(finalizeSharedCookieDomain('afenda.localhost')).toBe('afenda.localhost');
  });
});

describe('resolveSharedCookieDomain', () => {
  it('prefers AUTH_COOKIE_DOMAIN over tenant root', () => {
    expect(resolveSharedCookieDomain('https://auth.example.com', 'example.com')).toBe('auth.example.com');
  });

  it('falls back to TENANT_ROOT_DOMAIN', () => {
    expect(resolveSharedCookieDomain(undefined, 'localhost')).toBeUndefined();
  });

  it('falls back to NEXT_PUBLIC_COOKIE_DOMAIN', () => {
    expect(resolveSharedCookieDomain(undefined, undefined, 'public.example.com')).toBe('public.example.com');
  });

  it('falls back to NEXT_PUBLIC_TENANT_ROOT_DOMAIN', () => {
    expect(resolveSharedCookieDomain(undefined, undefined, undefined, 'localhost')).toBeUndefined();
  });

  it('AUTH_COOKIE_DOMAIN wins over NEXT_PUBLIC_COOKIE_DOMAIN', () => {
    expect(resolveSharedCookieDomain('a.example.com', undefined, 'b.example.com', 'c.example.com')).toBe(
      'a.example.com',
    );
  });

  it('TENANT_ROOT_DOMAIN wins over NEXT_PUBLIC_COOKIE_DOMAIN', () => {
    expect(resolveSharedCookieDomain(undefined, 'tenant.example.com', 'public.example.com')).toBe('tenant.example.com');
  });

  it('NEXT_PUBLIC_COOKIE_DOMAIN wins over NEXT_PUBLIC_TENANT_ROOT_DOMAIN', () => {
    expect(resolveSharedCookieDomain(undefined, undefined, 'cookie.example.com', 'tenant.example.com')).toBe(
      'cookie.example.com',
    );
  });

  it('returns undefined when none set', () => {
    expect(resolveSharedCookieDomain(undefined, undefined, undefined, undefined)).toBeUndefined();
  });

  it('does not emit Domain for vercel.app even if set in env chain', () => {
    expect(resolveSharedCookieDomain(undefined, undefined, 'vercel.app')).toBeUndefined();
    expect(resolveSharedCookieDomain(undefined, 'myproject.vercel.app')).toBeUndefined();
  });
});
