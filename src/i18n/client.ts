'use client';

import { useLocale } from 'next-intl';
import { useCallback, useTransition } from 'react';
import { type Locale } from './config';
import { buildLocalePreferenceCookies } from './locale-cookie';

/**
 * Hook to get and set the current locale
 * Uses cookies for persistence (no URL change)
 */
export function useChangeLocale() {
  const currentLocale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const changeLocale = useCallback((newLocale: Locale) => {
    startTransition(() => {
      // Set cookie
      for (const cookie of buildLocalePreferenceCookies(newLocale, 'user')) {
        document.cookie = cookie;
      }
      // Refresh the page to apply the new locale
      window.location.reload();
    });
  }, []);

  return {
    locale: currentLocale,
    changeLocale,
    isPending,
  };
}
