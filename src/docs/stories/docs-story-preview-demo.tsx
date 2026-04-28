'use client';

export interface DocsStoryPreviewDemoProps {
  /** Short label shown in the preview frame */
  label?: string;
}

/** Minimal client component for verifying `@fumadocs/story` controls in docs MDX. */
export function DocsStoryPreviewDemo({ label = 'Afenda' }: DocsStoryPreviewDemoProps) {
  return (
    <div className="bg-muted/40 text-muted-foreground rounded-lg border border-border px-4 py-3 text-sm">{label}</div>
  );
}
