import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

type FooterSegmentLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Ensures next-intl server APIs and RSC navigation slots see the active locale
 * for every `/footer/*` page (mirrors `[locale]/docs/layout.tsx` pattern).
 */
export default async function FooterSegmentLayout({ children, params }: FooterSegmentLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return children;
}
