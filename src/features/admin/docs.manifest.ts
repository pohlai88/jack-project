import { defineDocsManifest } from '@/docs/evidence/manifest';

export default defineDocsManifest({
  id: 'admin',
  title: 'Administration',
  module: 'Tenant Operations',
  owner: 'platform-admin',
  releaseState: 'released',
  summary: 'Tenant administration for audit logs, members, invites, roles, permissions, and tenant settings.',
  routes: [
    '/t/[tenant]/admin',
    '/t/[tenant]/admin/audit-logs',
    '/t/[tenant]/admin/invites',
    '/t/[tenant]/admin/members',
    '/t/[tenant]/admin/roles',
    '/t/[tenant]/admin/settings',
    '/t/[tenant]/admin/settings/ai-provider',
    '/t/[tenant]/admin/settings/branding',
    '/t/[tenant]/admin/settings/storage',
    '/api/tenants/[tenant]/admin/settings/ai/test',
    '/api/tenants/[tenant]/admin/settings/storage/test',
    '/api/tenants/[tenant]/departments',
    '/api/tenants/[tenant]/departments/[id]',
    '/api/tenants/[tenant]/departments/[id]/managers',
    '/api/tenants/[tenant]/departments/[id]/members',
    '/api/tenants/[tenant]/directory',
    '/api/tenants/[tenant]/files/[fileId]',
    '/api/tenants/[tenant]/permissions',
    '/api/tenants/[tenant]/settings',
  ],
  permissions: ['admin:dashboard', 'admin:members', 'admin:settings'],
  workflows: [
    {
      id: 'admin.member-lifecycle',
      title: 'Member lifecycle administration',
      summary: 'Administrators invite members, assign roles, and audit membership changes.',
    },
    {
      id: 'admin.tenant-settings',
      title: 'Tenant settings management',
      summary: 'Administrators configure general, branding, AI provider, and storage settings.',
    },
  ],
  actions: [
    {
      id: 'admin.manage-members',
      title: 'Manage members and invites',
      summary: 'Review members, send invites, and update role assignments.',
    },
    {
      id: 'admin.manage-settings',
      title: 'Manage tenant settings',
      summary: 'Update tenant settings and validate external provider connectivity.',
    },
  ],
  apis: [
    {
      id: 'admin.settings.ai.test',
      method: 'POST',
      route: '/api/tenants/[tenant]/admin/settings/ai/test',
      summary: 'Validate tenant AI provider settings.',
    },
    {
      id: 'admin.settings.storage.test',
      method: 'POST',
      route: '/api/tenants/[tenant]/admin/settings/storage/test',
      summary: 'Validate tenant storage provider settings.',
    },
  ],
  errors: [
    {
      code: 'AFD-ADMIN-UNAUTHORIZED',
      title: 'Administration permission missing',
      mitigation: 'Confirm the user has the required tenant administration role and permission assignment.',
    },
  ],
  troubleshooting: [
    {
      id: 'admin.settings-test-fails',
      title: 'Provider connection test fails',
      symptom: 'AI or storage settings test requests return a failure.',
      resolution: 'Check tenant credentials, provider endpoint configuration, and provider-side availability.',
    },
  ],
});
