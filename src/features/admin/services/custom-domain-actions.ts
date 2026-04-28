'use server';

import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { resolveTxt } from 'node:dns/promises';

import { db } from '@/shared/db';
import { tenants } from '@/shared/db/schema';
import { assertCustomDomainHostnameAllowed, normalizeCustomDomainHostname } from '@/shared/lib/custom-domain-hostname';
import { env } from '@/shared/lib/env';
import { logger } from '@/shared/lib/logger';
import { getPostgresConstraintName, isPostgresUniqueViolation } from '@/shared/lib/postgres-errors';
import { requireTenantAdmin } from '@/shared/lib/rbac';

import type { AdminActionResult } from '../types';

const TXT_PREFIX = 'afenda-verify=';

export async function beginCustomDomainVerification(
  tenantSlug: string,
  hostnameRaw: string,
): Promise<AdminActionResult<{ txtRecordName: string; txtRecordValue: string }>> {
  try {
    if (!env.ENABLE_CUSTOM_DOMAIN) {
      return { success: false, error: 'Custom domain onboarding is not enabled.' };
    }
    await requireTenantAdmin(tenantSlug);

    const normalized = normalizeCustomDomainHostname(hostnameRaw);
    if (!normalized) {
      return { success: false, error: 'Enter a valid hostname (no scheme or port).' };
    }

    const apexErr = assertCustomDomainHostnameAllowed(normalized, env.TENANT_ROOT_DOMAIN);
    if (apexErr) {
      return { success: false, error: apexErr };
    }

    const token = randomBytes(24).toString('hex');
    const txtRecordName = `_afenda-verify.${normalized}`;
    const txtRecordValue = `${TXT_PREFIX}${token}`;

    try {
      await db
        .update(tenants)
        .set({
          customDomainHostname: normalized,
          customDomainVerifiedAt: null,
          customDomainVerifyToken: token,
          updatedAt: new Date(),
        })
        .where(eq(tenants.slug, tenantSlug));
    } catch (error) {
      if (
        isPostgresUniqueViolation(error) &&
        getPostgresConstraintName(error) === 'tenants_custom_domain_hostname_unique'
      ) {
        return { success: false, error: 'That hostname is already assigned to another organization.' };
      }
      throw error;
    }

    return {
      success: true,
      data: { txtRecordName, txtRecordValue },
    };
  } catch (error) {
    logger.error({ error }, 'beginCustomDomainVerification failed');
    return { success: false, error: 'Could not save custom domain request.' };
  }
}

export async function verifyCustomDomainDns(tenantSlug: string): Promise<AdminActionResult<{ verified: boolean }>> {
  try {
    if (!env.ENABLE_CUSTOM_DOMAIN) {
      return { success: false, error: 'Custom domain onboarding is not enabled.' };
    }
    await requireTenantAdmin(tenantSlug);

    const row = await db.query.tenants.findFirst({
      where: eq(tenants.slug, tenantSlug),
      columns: {
        customDomainHostname: true,
        customDomainVerifyToken: true,
        customDomainVerifiedAt: true,
      },
    });

    if (!row?.customDomainHostname || !row.customDomainVerifyToken) {
      return { success: false, error: 'No pending verification. Enter a hostname first.' };
    }
    if (row.customDomainVerifiedAt) {
      return { success: true, data: { verified: true } };
    }

    const hostname = row.customDomainHostname;
    const token = row.customDomainVerifyToken;
    const txtName = `_afenda-verify.${hostname}`;
    let ok = false;
    try {
      const records = await resolveTxt(txtName);
      const flat = records.flat().join('');
      ok = flat.includes(`${TXT_PREFIX}${token}`);
    } catch {
      ok = false;
    }

    if (!ok) {
      return { success: false, error: 'TXT record not found yet. Wait for DNS propagation and try again.' };
    }

    await db
      .update(tenants)
      .set({
        customDomainVerifiedAt: new Date(),
        customDomainVerifyToken: null,
        updatedAt: new Date(),
      })
      .where(eq(tenants.slug, tenantSlug));

    return { success: true, data: { verified: true } };
  } catch (error) {
    logger.error({ error }, 'verifyCustomDomainDns failed');
    return { success: false, error: 'DNS verification failed.' };
  }
}

export async function clearCustomDomain(tenantSlug: string): Promise<AdminActionResult> {
  try {
    if (!env.ENABLE_CUSTOM_DOMAIN) {
      return { success: false, error: 'Custom domain onboarding is not enabled.' };
    }
    await requireTenantAdmin(tenantSlug);

    await db
      .update(tenants)
      .set({
        customDomainHostname: null,
        customDomainVerifiedAt: null,
        customDomainVerifyToken: null,
        updatedAt: new Date(),
      })
      .where(eq(tenants.slug, tenantSlug));

    return { success: true };
  } catch (error) {
    logger.error({ error }, 'clearCustomDomain failed');
    return { success: false, error: 'Could not clear custom domain.' };
  }
}
