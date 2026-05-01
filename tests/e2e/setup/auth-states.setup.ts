import { test as setup } from '@playwright/test';

import { loginPath, storageStates, tenantLoginPath, tenants, users } from '../support/auth-fixtures';
import { saveAuthState, seedAuthFixtures } from '../support/auth-state';

setup.setTimeout(180_000);

setup('seed auth fixtures and persist login states @smoke', async ({ browser }) => {
  await seedAuthFixtures();

  await saveAuthState(browser, {
    storagePath: storageStates.admin,
    email: users.admin,
    loginPath: tenantLoginPath(tenants.primary, users.admin),
    successPathSuffix: `/t/${tenants.primary}`,
  });

  await saveAuthState(browser, {
    storagePath: storageStates.member,
    email: users.member,
    loginPath: loginPath(users.member),
    successPathSuffix: `/t/${tenants.primary}`,
  });

  await saveAuthState(browser, {
    storagePath: storageStates.multi,
    email: users.multi,
    loginPath: loginPath(users.multi),
    successPathSuffix: '/select-tenant',
  });

  await saveAuthState(browser, {
    storagePath: storageStates.tenantless,
    email: users.tenantless,
    loginPath: loginPath(users.tenantless),
    successPathSuffix: '/select-tenant',
  });

  await saveAuthState(browser, {
    storagePath: storageStates.invitee,
    email: users.invitee,
    loginPath: loginPath(users.invitee),
    successPathSuffix: '/select-tenant',
  });

  await saveAuthState(browser, {
    storagePath: storageStates.wrongEmail,
    email: users.wrongEmail,
    loginPath: loginPath(users.wrongEmail),
    successPathSuffix: '/select-tenant',
  });
});
