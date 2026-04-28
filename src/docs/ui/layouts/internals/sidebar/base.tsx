'use client';

import { Presence } from '@radix-ui/react-presence';
import { usePathname } from 'fumadocs-core/framework';
import Link, { type LinkProps } from 'fumadocs-core/link';
import { useMediaQuery } from 'fumadocs-core/utils/use-media-query';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import { ChevronDown, ExternalLink } from 'lucide-react';
import {
  type ComponentProps,
  createContext,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';

import {
  Collapsible,
  CollapsibleContent,
  type CollapsibleContentProps,
  CollapsibleTrigger,
  type CollapsibleTriggerProps,
} from '@/shared/components/ui/collapsible';
import { ScrollArea, ScrollViewport } from '@/shared/components/ui/scroll-area';
import { cn } from '@/shared/lib/cn';

type Mode = 'drawer' | 'full';

interface SidebarContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  closeOnRedirect: RefObject<boolean>;
  defaultOpenLevel: number;
  prefetch?: boolean;
  mode: Mode;
}

interface FolderContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  depth: number;
  collapsible: boolean;
}

export interface SidebarProviderProps {
  defaultOpenLevel?: number;
  prefetch?: boolean;
  children?: ReactNode;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);
const FolderContext = createContext<FolderContextValue | null>(null);

export function SidebarProvider({ defaultOpenLevel = 0, prefetch, children }: SidebarProviderProps) {
  const closeOnRedirect = useRef(true);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();
  const isDrawer = useMediaQuery('(width < 768px)');
  const mode: Mode = isDrawer ? 'drawer' : 'full';

  useOnChange(pathname, () => {
    if (closeOnRedirect.current) {
      setOpen(false);
    }

    closeOnRedirect.current = true;
  });

  const value = useMemo<SidebarContextValue>(
    () => ({
      open,
      setOpen,
      collapsed,
      setCollapsed,
      closeOnRedirect,
      defaultOpenLevel,
      prefetch,
      mode,
    }),
    [open, collapsed, defaultOpenLevel, prefetch, mode],
  );

  return <SidebarContext value={value}>{children}</SidebarContext>;
}

export function useSidebar(): SidebarContextValue {
  const context = use(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used inside <SidebarProvider>.');
  }

  return context;
}

export function useFolder(): FolderContextValue {
  const context = use(FolderContext);

  if (!context) {
    throw new Error('useFolder must be used inside <SidebarFolder>.');
  }

  return context;
}

export function useOptionalFolder(): FolderContextValue | null {
  return use(FolderContext);
}

export function useFolderDepth(): number {
  return useOptionalFolder()?.depth ?? 0;
}

export function SidebarContent({
  mode: allowedMode = 'full',
  children,
}: {
  mode?: Mode | true;
  children: (state: {
    ref: RefObject<HTMLElement | null>;
    collapsed: boolean;
    hovered: boolean;
    onPointerEnter: (event: PointerEvent) => void;
    onPointerLeave: (event: PointerEvent) => void;
  }) => ReactNode;
}) {
  const { collapsed, mode } = useSidebar();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useOnChange(collapsed, () => {
    if (collapsed) setHovered(false);
  });

  if (allowedMode !== true && allowedMode !== mode) {
    return null;
  }

  function clearCloseTimer() {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function shouldIgnoreHover(event: PointerEvent): boolean {
    const element = ref.current;

    return !element || !collapsed || event.pointerType === 'touch' || element.getAnimations().length > 0;
  }

  return children({
    ref,
    collapsed,
    hovered,
    onPointerEnter(event) {
      if (shouldIgnoreHover(event)) return;

      clearCloseTimer();
      setHovered(true);
    },
    onPointerLeave(event) {
      if (shouldIgnoreHover(event)) return;

      clearCloseTimer();

      const distanceFromViewportEdge = Math.min(event.clientX, document.body.clientWidth - event.clientX);

      closeTimerRef.current = window.setTimeout(() => setHovered(false), distanceFromViewportEdge > 100 ? 0 : 500);
    },
  });
}

export function SidebarViewport({
  area,
  viewport,
  children,
}: {
  area?: ComponentProps<typeof ScrollArea>;
  viewport?: ComponentProps<typeof ScrollViewport>;
  children: ReactNode;
}) {
  return (
    <ScrollArea {...area} className={cn('min-h-0 flex-1', area?.className)}>
      <ScrollViewport
        {...viewport}
        className={cn(
          '*:flex! *:flex-col! *:gap-0.5! p-4 overscroll-contain mask-[linear-gradient(to_bottom,transparent,white_12px,white_calc(100%-12px),transparent)]',
          viewport?.className,
        )}
      >
        {children}
      </ScrollViewport>
    </ScrollArea>
  );
}

export function SidebarDrawerOverlay(props: ComponentProps<'div'>) {
  const { open, setOpen, mode } = useSidebar();

  if (mode !== 'drawer') return null;

  return (
    <Presence present={open}>
      <div role="presentation" data-state={open ? 'open' : 'closed'} onClick={() => setOpen(false)} {...props} />
    </Presence>
  );
}

export function SidebarDrawerContent({ className, children, ...props }: ComponentProps<'aside'>) {
  const { open, mode } = useSidebar();

  if (mode !== 'drawer') return null;

  return (
    <Presence present={open}>
      {({ present }) => (
        <aside
          id="nd-sidebar-mobile"
          aria-hidden={!open}
          data-state={open ? 'open' : 'closed'}
          className={cn(!present && 'invisible', className)}
          {...props}
        >
          {children}
        </aside>
      )}
    </Presence>
  );
}

export function SidebarSeparator(props: ComponentProps<'p'>) {
  return <p role="separator" {...props} />;
}

export function SidebarItem({
  icon,
  active = false,
  children,
  ...props
}: LinkProps & {
  active?: boolean;
  icon?: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { prefetch } = useSidebar();

  useAutoScroll(active, ref);

  return (
    <Link ref={ref} aria-current={active ? 'page' : undefined} data-active={active} prefetch={prefetch} {...props}>
      {icon ?? (props.external ? <ExternalLink aria-hidden="true" /> : null)}
      {children}
    </Link>
  );
}

export function SidebarFolder({
  defaultOpen: defaultOpenProp,
  collapsible = true,
  active = false,
  children,
  ...props
}: ComponentProps<'div'> & {
  active?: boolean;
  defaultOpen?: boolean;
  collapsible?: boolean;
}) {
  const { defaultOpenLevel } = useSidebar();
  const depth = useFolderDepth() + 1;

  const shouldDefaultOpen = !collapsible || active || (defaultOpenProp ?? defaultOpenLevel >= depth);

  const [open, setOpen] = useState(shouldDefaultOpen);

  useOnChange(shouldDefaultOpen, (nextOpen) => {
    if (nextOpen) setOpen(true);
  });

  const value = useMemo<FolderContextValue>(
    () => ({
      open,
      setOpen,
      depth,
      collapsible,
    }),
    [open, depth, collapsible],
  );

  return (
    <Collapsible open={open} onOpenChange={setOpen} disabled={!collapsible} {...props}>
      <FolderContext value={value}>{children}</FolderContext>
    </Collapsible>
  );
}

export function SidebarFolderTrigger({ children, ...props }: CollapsibleTriggerProps) {
  const { open, collapsible } = useFolder();

  if (!collapsible) {
    return <div {...(props as ComponentProps<'div'>)}>{children}</div>;
  }

  return (
    <CollapsibleTrigger aria-expanded={open} {...props}>
      {children}
      <ChevronDown
        aria-hidden="true"
        data-icon
        className={cn('ms-auto transition-transform', !open && '-rotate-90 rtl:rotate-90')}
      />
    </CollapsibleTrigger>
  );
}

export function SidebarFolderLink({
  children,
  active = false,
  ...props
}: LinkProps & {
  active?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { open, setOpen, collapsible } = useFolder();
  const { prefetch } = useSidebar();

  useAutoScroll(active, ref);

  return (
    <Link
      ref={ref}
      aria-current={active ? 'page' : undefined}
      data-active={active}
      onClick={(event) => {
        if (!collapsible) return;

        const target = event.target;

        if (target instanceof Element && target.matches('[data-icon], [data-icon] *')) {
          event.preventDefault();
          setOpen((prev) => !prev);
          return;
        }

        setOpen(active ? !open : true);
      }}
      prefetch={prefetch}
      {...props}
    >
      {children}

      {collapsible ? (
        <ChevronDown
          aria-hidden="true"
          data-icon
          className={cn('ms-auto transition-transform', !open && '-rotate-90 rtl:rotate-90')}
        />
      ) : null}
    </Link>
  );
}

export function SidebarFolderContent(props: CollapsibleContentProps) {
  return <CollapsibleContent {...props}>{props.children}</CollapsibleContent>;
}

export function SidebarTrigger({ children, ...props }: ComponentProps<'button'>) {
  const { open, setOpen } = useSidebar();

  return (
    <button
      type="button"
      aria-label={open ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={open}
      onClick={() => setOpen((prev) => !prev)}
      {...props}
    >
      {children}
    </button>
  );
}

export function SidebarCollapseTrigger(props: ComponentProps<'button'>) {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <button
      type="button"
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-pressed={collapsed}
      data-collapsed={collapsed}
      onClick={() => setCollapsed((prev) => !prev)}
      {...props}
    >
      {props.children}
    </button>
  );
}

export function useAutoScroll(active: boolean, ref: RefObject<HTMLElement | null>) {
  const { mode } = useSidebar();

  useEffect(() => {
    if (!active || !ref.current) return;

    scrollIntoView(ref.current, {
      boundary: document.getElementById(mode === 'drawer' ? 'nd-sidebar-mobile' : 'nd-sidebar'),
      scrollMode: 'if-needed',
    });
  }, [active, mode, ref]);
}
