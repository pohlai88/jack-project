import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';

const ENV_CONFIG_FILENAME = 'env.config';
const NEXT_ENV_LOCAL_FILENAME = '.env.local';
const RUNTIME_MANAGED_KEYS = new Set(['NODE_ENV']);
const GENERATED_HEADER = [
  '# -----------------------------------------------------------------------------',
  '# GENERATED FILE - DO NOT EDIT DIRECTLY',
  '# Source of truth: env.config',
  '# Run `pnpm env:sync` after editing env.config if you need to refresh manually.',
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

export function getEnvConfigPath(cwd = process.cwd()) {
  return path.resolve(cwd, ENV_CONFIG_FILENAME);
}

export function getNextEnvLocalPath(cwd = process.cwd()) {
  return path.resolve(cwd, NEXT_ENV_LOCAL_FILENAME);
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

export function loadManagedEnvConfig(cwd = process.cwd()) {
  const envConfig = applyEnvConfig(cwd);

  if (!envConfig) {
    return null;
  }

  syncNextEnvLocal(cwd);

  return envConfig;
}
