import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

export function localizeHref(locale: string, href: string): string {
  if (!href.startsWith('/')) {
    return href;
  }

  for (const knownLocale of routing.locales) {
    if (href === `/${knownLocale}` || href.startsWith(`/${knownLocale}/`)) {
      return href;
    }
  }

  return href === '/' ? `/${locale}` : `/${locale}${href}`;
}
