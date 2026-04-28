import type { ReactNode } from 'react';

interface DocsStoryFrameProps {
  eyebrow?: string;
  title?: string;
  status?: string;
  children: ReactNode;
}

export function DocsStoryFrame({
  eyebrow = 'Example',
  title = 'Interactive Preview',
  status = 'Live',
  children,
}: DocsStoryFrameProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-fd-border/70 bg-fd-background p-6 shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--fd-primary)/0.08),transparent_42%)]" />

      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-fd-border/60 pb-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">{eyebrow}</p>
            <h3 className="mt-1 text-sm font-semibold text-fd-foreground">{title}</h3>
          </div>

          <span className="rounded-full border border-fd-border/70 bg-fd-muted/40 px-2 py-0.5 text-[11px] font-medium text-fd-muted-foreground">
            {status}
          </span>
        </div>

        <div className="rounded-xl border border-fd-border/60 bg-fd-muted/30 p-4">{children}</div>
      </div>
    </div>
  );
}
