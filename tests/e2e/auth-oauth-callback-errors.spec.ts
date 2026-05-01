import { expect, test } from '@playwright/test';

import { storageStates, tenants } from './support/auth-fixtures';

const providerConfigs = {
  github: Boolean(process.env.GITHUB_INTEGRATION_CLIENT_ID && process.env.GITHUB_INTEGRATION_CLIENT_SECRET),
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  linkedin: Boolean(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
} as const;

function buildState(state: Record<string, string>) {
  return Buffer.from(JSON.stringify(state), 'utf-8').toString('base64url');
}

test.describe('oauth connect access control @auth @authenticated', () => {
  test.use({ storageState: storageStates.member });

  for (const provider of ['github', 'google-workspace', 'linkedin'] as const) {
    test(`${provider} admin connect is forbidden for non-admin users`, async ({ request }) => {
      const response = await request.get(
        `/api/integrations/${provider}/connect?returnUrl=${encodeURIComponent(`/t/${tenants.primary}/admin/integrations/${provider}`)}`,
        { maxRedirects: 0 },
      );

      expect(response.status()).toBe(403);
    });
  }
});

test.describe('oauth callback error handling @auth @authenticated', () => {
  test.use({ storageState: storageStates.admin });

  test('github connect rejects unsafe return URLs without tenant context', async ({ request }) => {
    test.skip(!providerConfigs.github, 'GitHub OAuth is not configured in this environment.');

    const response = await request.get('/api/integrations/github/connect?returnUrl=//evil.example/escape', {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(403);
  });

  test('google workspace connect rejects unsafe return URLs without tenant context', async ({ request }) => {
    test.skip(!providerConfigs.google, 'Google Workspace OAuth is not configured in this environment.');

    const response = await request.get('/api/integrations/google-workspace/connect?returnUrl=//evil.example/escape', {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(403);
  });

  test('linkedin connect rejects unsafe return URLs without tenant context', async ({ request }) => {
    test.skip(!providerConfigs.linkedin, 'LinkedIn OAuth is not configured in this environment.');

    const response = await request.get('/api/integrations/linkedin/connect?returnUrl=//evil.example/escape', {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(403);
  });

  test('github callback reports missing code errors', async ({ request }) => {
    const returnUrl = `/t/${tenants.primary}/admin/integrations/github`;
    const response = await request.get(
      `/api/integrations/github/callback?state=${buildState({ returnUrl, tenantSlug: tenants.primary, type: 'admin' })}`,
      { maxRedirects: 0 },
    );

    expect([302, 307, 308]).toContain(response.status());
    expect(response.headers().location).toContain(`${returnUrl}?error=github_missing_code`);
  });

  test('google workspace callback reports missing code errors', async ({ request }) => {
    const returnUrl = `/t/${tenants.primary}/admin/integrations/google-workspace`;
    const response = await request.get(
      `/api/integrations/google-workspace/callback?state=${buildState({ returnUrl, tenantSlug: tenants.primary })}`,
      { maxRedirects: 0 },
    );

    expect([302, 307, 308]).toContain(response.status());
    expect(response.headers().location).toContain(`${returnUrl}?error=google_missing_code`);
  });

  test('linkedin callback reports missing code errors', async ({ request }) => {
    const returnUrl = `/t/${tenants.primary}/admin/integrations/linkedin`;
    const response = await request.get(
      `/api/integrations/linkedin/callback?state=${buildState({ returnUrl, tenantSlug: tenants.primary })}`,
      { maxRedirects: 0 },
    );

    expect([302, 307, 308]).toContain(response.status());
    expect(response.headers().location).toContain(`${returnUrl}?error=linkedin_missing_code`);
  });

  test('github callback reports not-configured errors when credentials are absent', async ({ request }) => {
    test.skip(providerConfigs.github, 'GitHub OAuth is configured in this environment.');

    const response = await request.get(
      `/api/integrations/github/callback?code=dummy&state=${buildState({ returnUrl: '/select-tenant', tenantSlug: tenants.primary, type: 'admin' })}`,
      { maxRedirects: 0 },
    );

    expect(response.headers().location).toContain('/select-tenant?error=github_not_configured');
  });

  test('google workspace callback reports not-configured errors when credentials are absent', async ({ request }) => {
    test.skip(providerConfigs.google, 'Google Workspace OAuth is configured in this environment.');

    const response = await request.get(
      `/api/integrations/google-workspace/callback?code=dummy&state=${buildState({ returnUrl: '/select-tenant', tenantSlug: tenants.primary })}`,
      { maxRedirects: 0 },
    );

    expect(response.headers().location).toContain('/select-tenant?error=google_not_configured');
  });

  test('linkedin callback reports not-configured errors when credentials are absent', async ({ request }) => {
    test.skip(providerConfigs.linkedin, 'LinkedIn OAuth is configured in this environment.');

    const response = await request.get(
      `/api/integrations/linkedin/callback?code=dummy&state=${buildState({ returnUrl: '/select-tenant', tenantSlug: tenants.primary })}`,
      { maxRedirects: 0 },
    );

    expect(response.headers().location).toContain('/select-tenant?error=linkedin_not_configured');
  });
});
