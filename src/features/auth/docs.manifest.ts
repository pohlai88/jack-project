import { defineDocsManifest } from '@/docs/evidence/manifest';

export default defineDocsManifest({
  id: 'auth',
  title: 'Authentication and Tenant Access',
  module: 'Identity',
  owner: 'identity-platform',
  releaseState: 'released',
  summary: 'Authentication, tenant selection, tenant login, and invite-token entry points.',
  routes: ['/login', '/select-tenant', '/t/[tenant]/login', '/t/[tenant]/invite/[token]', '/api/auth/[...nextauth]'],
  permissions: [],
  workflows: [
    {
      id: 'auth.sign-in',
      title: 'User sign-in',
      summary: 'Users authenticate and resolve their tenant context.',
    },
    {
      id: 'auth.invite-acceptance',
      title: 'Invite acceptance',
      summary: 'Invited users enter a tenant through an invite token.',
    },
  ],
  actions: [
    {
      id: 'auth.select-tenant',
      title: 'Select tenant',
      summary: 'Choose an authorized tenant after successful authentication.',
    },
  ],
  apis: [
    {
      id: 'auth.nextauth',
      method: 'GET',
      route: '/api/auth/[...nextauth]',
      summary: 'Auth.js route handler for authentication lifecycle requests.',
    },
  ],
  errors: [
    {
      code: 'AFD-AUTH-NO-TENANT',
      title: 'No tenant membership available',
      mitigation: 'Confirm the user has an active tenant membership or a valid invite.',
    },
  ],
  troubleshooting: [
    {
      id: 'auth.user-cannot-enter-tenant',
      title: 'User cannot enter tenant',
      symptom: 'Authenticated user is redirected away from a tenant.',
      resolution: 'Verify tenant membership, role assignment, and invite status.',
    },
  ],
});
