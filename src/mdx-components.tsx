import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { isDocsMdxLockedComponent } from '@/docs/runtime/docs-mdx.policy';
import { DocsOpenAPIAdapter } from '@/docs/ui/docs-openapi-adapter';
import { Mermaid } from '@/shared/components/markdown/Mermaid';

export function createDocsMdxComponents(extensions?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    TypeTable,
    APIPage: DocsOpenAPIAdapter,
    Mermaid,
    ...filterSafeOverrides(extensions),
  } satisfies MDXComponents;
}

function filterSafeOverrides(components?: MDXComponents): MDXComponents {
  if (!components) return {};

  return Object.fromEntries(
    Object.entries(components).filter(([componentName]) => !isDocsMdxLockedComponent(componentName)),
  );
}

export const getMDXComponents = createDocsMdxComponents;
export const useMDXComponents = createDocsMdxComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof createDocsMdxComponents>;
}
