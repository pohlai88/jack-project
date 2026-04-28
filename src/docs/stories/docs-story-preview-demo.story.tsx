import { defineStory } from '@/docs/runtime/story';

import { DocsStoryFrame } from './docs-story-frame';
import { DocsStoryPreviewDemo, type DocsStoryPreviewDemoProps } from './docs-story-preview-demo';

/**
 * Stable file path for ts-morph / fs read.
 */
const STORY_SOURCE_FILE = 'src/docs/stories/docs-story-preview-demo.story.tsx';

function DocsStoryPreviewDemoFramed(props: DocsStoryPreviewDemoProps) {
  return (
    <DocsStoryFrame>
      <DocsStoryPreviewDemo {...props} />
    </DocsStoryFrame>
  );
}

export const story = defineStory(STORY_SOURCE_FILE, {
  Component: DocsStoryPreviewDemoFramed,
  args: {
    initial: { label: 'Docs preview' },
  },
});
