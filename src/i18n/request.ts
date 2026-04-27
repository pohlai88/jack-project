import { cookies, headers } from 'next/headers';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, defaultTimeZone, type Locale, LOCALE_COOKIE_NAME } from './config';
import { resolveLocaleValue } from './locale-cookie';
import { mergeWithFallbackMessages } from './merge-messages';
import { routing } from './routing';

const enMessagesPromise = import('./messages/en.json').then((m) => m.default);

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

const isDev = process.env.NODE_ENV === 'development';

function logIntlError(error: unknown) {
  if (isDev) {
    console.error('[i18n]', error);
  }
}

export default getRequestConfig(async ({ requestLocale, locale: explicitRequestLocale }) => {
  const requested = await requestLocale;
  const fromRouteOrExplicit =
    (explicitRequestLocale && hasLocale(routing.locales, explicitRequestLocale) ? explicitRequestLocale : null) ??
    (requested && hasLocale(routing.locales, requested) ? requested : null);

  const fromDetection = await detectLocale();
  const effectiveLocale: Locale = fromRouteOrExplicit
    ? (fromRouteOrExplicit as Locale)
    : hasLocale(routing.locales, fromDetection)
      ? fromDetection
      : defaultLocale;

  const { default: activeMessages } = await import(`./messages/${effectiveLocale}.json`);
  const baseMessages = await enMessagesPromise;
  const messages =
    effectiveLocale === defaultLocale ? activeMessages : mergeWithFallbackMessages(baseMessages, activeMessages);

  return {
    locale: effectiveLocale,
    messages,
    timeZone: defaultTimeZone,
    onError: logIntlError,
  };
});
