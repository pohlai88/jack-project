import { type Locale, LOCALE_COOKIE_NAME, locales } from './config';
import { resolveConfiguredLocale } from './locale-matching';

const NO_LOCALE_MATCH = '__NO_LOCALE_MATCH__';

export const LOCALE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
export const LOCALE_SOURCE_COOKIE_NAME = `${LOCALE_COOKIE_NAME}_SOURCE`;

export type LocaleCookieSource = 'user' | 'tenant-default';

function buildCookie(name: string, value: string): string {
  return `${name}=${encodeURIComponent(value)}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function buildLocaleCookie(locale: Locale): string {
  return buildCookie(LOCALE_COOKIE_NAME, locale);
}

export function buildLocaleSourceCookie(source: LocaleCookieSource): string {
  return buildCookie(LOCALE_SOURCE_COOKIE_NAME, source);
}

export function buildLocalePreferenceCookies(locale: Locale, source: LocaleCookieSource): string[] {
  return [buildLocaleCookie(locale), buildLocaleSourceCookie(source)];
}

function readCookie(cookieString: string | null | undefined, name: string): string | null {
  if (!cookieString) {
    return null;
  }

  for (const part of cookieString.split(';')) {
    const [rawName, ...rawValueParts] = part.trim().split('=');
    if (rawName !== name) {
      continue;
    }

    const rawValue = rawValueParts.join('=');
    try {
      return decodeURIComponent(rawValue);
    } catch {
      return rawValue;
    }
  }

  return null;
}

export function readLocaleCookie(cookieString: string | null | undefined): string | null {
  return readCookie(cookieString, LOCALE_COOKIE_NAME);
}

export function readLocaleSourceCookie(cookieString: string | null | undefined): LocaleCookieSource | null {
  const source = readCookie(cookieString, LOCALE_SOURCE_COOKIE_NAME);
  return source === 'user' || source === 'tenant-default' ? source : null;
}

export function resolveLocaleValue(value: string | null | undefined): Locale | null {
  const locale = resolveConfiguredLocale(value, {
    locales,
    defaultLocale: NO_LOCALE_MATCH,
  });

  return locale === NO_LOCALE_MATCH ? null : (locale as Locale);
}

export function resolveLocaleCookie(cookieString: string | null | undefined): Locale | null {
  return resolveLocaleValue(readLocaleCookie(cookieString));
}

export function hasValidLocaleCookie(cookieString: string | null | undefined): boolean {
  return resolveLocaleCookie(cookieString) !== null;
}

export function hasExplicitLocaleCookie(cookieString: string | null | undefined): boolean {
  if (!hasValidLocaleCookie(cookieString)) {
    return false;
  }

  const source = readLocaleSourceCookie(cookieString);
  return source === 'user' || source === null;
}

export function shouldApplyTenantDefaultLocale({
  currentLocale,
  cookieString,
  tenantDefaultLocale,
}: {
  currentLocale: string | null | undefined;
  cookieString: string | null | undefined;
  tenantDefaultLocale?: Locale | null;
}): boolean {
  if (!tenantDefaultLocale || hasExplicitLocaleCookie(cookieString)) {
    return false;
  }

  const resolvedCookieLocale = resolveLocaleCookie(cookieString);
  if (resolvedCookieLocale && resolvedCookieLocale !== tenantDefaultLocale) {
    return true;
  }

  const resolvedCurrentLocale = resolveLocaleValue(currentLocale) ?? NO_LOCALE_MATCH;

  return resolvedCurrentLocale !== tenantDefaultLocale;
}
