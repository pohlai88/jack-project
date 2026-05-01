import { legalPageRegistry } from './compliance-footer';

import type { LegalPageKey } from './compliance-footer';

export type FooterNavColumnKey = 'product' | 'legal' | 'trust' | 'commercial';

export type FooterNavLink = {
  readonly label: string;
  readonly href: string;
  readonly legalPageKey?: LegalPageKey;
  readonly external?: boolean;
};

export type FooterNavColumn = {
  readonly title: string;
  readonly links: readonly FooterNavLink[];
};

export type FooterNavConfig = Record<FooterNavColumnKey, FooterNavColumn>;

function legalLink(key: LegalPageKey): FooterNavLink {
  const page = legalPageRegistry[key];

  return { label: page.label, href: page.href, legalPageKey: key };
}

/**
 * Single configuration surface for marketing footer columns.
 * Legal anchors reuse `compliance-footer` so counsel updates stay centralized.
 */
export const footerNavConfig = {
  product: {
    title: 'Product',
    links: [
      { label: 'Platform', href: '/' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Book a demo', href: '/book-demo' },
      { label: 'Log in', href: '/login' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      legalLink('legalDisclosure'),
      legalLink('terms'),
      legalLink('privacy'),
      legalLink('cookies'),
      legalLink('accessibility'),
    ],
  },
  trust: {
    title: 'Trust',
    links: [
      legalLink('security'),
      legalLink('dpa'),
      legalLink('subprocessors'),
      legalLink('responsibleDisclosure'),
      legalLink('serviceAvailability'),
    ],
  },
  commercial: {
    title: 'Commercial',
    links: [
      legalLink('billing'),
      legalLink('refundCancellation'),
      legalLink('acceptableUse'),
      legalLink('complaints'),
      legalLink('contact'),
    ],
  },
} as const satisfies FooterNavConfig;
