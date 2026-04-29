import { NextRequest, NextResponse } from 'next/server';

import { getCutoverReadiness, parseIntegrationProvider } from '@/features/integration-sync';
import { auth } from '@/shared/lib/auth';
import { hasPermission } from '@/shared/lib/permissions';
import { getTenantBySlug } from '@/shared/lib/tenant';

export async function GET(request: NextRequest, context: { params: Promise<{ tenant: string }> }) {
  const { tenant: tenantSlug } = await context.params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const allowed =
    (await hasPermission(tenantSlug, 'integrations:metrics_read')) ||
    (await hasPermission(tenantSlug, 'admin:integrations'));
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });

  const providerParam = request.nextUrl.searchParams.get('provider');
  const parsedProvider = parseIntegrationProvider(providerParam);
  if (providerParam !== null && parsedProvider === null) {
    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  }
  const provider = parsedProvider ?? 'github';

  const readiness = await getCutoverReadiness({
    tenantId: tenant.id,
    provider,
  });
  return NextResponse.json({ readiness });
}
