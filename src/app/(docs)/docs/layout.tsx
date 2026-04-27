import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { Metadata } from 'next';

import { baseOptions } from '@/docs/runtime/layout.shared';
import { source } from '@/docs/runtime/source';

export const metadata: Metadata = {
  title: 'Documentation | Afenda',
  description: 'Afenda documentation evidence generated from governed product truth.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={source.pageTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
