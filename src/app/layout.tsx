import './globals.css';

import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';

import { DOCS_FEED_PATH, DOCS_FEED_TITLE } from '@/docs/runtime/docs-rss.contract';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://afenda.com';

const siteTitle = 'Afenda | Enterprise Workforce Intelligence';
const siteDescription =
  'Deterministic workforce intelligence for skills telemetry, performance alignment, governed identity, and enterprise operating evidence.';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F5F7' },
    { media: '(prefers-color-scheme: dark)', color: '#161619' },
  ],
  colorScheme: 'dark light',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Afenda',
  title: {
    default: siteTitle,
    template: '%s | Afenda',
  },
  description: siteDescription,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/afenda-icon-192-transparent.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/afenda-icon-512-transparent.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/icons/afenda-icon-180-transparent.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: 'Afenda',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
  alternates: {
    types: {
      'application/rss+xml': [
        {
          title: DOCS_FEED_TITLE,
          url: DOCS_FEED_PATH,
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
  const { locale } = await params;
  const lang = locale ?? 'en';

  return (
    <html lang={lang} suppressHydrationWarning className={`${dmSans.variable} dark:scroll-smooth`}>
      <body
        className={`${dmSans.className} flex min-h-screen flex-col bg-background font-sans text-foreground antialiased`}
      >
        <main className="relative flex min-h-screen flex-col">{children}</main>
      </body>
    </html>
  );
}
