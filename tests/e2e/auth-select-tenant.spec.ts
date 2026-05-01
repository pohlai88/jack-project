import { expect, test } from '@playwright/test';

import { storageStates, tenantPath, tenants } from './support/auth-fixtures';

test.describe('select-tenant branches for a single membership @auth @authenticated', () => {
  test.use({ storageState: storageStates.member });

  test('single-membership users are redirected from select-tenant to their tenant', async ({ page }) => {
    await page.goto('/en/select-tenant', { waitUntil: 'load' });

    await expect(page).toHaveURL(new RegExp(`/en/t/${tenants.primary}$`));
  });
});

test.describe('select-tenant branches for multiple memberships @auth @critical @authenticated', () => {
  test.use({ storageState: storageStates.multi });

  test('multi-tenant users can choose a workspace from the selector', async ({ page }) => {
    await page.goto('/en/select-tenant', { waitUntil: 'load' });

    await expect(page.getByRole('heading', { name: 'Select Organization' })).toBeVisible();
    await expect(page.getByText(tenants.primary)).toBeVisible();
    await expect(page.getByText(tenants.secondary)).toBeVisible();

    await page.getByRole('link', { name: new RegExp(tenants.secondary, 'i') }).click();

    await expect(page).toHaveURL(new RegExp(`/en/t/${tenants.secondary}$`));
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });
});

test.describe('select-tenant branches with no memberships @auth @authenticated', () => {
  test.use({ storageState: storageStates.tenantless });

  test('tenantless users see the no-organizations state when self-service is disabled', async ({ page }) => {
    test.skip(
      process.env.ENABLE_SELF_SERVICE_TENANT_CREATE === 'true',
      'Self-service create is enabled in this environment.',
    );

    await page.goto('/en/select-tenant', { waitUntil: 'load' });

    await expect(page.getByRole('heading', { name: 'No Organizations' })).toBeVisible();
    await expect(page.getByText('Ask your organization admin to send you an invitation link.')).toBeVisible();
  });

  test('tenantless users can create their first organization when self-service is enabled', async ({ page }) => {
    test.skip(
      process.env.ENABLE_SELF_SERVICE_TENANT_CREATE !== 'true',
      'Self-service create is disabled in this environment.',
    );

    const uniqueSlug = `e2e-auth-${Date.now()}`;

    await page.goto('/en/select-tenant', { waitUntil: 'load' });

    await expect(page.getByRole('heading', { name: 'Create your organization' })).toBeVisible();

    await page.getByLabel('Organization name').fill('E2E Auth Organization');
    await page.getByLabel('URL slug').fill(uniqueSlug);
    await page.getByRole('button', { name: 'Create organization' }).click();

    await expect(page).toHaveURL(new RegExp(`/en/t/${uniqueSlug}/profile/settings\\?onboarding=1$`));
    await page.goto(tenantPath(uniqueSlug), { waitUntil: 'load' });
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  });
});
