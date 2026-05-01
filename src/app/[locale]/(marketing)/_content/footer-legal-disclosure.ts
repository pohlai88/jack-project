import { type LegalPageKey, legalPageRegistry } from './compliance-footer';

/** Public legal declaration surface for the marketing footer (SSR-deterministic). */
export type FooterLegalPrimaryLink = {
  readonly label: string;
  readonly href: string;
};

export type FooterLegalQuickLinkKey = Extract<LegalPageKey, 'legalDisclosure' | 'security' | 'accessibility'>;

export type FooterLegalQuickLink = {
  readonly key: FooterLegalQuickLinkKey;
  readonly label: string;
  readonly href: string;
};

function quickLink(key: FooterLegalQuickLinkKey): FooterLegalQuickLink {
  const page = legalPageRegistry[key];

  return { key, label: page.label, href: page.href };
}

/** Footer copyright year — not derived from `legalIdentity.lastUpdated` or `effectiveDate` (disclosure edits must not shift asserted origin). */
const copyrightYear = '2026';

export const footerLegalDisclosure = {
  primaryLinks: [
    { label: 'Terms & Conditions', href: legalPageRegistry.terms.href },
    { label: 'Privacy Policy (PDPA)', href: legalPageRegistry.privacy.href },
    { label: 'Contact Us', href: legalPageRegistry.contact.href },
  ] as const satisfies readonly FooterLegalPrimaryLink[],

  quickLinks: [
    quickLink('legalDisclosure'),
    quickLink('security'),
    quickLink('accessibility'),
  ] as const satisfies readonly FooterLegalQuickLink[],

  laws: [
    'Company and online business disclosure posture',
    'Privacy and data protection disclosure posture',
    'ASEAN market applicability review',
    'Electronic transaction and online service disclosure posture',
  ] as const,

  copyrightNotice: `© ${copyrightYear} Afenda. All rights reserved.`,
} as const;
