'use client';

import { useLocale } from 'next-intl';
import { useCallback, useTransition } from 'react';
import { type Locale } from './config';
import { buildLocalePreferenceCookies } from './locale-cookie';
import { usePathname, useRouter } from './navigation';

export function useChangeLocale() {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const changeLocale = useCallback(
    (newLocale: Locale) => {
      startTransition(() => {
        for (const cookie of buildLocalePreferenceCookies(newLocale, 'user')) {
          document.cookie = cookie;
        }
        router.replace(pathname, { locale: newLocale });
        router.refresh();
      });
    },
    [pathname, router],
  );

  return {
    locale: currentLocale,
    changeLocale,
    isPending,
  };
}
