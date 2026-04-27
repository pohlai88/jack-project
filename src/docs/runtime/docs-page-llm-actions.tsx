'use client';

import { Copy, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';

interface DocsPageLlmActionsProps {
  markdownAbsoluteUrl: string;
}

export function DocsPageLlmActions({ markdownAbsoluteUrl }: DocsPageLlmActionsProps) {
  const t = useTranslations('docs.llm');
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(markdownAbsoluteUrl);
      setCopied(true);
      toast.success(t('copied'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('copyFailed'));
    }
  }

  return (
    <div className="not-prose flex flex-wrap items-center gap-2 border-b pb-4 pt-1">
      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => void copyUrl()}>
        <Copy className="size-3.5" aria-hidden />
        {copied ? t('copiedButton') : t('copyMarkdownUrl')}
      </Button>
      <Button type="button" variant="ghost" size="sm" className="gap-1.5" asChild>
        <a href={markdownAbsoluteUrl} target="_blank" rel="noreferrer">
          <ExternalLink className="size-3.5" aria-hidden />
          {t('openMarkdown')}
        </a>
      </Button>
    </div>
  );
}
