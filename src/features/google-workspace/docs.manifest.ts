import { defineDocsManifest } from '@/docs/runtime/docs-contract-manifest';

export default defineDocsManifest({
  id: 'google-workspace',
  title: 'Google Workspace OAuth Integration',
  module: 'Integrations',
  owner: 'integrations-platform',
  releaseState: 'released',
  summary: 'Google Workspace OAuth connection entry points for tenant integration setup.',
  routes: ['/api/integrations/google-workspace/callback', '/api/integrations/google-workspace/connect'],
  permissions: ['admin:integrations'],
  workflows: [
    {
      id: 'google-workspace.oauth-connect',
      title: 'Google Workspace OAuth connection',
      summary: 'Start and complete Google Workspace OAuth for tenant integration setup.',
    },
  ],
  actions: [
    {
      id: 'google-workspace.connect',
      title: 'Connect Google Workspace account',
      summary: 'Generate Google OAuth state and redirect to Google authorization.',
    },
  ],
  apis: [
    {
      id: 'google-workspace.oauth.callback',
      method: 'GET',
      route: '/api/integrations/google-workspace/callback',
      summary: 'Handle Google Workspace OAuth callback.',
      public: false,
    },
    {
      id: 'google-workspace.oauth.connect',
      method: 'GET',
      route: '/api/integrations/google-workspace/connect',
      summary: 'Start Google Workspace OAuth authorization.',
      public: false,
    },
  ],
  errors: [
    {
      code: 'AFD-GOOGLE-WORKSPACE-OAUTH',
      title: 'Google Workspace OAuth failed',
      mitigation: 'Validate OAuth state, Google credentials, callback URL, and tenant context.',
    },
  ],
  troubleshooting: [
    {
      id: 'google-workspace-callback-fails',
      title: 'Google Workspace callback fails',
      symptom: 'Google redirects back but the integration is not connected.',
      resolution: 'Confirm callback URL, OAuth state, Google credentials, and tenant permission.',
    },
  ],
});
