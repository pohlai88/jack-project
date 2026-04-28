'use client';

import { usePathname } from 'fumadocs-core/framework';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import { Check, ChevronDown, Copy, ExternalLinkIcon, TextIcon } from 'lucide-react';
import { type ComponentProps, type ReactNode, useMemo, useState } from 'react';
import { buttonVariants } from '../../../shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shared/components/ui/popover';
import { cn } from '../../../shared/lib/cn';

const cache = new Map<string, Promise<string>>();

export function MarkdownCopyButton({
  markdownUrl,
  ...props
}: ComponentProps<'button'> & {
  markdownUrl: string;
}) {
  const [isLoading, setLoading] = useState(false);

  const [checked, onClick] = useCopyButton(async () => {
    let promise = cache.get(markdownUrl);

    if (!promise) {
      setLoading(true);
      promise = fetch(markdownUrl).then((res) => res.text());
      cache.set(markdownUrl, promise);
    }

    try {
      const text = await promise;
      await navigator.clipboard.writeText(text);
    } finally {
      setLoading(false);
    }
  });

  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      {...props}
      className={cn(
        buttonVariants({
          variant: 'secondary',
          size: 'sm',
          className: 'gap-2 [&_svg]:size-3.5 [&_svg]:text-fd-muted-foreground',
        }),
        props.className,
      )}
    >
      {checked ? <Check /> : <Copy />}
      {props.children ?? 'Copy Markdown'}
    </button>
  );
}

export function ViewOptionsPopover({
  markdownUrl,
  githubUrl,
  ...props
}: ComponentProps<typeof PopoverTrigger> & {
  markdownUrl?: string;
  githubUrl?: string;
}) {
  const pathname = usePathname();

  const items = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    const pageUrl = origin ? `${origin}${pathname}` : pathname;

    const prompt = `Read ${pageUrl}. I want to ask questions about it.`;

    const list = [
      githubUrl && {
        title: 'Open in GitHub',
        href: githubUrl,
        icon: <ExternalLinkIcon />,
      },

      markdownUrl && {
        title: 'View as Markdown',
        href: markdownUrl,
        icon: <TextIcon />,
      },

      {
        title: 'Open in ChatGPT',
        href: `https://chatgpt.com/?${new URLSearchParams({
          hints: 'search',
          q: prompt,
        })}`,
        icon: <ExternalLinkIcon />,
      },

      {
        title: 'Open in Claude',
        href: `https://claude.ai/new?${new URLSearchParams({
          q: prompt,
        })}`,
        icon: <ExternalLinkIcon />,
      },

      {
        title: 'Open in Cursor',
        href: `https://cursor.com/link/prompt?${new URLSearchParams({
          text: prompt,
        })}`,
        icon: <ExternalLinkIcon />,
      },
    ];

    return list.filter(Boolean) as {
      title: string;
      href: string;
      icon: ReactNode;
    }[];
  }, [githubUrl, markdownUrl, pathname]);

  return (
    <Popover>
      <PopoverTrigger
        {...props}
        className={cn(
          buttonVariants({
            variant: 'secondary',
            size: 'sm',
          }),
          'gap-2 data-[state=open]:bg-fd-accent data-[state=open]:text-fd-accent-foreground',
          props.className,
        )}
      >
        {props.children ?? 'Open'}
        <ChevronDown className="size-3.5 text-fd-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent className="flex flex-col">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm p-2 rounded-lg inline-flex items-center gap-2 hover:text-fd-accent-foreground hover:bg-fd-accent [&_svg]:size-4"
          >
            {item.icon}
            {item.title}
            <ExternalLinkIcon className="ms-auto size-3.5 text-fd-muted-foreground" />
          </a>
        ))}
      </PopoverContent>
    </Popover>
  );
}
