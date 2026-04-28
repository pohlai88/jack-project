/**
 * Human-readable production env readiness (local merged preview vs Vercel Production keys).
 */

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

import {
  analyzeProductionReadiness,
  keysExpectedOnVercelAfterPush,
  mergeProductionEnv,
  PRODUCTION_REQUIRED_KEYS,
  VERCEL_SCOPE,
} from './production-env-plan.mjs';

const require = createRequire(import.meta.url);
const VC_CLI = require.resolve('vercel/dist/vc.js');

function fmtList(items) {
  return items.length ? items.join(', ') : '(none)';
}

const OPTIONAL_PREVIEW_MAX = 12;

function fmtOptionalAbsent(items) {
  if (items.length === 0) {
    return '(none)';
  }
  if (items.length <= OPTIONAL_PREVIEW_MAX) {
    return items.join(', ');
  }
  const head = items.slice(0, OPTIONAL_PREVIEW_MAX).join(', ');
  return `${head}, … (+${items.length - OPTIONAL_PREVIEW_MAX} more — see scripts/production-env-plan.mjs)`;
}

/**
 * After `env:sync` — shows what the generated `.env.production` satisfies vs gaps.
 * @param {Record<string, string | undefined>} envConfigValues
 */
export function printLocalProductionReport(envConfigValues, { prefix = '[env:sync]' } = {}) {
  const merged = mergeProductionEnv(envConfigValues);
  const { missingRequired, presentOptional, absentOptional } = analyzeProductionReadiness(merged);

  console.log(`${prefix} Production preview (.env.production)`);
  console.log(`${prefix}   Required keys: ${missingRequired.length === 0 ? 'complete' : 'INCOMPLETE'}`);
  if (missingRequired.length) {
    console.log(`${prefix}   Missing required: ${fmtList(missingRequired)}`);
  }
  console.log(`${prefix}   Optional set locally: ${fmtList(presentOptional)}`);
  console.log(
    `${prefix}   Optional not set (${absentOptional.length}, ok if unused): ${fmtOptionalAbsent(absentOptional)}`,
  );

  const authSecret = merged.AUTH_SECRET ?? '';
  if (authSecret.length > 0 && authSecret.length < 32) {
    console.warn(`${prefix}   WARN: AUTH_SECRET is under 32 characters — production validation will fail.`);
  }

  const routingOn = merged.ENABLE_CUSTOM_DOMAIN_ROUTING === 'true';
  const middlewareSecret = merged.MIDDLEWARE_TENANT_LOOKUP_SECRET?.trim();
  if (routingOn && (!middlewareSecret || middlewareSecret.length < 32)) {
    console.warn(
      `${prefix}   WARN: ENABLE_CUSTOM_DOMAIN_ROUTING=true but MIDDLEWARE_TENANT_LOOKUP_SECRET is missing or <32 chars.`,
    );
  }
}

function fetchVercelProductionKeys() {
  const result = spawnSync(
    process.execPath,
    [VC_CLI, 'env', 'ls', 'production', '--format', 'json', '--scope', VERCEL_SCOPE],
    {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      cwd: process.cwd(),
      windowsHide: true,
    },
  );

  if (result.error) {
    return { ok: false, error: result.error.message, keys: /** @type {string[]} */ ([]) };
  }

  if (result.status !== 0) {
    const msg = (result.stderr || result.stdout || '').trim() || `exit ${result.status}`;
    return { ok: false, error: msg, keys: [] };
  }

  try {
    const parsed = JSON.parse(result.stdout);
    const keys = Array.isArray(parsed.envs) ? parsed.envs.map((e) => e.key).filter(Boolean) : [];
    return { ok: true, error: null, keys };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e), keys: [] };
  }
}

/**
 * Compare Vercel Production env keys to the plan derived from env.config.
 * @param {Record<string, string | undefined>} envConfigValues
 */
export function printVercelProductionReport(envConfigValues, { prefix = '[vercel:env]' } = {}) {
  const merged = mergeProductionEnv(envConfigValues);
  const expected = new Set(keysExpectedOnVercelAfterPush(merged));
  const remote = fetchVercelProductionKeys();

  console.log(`${prefix} Vercel Production (scope ${VERCEL_SCOPE}) vs push plan`);

  if (!remote.ok) {
    console.warn(`${prefix}   Could not list Vercel env: ${remote.error}`);
    console.warn(`${prefix}   Run \`vercel login\` and \`pnpm vercel:link\`, then retry.`);
    printExpectedOnly(expected, prefix);
    return;
  }

  const remoteSet = new Set(remote.keys);
  const missingOnVercel = [...expected].filter((k) => !remoteSet.has(k));
  const extraOnVercel = [...remoteSet].filter((k) => !expected.has(k));

  console.log(`${prefix}   Expected keys (after merge): ${expected.size}`);
  console.log(`${prefix}   Present on Vercel: ${remote.keys.length}`);

  if (missingOnVercel.length) {
    console.warn(`${prefix}   Missing on Vercel (run pnpm vercel:env:push-production): ${fmtList(missingOnVercel)}`);
  } else {
    console.log(`${prefix}   Missing on Vercel: (none)`);
  }

  if (extraOnVercel.length) {
    console.log(`${prefix}   Extra on Vercel only (not from current push plan): ${fmtList(extraOnVercel)}`);
  } else {
    console.log(`${prefix}   Extra on Vercel only: (none)`);
  }
}

function printExpectedOnly(expected, prefix) {
  console.log(`${prefix}   Expected keys from env.config + overrides: ${fmtList([...expected])}`);
}
