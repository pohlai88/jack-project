import { createAPIPage } from 'fumadocs-openapi/ui';

import { openapi } from '@/docs/runtime/docs-openapi.server';

/**
 * Server-only Fumadocs OpenAPI adapter.
 *
 * Keep this wrapper as the single docs-owned UI boundary around
 * `fumadocs-openapi/ui` so route pages do not import the preset directly.
 */
export const DocsOpenAPIAdapter = createAPIPage(openapi);
