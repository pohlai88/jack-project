import { RootProvider } from 'fumadocs-ui/provider/next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { docsSearchOptions, i18nUI } from '@/docs/runtime/docs-layout.config';
import { routing } from '@/i18n/routing';
import { AuthProvider, ThemeProvider } from '@/shared/components/providers';
import { Toaster } from '@/shared/components/ui/sonner';
import { AppShellBoundary } from './app-shell-boundary';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {/*
          Fumadocs RootProvider includes next-themes by default.
          Keep Afenda's outer ThemeProvider as the only theme owner to avoid
          duplicate theme scripts/providers and React hydration/runtime warnings.
        */}
        <RootProvider theme={{ enabled: false }} i18n={i18nUI.provider(locale)} search={docsSearchOptions(locale)}>
          <AuthProvider>
            <AppShellBoundary>{children}</AppShellBoundary>
            <Toaster richColors closeButton position="bottom-right" />
          </AuthProvider>
        </RootProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
