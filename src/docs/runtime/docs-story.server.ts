import 'server-only';

import { createFileSystemCache, defineStoryFactory } from '@fumadocs/story';

const STORY_CACHE_PATH = '.next/fumadocs-story' as const;

export const { defineStory } = defineStoryFactory({
  cache: resolveStoryCache(),
});

function resolveStoryCache() {
  if (process.env.NODE_ENV !== 'production') {
    return undefined;
  }

  try {
    return createFileSystemCache(STORY_CACHE_PATH);
  } catch {
    return undefined;
  }
}
