import { env } from '@/shared/lib/env';

import {
  LINKEDIN_CALLBACK_PATH,
  LINKEDIN_OAUTH_AUTHORIZE_URL,
  LINKEDIN_OAUTH_TOKEN_URL,
  LINKEDIN_REQUIRED_SCOPES,
  LINKEDIN_USERINFO_URL,
} from './constants';
import type { LinkedInTokenResponse, LinkedInUserInfo } from '../types';

export interface LinkedInCredentials {
  clientId: string;
  clientSecret: string;
}

export function getLinkedInCredentials(tenantCredentials?: {
  clientId?: string;
  clientSecret?: string;
}): LinkedInCredentials | null {
  if (tenantCredentials?.clientId && tenantCredentials?.clientSecret) {
    return {
      clientId: tenantCredentials.clientId,
      clientSecret: tenantCredentials.clientSecret,
    };
  }

  if (env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET) {
    return {
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
    };
  }

  return null;
}

export function getLinkedInCallbackBaseUrl(request: Request): string {
  if (env.AUTH_URL) {
    return env.AUTH_URL.replace(/\/$/, '');
  }

  const headers = request.headers;
  const proto = headers.get('x-forwarded-proto');
  const host = headers.get('x-forwarded-host') ?? headers.get('host');
  if (proto && host) {
    return `${proto === 'https' ? 'https' : 'http'}://${host}`;
  }

  try {
    const url = new URL(request.url);
    return `${url.protocol}//${url.host}`;
  } catch {
    return env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
}

export function getLinkedInRedirectUri(request: Request): string {
  return `${getLinkedInCallbackBaseUrl(request)}${LINKEDIN_CALLBACK_PATH}`;
}

export function buildLinkedInAuthorizationUrl(
  redirectUri: string,
  state: string,
  credentials: LinkedInCredentials,
): string {
  const params = new URLSearchParams({
    client_id: credentials.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: LINKEDIN_REQUIRED_SCOPES.join(' '),
    state,
  });

  return `${LINKEDIN_OAUTH_AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeLinkedInCodeForToken(
  code: string,
  redirectUri: string,
  credentials: LinkedInCredentials,
): Promise<LinkedInTokenResponse> {
  const body = new URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const res = await fetch(LINKEDIN_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn OAuth token exchange failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as LinkedInTokenResponse & { error?: string; error_description?: string };
  if (data.error) {
    throw new Error(`LinkedIn OAuth error: ${data.error} - ${data.error_description ?? 'No description'}`);
  }

  return data;
}

export async function getLinkedInUserInfo(accessToken: string): Promise<LinkedInUserInfo> {
  const res = await fetch(LINKEDIN_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LinkedIn userinfo failed: ${res.status} ${text}`);
  }

  return (await res.json()) as LinkedInUserInfo;
}
