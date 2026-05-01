import { eq, or } from 'drizzle-orm';
import { headers } from 'next/headers';
import { cache } from 'react';

import { db } from '@/shared/db';
import { tenants } from '@/shared/db/schema';

import { parseTenantSubdomainSlugFromHost } from '@/shared/lib/tenant-subdomain-host';

/** Get the underlying cause message from a Drizzle or database error */
function getCauseMessage(err: unknown): string {
  const e = err as Error & { cause?: unknown };
  if (e?.cause instanceof Error) return e.cause.message;
  if (e?.message) return e.message;
  return String(err);
}

/**
 * Get the current tenant slug from the URL path.
 *
 * For path-based multi-tenancy: /t/{slug}/...
 *
 * This is cached per request to avoid multiple lookups.
 */
export const getCurrentTenantSlug = cache(async (): Promise<string | null> => {
  const headersList = await headers();
  const fromProxy = headersList.get('x-tenant-slug')?.trim();
  if (fromProxy) return fromProxy;

  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
  return extractTenantSlug(pathname);
});

/**
 * Get the current tenant from the database.
 *
 * Cached per request for efficiency.
 *
 * @returns Tenant object or null if not found
 */
export const getCurrentTenant = cache(async () => {
  const slug = await getCurrentTenantSlug();
  if (!slug) return null;

  try {
    const tenant = await findTenantBySlugOrSubdomain(slug);
    return tenant;
  } catch (err) {
    const cause = getCauseMessage(err);
    throw new Error(`Tenant lookup failed for slug "${slug}": ${cause}`, { cause: err });
  }
});

/** Resolved tenant row id for the current request, or null (no extra DB round-trip vs getCurrentTenant). */
export const getCurrentTenantId = cache(async (): Promise<string | null> => {
  const tenant = await getCurrentTenant();
  return tenant?.id ?? null;
});

async function findTenantBySlugOrSubdomain(label: string) {
  return db.query.tenants.findFirst({
    where: or(eq(tenants.slug, label), eq(tenants.subdomain, label)),
  });
}

/**
 * Get tenant by URL routing label (matches `tenants.slug` or optional `tenants.subdomain`).
 *
 * @param slug - Path or host segment (not verified beyond DB match)
 * @returns Tenant object or null if not found
 */
export async function getTenantBySlug(slug: string) {
  try {
    return await findTenantBySlugOrSubdomain(slug);
  } catch (err) {
    const cause = getCauseMessage(err);
    throw new Error(`Tenant lookup failed for slug "${slug}": ${cause}`, { cause: err });
  }
}

/**
 * Resolve tenant from `Host` when `tenantRootDomain` is configured (`{label}.{tenantRootDomain}`).
 * Uses the same label rules as the edge proxy (see `parseTenantSubdomainSlugFromHost`).
 */
export async function getTenantByHost(
  hostHeader: string | null | undefined,
  tenantRootDomain: string | null | undefined,
) {
  const label = parseTenantSubdomainSlugFromHost(hostHeader, tenantRootDomain);
  if (!label) return null;
  return getTenantBySlug(label);
}

/**
 * Validate that a tenant slug exists.
 *
 * Used in middleware for early validation.
 */
export async function validateTenantSlug(slug: string): Promise<boolean> {
  const tenant = await getTenantBySlug(slug);
  return tenant !== null;
}

/**
 * Build a tenant-scoped URL path.
 *
 * @example
 * buildTenantPath('afenda', '/dashboard') // '/t/afenda/dashboard'
 * buildTenantPath('afenda', 'skills')     // '/t/afenda/skills'
 */
export function buildTenantPath(tenantSlug: string, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/t/${tenantSlug}${cleanPath}`;
}

/**
 * Extract tenant slug from a path.
 *
 * @example
 * extractTenantSlug('/t/afenda/dashboard') // 'afenda'
 * extractTenantSlug('/about')            // null
 */
export function extractTenantSlug(path: string): string | null {
  const match = path.match(/^\/t\/([^/]+)/);
  return match ? match[1] : null;
}
