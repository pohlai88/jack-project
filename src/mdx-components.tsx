import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { DocsOpenAPIPage } from '@/docs/runtime/openapi-api-page';
import { Mermaid } from '@/shared/components/markdown/Mermaid';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    /** Required for `remark-auto-type-table` output and explicit `<TypeTable />` in MDX. */
    TypeTable,
    /** OpenAPI (`fumadocs-openapi` / optional `generateFiles()` output). */
    APIPage: DocsOpenAPIPage,
    Mermaid,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
