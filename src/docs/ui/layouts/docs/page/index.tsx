'use client';
import type { TOCItemType } from 'fumadocs-core/toc';
import { type ComponentProps, createContext, type FC, use } from 'react';
import { cn } from '@/shared/lib/cn';
import { Breadcrumb, type BreadcrumbProps } from './slots/breadcrumb';
import { Container } from './slots/container';
import { Footer, type FooterProps } from './slots/footer';
import { TOC, TOCPopover, type TOCPopoverProps, type TOCProps, TOCProvider, type TOCProviderProps } from './slots/toc';

export interface DocsPageProps extends ComponentProps<'article'> {
  toc?: TOCItemType[];

  /**
   * Extend the page to fill all available space
   *
   * @defaultValue false
   */
  full?: boolean;
}

interface DocsPageSlots {
  toc: {
    provider: FC<TOCProviderProps>;
    main: FC<TOCProps>;
    popover: FC<TOCPopoverProps>;
  };
  container: FC<ComponentProps<'article'>>;
  footer: FC<FooterProps>;
  breadcrumb: FC<BreadcrumbProps>;
}

type PageSlotsProps = Pick<DocsPageProps, 'full'>;

const PageContext = createContext<{
  props: PageSlotsProps;
  slots: DocsPageSlots;
} | null>(null);

export function useDocsPage() {
  const context = use(PageContext);
  if (!context) throw new Error('Please use page components under <DocsPage /> (`fumadocs-ui/layouts/docs/page`).');
  return context;
}

export function DocsPage({ full = false, toc = [], children, ...containerProps }: DocsPageProps) {
  const tocEnabled = !full && toc.length > 0;
  const tocPopoverEnabled = toc.length > 0;

  const slots: DocsPageSlots = {
    breadcrumb: Breadcrumb,
    footer: Footer,
    toc: {
      provider: TOCProvider,
      main: TOC,
      popover: TOCPopover,
    },
    container: Container,
  };

  return (
    <PageContext
      value={{
        props: { full },
        slots,
      }}
    >
      <slots.toc.provider toc={tocEnabled || tocPopoverEnabled ? toc : []}>
        {tocPopoverEnabled && <slots.toc.popover />}
        <slots.container {...containerProps}>
          <slots.breadcrumb />
          {children}
          <slots.footer />
        </slots.container>
        {tocEnabled && <slots.toc.main />}
      </slots.toc.provider>
    </PageContext>
  );
}

/**
 * Add typography styles
 */
export function DocsBody({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div {...props} className={cn('prose flex-1', className)}>
      {children}
    </div>
  );
}

export function DocsDescription({ children, className, ...props }: ComponentProps<'p'>) {
  // Don't render if no description provided
  if (children === undefined) return null;

  return (
    <p {...props} className={cn('mb-8 text-lg text-fd-muted-foreground', className)}>
      {children}
    </p>
  );
}

export function DocsTitle({ children, className, ...props }: ComponentProps<'h1'>) {
  return (
    <h1 {...props} className={cn('text-[1.75em] font-semibold', className)}>
      {children}
    </h1>
  );
}
