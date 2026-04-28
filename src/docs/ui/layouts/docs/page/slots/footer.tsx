'use client';

import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useFooterItems } from 'fumadocs-ui/utils/use-footer-items';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type ComponentProps, useMemo } from 'react';

import { cn } from '@/shared/lib/cn';
import { isActive } from '@/shared/lib/urls';

type Item = Pick<PageTree.Item, 'name' | 'description' | 'url'>;

export interface FooterProps extends ComponentProps<'nav'> {
  items?: {
    previous?: Item;
    next?: Item;
  };
}

export function Footer({ items, children, className, ...props }: FooterProps) {
  const footerList = useFooterItems();
  const pathname = usePathname();

  const { previous, next } = useMemo(() => {
    if (items) return items;

    const index = footerList.findIndex((item) => isActive(item.url, pathname));

    if (index === -1) return {};

    return {
      previous: footerList[index - 1],
      next: footerList[index + 1],
    };
  }, [footerList, items, pathname]);

  if (!previous && !next && !children) return null;

  return (
    <>
      {(previous || next) && (
        <nav
          aria-label="Documentation pagination"
          className={cn(
            '@container mt-10 grid gap-4 border-t border-fd-border/70 pt-6',
            previous && next ? 'grid-cols-2' : 'grid-cols-1',
            className,
          )}
          {...props}
        >
          {previous ? <FooterItem item={previous} direction="previous" /> : <div />}
          {next ? <FooterItem item={next} direction="next" /> : <div />}
        </nav>
      )}

      {children}
    </>
  );
}

function FooterItem({ item, direction }: { item: Item; direction: 'previous' | 'next' }) {
  const { text } = useI18n();

  const isNext = direction === 'next';
  const Icon = isNext ? ChevronRight : ChevronLeft;
  const label = isNext ? text.nextPage : text.previousPage;

  return (
    <Link
      href={item.url}
      className={cn(
        'group relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-2xl',
        'border border-fd-border/70 bg-fd-muted/30 p-4 text-sm shadow-sm',
        'transition-all duration-200 hover:-translate-y-0.5 hover:border-fd-primary/40 hover:bg-fd-accent/70 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring focus-visible:ring-offset-2',
        '@max-lg:col-span-full',
        isNext && 'items-end text-end',
      )}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">{label}</span>

      <div className={cn('flex min-w-0 items-center gap-2 text-fd-foreground', isNext && 'flex-row-reverse')}>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-fd-border/70 bg-fd-background shadow-sm transition-transform group-hover:scale-105">
          <Icon className="size-4 rtl:rotate-180" aria-hidden="true" />
        </span>

        <span className="truncate font-semibold">{item.name}</span>
      </div>

      <p className="line-clamp-2 text-fd-muted-foreground">{item.description ?? label}</p>
    </Link>
  );
}
