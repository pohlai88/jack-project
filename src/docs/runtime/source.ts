import { loader } from 'fumadocs-core/source';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { i18n } from '@/docs/runtime/i18n';
import { openapi } from '@/docs/runtime/openapi-server';
import { docs } from 'fumadocs-mdx:collections/server';

const openapiPages = await openapiSource(openapi, {
  baseDir: 'openapi',
  meta: true,
});

/**
 * Fumadocs `loader` with MDX `docs` + virtual OpenAPI pages (`openapiSource`).
 * RSC path: https://www.fumadocs.dev/docs/integrations/openapi (not the without-RSC flow).
 */
export const source = loader(
  {
    docs: docs.toFumadocsSource(),
    openapi: openapiPages,
  },
  {
    baseUrl: '/docs',
    plugins: [openapiPlugin()],
    i18n,
    icon(icon) {
      if (!icon) return;

      const Icon = icons[icon as keyof typeof icons];
      if (!Icon) return;

      return createElement(Icon);
    },
  },
);
