import type * as PageTree from 'fumadocs-core/page-tree';
import { useMemo } from 'react';
import { LayoutBody } from './client';
import { type BaseLayoutProps, getLayoutTabs } from '../shared';

export interface DocsLayoutProps extends BaseLayoutProps {
  tree: PageTree.Root;
}

export function DocsLayout({ tree, children, ...props }: DocsLayoutProps) {
  const tabs = useMemo(() => getLayoutTabs(tree), [tree]);

  return (
    <LayoutBody tree={tree} tabs={tabs} {...props}>
      {children}
    </LayoutBody>
  );
}

export { useDocsLayout } from './client';
