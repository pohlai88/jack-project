'use client';

import { Bot, CalendarDays, Check, ChevronDown, Copy, ExternalLink, FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

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
  lastUpdated?: string;
}

export function DocsPageLlmActions({
  markdownAbsoluteUrl,
  copy,
  lastUpdated,
}: DocsPageLlmActionsProps) {
  const resetTimerRef = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function copyUrl() {
    if (isCopying) return;

    setIsCopying(true);

    try {
      await navigator.clipboard.writeText(markdownAbsoluteUrl);

      setCopied(true);
      toast.success(copy.copied);

      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        resetTimerRef.current = null;
      }, 2000);
    } catch {
      toast.error(copy.copyFailed);
    } finally {
      setIsCopying(false);
    }
  }

  const aiPrompt = `Read ${markdownAbsoluteUrl}. I want to ask questions about this Afenda documentation page.`;
  const aiLinks = [
    {
      label: 'Open in ChatGPT',
      href: `https://chatgpt.com/?${new URLSearchParams({
        hints: 'search',
        q: aiPrompt,
      })}`,
    },
    {
      label: 'Open in Claude',
      href: `https://claude.ai/new?${new URLSearchParams({
        q: aiPrompt,
      })}`,
    },
    {
      label: 'Open in Cursor',
      href: `https://cursor.com/link/prompt?${new URLSearchParams({
        text: aiPrompt,
      })}`,
    },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <div
        className="not-wysiwyg docs-page-actions"
        aria-label="Markdown page actions"
      >
        {lastUpdated ? (
          <div className="docs-page-actions__updated" aria-label={`Last updated ${lastUpdated}`}>
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <span>Updated {lastUpdated}</span>
          </div>
        ) : null}

        <div className="docs-page-actions__controls">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="docs-page-actions__button"
                disabled={isCopying}
                aria-live="polite"
                onClick={() => void copyUrl()}
              >
                {copied ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  <Copy className="size-3.5" aria-hidden="true" />
                )}
                <span>{copied ? copy.copiedButton : copy.copyMarkdownUrl}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copy.copyMarkdownUrl}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="docs-page-actions__button" asChild>
                <a href={markdownAbsoluteUrl} target="_blank" rel="noreferrer noopener">
                  <FileText className="size-3.5" aria-hidden="true" />
                  <span>{copy.openMarkdown}</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{copy.openMarkdown}</TooltipContent>
          </Tooltip>

          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button type="button" variant="ghost" size="sm" className="docs-page-actions__button">
                    <Bot className="size-3.5" aria-hidden="true" />
                    <span>Open in AI</span>
                    <ChevronDown className="size-3.5" aria-hidden="true" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Open in AI</TooltipContent>
            </Tooltip>

            <PopoverContent align="end" className="docs-page-actions__ai-menu">
              {aiLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="docs-page-actions__ai-link"
                >
                  <Bot className="size-4" aria-hidden="true" />
                  {item.label}
                  <ExternalLink className="ms-auto size-3.5" aria-hidden="true" />
                </a>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </TooltipProvider>
  );
}
