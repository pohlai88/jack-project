'use client';

import { usePathname } from 'fumadocs-core/framework';
import type * as PageTree from 'fumadocs-core/page-tree';
import { useTreeContext, useTreePath } from 'fumadocs-ui/contexts/tree';
import { Fragment } from 'react';

import { isActive } from '@/shared/lib/urls';
import type * as Base from './base';

type InternalComponents = Pick<
  typeof Base,
  | 'SidebarSeparator'
  | 'SidebarFolder'
  | 'SidebarFolderLink'
  | 'SidebarFolderContent'
  | 'SidebarFolderTrigger'
  | 'SidebarItem'
>;

function getNodeKey(node: PageTree.Node, index: number, parentKey: string): string {
  if ('$id' in node && node.$id) return `${parentKey}:${node.$id}`;
  if ('url' in node && node.url) return `${parentKey}:${node.url}`;
  if ('name' in node && node.name) return `${parentKey}:${node.type}:${node.name}`;
  return `${parentKey}:${node.type}:${index}`;
}

export function createPageTreeRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarSeparator,
  SidebarItem,
}: InternalComponents) {
  function PageTreeList({ nodes, parentKey }: { nodes: PageTree.Node[]; parentKey: string }) {
    return (
      <>
        {nodes.map((node, index) => (
          <PageTreeNode
            key={getNodeKey(node, index, parentKey)}
            node={node}
            nodeKey={getNodeKey(node, index, parentKey)}
          />
        ))}
      </>
    );
  }

  function PageTreeNode({ node, nodeKey }: { node: PageTree.Node; nodeKey: string }) {
    if (node.type === 'separator') {
      return <SeparatorNode node={node} />;
    }

    if (node.type === 'folder') {
      return <FolderNode node={node} nodeKey={nodeKey} />;
    }

    return <ItemNode node={node} />;
  }

  function SeparatorNode({ node }: { node: PageTree.Separator }) {
    return (
      <SidebarSeparator>
        {node.icon}
        {node.name}
      </SidebarSeparator>
    );
  }

  function FolderNode({ node, nodeKey }: { node: PageTree.Folder; nodeKey: string }) {
    const pathname = usePathname();
    const treePath = useTreePath();

    const isCurrentTreePath = treePath.includes(node);
    const indexActive = node.index ? isActive(node.index.url, pathname) : false;
    const folderActive = isCurrentTreePath || indexActive;

    return (
      <SidebarFolder
        collapsible={node.collapsible}
        active={folderActive}
        defaultOpen={node.defaultOpen ?? folderActive}
      >
        {node.index ? (
          <SidebarFolderLink href={node.index.url} active={indexActive} external={node.index.external}>
            {node.icon}
            {node.name}
          </SidebarFolderLink>
        ) : (
          <SidebarFolderTrigger>
            {node.icon}
            {node.name}
          </SidebarFolderTrigger>
        )}

        <SidebarFolderContent>
          <PageTreeList nodes={node.children} parentKey={nodeKey} />
        </SidebarFolderContent>
      </SidebarFolder>
    );
  }

  function ItemNode({ node }: { node: PageTree.Item }) {
    const pathname = usePathname();

    return (
      <SidebarItem href={node.url} external={node.external} active={isActive(node.url, pathname)} icon={node.icon}>
        {node.name}
      </SidebarItem>
    );
  }

  return function SidebarPageTree() {
    const { root } = useTreeContext();

    return (
      <Fragment key={root.$id}>
        <PageTreeList nodes={root.children} parentKey={root.$id ?? 'root'} />
      </Fragment>
    );
  };
}
