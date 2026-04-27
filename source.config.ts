import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins';
import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { z } from 'zod';

const docsFrontmatterSchema = frontmatterSchema.extend({
  description: z.string().min(1),
});

export const docs = defineDocs({
  dir: 'docs/content',
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
    remarkPlugins: [remarkMdxMermaid],
  },
  plugins: [
    lastModified({
      filter: (collection) => collection === 'docs',
    }),
  ],
});
