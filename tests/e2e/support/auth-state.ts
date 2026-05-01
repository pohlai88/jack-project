import { expect } from '@playwright/test';
import type { Browser } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

function runSeed() {
  execFileSync('node', ['scripts/with-env-config.mjs', 'tsx', 'scripts/seed-demo.ts'], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

export async function seedAuthFixtures() {
  runSeed();
}

export async function saveAuthState(
  browser: Browser,
  input: {
    storagePath: string;
    email: string;
    loginPath: string;
    successPathSuffix: string;
  },
) {
  mkdirSync(dirname(input.storagePath), { recursive: true });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(input.loginPath, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  await expect(page.getByLabel('Email')).toHaveValue(input.email);
  await page.getByRole('button', { name: /dev(?:elopment)? login/i }).click();
  await page.waitForURL((url) => url.pathname.endsWith(input.successPathSuffix), { timeout: 30_000 });

  await context.storageState({ path: input.storagePath });
  await context.close();
}
