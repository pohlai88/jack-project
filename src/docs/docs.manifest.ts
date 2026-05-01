import { defineDocsManifest } from './runtime/docs-contract-manifest';

export default defineDocsManifest({
  id: 'docs',
  title: 'Documentation Experience',
  module: 'Documentation',
  owner: 'platform-docs',
  releaseState: 'released',
  summary: 'Fumadocs documentation routes, machine-readable exports, search, RSS, and Open Graph surfaces.',
  routes: [
    '/[locale]/docs',
    '/[locale]/docs/[[...slug]]',
    '/[locale]/og/docs/[...slug]',
    '/api/search',
    '/llms-full.txt',
    '/llms.mdx/[locale]/docs/[[...slug]]',
    '/llms.txt',
    '/rss.xml',
  ],
  permissions: [],
  workflows: [
    {
      id: 'docs.read-docs',
      title: 'Read documentation',
      summary: 'Visitors browse localized Fumadocs pages and generated evidence pages.',
    },
    {
      id: 'docs.machine-readable-export',
      title: 'Machine-readable docs export',
      summary: 'LLM, RSS, search, Markdown, and Open Graph routes expose docs content without a parallel docs engine.',
    },
  ],
  actions: [
    {
      id: 'docs.copy-markdown-url',
      title: 'Copy Markdown URL',
      summary: 'Page actions expose Markdown URLs for AI and reader workflows.',
    },
    {
      id: 'docs.submit-feedback',
      title: 'Submit docs feedback',
      summary: 'Readers can submit lightweight page feedback through the docs feedback action.',
    },
  ],
  apis: [
    {
      id: 'docs.search',
      method: 'GET',
      route: '/api/search',
      summary: 'Search index endpoint backed by the Fumadocs source registry.',
    },
    {
      id: 'docs.llms-index',
      method: 'GET',
      route: '/llms.txt',
      summary: 'Machine-readable LLM index for the documentation corpus.',
    },
    {
      id: 'docs.llms-full',
      method: 'GET',
      route: '/llms-full.txt',
      summary: 'Full machine-readable LLM export for the documentation corpus.',
    },
    {
      id: 'docs.rss',
      method: 'GET',
      route: '/rss.xml',
      summary: 'RSS feed for documentation pages.',
    },
  ],
  errors: [
    {
      code: 'AFD-DOCS-PAGE-NOT-FOUND',
      title: 'Documentation page not found',
      mitigation: 'Confirm the requested localized docs page exists in the Fumadocs source registry.',
    },
  ],
  troubleshooting: [
    {
      id: 'docs.route-build-fails',
      title: 'Docs route build fails',
      symptom: 'The docs route fails type-check or build after layout or runtime changes.',
      resolution: 'Run docs source generation, verify route imports target src/docs/runtime, then run type-check.',
    },
  ],
});
