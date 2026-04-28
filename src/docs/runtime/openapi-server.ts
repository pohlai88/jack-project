import { createOpenAPI } from 'fumadocs-openapi/server';
import { join } from 'node:path';

/**
 * Server-only OpenAPI bundle for Fumadocs (`createOpenAPI`).
 * Add `proxyUrl` + `openapi.createProxy()` route if playground requests need a same-origin proxy;
 * see https://www.fumadocs.dev/docs/integrations/openapi/server
 */
export const openapi = createOpenAPI({
  input: [join(process.cwd(), 'src/docs/openapi/afenda-public.json')],
});
