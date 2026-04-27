import { defineDocsManifest } from '@/docs/evidence/manifest';

export default defineDocsManifest({
  id: 'docs',
  title: 'Documentation Evidence Pipeline',
  module: 'Governance',
  owner: 'docs-platform',
  releaseState: 'beta',
  summary: 'Fumadocs-rendered evidence surface generated from governed product truth.',
  routes: [
    '/[locale]/docs',
    '/[locale]/docs/[[...slug]]',
    '/api/search',
    '/llms.txt',
    '/llms-full.txt',
    '/llms.mdx/[locale]/docs/[[...slug]]',
    '/rss.xml',
  ],
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
    {
      id: 'docs.feedback.submit',
      title: 'Submit documentation page feedback',
      summary:
        'Validate, rate-limit, and append a page-level feedback event for a Fumadocs-rendered documentation page.',
    },
  ],
  apis: [
    {
      id: 'docs.llms.index',
      method: 'GET',
      route: '/llms.txt',
      summary:
        'Expose the Fumadocs page index for LLM-friendly discovery. Optional `locale` query selects the language tree (default `en`).',
    },
    {
      id: 'docs.llms.full',
      method: 'GET',
      route: '/llms-full.txt',
      summary:
        'Expose all documentation pages as clean Markdown for LLM consumption. Optional `locale` query selects the language tree (default `en`).',
    },
    {
      id: 'docs.llms.page',
      method: 'GET',
      route: '/llms.mdx/[locale]/docs/[[...slug]]',
      summary: 'Expose one locale-aware documentation page as clean Markdown for LLM consumption.',
    },
    {
      id: 'docs.search',
      method: 'GET',
      route: '/api/search',
      summary: 'Expose locale-aware Fumadocs search results from the generated documentation source.',
    },
    {
      id: 'docs.rss',
      method: 'GET',
      route: '/rss.xml',
      summary: 'Expose an RSS feed for generated documentation evidence pages.',
    },
  ],
  errors: [
    {
      code: 'AFD-DOCS-CONTRACT',
      title: 'Docs contract validation failed',
      mitigation: 'Fix manifest IDs, owners, routes, permissions, APIs, errors, or troubleshooting references.',
    },
    {
      code: 'AFD-DOCS-FEEDBACK-VALIDATION',
      title: 'Docs feedback validation failed',
      mitigation: 'Submit feedback only for canonical /docs pages with a supported opinion and bounded message.',
    },
    {
      code: 'AFD-DOCS-FEEDBACK-ORIGIN',
      title: 'Docs feedback origin rejected',
      mitigation: 'Ensure the request Origin matches the deployment Host or X-Forwarded-Host.',
    },
    {
      code: 'AFD-DOCS-FEEDBACK-RATE-LIMIT',
      title: 'Docs feedback rate limit exceeded',
      mitigation: 'Wait for the feedback submission window to reset before retrying.',
    },
    {
      code: 'AFD-DOCS-FEEDBACK-CONTEXT',
      title: 'Docs feedback request context unavailable',
      mitigation: 'Confirm the deployment provides AUTH_SECRET and enough request headers to derive a rate-limit key.',
    },
    {
      code: 'AFD-DOCS-FEEDBACK-STORAGE',
      title: 'Docs feedback storage failed',
      mitigation: 'Check database connectivity and the docs_page_feedback_events migration state.',
    },
  ],
  troubleshooting: [
    {
      id: 'docs-generated-stale',
      title: 'Generated docs are stale',
      symptom: 'docs:generate --check fails in CI.',
      resolution: 'Run pnpm docs:generate and commit the regenerated evidence files.',
    },
    {
      id: 'docs-feedback-submit-fails',
      title: 'Docs feedback submission fails',
      symptom: 'A documentation page feedback form shows a submission failure.',
      resolution:
        'Check origin headers, AUTH_SECRET, rate-limit history, and the docs_page_feedback_events database migration.',
    },
  ],
});
