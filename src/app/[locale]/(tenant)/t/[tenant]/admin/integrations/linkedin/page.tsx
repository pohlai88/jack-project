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
import { getLinkedInCredentials } from '@/features/linkedin';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { auth } from '@/shared/lib/auth';
import { requirePermission } from '@/shared/lib/permissions';
import { getTenantBySlug } from '@/shared/lib/tenant';

interface LinkedInPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function LinkedInIntegrationPage({ params }: LinkedInPageProps) {
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

  const tenantCredentials = await getExternalOAuthTenantCredentials(tenant, 'linkedin');
  const credentials = getLinkedInCredentials(tenantCredentials ?? undefined);
  const hasEnvCredentials = await hasExternalOAuthEnvCredentials('linkedin');

  if (!credentials) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="LinkedIn"
          description="Connect LinkedIn OpenID Connect for profile identity data."
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
              Configure LinkedIn OAuth credentials before connecting this tenant. Add callback URL{' '}
              <code>/api/integrations/linkedin/callback</code> in the LinkedIn developer portal.
            </CardDescription>
          </CardHeader>
        </Card>
        <ExternalOAuthCredentialsForm
          tenantSlug={tenant}
          provider="linkedin"
          providerLabel="LinkedIn"
          hasEnvCredentials={hasEnvCredentials}
          initialClientId={tenantCredentials?.clientId ?? ''}
          initialClientSecret={tenantCredentials?.clientSecret ?? ''}
          developerUrl="https://www.linkedin.com/developers/apps"
        />
      </div>
    );
  }

  const [tenantSettings, connectionInfo] = await Promise.all([
    getTenantSettings(tenant),
    getExternalOAuthConnectionInfo(session.user.id, 'linkedin'),
  ]);

  const settings = tenantSettings.integrations?.linkedin;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="LinkedIn"
        description="Connect LinkedIn OpenID Connect for profile identity data."
        backHref={`/t/${tenant}/admin/integrations`}
        backLabel="Integrations"
      />
      <ExternalOAuthSettingsPanel
        tenantSlug={tenant}
        provider="linkedin"
        providerLabel="LinkedIn"
        providerPath="linkedin"
        enabled={settings?.enabled}
        isConnected={connectionInfo.isConnected}
        connectedDisplayName={connectionInfo.displayName}
        connectedEmail={connectionInfo.email}
        hasEnvCredentials={hasEnvCredentials}
      />
      {!hasEnvCredentials ? (
        <ExternalOAuthCredentialsForm
          tenantSlug={tenant}
          provider="linkedin"
          providerLabel="LinkedIn"
          hasEnvCredentials={false}
          initialClientId={tenantCredentials?.clientId ?? ''}
          initialClientSecret={tenantCredentials?.clientSecret ?? ''}
          developerUrl="https://www.linkedin.com/developers/apps"
        />
      ) : null}
    </div>
  );
}

export const metadata = {
  title: 'LinkedIn | Integrations | Admin',
  description: 'Connect LinkedIn OpenID Connect for profile identity data.',
};
