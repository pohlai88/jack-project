import { spawnSync } from 'node:child_process';

import { loadManagedEnvConfig } from './env-config.mjs';

loadManagedEnvConfig();

const result = spawnSync('pnpm', ['exec', 'next', 'build'], {
  env: {
    ...process.env,
    SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION ?? 'true',
  },
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
