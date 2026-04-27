import { defineDocsManifest } from '@/docs/evidence/manifest';

export default defineDocsManifest({
  id: 'dashboard',
  title: 'Dashboard',
  module: 'Workspace',
  owner: 'product-platform',
  releaseState: 'released',
  summary: 'Landing and tenant dashboard surfaces for workspace entry, activity, stats, and quick actions.',
  routes: ['/[locale]', '/[locale]/t/[tenant]', '/api/health'],
  permissions: [],
  workflows: [
    {
      id: 'dashboard.workspace-entry',
      title: 'Workspace entry',
      summary: 'Users land in the tenant workspace and review activity, stats, and quick actions.',
    },
  ],
  actions: [
    {
      id: 'dashboard.review-workspace',
      title: 'Review workspace status',
      summary: 'Inspect tenant metrics, profile completion, contextual tips, and recent activity.',
    },
  ],
  apis: [
    {
      id: 'platform.health',
      method: 'GET',
      route: '/api/health',
      summary: 'Expose basic application health status.',
    },
  ],
  errors: [
    {
      code: 'AFD-DASHBOARD-STATS',
      title: 'Dashboard stats unavailable',
      mitigation: 'Check tenant context and dashboard stats service execution.',
    },
  ],
  troubleshooting: [
    {
      id: 'dashboard-empty-state',
      title: 'Dashboard appears empty',
      symptom: 'Dashboard cards show no activity or metrics.',
      resolution: 'Confirm the tenant has seeded data, memberships, and accessible dashboard services.',
    },
  ],
});
