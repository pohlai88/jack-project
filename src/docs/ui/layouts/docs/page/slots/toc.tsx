'use client';

import { I18nLabel, useI18n } from 'fumadocs-ui/contexts/i18n';
import { useTreePath } from 'fumadocs-ui/contexts/tree';
import { ChevronDown, Text } from 'lucide-react';
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import { cn } from '@/shared/lib/cn';

import { useDocsLayout } from '../..';
import * as Base from '../../../internals/toc';
import * as TocDefault from '../../../internals/toc/default';

export type TOCProviderProps = Base.TOCProviderProps;

export function TOCProvider(props: TOCProviderProps) {
  return <Base.TOCProvider {...props} />;
}

export type TOCProps = {
  container?: ComponentProps<'div'>;
  header?: ReactNode;
  footer?: ReactNode;
  list?: TocDefault.TOCItemsProps;
};

export function TOC({ container, header, footer, list }: TOCProps) {
  const items = Base.useTOCItems();
  const { TOCItems, TOCEmpty, TOCItem } = TocDefault;

  return (
    <aside
      id="nd-toc"
      aria-labelledby="toc-title"
      {...container}
      className={cn(
        'sticky top-(--fd-docs-row-1) hidden h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] w-(--fd-toc-width) flex-col [grid-area:toc] xl:flex',
        'border-l border-fd-border/60 pb-4 pe-4 pl-6 pt-10',
        container?.className,
      )}
    >
      {header}

      <h3
        id="toc-title"
        className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground"
      >
        <Text className="size-4 opacity-70" aria-hidden="true" />
        <I18nLabel label="toc" />
      </h3>

      <div className="relative min-h-0 flex-1">
        <Base.TOCScrollArea className="h-full pr-2">
          <TOCItems {...list}>
            {items.length === 0 && <TOCEmpty />}
            {items.map((item) => (
              <TOCItem key={item.url} item={item} />
            ))}
          </TOCItems>
        </Base.TOCScrollArea>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-fd-background to-transparent"
        />
      </div>

      {footer}
    </aside>
  );
}

const TocPopoverContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export type TOCPopoverProps = {
  container?: ComponentProps<'div'>;
  trigger?: ComponentProps<'button'>;
  content?: ComponentProps<'div'>;
  header?: ReactNode;
  footer?: ReactNode;
  list?: TocDefault.TOCItemsProps;
};

export function TOCPopover({ container, trigger, content, header, footer, list }: TOCPopoverProps) {
  const items = Base.useTOCItems();
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { isNavTransparent } = useDocsLayout();

  const { TOCItems, TOCItem, TOCEmpty } = TocDefault;

  const onClickOutside = useEffectEvent((event: Event) => {
    if (!open || !(event.target instanceof HTMLElement)) return;
    if (ref.current && !ref.current.contains(event.target)) setOpen(false);
  });

  const onClickItem = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.addEventListener('click', onClickOutside);
    return () => window.removeEventListener('click', onClickOutside);
  }, []);

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
    }),
    [open],
  );

  return (
    <TocPopoverContext value={contextValue}>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        data-toc-popover=""
        {...container}
        className={cn(
          'sticky top-(--fd-docs-row-2) z-10 [grid-area:toc-popover] h-(--fd-toc-popover-height) xl:hidden max-xl:layout:[--fd-toc-popover-height:--spacing(11)]',
          container?.className,
        )}
      >
        <header
          ref={ref}
          className={cn(
            'border-b border-fd-border/60 backdrop-blur transition-all duration-200',
            (!isNavTransparent || open) && 'bg-fd-background/85',
            open && 'shadow-lg',
          )}
        >
          <PageTOCPopoverTrigger {...trigger} />

          <PageTOCPopoverContent {...content}>
            {header}

            <Base.TOCScrollArea className="max-h-[60vh] pr-2">
              <TOCItems {...list}>
                {items.length === 0 && <TOCEmpty />}
                {items.map((item) => (
                  <TOCItem key={item.url} item={item} onClick={onClickItem} />
                ))}
              </TOCItems>
            </Base.TOCScrollArea>

            {footer}
          </PageTOCPopoverContent>
        </header>
      </Collapsible>
    </TocPopoverContext>
  );
}

function PageTOCPopoverTrigger({ className, ...props }: ComponentProps<'button'>) {
  const { text } = useI18n();
  const context = use(TocPopoverContext);
  const open = context?.open ?? false;

  const items = Base.useItems();
  const selectedIndex = items.findIndex((item) => item.active);
  const activeIndex = items.findLastIndex((item) => item.active);
  const path = useTreePath().at(-1);

  const activeTitle = selectedIndex === -1 ? undefined : items[selectedIndex]?.original.title;
  const progressValue = (activeIndex + 1) / Math.max(1, items.length);

  return (
    <CollapsibleTrigger
      data-toc-popover-trigger=""
      {...props}
      className={cn(
        'flex h-11 w-full items-center gap-3 px-4 text-start text-sm transition-colors md:px-6',
        'bg-fd-background/70 hover:bg-fd-accent/60',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring',
        className,
      )}
    >
      <ProgressCircle
        value={progressValue}
        max={1}
        className={cn('shrink-0 text-fd-muted-foreground/60 transition-colors', open && 'text-fd-primary')}
      />

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[11px] font-medium uppercase tracking-wide text-fd-muted-foreground">{text.toc}</span>

        <span className="truncate text-sm font-medium text-fd-foreground">{activeTitle ?? path?.name ?? text.toc}</span>
      </span>

      <ChevronDown
        aria-hidden="true"
        className={cn(
          'size-4 shrink-0 text-fd-muted-foreground transition-transform',
          open && 'rotate-180 text-fd-foreground',
        )}
      />
    </CollapsibleTrigger>
  );
}

interface ProgressCircleProps extends Omit<React.ComponentProps<'svg'>, 'strokeWidth'> {
  value: number;
  strokeWidth?: number;
  size?: number;
  min?: number;
  max?: number;
}

function clamp(input: number, min: number, max: number): number {
  if (input < min) return min;
  if (input > max) return max;
  return input;
}

function ProgressCircle({
  value,
  strokeWidth = 1.75,
  size = 18,
  min = 0,
  max = 100,
  style,
  ...restSvgProps
}: ProgressCircleProps) {
  const normalizedValue = clamp(value, min, max);
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = (normalizedValue / max) * circumference;

  const circleProps = {
    cx: size / 2,
    cy: size / 2,
    r: radius,
    fill: 'none',
    strokeWidth,
  };

  return (
    <svg
      role="progressbar"
      viewBox={`0 0 ${size} ${size}`}
      aria-valuenow={normalizedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      style={{ width: size, height: size, ...style }}
      {...restSvgProps}
    >
      <circle {...circleProps} className="stroke-current/20" />
      <circle
        {...circleProps}
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-300"
      />
    </svg>
  );
}

function PageTOCPopoverContent({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <CollapsibleContent
      data-toc-popover-content=""
      {...props}
      className={cn('border-t border-fd-border/60 bg-fd-background/95 backdrop-blur', className)}
    >
      <div className="flex max-h-[60vh] flex-col gap-2 px-4 py-3 md:px-6">{children}</div>
    </CollapsibleContent>
  );
}
