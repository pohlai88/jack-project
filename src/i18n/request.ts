import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, type Locale, LOCALE_COOKIE_NAME, locales } from './config';
import { resolveConfiguredLocale } from './locale-matching';

const NO_LOCALE_MATCH = '__NO_LOCALE_MATCH__';

/**
 * Detect locale from various sources:
 * 1. Cookie (user preference)
 * 2. Accept-Language header (browser preference)
 * 3. Default locale
 */
async function detectLocale(): Promise<Locale> {
  // 1. Check cookie first (user's explicit choice)
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME);
  const cookieLocale = resolveConfiguredLocale(localeCookie?.value, {
    locales,
    defaultLocale: NO_LOCALE_MATCH,
  });
  if (cookieLocale !== NO_LOCALE_MATCH) {
    return cookieLocale as Locale;
  }

  // 2. Check Accept-Language header
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  if (acceptLanguage) {
    // Parse Accept-Language header and find best match
    const browserLocales = acceptLanguage
      .split(',')
      .map((part) => {
        const [locale, quality = 'q=1'] = part.trim().split(';');
        return {
          locale,
          quality: parseFloat(quality.replace('q=', '')),
        };
      })
      .sort((a, b) => b.quality - a.quality);

    for (const { locale } of browserLocales) {
      const resolvedLocale = resolveConfiguredLocale(locale, {
        locales,
        defaultLocale: NO_LOCALE_MATCH,
      });
      if (resolvedLocale !== NO_LOCALE_MATCH) {
        return resolvedLocale as Locale;
      }
    }
  }

  // 3. Fallback to default
  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await detectLocale();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
