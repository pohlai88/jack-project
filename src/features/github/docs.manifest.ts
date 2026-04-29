import { defineDocsManifest } from '@/docs/runtime/docs-contract-manifest';

export default defineDocsManifest({
  id: 'github',
  title: 'GitHub OAuth Integration',
  module: 'Integrations',
  owner: 'integrations-platform',
  releaseState: 'released',
  summary: 'GitHub OAuth connection entry points for tenant and user integration flows.',
  routes: [
    '/api/integrations/github/callback',
    '/api/integrations/github/connect',
    '/api/integrations/github/user-connect',
  ],
  permissions: [],
  workflows: [
    {
      id: 'github.oauth-connect',
      title: 'GitHub OAuth connection',
      summary: 'Start and complete GitHub OAuth for integration setup.',
    },
  ],
  actions: [
    {
      id: 'github.connect',
      title: 'Connect GitHub account',
      summary: 'Generate GitHub OAuth state and redirect to GitHub authorization.',
    },
  ],
  apis: [
    {
      id: 'github.oauth.callback',
      method: 'GET',
      route: '/api/integrations/github/callback',
      summary: 'Handle GitHub OAuth callback.',
    },
  ],
  errors: [
    {
      code: 'AFD-GITHUB-OAUTH',
      title: 'GitHub OAuth failed',
      mitigation: 'Validate OAuth state, GitHub app credentials, and callback configuration.',
    },
  ],
  troubleshooting: [
    {
      id: 'github-callback-fails',
      title: 'GitHub callback fails',
      symptom: 'GitHub redirects back but the integration is not connected.',
      resolution: 'Confirm callback URL, OAuth state, app credentials, and tenant/user context.',
    },
  ],
});
