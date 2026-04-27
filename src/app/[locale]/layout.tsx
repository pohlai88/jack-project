import { RootProvider } from 'fumadocs-ui/provider/next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { i18nUI } from '@/docs/runtime/layout.shared';
import { routing } from '@/i18n/routing';
import { AuthProvider, ThemeProvider } from '@/shared/components/providers';
import { Toaster } from '@/shared/components/ui/sonner';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <RootProvider i18n={i18nUI.provider(locale)}>
          <AuthProvider>
            {children}
            <Toaster richColors closeButton position="bottom-right" />
          </AuthProvider>
        </RootProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
