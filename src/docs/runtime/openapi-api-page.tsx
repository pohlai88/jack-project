import { createAPIPage } from 'fumadocs-openapi/ui';

import { openapi } from '@/docs/runtime/openapi-server';

/**
 * Server-only Fumadocs OpenAPI page renderer.
 *
 * Keep this wrapper as the single docs-owned boundary around
 * `fumadocs-openapi/ui` so route pages do not import the preset directly.
 */
export const DocsOpenAPIPage = createAPIPage(openapi);
