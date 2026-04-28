import { notFound } from 'next/navigation';

import { CustomDomainSettingsPageContent, getCustomDomainAdminSnapshot } from '@/features/admin';

interface PageProps {
  params: Promise<{ tenant: string }>;
}

export default async function CustomDomainSettingsPage({ params }: PageProps) {
  const { tenant } = await params;
  const snapshot = await getCustomDomainAdminSnapshot(tenant);
  if (!snapshot) {
    notFound();
  }

  return <CustomDomainSettingsPageContent tenantSlug={tenant} initialSnapshot={snapshot} />;
}
