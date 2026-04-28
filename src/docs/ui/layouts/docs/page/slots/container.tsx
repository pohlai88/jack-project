'use client';

import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/cn';
import { useDocsPage } from './..';

export function Container({ className, children, ...props }: ComponentProps<'article'>) {
  const {
    props: { full },
  } = useDocsPage();

  return (
    <article
      id="nd-page"
      data-full={full}
      {...props}
      className={cn(
        'relative flex w-full flex-col [grid-area:main]',
        'mx-auto min-w-0 px-4 py-8 md:px-6 md:py-10 xl:px-8 xl:py-14',
        'gap-6',

        full ? 'max-w-[1168px]' : 'max-w-[900px] xl:layout:[--fd-toc-width:268px]',

        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-4 top-0 h-px',
          'bg-gradient-to-r from-transparent via-fd-border to-transparent',
          full && 'inset-x-8',
        )}
      />

      {children}
    </article>
  );
}
