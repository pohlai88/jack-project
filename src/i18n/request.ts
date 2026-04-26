import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, type Locale, LOCALE_COOKIE_NAME } from './config';
import { resolveLocaleValue } from './locale-cookie';

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
  const cookieLocale = resolveLocaleValue(localeCookie?.value);
  if (cookieLocale) {
    return cookieLocale;
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
      const resolvedLocale = resolveLocaleValue(locale);
      if (resolvedLocale) {
        return resolvedLocale;
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
