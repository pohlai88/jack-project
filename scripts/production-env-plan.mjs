/**
 * Single source for production URL/host overrides and key lists used by:
 * - `.env.production` generation (`env:sync`)
 * - `vercel:env:push-production`
 * - readiness reports
 *
 * Align with `env.config.example` — Production — nexuscanon.com.
 */

export const VERCEL_SCOPE = 'jacks-projects-7b3cfe94';

export const PRODUCTION_APP_URL = 'https://www.nexuscanon.com';
export const PRODUCTION_ROOT_DOMAIN = 'nexuscanon.com';

/** Applied on top of parsed `env.config` when building production-facing env. */
export const PRODUCTION_ENV_OVERRIDES = {
  NEXT_PUBLIC_APP_URL: PRODUCTION_APP_URL,
  AUTH_URL: PRODUCTION_APP_URL,
  TENANT_ROOT_DOMAIN: PRODUCTION_ROOT_DOMAIN,
  NEXT_PUBLIC_TENANT_ROOT_DOMAIN: PRODUCTION_ROOT_DOMAIN,
  AUTH_COOKIE_DOMAIN: PRODUCTION_ROOT_DOMAIN,
  NEXT_PUBLIC_COOKIE_DOMAIN: PRODUCTION_ROOT_DOMAIN,
};

/** Must be non-empty after merge for a healthy Production deploy. */
export const PRODUCTION_REQUIRED_KEYS = [
  'DATABASE_URL',
  'AUTH_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'AUTH_URL',
  'NEXT_PUBLIC_APP_NAME',
  'TENANT_ROOT_DOMAIN',
  'NEXT_PUBLIC_TENANT_ROOT_DOMAIN',
  'AUTH_COOKIE_DOMAIN',
  'NEXT_PUBLIC_COOKIE_DOMAIN',
  'ENABLE_AI_FEATURES',
  'ENABLE_SELF_SERVICE_TENANT_CREATE',
  'ENABLE_CUSTOM_DOMAIN',
  'ENABLE_CUSTOM_DOMAIN_ROUTING',
];

/** Pushed to Vercel when set in env.config; listed in reports when unset. */
export const PRODUCTION_OPTIONAL_KEYS = [
  'MIDDLEWARE_TENANT_LOOKUP_SECRET',
  'OPENAI_API_KEY',
  'AI_GATEWAY_API_KEY',
  'ANTHROPIC_API_KEY',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_ISSUER',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'AWS_S3_BUCKET',
  'S3_ENDPOINT',
  'S3_PUBLIC_ENDPOINT',
  'S3_ACCESS_KEY',
  'S3_SECRET_KEY',
  'S3_BUCKET',
  'S3_REGION',
  'SENTRY_DSN',
  'NEXT_PUBLIC_SENTRY_DSN',
  'GITHUB_INTEGRATION_CLIENT_ID',
  'GITHUB_INTEGRATION_CLIENT_SECRET',
  'LINKEDIN_CLIENT_ID',
  'LINKEDIN_CLIENT_SECRET',
];

export const PRODUCTION_SENSITIVE_KEYS = new Set([
  'DATABASE_URL',
  'AUTH_SECRET',
  'AUTH0_CLIENT_SECRET',
  'OPENAI_API_KEY',
  'AI_GATEWAY_API_KEY',
  'ANTHROPIC_API_KEY',
  'AWS_SECRET_ACCESS_KEY',
  'S3_SECRET_KEY',
  'GITHUB_INTEGRATION_CLIENT_SECRET',
  'LINKEDIN_CLIENT_SECRET',
  'MIDDLEWARE_TENANT_LOOKUP_SECRET',
]);

/**
 * @param {Record<string, string | undefined>} envConfigValues Parsed env.config
 * @returns {Record<string, string>}
 */
export function mergeProductionEnv(envConfigValues) {
  const merged = { ...envConfigValues };
  for (const [k, v] of Object.entries(PRODUCTION_ENV_OVERRIDES)) {
    merged[k] = v;
  }
  return /** @type {Record<string, string>} */ (
    Object.fromEntries(Object.entries(merged).map(([k, v]) => [k, v === undefined ? '' : String(v)]))
  );
}

function isBlank(v) {
  return v === undefined || String(v).trim() === '';
}

/**
 * @param {Record<string, string>} merged From {@link mergeProductionEnv}
 */
export function analyzeProductionReadiness(merged) {
  const missingRequired = PRODUCTION_REQUIRED_KEYS.filter((k) => isBlank(merged[k]));
  const presentOptional = PRODUCTION_OPTIONAL_KEYS.filter((k) => !isBlank(merged[k]));
  const absentOptional = PRODUCTION_OPTIONAL_KEYS.filter((k) => isBlank(merged[k]));
  return { missingRequired, presentOptional, absentOptional };
}

/**
 * Keys the push script sends to Vercel (required + optional with a value).
 * @param {Record<string, string>} merged
 */
export function keysExpectedOnVercelAfterPush(merged) {
  const keys = [...PRODUCTION_REQUIRED_KEYS];
  for (const k of PRODUCTION_OPTIONAL_KEYS) {
    if (!isBlank(merged[k])) {
      keys.push(k);
    }
  }
  return keys;
}

/** Ordered keys written to `.env.production` (required block, then optional). */
export function getVercelProductionCatalogKeys() {
  return { required: [...PRODUCTION_REQUIRED_KEYS], optional: [...PRODUCTION_OPTIONAL_KEYS] };
}
