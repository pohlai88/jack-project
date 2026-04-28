'use client';

import { TreeContextProvider } from 'fumadocs-ui/contexts/tree';
import { useIsScrollTop } from 'fumadocs-ui/utils/use-is-scroll-top';
import { type ComponentProps, createContext, type FC, use } from 'react';
import { Container } from './slots/container';
import { Header } from './slots/header';
import {
  Sidebar,
  type SidebarProps,
  SidebarProvider,
  type SidebarProviderProps,
  SidebarTrigger,
  useSidebar,
} from './slots/sidebar';
import { baseSlots, useLinkItems } from '../shared';
import type { BaseSlots, BaseSlotsProps, LayoutTab, LinkItemType } from '../shared';
import type { DocsLayoutProps } from './index';

export interface DocsSlots extends BaseSlots {
  container: FC<ComponentProps<'div'>>;
  header: FC<ComponentProps<'header'>>;
  sidebar: {
    provider: FC<SidebarProviderProps>;
    root: FC<SidebarProps>;
    trigger: FC<ComponentProps<'button'>>;
    useSidebar: () => { collapsed: boolean; open: boolean; setOpen: (v: boolean) => void };
  };
}

const { useProvider } = baseSlots({
  useProps() {
    return useDocsLayout().props;
  },
});

interface SlotsProps extends BaseSlotsProps<DocsLayoutProps> {
  tabs: LayoutTab[];
  tabMode: 'auto';
}

const LayoutContext = createContext<{
  props: SlotsProps;
  isNavTransparent: boolean;
  navItems: LinkItemType[];
  menuItems: LinkItemType[];
  slots: DocsSlots;
} | null>(null);

export function useIsDocsLayout() {
  return use(LayoutContext) !== null;
}

export function useDocsLayout() {
  const context = use(LayoutContext);
  if (!context)
    throw new Error(
      'Please use <DocsPage /> (`fumadocs-ui/layouts/docs/page`) under <DocsLayout /> (`fumadocs-ui/layouts/docs`).',
    );
  return context;
}

export function LayoutBody(
  props: DocsLayoutProps & {
    tabs: LayoutTab[];
  },
) {
  const {
    nav: { enabled: navEnabled = true, transparentMode: navTransparentMode = 'none' } = {},
    tabs,
    tree,
    children,
  } = props;
  const tabMode = 'auto';
  const isTop = useIsScrollTop({ enabled: navTransparentMode === 'top' }) ?? true;
  const isNavTransparent = navTransparentMode === 'top' ? isTop : navTransparentMode === 'always';
  const { baseSlots, baseProps } = useProvider(props);
  const linkItems = useLinkItems(props);
  const slots: DocsSlots = {
    ...baseSlots,
    header: Header,
    container: Container,
    sidebar: {
      provider: SidebarProvider,
      root: Sidebar,
      trigger: SidebarTrigger,
      useSidebar: useSidebar,
    },
  };

  return (
    <TreeContextProvider tree={tree}>
      <LayoutContext
        value={{
          props: {
            tabMode,
            tabs,
            ...baseProps,
          },
          isNavTransparent,
          slots,
          ...linkItems,
        }}
      >
        <slots.sidebar.provider>
          <slots.container>
            {navEnabled && <slots.header />}
            <slots.sidebar.root />
            {children}
          </slots.container>
        </slots.sidebar.provider>
      </LayoutContext>
    </TreeContextProvider>
  );
}
