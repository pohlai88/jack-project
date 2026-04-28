import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

import { getVercelProductionCatalogKeys, mergeProductionEnv } from './production-env-plan.mjs';

const ENV_CONFIG_FILENAME = 'env.config';
const NEXT_ENV_LOCAL_FILENAME = '.env.local';
const ENV_PRODUCTION_FILENAME = '.env.production';
const RUNTIME_MANAGED_KEYS = new Set(['NODE_ENV']);
const GENERATED_HEADER = [
  '# -----------------------------------------------------------------------------',
  '# GENERATED FILE - DO NOT EDIT DIRECTLY',
  '# Source of truth: env.config',
  '# Run `pnpm env:sync` after editing env.config if you need to refresh manually.',
  '# -----------------------------------------------------------------------------',
  '',
];

const PRODUCTION_GENERATED_HEADER = [
  '# -----------------------------------------------------------------------------',
  '# GENERATED FILE - DO NOT EDIT DIRECTLY',
  '# Built from env.config + production URL/host overrides (see scripts/production-env-plan.mjs).',
  '# Used for local `next build` / production-shaped checks; Vercel Production uses `pnpm vercel:env:push-production`.',
  '# Run `pnpm env:sync` after editing env.config.',
  '#',
  '# Below: full Vercel Production catalog. Set values come from env.config (with prod URL overrides).',
  '# Missing keys appear as comments (# KEY= …) until set in env.config.',
  '# -----------------------------------------------------------------------------',
  '',
];

function quoteValue(value) {
  if (/^[A-Za-z0-9_./:@?&=%+,\-]+$/.test(value)) {
    return value;
  }

  return JSON.stringify(value);
}

function serializeEnv(entries) {
  return Object.entries(entries)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${quoteValue(value)}`)
    .join('\n');
}

/** @param {Record<string, string>} merged */
function planLineValue(merged, key) {
  const raw = merged[key];
  if (raw === undefined || String(raw).trim() === '') {
    return null;
  }
  return String(raw);
}

function envProductionCommentMissing(key, tier) {
  const hint =
    tier === 'required'
      ? 'required on Vercel — add to env.config then pnpm env:sync'
      : 'optional on Vercel — add to env.config if you use this integration';
  return `# ${key}=   # ${hint}`;
}

/**
 * Full Vercel catalog + commented gaps; extra keys from env.config at the end.
 * @param {Record<string, string>} merged
 */
function serializeEnvProductionContents(merged) {
  const { required, optional } = getVercelProductionCatalogKeys();
  const catalog = new Set([...required, ...optional]);

  const lines = [];

  lines.push('# ─── Vercel Production — required ───');
  for (const key of required) {
    const v = planLineValue(merged, key);
    lines.push(v !== null ? `${key}=${quoteValue(v)}` : envProductionCommentMissing(key, 'required'));
  }

  lines.push('');
  lines.push('# ─── Vercel Production — optional (pushed only when set in env.config) ───');
  for (const key of optional) {
    const v = planLineValue(merged, key);
    lines.push(v !== null ? `${key}=${quoteValue(v)}` : envProductionCommentMissing(key, 'optional'));
  }

  const extras = Object.entries(merged)
    .filter(([key]) => !catalog.has(key) && !RUNTIME_MANAGED_KEYS.has(key))
    .sort(([a], [b]) => a.localeCompare(b));

  if (extras.length) {
    lines.push('');
    lines.push('# ─── Also from env.config (not part of vercel:env:push-production catalog) ───');
    for (const [key, value] of extras) {
      lines.push(`${key}=${quoteValue(value)}`);
    }
  }

  return lines.join('\n');
}

export function getEnvConfigPath(cwd = process.cwd()) {
  return path.resolve(cwd, ENV_CONFIG_FILENAME);
}

export function getNextEnvLocalPath(cwd = process.cwd()) {
  return path.resolve(cwd, NEXT_ENV_LOCAL_FILENAME);
}

export function getEnvProductionPath(cwd = process.cwd()) {
  return path.resolve(cwd, ENV_PRODUCTION_FILENAME);
}

export function readEnvConfig(cwd = process.cwd()) {
  const envConfigPath = getEnvConfigPath(cwd);

  if (!fs.existsSync(envConfigPath)) {
    return null;
  }

  const content = fs.readFileSync(envConfigPath, 'utf8');

  return {
    path: envConfigPath,
    content,
    values: dotenv.parse(content),
  };
}

export function applyEnvConfig(cwd = process.cwd()) {
  const envConfig = readEnvConfig(cwd);

  if (!envConfig) {
    return null;
  }

  for (const [key, value] of Object.entries(envConfig.values)) {
    if (RUNTIME_MANAGED_KEYS.has(key)) {
      continue;
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return envConfig;
}

export function syncNextEnvLocal(cwd = process.cwd()) {
  const envConfig = readEnvConfig(cwd);

  if (!envConfig) {
    return null;
  }

  const nextEnvLocalPath = getNextEnvLocalPath(cwd);
  const serialized = serializeEnv(
    Object.fromEntries(Object.entries(envConfig.values).filter(([key]) => !RUNTIME_MANAGED_KEYS.has(key))),
  );
  const output = [...GENERATED_HEADER, serialized, ''].join('\n');

  fs.writeFileSync(nextEnvLocalPath, output, 'utf8');

  return nextEnvLocalPath;
}

/**
 * Writes `.env.production`: same keys as env.config with production URL/host overrides applied.
 * @returns {{ path: string, merged: Record<string, string> } | null}
 */
export function syncEnvProduction(cwd = process.cwd()) {
  const envConfig = readEnvConfig(cwd);

  if (!envConfig) {
    return null;
  }

  const merged = mergeProductionEnv(envConfig.values);
  const envProductionPath = getEnvProductionPath(cwd);
  const serialized = serializeEnvProductionContents(merged);
  const output = [...PRODUCTION_GENERATED_HEADER, serialized, ''].join('\n');

  fs.writeFileSync(envProductionPath, output, 'utf8');

  return { path: envProductionPath, merged };
}

export function loadManagedEnvConfig(cwd = process.cwd()) {
  const envConfig = applyEnvConfig(cwd);

  if (!envConfig) {
    return null;
  }

  syncNextEnvLocal(cwd);
  syncEnvProduction(cwd);

  return envConfig;
}

/**
 * Warnings when server tenant host vars and public cookie-domain mirrors look inconsistent.
 * @param {Record<string, string | undefined>} values Parsed env.config values
 * @returns {string[]}
 */
export function collectTenantCookieEnvWarnings(values) {
  const warnings = [];
  const trd = typeof values.TENANT_ROOT_DOMAIN === 'string' ? values.TENANT_ROOT_DOMAIN.trim() : '';
  const pub =
    typeof values.NEXT_PUBLIC_TENANT_ROOT_DOMAIN === 'string' ? values.NEXT_PUBLIC_TENANT_ROOT_DOMAIN.trim() : '';
  const pcd = typeof values.NEXT_PUBLIC_COOKIE_DOMAIN === 'string' ? values.NEXT_PUBLIC_COOKIE_DOMAIN.trim() : '';

  if (trd && !pub && !pcd) {
    warnings.push(
      'TENANT_ROOT_DOMAIN is set but neither NEXT_PUBLIC_TENANT_ROOT_DOMAIN nor NEXT_PUBLIC_COOKIE_DOMAIN is set. Session cookies may use the server root while NEXT_LOCALE stays host-scoped in the client bundle; set the NEXT_PUBLIC_* mirror(s) per ADR 0008.',
    );
  }

  if ((pub || pcd) && !trd) {
    warnings.push(
      'NEXT_PUBLIC_TENANT_ROOT_DOMAIN or NEXT_PUBLIC_COOKIE_DOMAIN is set but TENANT_ROOT_DOMAIN is empty. Locale cookie Domain may be shared while proxy/subdomain rewrites have no server root; set TENANT_ROOT_DOMAIN to match production topology.',
    );
  }

  return warnings;
}
