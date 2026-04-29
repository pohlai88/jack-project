import { Plug } from 'lucide-react';
import { redirect } from 'next/navigation';

import {
  AdminPageHeader,
  ExternalOAuthCredentialsForm,
  ExternalOAuthSettingsPanel,
  getExternalOAuthConnectionInfo,
  getExternalOAuthTenantCredentials,
  getTenantSettings,
  hasExternalOAuthEnvCredentials,
} from '@/features/admin';
import { getGoogleWorkspaceCredentials } from '@/features/google-workspace';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { auth } from '@/shared/lib/auth';
import { requirePermission } from '@/shared/lib/permissions';
import { getTenantBySlug } from '@/shared/lib/tenant';

interface GoogleWorkspacePageProps {
  params: Promise<{ tenant: string }>;
}

export default async function GoogleWorkspaceIntegrationPage({ params }: GoogleWorkspacePageProps) {
  const { tenant } = await params;

  await requirePermission(tenant, 'admin:integrations');

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/t/${tenant}/login`);
  }

  const tenantRecord = await getTenantBySlug(tenant);
  if (!tenantRecord) {
    redirect(`/t/${tenant}/admin`);
  }

  const tenantCredentials = await getExternalOAuthTenantCredentials(tenant, 'googleWorkspace');
  const credentials = getGoogleWorkspaceCredentials(tenantCredentials ?? undefined);
  const hasEnvCredentials = await hasExternalOAuthEnvCredentials('googleWorkspace');

  if (!credentials) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Google Workspace"
          description="Connect Google OAuth for Workspace account access."
          backHref={`/t/${tenant}/admin/integrations`}
          backLabel="Integrations"
        />
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-500/25 dark:bg-amber-500/[0.07]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plug className="h-5 w-5" />
              Integration Not Configured
            </CardTitle>
            <CardDescription>
              Configure Google OAuth credentials before connecting this tenant. Add callback URL{' '}
              <code>/api/integrations/google-workspace/callback</code> in Google Cloud Console.
            </CardDescription>
          </CardHeader>
        </Card>
        <ExternalOAuthCredentialsForm
          tenantSlug={tenant}
          provider="googleWorkspace"
          providerLabel="Google Workspace"
          hasEnvCredentials={hasEnvCredentials}
          initialClientId={tenantCredentials?.clientId ?? ''}
          initialClientSecret={tenantCredentials?.clientSecret ?? ''}
          developerUrl="https://console.cloud.google.com/apis/credentials"
        />
      </div>
    );
  }

  const [tenantSettings, connectionInfo] = await Promise.all([
    getTenantSettings(tenant),
    getExternalOAuthConnectionInfo(session.user.id, 'googleWorkspace'),
  ]);

  const settings = tenantSettings.integrations?.googleWorkspace;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Google Workspace"
        description="Connect Google OAuth for Workspace account access."
        backHref={`/t/${tenant}/admin/integrations`}
        backLabel="Integrations"
      />
      <ExternalOAuthSettingsPanel
        tenantSlug={tenant}
        provider="googleWorkspace"
        providerLabel="Google Workspace"
        providerPath="google-workspace"
        enabled={settings?.enabled}
        isConnected={connectionInfo.isConnected}
        connectedDisplayName={connectionInfo.displayName}
        connectedEmail={connectionInfo.email}
        hasEnvCredentials={hasEnvCredentials}
      />
      {!hasEnvCredentials ? (
        <ExternalOAuthCredentialsForm
          tenantSlug={tenant}
          provider="googleWorkspace"
          providerLabel="Google Workspace"
          hasEnvCredentials={false}
          initialClientId={tenantCredentials?.clientId ?? ''}
          initialClientSecret={tenantCredentials?.clientSecret ?? ''}
          developerUrl="https://console.cloud.google.com/apis/credentials"
        />
      ) : null}
    </div>
  );
}

export const metadata = {
  title: 'Google Workspace | Integrations | Admin',
  description: 'Connect Google OAuth for Workspace account access.',
};
