'use server';

import { and, eq } from 'drizzle-orm';

import { getGoogleUserInfo, GOOGLE_WORKSPACE_PROVIDER_ID } from '@/features/google-workspace';
import { getLinkedInUserInfo, LINKEDIN_PROVIDER_ID } from '@/features/linkedin';
import { db } from '@/shared/db';
import * as schema from '@/shared/db/schema';
import { auth } from '@/shared/lib/auth';
import { env } from '@/shared/lib/env';
import { requirePermission } from '@/shared/lib/permissions';
import type { TenantSettings } from '@/shared/lib/tenant-settings';

import { getTenantSettings, updateTenantSettings } from './settings-service';

export type ExternalOAuthProvider = 'googleWorkspace' | 'linkedin';

export interface ExternalOAuthProviderConfig {
  provider: ExternalOAuthProvider;
  label: string;
  accountProviderId: string;
  envClientId?: string;
  envClientSecret?: string;
}

export interface ExternalOAuthConnectionInfo {
  isConnected: boolean;
  displayName?: string;
  email?: string;
  picture?: string;
}

const providerConfigs: Record<ExternalOAuthProvider, ExternalOAuthProviderConfig> = {
  googleWorkspace: {
    provider: 'googleWorkspace',
    label: 'Google Workspace',
    accountProviderId: GOOGLE_WORKSPACE_PROVIDER_ID,
    envClientId: env.GOOGLE_CLIENT_ID,
    envClientSecret: env.GOOGLE_CLIENT_SECRET,
  },
  linkedin: {
    provider: 'linkedin',
    label: 'LinkedIn',
    accountProviderId: LINKEDIN_PROVIDER_ID,
    envClientId: env.LINKEDIN_CLIENT_ID,
    envClientSecret: env.LINKEDIN_CLIENT_SECRET,
  },
};

function getProviderConfig(provider: ExternalOAuthProvider): ExternalOAuthProviderConfig {
  return providerConfigs[provider];
}

function getProviderSettings(settings: TenantSettings, provider: ExternalOAuthProvider) {
  return settings.integrations?.[provider];
}

export async function getExternalOAuthTenantCredentials(
  tenantSlug: string,
  provider: ExternalOAuthProvider,
): Promise<{ clientId?: string; clientSecret?: string } | null> {
  const settings = await getTenantSettings(tenantSlug);
  const providerSettings = getProviderSettings(settings, provider);

  if (!providerSettings?.clientId || !providerSettings?.clientSecret) {
    return null;
  }

  return {
    clientId: providerSettings.clientId,
    clientSecret: providerSettings.clientSecret,
  };
}

export async function saveExternalOAuthCredentials(
  tenantSlug: string,
  provider: ExternalOAuthProvider,
  clientId: string,
  clientSecret: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  await requirePermission(tenantSlug, 'admin:integrations');

  try {
    const currentSettings = await getTenantSettings(tenantSlug);
    const currentProviderSettings = getProviderSettings(currentSettings, provider);

    await updateTenantSettings(tenantSlug, {
      integrations: {
        ...currentSettings.integrations,
        [provider]: {
          ...currentProviderSettings,
          clientId: clientId.trim(),
          clientSecret: clientSecret.trim(),
          enabled: currentProviderSettings?.enabled ?? false,
        },
      },
    } as Partial<TenantSettings>);

    return { success: true };
  } catch (error) {
    console.error(`Failed to save ${provider} credentials:`, error);
    return { success: false, error: 'Failed to save credentials' };
  }
}

export async function updateExternalOAuthSettings(
  tenantSlug: string,
  provider: ExternalOAuthProvider,
  updates: { enabled?: boolean },
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  await requirePermission(tenantSlug, 'admin:integrations');

  try {
    const currentSettings = await getTenantSettings(tenantSlug);
    const currentProviderSettings = getProviderSettings(currentSettings, provider);

    await updateTenantSettings(tenantSlug, {
      integrations: {
        ...currentSettings.integrations,
        [provider]: {
          ...currentProviderSettings,
          ...updates,
          ...(updates.enabled !== undefined && updates.enabled !== currentProviderSettings?.enabled
            ? {
                enabledAt: new Date().toISOString(),
                enabledBy: session.user.id,
              }
            : {}),
        },
      },
    } as Partial<TenantSettings>);

    return { success: true };
  } catch (error) {
    console.error(`Failed to update ${provider} settings:`, error);
    return { success: false, error: 'Failed to update settings' };
  }
}

export async function disconnectExternalOAuth(
  tenantSlug: string,
  provider: ExternalOAuthProvider,
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  await requirePermission(tenantSlug, 'admin:integrations');

  try {
    const config = getProviderConfig(provider);
    await db
      .delete(schema.accounts)
      .where(and(eq(schema.accounts.userId, session.user.id), eq(schema.accounts.provider, config.accountProviderId)));

    return { success: true };
  } catch (error) {
    console.error(`Failed to disconnect ${provider}:`, error);
    return { success: false, error: 'Failed to disconnect' };
  }
}

export async function getExternalOAuthConnectionInfo(
  userId: string,
  provider: ExternalOAuthProvider,
): Promise<ExternalOAuthConnectionInfo> {
  const config = getProviderConfig(provider);
  const account = await db.query.accounts.findFirst({
    where: and(eq(schema.accounts.userId, userId), eq(schema.accounts.provider, config.accountProviderId)),
    columns: {
      access_token: true,
      providerAccountId: true,
    },
  });

  if (!account?.access_token) {
    return { isConnected: false };
  }

  try {
    if (provider === 'googleWorkspace') {
      const user = await getGoogleUserInfo(account.access_token);
      return {
        isConnected: true,
        displayName: user.name,
        email: user.email,
        picture: user.picture,
      };
    }

    const user = await getLinkedInUserInfo(account.access_token);
    return {
      isConnected: true,
      displayName: user.name,
      email: user.email,
      picture: user.picture,
    };
  } catch {
    return { isConnected: true };
  }
}

export async function hasExternalOAuthEnvCredentials(provider: ExternalOAuthProvider): Promise<boolean> {
  const config = getProviderConfig(provider);
  return !!(config.envClientId && config.envClientSecret);
}
