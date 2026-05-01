import NextLink from 'next/link';
import { getLocale } from 'next-intl/server';
import type { ComponentProps } from 'react';

import { localizeHref } from '@/i18n/navigation';

type MarketingServerLinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href: string;
};

/**
 * Locale-prefixed navigation for marketing **server** components. Prefer this
 * over `next-intl`’s `Link` under nested client providers (`MarketingExplorerProvider`,
 * etc.) to avoid “No intl context found” on hydrate.
 */
export async function MarketingServerLink({ href, ...rest }: MarketingServerLinkProps) {
  const locale = await getLocale();
  const resolvedHref = href.startsWith('/') ? localizeHref(locale, href) : href;
  return <NextLink href={resolvedHref} {...rest} />;
}
