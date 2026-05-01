import { createAPIPage } from 'fumadocs-openapi/ui';
import { createFileSystemGeneratorCache, createGenerator } from 'fumadocs-typescript';
import { AutoTypeTable } from 'fumadocs-typescript/ui';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Banner } from 'fumadocs-ui/components/banner';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { GithubInfo } from 'fumadocs-ui/components/github-info';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { join } from 'node:path';

import { isDocsMdxLockedComponent } from '@/docs/runtime/docs-mdx.policy';
import { openapi } from '@/docs/runtime/docs-openapi.server';
import { GraphView } from '@/docs/ui/graph-view';
import { Mermaid } from '@/shared/components/markdown/Mermaid';

const DocsOpenAPIPage = createAPIPage(openapi);
const docsTypeScriptGenerator = createGenerator({
  cache: createFileSystemGeneratorCache(join(process.cwd(), '.artifacts/cache/fumadocs-typescript')),
});

export function createDocsMdxComponents(extensions?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    Banner,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    img: (props) => <ImageZoom {...(props as Parameters<typeof ImageZoom>[0])} />,
    CodeBlock,
    DynamicCodeBlock,
    File,
    Files,
    Folder,
    GithubInfo,
    GraphView,
    InlineTOC,
    Step,
    Steps,
    ...TabsComponents,
    TypeTable,
    AutoTypeTable: (props) => <AutoTypeTable {...props} generator={docsTypeScriptGenerator} />,
    APIPage: DocsOpenAPIPage,
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
