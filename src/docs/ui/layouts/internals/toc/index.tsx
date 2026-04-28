'use client';

import * as Primitive from 'fumadocs-core/toc';
import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  use,
  useMemo,
  useRef,
} from 'react';

import { cn } from '@/shared/lib/cn';
import { mergeRefs } from '@/shared/lib/merge-refs';

type TOCItem = Primitive.TOCItemType;
type TOCScrollAreaProps = ComponentPropsWithoutRef<'div'>;

const TOCItemsContext = createContext<TOCItem[]>([]);

export type TOCProviderProps = Primitive.AnchorProviderProps;

export const { useActiveAnchor, useActiveAnchors, useItems } = Primitive;

export function useTOCItems(): TOCItem[] {
  return use(TOCItemsContext);
}

export function TOCProvider({ toc, children, ...props }: TOCProviderProps) {
  const items = useMemo(() => toc, [toc]);

  return (
    <TOCItemsContext value={items}>
      <Primitive.AnchorProvider toc={items} {...props}>
        {children}
      </Primitive.AnchorProvider>
    </TOCItemsContext>
  );
}

export const TOCScrollArea = forwardRef<HTMLDivElement, TOCScrollAreaProps>(function TOCScrollArea(
  { className, children, ...props },
  ref,
) {
  const viewportRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={mergeRefs(viewportRef, ref)}
      className={cn(
        'relative ms-px min-h-0 overflow-auto py-3 text-sm [scrollbar-width:none] mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)]',
        className,
      )}
      {...props}
    >
      <Primitive.ScrollProvider containerRef={viewportRef}>
        {children}
      </Primitive.ScrollProvider>
    </div>
  );
});
