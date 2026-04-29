import { getTranslations } from 'next-intl/server';

import { requirePermission } from '@/shared/lib/permissions';
import { ComingSoonIntegrationPage } from '../_components/ComingSoonIntegrationPage';

interface GitlabPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function GitLabIntegrationPage({ params }: GitlabPageProps) {
  const { tenant } = await params;

  await requirePermission(tenant, 'admin:integrations');

  const t = await getTranslations('admin.integrationsPage');
  return (
    <ComingSoonIntegrationPage
      tenant={tenant}
      name={t('gitlab.name')}
      description={t('gitlab.description')}
      backLabel={t('title')}
    />
  );
}

export const metadata = {
  title: 'GitLab | Integrations | Admin',
  description: 'GitLab integration is not available yet.',
};
