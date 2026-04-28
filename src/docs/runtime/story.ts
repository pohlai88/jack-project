import { createFileSystemCache, defineStoryFactory } from '@fumadocs/story';

/**
 * Fumadocs Story factory for MDX component previews (`defineStory`, `<story.WithControl />`).
 * Production cache path matches Vercel-oriented guidance in the upstream docs.
 *
 * @see https://www.fumadocs.dev/docs/integrations/story/next
 */
export const { defineStory } = defineStoryFactory({
  cache: process.env.NODE_ENV === 'production' ? createFileSystemCache('.next/fumadocs-story') : undefined,
});
