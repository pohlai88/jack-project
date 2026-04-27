import { defineDocsManifest } from '@/docs/evidence/manifest';

export default defineDocsManifest({
  id: 'docs',
  title: 'Documentation Evidence Pipeline',
  module: 'Governance',
  owner: 'docs-platform',
  releaseState: 'beta',
  summary: 'Fumadocs-rendered evidence surface generated from governed product truth.',
  routes: ['/docs', '/docs/[[...slug]]'],
  permissions: [],
  workflows: [
    {
      id: 'docs.evidence-generation',
      title: 'Documentation evidence generation',
      summary: 'Validate manifests, build the docs inventory graph, generate MDX/JSON, and render through Fumadocs.',
    },
  ],
  actions: [
    {
      id: 'docs.generate',
      title: 'Generate documentation evidence',
      summary: 'Run the documentation generation pipeline from manifest-backed product truth.',
    },
  ],
  apis: [],
  errors: [
    {
      code: 'AFD-DOCS-CONTRACT',
      title: 'Docs contract validation failed',
      mitigation: 'Fix manifest IDs, owners, routes, permissions, APIs, errors, or troubleshooting references.',
    },
  ],
  troubleshooting: [
    {
      id: 'docs-generated-stale',
      title: 'Generated docs are stale',
      symptom: 'docs:generate --check fails in CI.',
      resolution: 'Run pnpm docs:generate and commit the regenerated evidence files.',
    },
  ],
});
