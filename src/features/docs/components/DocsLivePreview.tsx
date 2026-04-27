'use client';

import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DOCS_COMPONENT_REGISTRY, parsePreviewBlock } from '../lib/docs-component-registry';

interface DocsLivePreviewProps {
  raw: string;
}

export function DocsLivePreview({ raw }: DocsLivePreviewProps) {
  const t = useTranslations('docs.preview');
  const parsed = parsePreviewBlock(raw);

  if (!parsed) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
        {t.rich('invalidBlock', {
          code: (chunks) => <code>{chunks}</code>,
        })}
      </div>
    );
  }

  const factory = DOCS_COMPONENT_REGISTRY[parsed.component];

  if (!factory) {
    return (
      <div className="rounded-lg border border-warning/50 bg-warning/5 p-4 text-sm text-muted-foreground">
        {t.rich('notRegistered', {
          component: parsed.component,
          code: (chunks) => <code className="font-mono text-foreground">{chunks}</code>,
        })}
      </div>
    );
  }

  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2 bg-muted/30">
        <Eye className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">{t('title')}</span>
        <span className="text-xs text-muted-foreground/60">— {parsed.component}</span>
      </div>
      <div className="p-6 flex items-center justify-center">{factory(parsed.props)}</div>
    </div>
  );
}
