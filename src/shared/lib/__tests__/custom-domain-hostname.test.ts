import { describe, expect, it } from 'vitest';

import { assertCustomDomainHostnameAllowed, normalizeCustomDomainHostname } from '../custom-domain-hostname';

describe('normalizeCustomDomainHostname', () => {
  it('normalizes case and strips scheme-like mistakes via trimming host segment', () => {
    expect(normalizeCustomDomainHostname('portal.EXAMPLE.com')).toBe('portal.example.com');
  });

  it('strips port', () => {
    expect(normalizeCustomDomainHostname('portal.example.com:443')).toBe('portal.example.com');
  });

  it('rejects vercel preview hosts', () => {
    expect(normalizeCustomDomainHostname('x.vercel.app')).toBeNull();
  });

  it('allows localhost-style dev hosts', () => {
    expect(normalizeCustomDomainHostname('afenda.localhost')).toBe('afenda.localhost');
  });
});

describe('assertCustomDomainHostnameAllowed', () => {
  it('blocks apex matching tenant root', () => {
    expect(assertCustomDomainHostnameAllowed('app.example.com', 'example.com')).toBeNull();
    expect(assertCustomDomainHostnameAllowed('example.com', 'example.com')).toMatch(/apex/i);
  });
});
