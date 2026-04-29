import { getTranslations } from 'next-intl/server';

import { requirePermission } from '@/shared/lib/permissions';
import { ComingSoonIntegrationPage } from '../_components/ComingSoonIntegrationPage';

interface SlackPageProps {
  params: Promise<{ tenant: string }>;
}

export default async function SlackIntegrationPage({ params }: SlackPageProps) {
  const { tenant } = await params;

  await requirePermission(tenant, 'admin:integrations');

  const t = await getTranslations('admin.integrationsPage');
  return (
    <ComingSoonIntegrationPage
      tenant={tenant}
      name={t('slack.name')}
      description={t('slack.description')}
      backLabel={t('title')}
    />
  );
}

export const metadata = {
  title: 'Slack | Integrations | Admin',
  description: 'Slack integration is not available yet.',
};
