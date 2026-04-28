import { defineStory } from '@/docs/runtime/story';

import { DocsStoryPreviewDemo } from './docs-story-preview-demo';

/**
 * Path to this module on disk for ts-morph / fs read (see `defineStory` in `@fumadocs/story`).
 * Do not use `import.meta.url` alone: Turbopack can emit `file:/C:/...`, which their URL check
 * misses on Windows, yielding ENOENT paths like `cwd\\file:\\C:\\...`.
 */
const STORY_SOURCE_FILE = 'src/docs/stories/docs-story-preview-demo.story.tsx';

export const story = defineStory(STORY_SOURCE_FILE, {
  Component: DocsStoryPreviewDemo,
  args: {
    initial: { label: 'Docs preview' },
  },
});
