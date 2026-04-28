'use client';

export interface DocsStoryPreviewDemoProps {
  /** Short label shown in the preview frame */
  label?: string;
}

export function DocsStoryPreviewDemo({ label = 'Afenda' }: DocsStoryPreviewDemoProps) {
  return (
    <div
      className={[
        // Container
        'group relative overflow-hidden rounded-xl border border-border/70',
        'bg-linear-to-br from-background via-muted/40 to-background',
        'px-4 py-3 text-sm shadow-sm',

        // Interaction polish
        'transition-all duration-200 hover:shadow-md',
      ].join(' ')}
    >
      {/* subtle highlight */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_40%)] opacity-70" />

      <div className="relative flex items-center justify-between gap-3">
        {/* Label */}
        <span className="font-medium text-foreground">{label}</span>

        {/* Status pill (adds realism) */}
        <span className="rounded-full border border-border/70 bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          Preview
        </span>
      </div>
    </div>
  );
}
