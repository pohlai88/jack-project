import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

function formatEnvValidationError(issues: ReadonlyArray<{ path?: ReadonlyArray<unknown>; message?: string }>): string {
  const details = issues.map((issue) => {
    const key = issue.path?.length ? issue.path.map(String).join('.') : 'unknown';
    return `- ${key}: ${issue.message ?? 'Invalid value'}`;
  });

  return [
    'Invalid environment variables.',
    ...details,
    '',
    'Create env.config from env.config.example in the repo root, then run `pnpm env:sync`.',
  ].join('\n');
}

/**
 * Environment variables configuration with runtime validation.
 *
 * This module uses @t3-oss/env-nextjs for type-safe environment variable
 * validation. Variables are validated at build time and runtime.
 *
 * @see https://env.t3.gg/docs/nextjs
 */
export const env = createEnv({
  /**
   * Server-side environment variables schema.
   * These are only available on the server.
   */
  server: {
    // Node environment
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    // Database
    DATABASE_URL: z.url().describe('PostgreSQL connection string'),

    // Authentication (Auth.js / Auth0)
    AUTH_SECRET: z.string().min(32).describe('Secret for signing tokens (min 32 chars)'),
    AUTH_URL: z.url().optional().describe('Canonical URL of the app'),
    AUTH_COOKIE_DOMAIN: z
      .string()
      .min(1)
      .optional()
      .describe(
        'Optional Set-Cookie Domain for Auth.js (e.g. example.com). Wins over TENANT_ROOT_DOMAIN. For NEXT_LOCALE across subdomains, also set NEXT_PUBLIC_COOKIE_DOMAIN or NEXT_PUBLIC_TENANT_ROOT_DOMAIN (see env.config.example).',
      ),
    AUTH0_CLIENT_ID: z.string().optional().describe('Auth0 client ID'),
    AUTH0_CLIENT_SECRET: z.string().optional().describe('Auth0 client secret'),
    AUTH0_ISSUER: z.url().optional().describe('Auth0 issuer URL'),
    AUTH0_DOMAIN: z
      .string()
      .min(1)
      .optional()
      .describe('Auth0 tenant domain from the Auth0 Next.js quickstart, without https://'),
    AUTH0_SECRET: z.string().min(32).optional().describe('Auth0 SDK session secret from the Auth0 quickstart'),
    APP_BASE_URL: z.url().optional().describe('Auth0 SDK base URL from the Auth0 Next.js quickstart'),

    // AI / LLM
    AI_GATEWAY_API_KEY: z.string().optional().describe('Vercel AI Gateway API key'),
    OPENAI_API_KEY: z.string().optional().describe('OpenAI API key'),
    ANTHROPIC_API_KEY: z.string().optional().describe('Anthropic API key'),

    // AWS (for file storage, CloudWatch)
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().optional().default('us-east-1'),
    AWS_S3_BUCKET: z.string().optional().describe('S3 bucket for file uploads'),

    // S3-compatible storage (MinIO for local dev)
    S3_ENDPOINT: z.string().optional().describe('S3-compatible endpoint (for MinIO)'),
    S3_PUBLIC_ENDPOINT: z.string().optional().describe('Public S3 endpoint for browser-accessible presigned URLs'),
    S3_ACCESS_KEY: z.string().optional().describe('S3 access key (overrides AWS_ACCESS_KEY_ID)'),
    S3_SECRET_KEY: z.string().optional().describe('S3 secret key (overrides AWS_SECRET_ACCESS_KEY)'),
    S3_BUCKET: z.string().optional().describe('S3 bucket name (overrides AWS_S3_BUCKET)'),
    S3_REGION: z.string().optional().default('us-east-1'),

    // Observability
    SENTRY_DSN: z.url().optional().describe('Sentry DSN for error tracking'),

    // Feature flags
    ENABLE_AI_FEATURES: z
      .string()
      .default('false')
      .transform((val) => val === 'true'),

    /** When true, authenticated users with no tenant may create a first organization from select-tenant. */
    ENABLE_SELF_SERVICE_TENANT_CREATE: z
      .string()
      .default('false')
      .transform((val) => val === 'true'),

    /** Admin UI + DNS TXT verification for mapping a verified apex hostname to a tenant. */
    ENABLE_CUSTOM_DOMAIN: z
      .string()
      .default('false')
      .transform((val) => val === 'true'),

    /** When true, proxy resolves verified custom hostnames via internal lookup (requires MIDDLEWARE_TENANT_LOOKUP_SECRET). */
    ENABLE_CUSTOM_DOMAIN_ROUTING: z
      .string()
      .default('false')
      .transform((val) => val === 'true'),

    /** Shared secret for GET /api/internal/tenant-by-host (Bearer); enables Host→tenant slug rewrite for verified custom domains. */
    MIDDLEWARE_TENANT_LOOKUP_SECRET: z.string().min(32).optional(),

    // GitHub (OAuth App integration)
    GITHUB_INTEGRATION_CLIENT_ID: z.string().optional().describe('GitHub OAuth App client ID'),
    GITHUB_INTEGRATION_CLIENT_SECRET: z.string().optional().describe('GitHub OAuth App client secret'),

    // Google Workspace (OAuth integration)
    GOOGLE_CLIENT_ID: z.string().optional().describe('Google OAuth client ID'),
    GOOGLE_CLIENT_SECRET: z.string().optional().describe('Google OAuth client secret'),

    // LinkedIn (OpenID Connect integration)
    LINKEDIN_CLIENT_ID: z.string().optional().describe('LinkedIn OAuth client ID'),
    LINKEDIN_CLIENT_SECRET: z.string().optional().describe('LinkedIn OAuth client secret'),

    // Multi-tenant host (optional): apex/root label only, e.g. example.com or localhost (no scheme/port).
    // When set, `{slug}.{TENANT_ROOT_DOMAIN}` is rewritten to /[locale]/t/[slug]/... in src/proxy.ts.
    TENANT_ROOT_DOMAIN: z
      .string()
      .min(1)
      .optional()
      .describe(
        'Root label for tenant subdomains (e.g. example.com or localhost; no scheme). Enables {slug}.{TENANT_ROOT_DOMAIN} rewrites in src/proxy.ts. Custom host onboarding can use @vercel/sdk projectsAddProjectDomain separately.',
      ),
  },

  /**
   * Client-side environment variables schema.
   * These are exposed to the browser (must be prefixed with NEXT_PUBLIC_).
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
    NEXT_PUBLIC_APP_NAME: z.string().default('Afenda'),
    NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),
    /** Explicit Set-Cookie Domain for client-visible config (e.g. next-intl NEXT_LOCALE). Same apex as Auth.js cookies when using subdomains. */
    NEXT_PUBLIC_COOKIE_DOMAIN: z.string().min(1).optional(),
    /** Mirror of TENANT_ROOT_DOMAIN for client bundles; use same value when TENANT_ROOT_DOMAIN is set. */
    NEXT_PUBLIC_TENANT_ROOT_DOMAIN: z.string().min(1).optional(),
  },

  /**
   * Runtime environment variables.
   * Destructure all variables from `process.env` to ensure they're validated.
   */
  runtimeEnv: {
    // Server
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_ISSUER: process.env.AUTH0_ISSUER,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_SECRET: process.env.AUTH0_SECRET,
    APP_BASE_URL: process.env.APP_BASE_URL,
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_PUBLIC_ENDPOINT: process.env.S3_PUBLIC_ENDPOINT,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_REGION: process.env.S3_REGION,
    SENTRY_DSN: process.env.SENTRY_DSN,
    ENABLE_AI_FEATURES: process.env.ENABLE_AI_FEATURES,
    ENABLE_SELF_SERVICE_TENANT_CREATE: process.env.ENABLE_SELF_SERVICE_TENANT_CREATE,
    ENABLE_CUSTOM_DOMAIN: process.env.ENABLE_CUSTOM_DOMAIN,
    ENABLE_CUSTOM_DOMAIN_ROUTING: process.env.ENABLE_CUSTOM_DOMAIN_ROUTING,
    MIDDLEWARE_TENANT_LOOKUP_SECRET: process.env.MIDDLEWARE_TENANT_LOOKUP_SECRET,
    GITHUB_INTEGRATION_CLIENT_ID: process.env.GITHUB_INTEGRATION_CLIENT_ID,
    GITHUB_INTEGRATION_CLIENT_SECRET: process.env.GITHUB_INTEGRATION_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
    TENANT_ROOT_DOMAIN: process.env.TENANT_ROOT_DOMAIN,
    // Client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_COOKIE_DOMAIN: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    NEXT_PUBLIC_TENANT_ROOT_DOMAIN: process.env.NEXT_PUBLIC_TENANT_ROOT_DOMAIN,
  },

  /**
   * Skip validation in certain environments.
   * Useful for Docker builds or CI where env vars aren't available.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Treat empty strings as undefined.
   * Makes it easier to use optional variables with falsy defaults.
   */
  emptyStringAsUndefined: true,

  onValidationError: (issues) => {
    throw new Error(
      formatEnvValidationError(
        issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      ),
    );
  },
});

/**
 * Type-safe environment variable access.
 * Use this instead of process.env for validated variables.
 *
 * @example
 * import { env } from '@/shared/lib/env';
 *
 * // Server-side
 * const dbUrl = env.DATABASE_URL;
 *
 * // Client-side
 * const appName = env.NEXT_PUBLIC_APP_NAME;
 */
