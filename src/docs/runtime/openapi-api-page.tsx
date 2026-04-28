import { createAPIPage } from 'fumadocs-openapi/ui';

import { openapi } from '@/docs/runtime/openapi-server';

/** RSC `<APIPage />` preset for docs (see Fumadocs OpenAPI `createAPIPage`). */
export const DocsOpenAPIPage = createAPIPage(openapi);
