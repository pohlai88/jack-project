import { defineDocsManifest } from '@/docs/evidence/manifest';

export default defineDocsManifest({
  id: 'integration-sync',
  title: 'Integration Control Plane',
  module: 'Integrations',
  owner: 'integrations-platform',
  releaseState: 'released',
  summary:
    'Tenant integration administration for GitHub settings, webhooks, metrics, sync readiness, conflicts, and runs.',
  routes: [
    '/t/[tenant]/admin/integrations',
    '/t/[tenant]/admin/integrations/github',
    '/t/[tenant]/admin/integrations/webhooks',
    '/api/tenants/[tenant]/admin/integrations/conflicts',
    '/api/tenants/[tenant]/admin/integrations/field-mappings',
    '/api/tenants/[tenant]/admin/integrations/github/assign-usernames',
    '/api/tenants/[tenant]/admin/integrations/github/org-members',
    '/api/tenants/[tenant]/admin/integrations/metrics',
    '/api/tenants/[tenant]/admin/integrations/readiness',
    '/api/tenants/[tenant]/admin/integrations/runs',
  ],
  permissions: [
    'admin:integrations',
    'integrations:conflicts_resolve',
    'integrations:field_mappings',
    'integrations:metrics_read',
  ],
  workflows: [
    {
      id: 'integration-sync.github-setup',
      title: 'GitHub integration setup',
      summary: 'Configure GitHub credentials, mappings, readiness, and username assignment.',
    },
    {
      id: 'integration-sync.conflict-resolution',
      title: 'Integration conflict resolution',
      summary: 'Review sync conflicts and resolve mapped integration data issues.',
    },
  ],
  actions: [
    {
      id: 'integration-sync.review-metrics',
      title: 'Review integration metrics',
      summary: 'Inspect integration readiness, run history, metrics, and conflicts.',
    },
    {
      id: 'integration-sync.configure-webhooks',
      title: 'Configure webhooks',
      summary: 'Create and maintain outbound webhook integration settings.',
    },
  ],
  apis: [
    {
      id: 'integration-sync.metrics',
      method: 'GET',
      route: '/api/tenants/[tenant]/admin/integrations/metrics',
      summary: 'Return integration control plane metrics.',
    },
    {
      id: 'integration-sync.conflicts',
      method: 'GET',
      route: '/api/tenants/[tenant]/admin/integrations/conflicts',
      summary: 'Return integration sync conflicts.',
    },
  ],
  errors: [
    {
      code: 'AFD-INTEGRATION-PERMISSION',
      title: 'Integration permission missing',
      mitigation: 'Assign admin:integrations or the more specific integration permission required by the endpoint.',
    },
    {
      code: 'AFD-INTEGRATION-READINESS',
      title: 'Integration readiness failed',
      mitigation: 'Review credentials, mappings, and required organization membership data.',
    },
  ],
  troubleshooting: [
    {
      id: 'integration-sync-no-metrics',
      title: 'Integration metrics unavailable',
      symptom: 'The control plane cannot show metrics or readiness state.',
      resolution: 'Confirm permissions, integration credentials, and latest sync run status.',
    },
  ],
});
