import { expect, test } from '@playwright/test';

const tenantSlug = process.env.E2E_TENANT_SLUG ?? 'afenda';
const adminEmail = process.env.E2E_ADMIN_EMAIL || 'admin@example.com';

const oauthProviders = [
  {
    name: 'GitHub',
    path: 'github',
    returnUrl: `/t/${tenantSlug}/admin/integrations/github`,
  },
  {
    name: 'Google Workspace',
    path: 'google-workspace',
    returnUrl: `/t/${tenantSlug}/admin/integrations/google-workspace`,
  },
  {
    name: 'LinkedIn',
    path: 'linkedin',
    returnUrl: `/t/${tenantSlug}/admin/integrations/linkedin`,
  },
];

test.describe('auth and external OAuth smoke @smoke', () => {
  test('health endpoint is available', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.ok()).toBe(true);
  });

  test('login page renders development login', async ({ page }) => {
    await page.goto('/en/login', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /welcome to afenda/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Development Login', exact: true })).toBeVisible();
  });

  test('development users panel routes admin to afenda tenant login', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('Development Mode')).toBeVisible();
    await expect(page.locator('code').filter({ hasText: new RegExp(`^${tenantSlug}$`) })).toBeVisible();

    const adminLink = page.getByRole('link', { name: /sign in as admin/i });
    const adminHref = `/en/t/${tenantSlug}/login?email=admin%40example.com`;

    await expect(adminLink).toHaveAttribute('href', adminHref);
    await page.goto(adminHref, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/en/t/${tenantSlug}/login\\?email=admin%40example\\.com$`));
    await expect(page.getByLabel('Email')).toHaveValue(adminEmail);
  });

  for (const provider of oauthProviders) {
    test(`${provider.name} connect requires authentication`, async ({ request }) => {
      const response = await request.get(
        `/api/integrations/${provider.path}/connect?returnUrl=${encodeURIComponent(provider.returnUrl)}`,
        { maxRedirects: 0, timeout: 25_000 },
      );

      expect([302, 307, 308]).toContain(response.status());
      expect(response.headers()['location']).toContain('/login');
    });
  }

  test('tenant admin integrations page requires authentication', async ({ request }) => {
    const response = await request.get(`/en/t/${tenantSlug}/admin/integrations`, {
      maxRedirects: 0,
      timeout: 10_000,
    });
    const location = response.headers()['location'] ?? '';

    expect([302, 307, 308]).toContain(response.status());
    expect(location.includes('/login') || location.includes('error=unauthorized')).toBe(true);
  });
});

test.describe('authenticated tenant admin smoke', () => {
  test('admin can reach integration pages @smoke @authenticated', async ({ page }) => {
    test.setTimeout(90_000);

    await page.goto(`/en/t/${tenantSlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();

    for (const provider of oauthProviders) {
      await page.goto(`/en${provider.returnUrl}`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await expect(page).toHaveURL(new RegExp(`/en/t/${tenantSlug}/admin/integrations/${provider.path}`));
      await expect(page.getByRole('heading', { name: provider.name })).toBeVisible();
    }
  });
});
