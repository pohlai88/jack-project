import { expect, test } from '@playwright/test';

import { invitePath, inviteTokens, storageStates, tenants, users } from './support/auth-fixtures';

test.describe('invite acceptance lifecycle @auth @critical', () => {
  test('unauthenticated invite entry preserves callback and lands in onboarding after login', async ({ page }) => {
    await page.goto(invitePath(tenants.primary, inviteTokens.active), { waitUntil: 'load' });

    await expect(page).toHaveURL(new RegExp('/en/login'));
    await expect(page.getByLabel('Email')).toHaveValue(users.invitee);

    await page.getByRole('button', { name: 'Development Login', exact: true }).click();

    await expect(page).toHaveURL(
      new RegExp(`/en/t/${tenants.primary}/(onboarding/cv|profile/settings\\?onboarding=1)$`),
      {
        timeout: 30_000,
      },
    );
  });
});

test.describe('invite acceptance for existing members @auth @authenticated', () => {
  test.use({ storageState: storageStates.member });

  test('already-member invites still complete successfully', async ({ page }) => {
    await page.goto(invitePath(tenants.primary, inviteTokens.alreadyMember), { waitUntil: 'load' });

    await expect(page).toHaveURL(
      new RegExp(`/en/t/${tenants.primary}/(onboarding/cv|profile/settings\\?onboarding=1)$`),
      {
        timeout: 30_000,
      },
    );
  });
});

test.describe('invite validation failures @auth', () => {
  test('invalid invite tokens are rejected', async ({ page }) => {
    await page.goto(invitePath(tenants.primary, inviteTokens.invalid), { waitUntil: 'load' });

    await expect(page.getByText('Invalid Invitation', { exact: true })).toBeVisible();
  });

  test('expired invite tokens are rejected', async ({ page }) => {
    await page.goto(invitePath(tenants.primary, inviteTokens.expired), { waitUntil: 'load' });

    await expect(page.getByText('Invalid Invitation')).toBeVisible();
    await expect(page.getByText('This invitation has expired')).toBeVisible();
  });

  test('revoked invite tokens are rejected', async ({ page }) => {
    await page.goto(invitePath(tenants.primary, inviteTokens.revoked), { waitUntil: 'load' });

    await expect(page.getByText('Invalid Invitation')).toBeVisible();
    await expect(page.getByText('This invitation has already been revoked')).toBeVisible();
  });
});

test.describe('invite email mismatch handling @auth @authenticated', () => {
  test.use({ storageState: storageStates.wrongEmail });

  test('signed-in users with the wrong email are blocked from accepting the invite', async ({ page }) => {
    await page.goto(invitePath(tenants.primary, inviteTokens.mismatch), { waitUntil: 'load' });

    await expect(page.getByText('Email Mismatch')).toBeVisible();
    await expect(page.getByText(users.invitee)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign Out & Try Again' })).toBeVisible();
  });
});
