import { expect, test } from '@playwright/test';

import { loginPath, storageStates, tenantLoginPath, tenantPath, tenants, users } from './support/auth-fixtures';

test.describe('auth login lifecycle @auth @critical', () => {
  test('global login sends a single-tenant user to their dashboard', async ({ page }) => {
    await page.goto(loginPath(users.member), { waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    await expect(page.getByLabel('Email')).toHaveValue(users.member);

    await page.getByRole('button', { name: 'Development Login', exact: true }).click();

    await expect(page).toHaveURL(new RegExp(`/en/t/${tenants.primary}$`), { timeout: 30_000 });
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });

  test('global login sends a multi-tenant user to tenant selection', async ({ page }) => {
    await page.goto(loginPath(users.multi), { waitUntil: 'load' });
    await expect(page.getByLabel('Email')).toHaveValue(users.multi);

    await page.getByRole('button', { name: 'Development Login', exact: true }).click();

    await expect(page).toHaveURL(/\/en\/select-tenant$/);
    await expect(page.getByRole('heading', { name: 'Select Organization' })).toBeVisible();
    await expect(page.getByRole('link', { name: tenants.primary })).toBeVisible();
    await expect(page.getByRole('link', { name: tenants.secondary })).toBeVisible();
  });

  test('global login sends a tenantless user to the no-organizations state', async ({ page }) => {
    await page.goto(loginPath(users.tenantless), { waitUntil: 'load' });
    await expect(page.getByLabel('Email')).toHaveValue(users.tenantless);

    await page.getByRole('button', { name: 'Development Login', exact: true }).click();

    await expect(page).toHaveURL(/\/en\/select-tenant$/);
    await expect(page.getByRole('heading', { name: 'No Organizations' })).toBeVisible();
    await expect(page.getByText(users.tenantless)).toBeVisible();
  });

  test('tenant login returns 404 for an unknown tenant', async ({ request }) => {
    const response = await request.get(tenantLoginPath('missing-tenant'));

    expect(response.status()).toBe(404);
  });
});

test.describe('authenticated single-tenant login branches @auth @authenticated', () => {
  test.use({ storageState: storageStates.member });

  test('authenticated member visiting global login is redirected to their tenant', async ({ page }) => {
    await page.goto(loginPath(), { waitUntil: 'load' });

    await expect(page).toHaveURL(new RegExp(`/en/t/${tenants.primary}$`));
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });

  test('authenticated member revisiting tenant login is redirected to their tenant', async ({ page }) => {
    await page.goto(tenantLoginPath(tenants.primary), { waitUntil: 'load' });

    await expect(page).toHaveURL(new RegExp(`/en/t/${tenants.primary}$`));
  });

  test('authenticated member without admin access is redirected out of admin routes', async ({ page }) => {
    await page.goto(`${tenantPath(tenants.primary)}/admin`, { waitUntil: 'load' });

    await expect(page).toHaveURL(new RegExp(`/en/t/${tenants.primary}\\?error=unauthorized$`));
  });

  test('authenticated member without access to another tenant sees access required', async ({ page }) => {
    await page.goto(tenantLoginPath(tenants.secondary), { waitUntil: 'load' });

    await expect(page.getByRole('heading', { name: 'Access Required' })).toBeVisible();
    await expect(page.getByText(users.member)).toBeVisible();
  });
});

test.describe('authenticated tenant admin session lifecycle @auth @critical @authenticated', () => {
  test.use({ storageState: storageStates.admin });

  test('sign out returns to public pages and revokes tenant access', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'load' });
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Toggle theme' })).toBeVisible();

    const signOutRequest = page.waitForResponse(
      (response) => response.url().includes('/api/auth/signout') && response.request().method() === 'POST',
    );

    await page.getByRole('button', { name: 'Sign Out' }).click();
    await signOutRequest;
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Out' })).toHaveCount(0);

    await expect
      .poll(async () => {
        const cookies = await page.context().cookies();
        return cookies.some((cookie) => cookie.name.includes('session-token'));
      })
      .toBe(false);

    await page.goto(`${tenantPath(tenants.primary)}/admin/integrations`, { waitUntil: 'load' });
    await expect(page).toHaveURL(new RegExp(`/en/t/${tenants.primary}/login$`));
  });
});
