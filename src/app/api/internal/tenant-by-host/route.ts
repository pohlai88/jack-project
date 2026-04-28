import { and, eq, isNotNull } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/shared/db';
import { tenants } from '@/shared/db/schema';
import { normalizeCustomDomainHostname } from '@/shared/lib/custom-domain-hostname';
import { env } from '@/shared/lib/env';

export const dynamic = 'force-dynamic';

/**
 * Internal: map verified custom apex hostname → tenant slug for Edge proxy (Bearer secret).
 * Not a public API—authorize with MIDDLEWARE_TENANT_LOOKUP_SECRET.
 */
export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (!env.MIDDLEWARE_TENANT_LOOKUP_SECRET || auth !== `Bearer ${env.MIDDLEWARE_TENANT_LOOKUP_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const raw = request.nextUrl.searchParams.get('host');
  const hostname = normalizeCustomDomainHostname(raw);
  if (!hostname) {
    return NextResponse.json({ slug: null });
  }

  const row = await db.query.tenants.findFirst({
    where: and(eq(tenants.customDomainHostname, hostname), isNotNull(tenants.customDomainVerifiedAt)),
    columns: { slug: true },
  });

  return NextResponse.json({ slug: row?.slug ?? null });
}
