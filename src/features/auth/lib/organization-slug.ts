/**
 * Slug rules for self-service organization creation (path segment + subdomain label).
 */

const RESERVED = new Set([
  'api',
  'auth',
  'login',
  'logout',
  'docs',
  'www',
  'static',
  '_next',
  't',
  'admin',
  'select-tenant',
  'settings',
  'profile',
  'onboarding',
  'invite',
  'new',
  'app',
  'cdn',
  'mail',
  'ftp',
]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeOrganizationSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isReservedOrganizationSlug(slug: string): boolean {
  return RESERVED.has(slug);
}

export function assertValidOrganizationSlug(slug: string): string | null {
  if (slug.length < 2 || slug.length > 100) {
    return 'Slug must be between 2 and 100 characters.';
  }
  if (!SLUG_RE.test(slug)) {
    return 'Use lowercase letters, numbers, and single hyphens between words (no leading or trailing hyphen).';
  }
  if (isReservedOrganizationSlug(slug)) {
    return 'This organization URL is reserved. Choose a different slug.';
  }
  return null;
}
