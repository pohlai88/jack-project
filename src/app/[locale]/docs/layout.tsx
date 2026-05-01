import { DocsLayout as FumadocsLayout } from 'fumadocs-ui/layouts/docs';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import './docs.css';

import { baseOptions } from '@/docs/runtime/docs-layout.config';
import { DOCS_LLM_FULL_PATH, DOCS_LLM_INDEX_PATH } from '@/docs/runtime/docs-runtime.contract';
import { source } from '@/docs/runtime/docs-source.registry';

export const metadata: Metadata = {
  title: 'Documentation | Afenda',
  description: 'Afenda documentation evidence generated from governed product truth.',
  applicationName: 'Afenda Documentation',
  icons: {
    icon: [
      { url: '/icons/afenda-icon-192-transparent.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/afenda-icon-512-transparent.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icons/afenda-icon-192-transparent.png',
    apple: '/icons/afenda-icon-192-transparent.png',
  },
};

interface DocsLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function Layout({ children, params }: DocsLayoutProps) {
  const { locale } = await params;
  const tLlm = await getTranslations('docs.llm');

  const links = [
    { url: 'https://github.com/pohlai88/jack-project', text: 'GitHub' },
    { url: DOCS_LLM_INDEX_PATH, text: tLlm('navLlmsIndex') },
    { url: DOCS_LLM_FULL_PATH, text: tLlm('navLlmsFull') },
  ] satisfies NonNullable<BaseLayoutProps['links']>;

  return (
    <FumadocsLayout tree={source.getPageTree(locale)} {...baseOptions(locale)} links={links}>
      {children}
    </FumadocsLayout>
  );
}
