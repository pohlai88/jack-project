import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { DocsAssistantHint } from '@/docs/runtime/docs-assistant-hint';
import { baseOptions } from '@/docs/runtime/layout.shared';
import { source } from '@/docs/runtime/source';

export const metadata: Metadata = {
  title: 'Documentation | Afenda',
  description: 'Afenda documentation evidence generated from governed product truth.',
};

interface DocsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function Layout({ children, params }: DocsLayoutProps) {
  const { locale } = await params;
  const tLlm = await getTranslations('docs.llm');

  return (
    <DocsLayout
      tree={source.getPageTree(locale)}
      {...baseOptions(locale)}
      links={[
        { url: '/llms.txt', text: tLlm('navLlmsIndex') },
        { url: '/llms-full.txt', text: tLlm('navLlmsFull') },
      ]}
    >
      <DocsAssistantHint />
      {children}
    </DocsLayout>
  );
}
