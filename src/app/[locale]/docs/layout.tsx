import './docs.css';

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { baseOptions } from '@/docs/runtime/layout.shared';
import { source } from '@/docs/runtime/source';
import { DocsLayout as FumadocsLayout } from '@/docs/ui/layouts/docs';

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

  const links = [
    { url: '/llms.txt', text: tLlm('navLlmsIndex') },
    { url: '/llms-full.txt', text: tLlm('navLlmsFull') },
  ];

  return (
    <FumadocsLayout tree={source.getPageTree(locale)} {...baseOptions(locale)} links={links}>
      {children}
    </FumadocsLayout>
  );
}
