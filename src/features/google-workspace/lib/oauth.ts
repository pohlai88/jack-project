import { env } from '@/shared/lib/env';

import {
  GOOGLE_OAUTH_AUTHORIZE_URL,
  GOOGLE_OAUTH_TOKEN_URL,
  GOOGLE_USERINFO_URL,
  GOOGLE_WORKSPACE_CALLBACK_PATH,
  GOOGLE_WORKSPACE_REQUIRED_SCOPES,
} from './constants';
import type { GoogleTokenResponse, GoogleUserInfo } from '../types';

export interface GoogleWorkspaceCredentials {
  clientId: string;
  clientSecret: string;
}

export function getGoogleWorkspaceCredentials(tenantCredentials?: {
  clientId?: string;
  clientSecret?: string;
}): GoogleWorkspaceCredentials | null {
  if (tenantCredentials?.clientId && tenantCredentials?.clientSecret) {
    return {
      clientId: tenantCredentials.clientId,
      clientSecret: tenantCredentials.clientSecret,
    };
  }

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    return {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  return null;
}

export function getGoogleWorkspaceCallbackBaseUrl(request: Request): string {
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

export function getGoogleWorkspaceRedirectUri(request: Request): string {
  return `${getGoogleWorkspaceCallbackBaseUrl(request)}${GOOGLE_WORKSPACE_CALLBACK_PATH}`;
}

export function buildGoogleWorkspaceAuthorizationUrl(
  redirectUri: string,
  state: string,
  credentials: GoogleWorkspaceCredentials,
): string {
  const params = new URLSearchParams({
    client_id: credentials.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_WORKSPACE_REQUIRED_SCOPES.join(' '),
    state,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `${GOOGLE_OAUTH_AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeGoogleWorkspaceCodeForToken(
  code: string,
  redirectUri: string,
  credentials: GoogleWorkspaceCredentials,
): Promise<GoogleTokenResponse> {
  const body = new URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const res = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google OAuth token exchange failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as GoogleTokenResponse & { error?: string; error_description?: string };
  if (data.error) {
    throw new Error(`Google OAuth error: ${data.error} - ${data.error_description ?? 'No description'}`);
  }

  return data;
}

export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google userinfo failed: ${res.status} ${text}`);
  }

  return (await res.json()) as GoogleUserInfo;
}
