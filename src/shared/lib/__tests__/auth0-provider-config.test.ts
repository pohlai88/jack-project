import { describe, expect, it } from 'vitest';

import { isAuth0ProviderConfigured, resolveAuth0IssuerUrl } from '@/shared/lib/auth0-provider-config';

describe('auth0 provider config', () => {
  it('uses explicit issuer first', () => {
    expect(
      resolveAuth0IssuerUrl({
        AUTH0_ISSUER: 'https://issuer.example.com/',
        AUTH0_DOMAIN: 'tenant.example.com',
      }),
    ).toBe('https://issuer.example.com');
  });

  it('derives issuer from Auth0 quickstart domain', () => {
    expect(resolveAuth0IssuerUrl({ AUTH0_DOMAIN: 'dev-example.us.auth0.com' })).toBe(
      'https://dev-example.us.auth0.com',
    );
  });

  it('normalizes a domain that includes a scheme', () => {
    expect(resolveAuth0IssuerUrl({ AUTH0_DOMAIN: 'https://dev-example.us.auth0.com/' })).toBe(
      'https://dev-example.us.auth0.com',
    );
  });

  it('requires credentials plus an issuer source', () => {
    expect(
      isAuth0ProviderConfigured({
        AUTH0_CLIENT_ID: 'client-id',
        AUTH0_CLIENT_SECRET: 'client-secret',
        AUTH0_DOMAIN: 'dev-example.us.auth0.com',
      }),
    ).toBe(true);

    expect(
      isAuth0ProviderConfigured({
        AUTH0_CLIENT_ID: 'client-id',
        AUTH0_CLIENT_SECRET: 'client-secret',
      }),
    ).toBe(false);
  });
});
