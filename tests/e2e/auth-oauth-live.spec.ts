import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

import { storageStates, tenants } from './support/auth-fixtures';

const liveEnabled = process.env.E2E_OAUTH_LIVE === 'true';

async function clickIfVisible(selector: Locator) {
  if (await selector.count()) {
    const first = selector.first();
    if (await first.isVisible()) {
      await first.click();
      return true;
    }
  }

  return false;
}

async function completeGitHubLogin(page: Page) {
  const email = process.env.E2E_GITHUB_EMAIL;
  const password = process.env.E2E_GITHUB_PASSWORD;
  test.skip(!email || !password, 'Missing GitHub live OAuth credentials.');
  if (!email || !password) return;

  if (page.url().includes('github.com/login')) {
    await page.locator('input[name="login"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();
  }

  await clickIfVisible(page.getByRole('button', { name: /authorize|continue/i }));
}

async function completeGoogleLogin(page: Page) {
  const email = process.env.E2E_GOOGLE_EMAIL;
  const password = process.env.E2E_GOOGLE_PASSWORD;
  test.skip(!email || !password, 'Missing Google live OAuth credentials.');
  if (!email || !password) return;

  if (await page.locator('input[type="email"]').count()) {
    await page.locator('input[type="email"]').fill(email);
    await page.getByRole('button', { name: /next/i }).click();
  }

  if (await page.locator('input[type="password"]').count()) {
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole('button', { name: /next/i }).click();
  }

  await clickIfVisible(page.getByRole('button', { name: /continue|allow/i }));
}

async function completeLinkedInLogin(page: Page) {
  const email = process.env.E2E_LINKEDIN_EMAIL;
  const password = process.env.E2E_LINKEDIN_PASSWORD;
  test.skip(!email || !password, 'Missing LinkedIn live OAuth credentials.');
  if (!email || !password) return;

  if (await page.locator('#username').count()) {
    await page.locator('#username').fill(email);
    await page.locator('#password').fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();
  }

  await clickIfVisible(page.getByRole('button', { name: /allow|continue/i }));
}

async function completeAuth0Login(page: Page) {
  const email = process.env.E2E_AUTH0_EMAIL;
  const password = process.env.E2E_AUTH0_PASSWORD;
  test.skip(!email || !password, 'Missing Auth0 live OAuth credentials.');
  if (!email || !password) return;

  if (await page.locator('input[type="email"]').count()) {
    await page.locator('input[type="email"]').fill(email);
    await clickIfVisible(page.getByRole('button', { name: /continue|next/i }));
  }

  if (await page.locator('input[type="password"]').count()) {
    await page.locator('input[type="password"]').fill(password);
    await clickIfVisible(page.getByRole('button', { name: /continue|log in|login/i }));
  }
}

test.describe('live oauth smoke @oauth-live', () => {
  test.skip(!liveEnabled, 'Set E2E_OAUTH_LIVE=true and provider credentials to run live OAuth smoke.');

  test.describe('external integration oauth round-trips', () => {
    test.use({ storageState: storageStates.admin });

    test('github connect round-trips back to the integration page', async ({ page }) => {
      await page.goto(
        `/api/integrations/github/connect?returnUrl=${encodeURIComponent(`/t/${tenants.primary}/admin/integrations/github`)}`,
      );
      await completeGitHubLogin(page);

      await expect(page).toHaveURL(new RegExp(`/en/t/${tenants.primary}/admin/integrations/github`), {
        timeout: 120_000,
      });
    });

    test('google workspace connect round-trips back to the integration page', async ({ page }) => {
      await page.goto(
        `/api/integrations/google-workspace/connect?returnUrl=${encodeURIComponent(`/t/${tenants.primary}/admin/integrations/google-workspace`)}`,
      );
      await completeGoogleLogin(page);

      await expect(page).toHaveURL(new RegExp(`/en/t/${tenants.primary}/admin/integrations/google-workspace`), {
        timeout: 120_000,
      });
    });

    test('linkedin connect round-trips back to the integration page', async ({ page }) => {
      await page.goto(
        `/api/integrations/linkedin/connect?returnUrl=${encodeURIComponent(`/t/${tenants.primary}/admin/integrations/linkedin`)}`,
      );
      await completeLinkedInLogin(page);

      await expect(page).toHaveURL(new RegExp(`/en/t/${tenants.primary}/admin/integrations/linkedin`), {
        timeout: 120_000,
      });
    });
  });

  test('auth0 login round-trips back into tenant resolution', async ({ page }) => {
    await page.goto('/en/login', { waitUntil: 'load' });
    await page.getByRole('button', { name: /continue with auth0/i }).click();
    await completeAuth0Login(page);

    await expect(page).toHaveURL(/\/en\/(select-tenant|t\/[^/]+$)/, { timeout: 120_000 });
  });
});
