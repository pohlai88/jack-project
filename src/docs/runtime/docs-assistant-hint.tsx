import { Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

interface DocsAssistantHintProps {
  className?: string;
}

export async function DocsAssistantHint({ className }: DocsAssistantHintProps) {
  const t = await getTranslations('docs.llm');

  return (
    <aside
      aria-labelledby="docs-assistant-hint-title"
      className={[
        'group relative mb-6 overflow-hidden rounded-2xl border border-fd-border/70',
        'bg-linear-to-br from-fd-muted/70 via-fd-background to-fd-muted/30',
        'px-4 py-4 text-sm shadow-sm',
        'transition-all duration-300 hover:border-fd-primary/40 hover:shadow-md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--fd-primary)/0.12),transparent_36%)]" />
      <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-fd-primary/10 blur-2xl transition-opacity group-hover:opacity-80" />

      <div className="relative flex gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-fd-border/70 bg-fd-background/80 text-fd-primary shadow-sm">
          <Sparkles className="size-4" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 id="docs-assistant-hint-title" className="text-sm font-semibold text-fd-foreground">
            {t('assistantHintTitle')}
          </h2>

          <p className="mt-1 max-w-prose leading-6 text-fd-muted-foreground">{t('assistantHint')}</p>

          <div className="mt-3">
            <Link
              href="/"
              className={[
                'inline-flex items-center rounded-full border border-fd-border/80',
                'bg-fd-background/80 px-3 py-1.5 text-xs font-semibold text-fd-foreground shadow-sm',
                'transition-all duration-200 hover:-translate-y-0.5 hover:border-fd-primary/50 hover:bg-fd-accent hover:shadow',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2',
              ].join(' ')}
            >
              {t('assistantCta')}
              <span className="ml-1.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
