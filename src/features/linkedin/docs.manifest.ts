import { defineDocsManifest } from '@/docs/runtime/docs-contract-manifest';

export default defineDocsManifest({
  id: 'linkedin',
  title: 'LinkedIn OAuth Integration',
  module: 'Integrations',
  owner: 'integrations-platform',
  releaseState: 'released',
  summary: 'LinkedIn OAuth connection entry points for tenant integration setup.',
  routes: ['/api/integrations/linkedin/callback', '/api/integrations/linkedin/connect'],
  permissions: ['admin:integrations'],
  workflows: [
    {
      id: 'linkedin.oauth-connect',
      title: 'LinkedIn OAuth connection',
      summary: 'Start and complete LinkedIn OAuth for tenant integration setup.',
    },
  ],
  actions: [
    {
      id: 'linkedin.connect',
      title: 'Connect LinkedIn account',
      summary: 'Generate LinkedIn OAuth state and redirect to LinkedIn authorization.',
    },
  ],
  apis: [
    {
      id: 'linkedin.oauth.callback',
      method: 'GET',
      route: '/api/integrations/linkedin/callback',
      summary: 'Handle LinkedIn OAuth callback.',
      public: false,
    },
    {
      id: 'linkedin.oauth.connect',
      method: 'GET',
      route: '/api/integrations/linkedin/connect',
      summary: 'Start LinkedIn OAuth authorization.',
      public: false,
    },
  ],
  errors: [
    {
      code: 'AFD-LINKEDIN-OAUTH',
      title: 'LinkedIn OAuth failed',
      mitigation: 'Validate OAuth state, LinkedIn credentials, callback URL, and tenant context.',
    },
  ],
  troubleshooting: [
    {
      id: 'linkedin-callback-fails',
      title: 'LinkedIn callback fails',
      symptom: 'LinkedIn redirects back but the integration is not connected.',
      resolution: 'Confirm callback URL, OAuth state, LinkedIn credentials, and tenant permission.',
    },
  ],
});
