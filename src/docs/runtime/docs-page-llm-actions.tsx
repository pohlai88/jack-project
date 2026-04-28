'use client';

import { Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';

/**
 * Strings resolved in the Server Component via `getTranslations('docs.llm')` and passed in.
 * Avoids `useTranslations` here so this island does not depend on `NextIntlClientProvider`
 * (recommended for mixed RSC/MDX/client previews).
 *
 * @see https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/environments/server-client-components.mdx
 */
export interface DocsPageLlmCopy {
  copyMarkdownUrl: string;
  openMarkdown: string;
  copied: string;
  copiedButton: string;
  copyFailed: string;
}

interface DocsPageLlmActionsProps {
  markdownAbsoluteUrl: string;
  copy: DocsPageLlmCopy;
}

export function DocsPageLlmActions({ markdownAbsoluteUrl, copy }: DocsPageLlmActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(markdownAbsoluteUrl);
      setCopied(true);
      toast.success(copy.copied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(copy.copyFailed);
    }
  }

  return (
    <div className="not-wysiwyg flex flex-wrap items-center gap-2 border-b pb-4 pt-1">
      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => void copyUrl()}>
        <Copy className="size-3.5" aria-hidden />
        {copied ? copy.copiedButton : copy.copyMarkdownUrl}
      </Button>
      <Button type="button" variant="ghost" size="sm" className="gap-1.5" asChild>
        <a href={markdownAbsoluteUrl} target="_blank" rel="noreferrer">
          <ExternalLink className="size-3.5" aria-hidden />
          {copy.openMarkdown}
        </a>
      </Button>
    </div>
  );
}
