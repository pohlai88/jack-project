import { NextResponse } from 'next/server';

import { getExternalOAuthTenantCredentials } from '@/features/admin';
import { buildLinkedInAuthorizationUrl, getLinkedInCredentials, getLinkedInRedirectUri } from '@/features/linkedin';
import { auth } from '@/shared/lib/auth';
import { hasPermission } from '@/shared/lib/permissions';

function extractTenantFromReturnUrl(returnUrl: string): string | null {
  const match = returnUrl.match(/^\/t\/([^/]+)/);
  return match ? match[1] : null;
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get('returnUrl') ?? '/select-tenant';
  const safeReturn = returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/select-tenant';
  const tenantSlug = extractTenantFromReturnUrl(safeReturn);
  if (!tenantSlug || !(await hasPermission(tenantSlug, 'admin:integrations'))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const tenantCredentials = await getExternalOAuthTenantCredentials(tenantSlug, 'linkedin');
  const credentials = getLinkedInCredentials(tenantCredentials ?? undefined);
  if (!credentials) {
    return NextResponse.json({ error: 'LinkedIn OAuth is not configured' }, { status: 503 });
  }

  const redirectUri = getLinkedInRedirectUri(request);
  const state = Buffer.from(JSON.stringify({ returnUrl: safeReturn, tenantSlug }), 'utf-8').toString('base64url');

  return NextResponse.redirect(buildLinkedInAuthorizationUrl(redirectUri, state, credentials));
}
