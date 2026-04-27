import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, defaultTimeZone, type Locale } from './config';
import { mergeWithFallbackMessages } from './merge-messages';
import { routing } from './routing';

const enMessagesPromise = import('./messages/en.json').then((m) => m.default);

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
  const effectiveLocale: Locale = fromRouteOrExplicit ? (fromRouteOrExplicit as Locale) : defaultLocale;

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
