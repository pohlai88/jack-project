/**
 * Run Tolgee CLI with Afenda-managed env (env.config → process.env via loadManagedEnvConfig).
 * API key: `TOLGEE_API_KEY` (never commit). Cloud defaults apply; optional `TOLGEE_PROJECT_ID` / `TOLGEE_API_URL` when tooling needs them — see `tolgee.config.cjs`.
 *
 * Usage:
 *   pnpm i18n:tolgee:cli -- pull
 *   pnpm i18n:tolgee:cli -- pull --languages zh-CN
 *   pnpm i18n:tolgee:cli -- --help
 *
 * @see https://docs.tolgee.io/tolgee-cli
 */

import { spawnSync } from 'node:child_process';

import { loadTolgeeEnv } from './tolgee-load-env.mjs';

loadTolgeeEnv();

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: pnpm i18n:tolgee:cli -- <tolgee-subcommand> [options]');
  console.error('Examples:');
  console.error('  pnpm i18n:tolgee:cli -- pull');
  console.error('  pnpm i18n:tolgee:cli -- --help');
  process.exit(1);
}

const result = spawnSync('pnpm', ['exec', 'tolgee', ...args], {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
