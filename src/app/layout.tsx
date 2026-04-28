import './globals.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { docsFeedPath, docsFeedTitle } from '@/docs/runtime/rss-metadata';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Afenda | AI-Native Skills Management',
  description: 'Production-ready Next.js SaaS boilerplate with multi-tenancy, AI assistant, and integrations',
  alternates: {
    types: {
      'application/rss+xml': [
        {
          title: docsFeedTitle,
          url: docsFeedPath,
        },
      ],
    },
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.locale ?? 'en';

  return (
    <html lang={lang} suppressHydrationWarning className={`${dmSans.variable} dark:scroll-smooth`}>
      <body className={`${dmSans.className} flex min-h-screen flex-col bg-background font-sans antialiased`}>
        <main className="relative flex min-h-screen flex-col">{children}</main>
      </body>
    </html>
  );
}
