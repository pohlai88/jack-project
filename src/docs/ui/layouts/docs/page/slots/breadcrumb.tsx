'use client';

import { type BreadcrumbOptions, getBreadcrumbItemsFromPath } from 'fumadocs-core/breadcrumb';
import Link from 'fumadocs-core/link';
import { useTreeContext, useTreePath } from 'fumadocs-ui/contexts/tree';
import { ChevronRight } from 'lucide-react';
import { type ComponentProps, Fragment, useMemo } from 'react';

import { cn } from '@/shared/lib/cn';

export type BreadcrumbProps = BreadcrumbOptions & ComponentProps<'nav'>;

export function Breadcrumb({ includeRoot, includeSeparator, includePage, className, ...props }: BreadcrumbProps) {
  const path = useTreePath();
  const { root } = useTreeContext();

  const items = useMemo(
    () =>
      getBreadcrumbItemsFromPath(root, path, {
        includePage,
        includeSeparator,
        includeRoot,
      }),
    [includePage, includeRoot, includeSeparator, path, root],
  );

  if (items.length === 0) return null;

  return (
    <nav
      {...props}
      aria-label="Breadcrumb"
      className={cn(
        'mb-4 flex min-w-0 items-center overflow-hidden rounded-full',
        'border border-fd-border/70 bg-fd-muted/30 px-3 py-1.5',
        'text-xs text-fd-muted-foreground shadow-sm backdrop-blur',
        className,
      )}
    >
      <ol className="flex min-w-0 items-center gap-1.5">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          const itemClassName = cn(
            'max-w-[12rem] truncate rounded-full px-1.5 py-0.5 transition-colors',
            isCurrent
              ? 'bg-fd-background text-fd-foreground font-medium shadow-sm'
              : 'hover:bg-fd-muted hover:text-fd-foreground',
          );

          return (
            <Fragment key={`${item.name}-${item.url ?? index}`}>
              {index !== 0 && (
                <ChevronRight aria-hidden="true" className="size-3 shrink-0 text-fd-muted-foreground/60" />
              )}

              <li className="min-w-0">
                {item.url && !isCurrent ? (
                  <Link href={item.url} className={itemClassName}>
                    {item.name}
                  </Link>
                ) : (
                  <span aria-current={isCurrent ? 'page' : undefined} className={itemClassName}>
                    {item.name}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
