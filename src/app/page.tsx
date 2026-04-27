import { redirect } from 'next/navigation';

import { defaultLocale } from '@/i18n/config';

/**
 * Root `/` has no `[locale]` segment; next-intl middleware typically redirects here,
 * but a root page keeps the App Router tree valid and avoids ambiguous root handling.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
