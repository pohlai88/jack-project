'use client';

import * as Primitive from 'fumadocs-core/toc';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import {
  type ComponentProps,
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@/shared/lib/cn';
import { mergeRefs } from '@/shared/lib/merge-refs';
import { useTOCItems } from './index';

export type TOCItemsProps = ComponentProps<'div'>;

interface ComputedData {
  positions: [top: number, bottom: number][];
}

function createHrefSelector(href: string): string {
  return `a[href="${CSS.escape(href)}"]`;
}

export function TOCItems({ ref, className, ...props }: TOCItemsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useTOCItems();
  const [computed, setComputed] = useState<ComputedData | null>(null);

  const compute = useCallback(() => {
    const container = containerRef.current;

    if (!container || items.length === 0) {
      setComputed(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const positions: [top: number, bottom: number][] = [];

    for (const item of items) {
      const element = container.querySelector(createHrefSelector(item.url));

      if (!(element instanceof HTMLElement)) continue;

      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);

      positions.push([
        rect.top - containerRect.top + parseFloat(styles.paddingTop),
        rect.bottom - containerRect.top - parseFloat(styles.paddingBottom),
      ]);
    }

    setComputed(positions.length > 0 ? { positions } : null);
  }, [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame = 0;

    const scheduleCompute = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(compute);
    };

    const observer = new ResizeObserver(scheduleCompute);
    observer.observe(container);

    scheduleCompute();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [compute]);

  return (
    <div className="relative">
      {computed ? <TOCThumb computed={computed} /> : null}

      <div
        ref={mergeRefs(ref, containerRef)}
        className={cn('flex flex-col border-s border-fd-foreground/10', className)}
        {...props}
      />
    </div>
  );
}

function getThumbStyle(
  tocItems: Primitive.TOCItemInfo[],
  computed: ComputedData,
): CSSProperties {
  const startIndex = tocItems.findIndex((item) => item.active);

  if (startIndex === -1) {
    return {};
  }

  const endIndex = tocItems.findLastIndex((item) => item.active);
  const start = computed.positions[startIndex];
  const end = computed.positions[endIndex];

  if (!start || !end) {
    return {};
  }

  return {
    '--track-top': `${start[0]}px`,
    '--track-bottom': `${end[1]}px`,
  } as CSSProperties;
}

function TOCThumb({ computed }: { computed: ComputedData }) {
  const ref = useRef<HTMLDivElement>(null);
  const tocInfo = Primitive.useTOC();

  Primitive.useTOCListener((items) => {
    const element = ref.current;
    if (!element) return;

    const styles = getThumbStyle(items, computed);

    for (const [key, value] of Object.entries(styles)) {
      element.style.setProperty(key, String(value));
    }
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-y-0 inset-s-0 w-px bg-fd-primary transition-[clip-path]"
      style={{
        clipPath:
          'polygon(0 var(--track-top,0), 100% var(--track-top,0), 100% var(--track-bottom,0), 0 var(--track-bottom,0))',
        ...getThumbStyle(tocInfo.get(), computed),
      }}
    />
  );
}

export function TOCEmpty() {
  const { text } = useI18n();

  return (
    <div className="rounded-lg border bg-fd-card p-3 text-xs text-fd-muted-foreground">
      {text.tocNoHeadings}
    </div>
  );
}

export function TOCItem({
  item,
  ...props
}: Primitive.TOCItemProps & {
  item: Primitive.TOCItemType;
}) {
  return (
    <Primitive.TOCItem
      href={item.url}
      {...props}
      className={cn(
        'prose py-1.5 text-sm text-fd-muted-foreground scroll-m-4 transition-colors wrap-anywhere first:pt-0 last:pb-0 data-[active=true]:text-fd-primary hover:text-fd-accent-foreground',
        item.depth <= 2 && 'ps-3',
        item.depth === 3 && 'ps-6',
        item.depth >= 4 && 'ps-8',
        props.className,
      )}
    >
      {item.title}
    </Primitive.TOCItem>
  );
}
