import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { createFileSystemGeneratorCache, createGenerator, remarkAutoTypeTable } from 'fumadocs-typescript';
import { z } from 'zod';
import { join } from 'node:path';

/** @see https://www.fumadocs.dev/docs/integrations/typescript */
const typescriptGenerator = createGenerator({
  cache: createFileSystemGeneratorCache(join(process.cwd(), '.artifacts/cache/fumadocs-typescript')),
});

const docsFrontmatterSchema = frontmatterSchema.extend({
  description: z.string().min(1),
});

export const docs = defineDocs({
  dir: 'content/i18n/docs',
  docs: {
    schema: docsFrontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMdxMermaid, [remarkAutoTypeTable, { generator: typescriptGenerator }]],
  },
  plugins: [
    lastModified({
      filter: (collection) => collection === 'docs',
    }),
  ],
});
