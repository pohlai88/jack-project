import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { getExternalOAuthTenantCredentials } from '@/features/admin';
import {
  exchangeLinkedInCodeForToken,
  getLinkedInCredentials,
  getLinkedInRedirectUri,
  getLinkedInUserInfo,
  LINKEDIN_PROVIDER_ID,
} from '@/features/linkedin';
import { db } from '@/shared/db';
import * as schema from '@/shared/db/schema';
import { auth } from '@/shared/lib/auth';
import { getTenantBySlug } from '@/shared/lib/tenant';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateParam = searchParams.get('state');

  let returnUrl = '/select-tenant';
  let tenantSlug: string | null = null;

  if (stateParam) {
    try {
      const decoded = JSON.parse(Buffer.from(stateParam, 'base64url').toString('utf-8')) as {
        returnUrl?: string;
        tenantSlug?: string;
      };
      if (decoded.returnUrl && decoded.returnUrl.startsWith('/') && !decoded.returnUrl.startsWith('//')) {
        returnUrl = decoded.returnUrl;
      }
      tenantSlug = decoded.tenantSlug ?? null;
    } catch {
      // Ignore malformed OAuth state and fall back to the safe default.
    }
  }

  if (!code) {
    return NextResponse.redirect(new URL(`${returnUrl}?error=linkedin_missing_code`, request.url));
  }

  const tenantCredentials = tenantSlug ? await getExternalOAuthTenantCredentials(tenantSlug, 'linkedin') : null;
  const credentials = getLinkedInCredentials(tenantCredentials ?? undefined);
  if (!credentials) {
    return NextResponse.redirect(new URL(`${returnUrl}?error=linkedin_not_configured`, request.url));
  }

  try {
    const tokens = await exchangeLinkedInCodeForToken(code, getLinkedInRedirectUri(request), credentials);
    const userInfo = await getLinkedInUserInfo(tokens.access_token);
    const expiresAt = tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : undefined;

    await db
      .delete(schema.accounts)
      .where(and(eq(schema.accounts.userId, session.user.id), eq(schema.accounts.provider, LINKEDIN_PROVIDER_ID)));

    await db.insert(schema.accounts).values({
      userId: session.user.id,
      type: 'oauth',
      provider: LINKEDIN_PROVIDER_ID,
      providerAccountId: userInfo.sub,
      access_token: tokens.access_token,
      expires_at: expiresAt,
      token_type: tokens.token_type ?? 'Bearer',
      scope: tokens.scope,
      id_token: tokens.id_token,
    });

    if (tenantSlug && (userInfo.profile || userInfo.picture)) {
      const tenant = await getTenantBySlug(tenantSlug);
      if (tenant && session.user.email) {
        const personUpdates: Partial<typeof schema.persons.$inferInsert> = {
          updatedAt: new Date(),
        };
        if (userInfo.profile) {
          personUpdates.linkedinUrl = userInfo.profile;
        }
        if (userInfo.picture) {
          personUpdates.avatarUrl = userInfo.picture;
        }

        await db
          .update(schema.persons)
          .set(personUpdates)
          .where(and(eq(schema.persons.tenantId, tenant.id), eq(schema.persons.email, session.user.email)));
      }
    }

    return NextResponse.redirect(new URL(returnUrl, request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(
      new URL(`${returnUrl}?error=linkedin_connect_failed&message=${encodeURIComponent(message)}`, request.url),
    );
  }
}
