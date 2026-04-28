'use client';

import { usePathname } from 'fumadocs-core/framework';
import type { HTMLAttributes, ReactNode } from 'react';
import type * as Base from './base';

import { isLinkItemActive, type LinkItemType } from '../../shared';

type RenderableLinkItem = Exclude<LinkItemType, { type: 'icon' }>;

type InternalComponents = Pick<
  typeof Base,
  | 'SidebarFolder'
  | 'SidebarFolderLink'
  | 'SidebarFolderContent'
  | 'SidebarFolderTrigger'
  | 'SidebarItem'
>;

interface SidebarLinkItemProps extends HTMLAttributes<HTMLElement> {
  item: RenderableLinkItem;
}

function getSidebarItemKey(item: RenderableLinkItem, index: number, parentKey: string): string {
  if ('url' in item && item.url) return `${parentKey}:${item.url}`;
  if ('text' in item && typeof item.text === 'string') return `${parentKey}:${item.text}`;
  return `${parentKey}:item-${index}`;
}

function renderItemLabel(item: Extract<RenderableLinkItem, { type: 'menu' }> | Extract<RenderableLinkItem, { type: 'page' }>) {
  return (
    <>
      {item.icon}
      {item.text}
    </>
  );
}

export function createLinkItemRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
}: InternalComponents) {
  function SidebarLinkItem({
    item,
    className,
    ...props
  }: SidebarLinkItemProps): ReactNode {
    const pathname = usePathname();
    const active = isLinkItemActive(item, pathname);

    if (item.type === 'custom') {
      return (
        <div className={className} {...props}>
          {item.children}
        </div>
      );
    }

    if (item.type === 'menu') {
      const folderKeyBase = item.url ?? String(item.text ?? 'menu');

      return (
        <SidebarFolder
          className={className}
          active={active}
          defaultOpen={active}
          {...props}
        >
          {item.url ? (
            <SidebarFolderLink href={item.url} active={active} external={item.external}>
              {renderItemLabel(item)}
            </SidebarFolderLink>
          ) : (
            <SidebarFolderTrigger>
              {renderItemLabel(item)}
            </SidebarFolderTrigger>
          )}

          <SidebarFolderContent>
            {item.items.map((child, index) => (
              <SidebarLinkItem
                key={getSidebarItemKey(child, index, folderKeyBase)}
                item={child}
              />
            ))}
          </SidebarFolderContent>
        </SidebarFolder>
      );
    }

    return (
      <SidebarItem
        className={className}
        href={item.url}
        icon={item.icon}
        external={item.external}
        active={active}
        {...props}
      >
        {item.text}
      </SidebarItem>
    );
  }

  SidebarLinkItem.displayName = 'SidebarLinkItem';

  return SidebarLinkItem;
}
