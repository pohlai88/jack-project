import { createOpenAPI } from 'fumadocs-openapi/server';

/**
 * Server-only OpenAPI bundle for Fumadocs (`createOpenAPI`).
 * Add `proxyUrl` + `openapi.createProxy()` route if playground requests need a same-origin proxy;
 * see https://www.fumadocs.dev/docs/integrations/openapi/server
 */
export const openapi = createOpenAPI({
  input: ['./openapi/afenda-public.json'],
});
