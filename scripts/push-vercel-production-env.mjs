/**
 * Push production env vars to Vercel from local env.config.
 *
 * Applies production URL/host overrides (nexuscanon.com) so deploy matches
 * env.config.example "Production — nexuscanon.com".
 *
 * Usage: pnpm vercel:env:push-production
 *
 * Requires: `vercel login`, linked project (pnpm vercel:link), scope jacks-projects-7b3cfe94.
 */

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

import { readEnvConfig } from './env-config.mjs';
import {
  mergeProductionEnv,
  PRODUCTION_OPTIONAL_KEYS,
  PRODUCTION_REQUIRED_KEYS,
  PRODUCTION_SENSITIVE_KEYS,
  VERCEL_SCOPE,
} from './production-env-plan.mjs';
import { printVercelProductionReport } from './production-env-report.mjs';

const require = createRequire(import.meta.url);
const VC_CLI = require.resolve('vercel/dist/vc.js');

/**
 * Spawn `node vercel/dist/vc.js` (no shell) so PostgreSQL URLs with `&` are not mangled by cmd.exe.
 */
function addEnv(name, value, { sensitive }) {
  const args = [VC_CLI, 'env', 'add', name, 'production', '--yes', '--scope', VERCEL_SCOPE, '--force'];
  if (sensitive) {
    args.push('--sensitive');
  } else {
    args.push('--no-sensitive');
  }
  args.push('--value', value);

  const result = spawnSync(process.execPath, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
    cwd: process.cwd(),
    windowsHide: true,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout || '');
    throw new Error(`vercel env add ${name} failed with exit ${result.status}`);
  }

  process.stdout.write(result.stdout || '');
}

function main() {
  const envConfig = readEnvConfig();

  if (!envConfig) {
    console.error('Missing env.config. Copy from env.config.example and fill values.');
    process.exit(1);
  }

  const src = mergeProductionEnv(envConfig.values);

  const missing = PRODUCTION_REQUIRED_KEYS.filter((k) => {
    const v = src[k];
    return v === undefined || String(v).trim() === '';
  });

  if (missing.length) {
    console.error(`Missing required keys in env.config (after overrides): ${missing.join(', ')}`);
    process.exit(1);
  }

  if (String(src.AUTH_SECRET).length < 32) {
    console.error('AUTH_SECRET must be at least 32 characters for production.');
    process.exit(1);
  }

  const keys = [...PRODUCTION_REQUIRED_KEYS];
  for (const k of PRODUCTION_OPTIONAL_KEYS) {
    const v = src[k];
    if (v !== undefined && String(v).trim() !== '') {
      keys.push(k);
    }
  }

  console.log(`Pushing ${keys.length} variables to Vercel Production (scope ${VERCEL_SCOPE})…`);

  for (const key of keys) {
    const value = String(src[key]);
    const sensitive = PRODUCTION_SENSITIVE_KEYS.has(key);
    process.stdout.write(`  + ${key}${sensitive ? ' (sensitive)' : ''}\n`);
    addEnv(key, value, { sensitive });
  }

  console.log('Done.\n');
  printVercelProductionReport(envConfig.values);
  console.log('List: pnpm vercel:env:production');
}

main();
