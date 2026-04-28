/**
 * Runtime locale authority (I18N-RUNTIME-001, ADR-0009):
 * - The active request locale comes from the `[locale]` route segment (via next-intl `requestLocale`),
 *   optionally the same validated value passed as `locale` from the framework (adapter/testing only; not a preference channel).
 * - Cookies, tenant defaults, headers, and profile preferences must not be read here to override an already resolved localized route.
 * - Preference-based behavior belongs at redirect / entrypoint boundaries (e.g. proxy), not inside `getRequestConfig`.
 */
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
