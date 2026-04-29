import 'server-only';

import { loader } from 'fumadocs-core/source';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { docs } from 'fumadocs-mdx:collections/server';

import { i18n } from './docs-i18n.config';
import { openapi } from './docs-openapi.server';
import { DOCS_OPENAPI_BASE_DIR, DOCS_ROUTE_BASE_PATH } from './docs-runtime.contract';

const openapiPages = await openapiSource(openapi, {
  baseDir: DOCS_OPENAPI_BASE_DIR,
  meta: true,
});

/** Canonical Fumadocs source registry for MDX docs and virtual OpenAPI pages. */
export const source = loader(
  {
    docs: docs.toFumadocsSource(),
    openapi: openapiPages,
  },
  {
    baseUrl: DOCS_ROUTE_BASE_PATH,
    i18n,
    plugins: [openapiPlugin()],
  },
);
