import type { Metadata } from 'next';

import { DocsLayoutClient } from '@/features/docs';

export const metadata: Metadata = {
  title: 'Documentation | Afenda',
  description: 'Complete documentation for the Afenda — guides for members and administrators.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsLayoutClient>{children}</DocsLayoutClient>;
}
