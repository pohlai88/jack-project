import { spawnSync } from 'node:child_process';

import { loadManagedEnvConfig } from './env-config.mjs';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node scripts/with-env-config.mjs <command> [...args]');
  process.exit(1);
}

loadManagedEnvConfig();

const [command, ...commandArgs] = args;

const result = spawnSync(command, commandArgs, {
  env: process.env,
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
