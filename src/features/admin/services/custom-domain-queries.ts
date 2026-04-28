import { eq } from 'drizzle-orm';

import { db } from '@/shared/db';
import { tenants } from '@/shared/db/schema';
import { env } from '@/shared/lib/env';
import { requireTenantAdmin } from '@/shared/lib/rbac';

export type CustomDomainAdminSnapshot = {
  featureEnabled: boolean;
  routingEnabled: boolean;
  hostname: string | null;
  verifiedAt: Date | null;
  verifyToken: string | null;
  txtRecordName: string | null;
  txtRecordValue: string | null;
};

const TXT_PREFIX = 'afenda-verify=';

export async function getCustomDomainAdminSnapshot(tenantSlug: string): Promise<CustomDomainAdminSnapshot | null> {
  await requireTenantAdmin(tenantSlug);
  const row = await db.query.tenants.findFirst({
    where: eq(tenants.slug, tenantSlug),
    columns: {
      customDomainHostname: true,
      customDomainVerifiedAt: true,
      customDomainVerifyToken: true,
    },
  });
  if (!row) return null;

  const hostname = row.customDomainHostname ?? null;
  const verifiedAt = row.customDomainVerifiedAt ?? null;
  const verifyToken = row.customDomainVerifyToken ?? null;
  const pending = hostname && !verifiedAt && verifyToken;

  return {
    featureEnabled: env.ENABLE_CUSTOM_DOMAIN,
    routingEnabled: env.ENABLE_CUSTOM_DOMAIN_ROUTING && !!env.MIDDLEWARE_TENANT_LOOKUP_SECRET,
    hostname,
    verifiedAt,
    verifyToken,
    txtRecordName: pending ? `_afenda-verify.${hostname}` : null,
    txtRecordValue: pending ? `${TXT_PREFIX}${verifyToken}` : null,
  };
}
