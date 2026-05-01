export type DisclosureStatus =
  | 'registered'
  | 'verified_config'
  | 'applicable'
  | 'applicable_review'
  | 'applicable_if_selling_online'
  | 'pending_review'
  | 'not_applicable'
  | 'not_published'
  | 'not_claimed'
  | 'counsel_verification_required'
  | 'accounting_verification_required';

/** Semantic grouping for auditing, filtering, and UI semantics (distinct from vendor-specific `DisclosureStatus`). */
export type DisclosureStatusClass =
  | 'verified'
  | 'declared'
  | 'conditional'
  | 'unverified'
  | 'not_applicable'
  | 'not_claimed';

export function getDisclosureStatusClass(status: DisclosureStatus): DisclosureStatusClass {
  switch (status) {
    case 'registered':
    case 'verified_config':
      return 'verified';

    case 'applicable':
      return 'declared';

    case 'applicable_review':
    case 'applicable_if_selling_online':
      return 'conditional';

    case 'pending_review':
    case 'counsel_verification_required':
    case 'accounting_verification_required':
      return 'unverified';

    case 'not_applicable':
      return 'not_applicable';

    case 'not_claimed':
    case 'not_published':
      return 'not_claimed';
  }
}

export type ComplianceClaimBoundary = {
  readonly summary: string;
  /** True when posture explicitly forbids implying broader approvals than stated. */
  readonly prohibitsOverclaim: boolean;
};

/** Optional linkage to canonical evidence artifact ids (control-plane / attestations). */
export type ComplianceJurisdictionEvidence = {
  readonly registration?: string;
  readonly privacy?: string;
  readonly ecommerce?: string;
};

export type ComplianceJurisdiction = {
  countryCode: 'MY' | 'VN' | 'TH' | 'ID' | 'SG' | 'PH';
  displayName: string;
  localEntityStatus: DisclosureStatus;
  registrationStatus: DisclosureStatus;
  authorityLabel: string;
  publicRegistrationReference: string;
  privacyStatus: DisclosureStatus;
  ecommerceStatus: DisclosureStatus;
  claimBoundary: ComplianceClaimBoundary;
  evidence?: ComplianceJurisdictionEvidence;
};

export type LegalPageKey =
  | 'legalDisclosure'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'security'
  | 'dpa'
  | 'subprocessors'
  | 'acceptableUse'
  | 'billing'
  | 'refundCancellation'
  | 'serviceAvailability'
  | 'contact'
  | 'complaints'
  | 'responsibleDisclosure'
  | 'accessibility'
  | 'trademarks';

export type LegalPageRegistryEntry = {
  key: LegalPageKey;
  label: string;
  href: string;
};

const counselVerificationRequired = 'Counsel verification required';
const accountingVerificationRequired = 'Accounting verification required';

export const legalPageRegistry = {
  legalDisclosure: { key: 'legalDisclosure', label: 'Legal Disclosure', href: '/legal-disclosure' },
  privacy: { key: 'privacy', label: 'Privacy Notice', href: '/privacy' },
  terms: { key: 'terms', label: 'Terms of Service', href: '/terms' },
  cookies: { key: 'cookies', label: 'Cookie Policy', href: '/cookies' },
  security: { key: 'security', label: 'Security', href: '/security' },
  dpa: { key: 'dpa', label: 'Data Processing Addendum', href: '/dpa' },
  subprocessors: { key: 'subprocessors', label: 'Subprocessors', href: '/subprocessors' },
  acceptableUse: { key: 'acceptableUse', label: 'Acceptable Use', href: '/acceptable-use' },
  billing: { key: 'billing', label: 'Billing Terms', href: '/billing' },
  refundCancellation: {
    key: 'refundCancellation',
    label: 'Refund & Cancellation',
    href: '/refund-cancellation',
  },
  serviceAvailability: {
    key: 'serviceAvailability',
    label: 'Service Availability',
    href: '/service-availability',
  },
  contact: { key: 'contact', label: 'Contact', href: '/contact' },
  complaints: { key: 'complaints', label: 'Complaints', href: '/complaints' },
  responsibleDisclosure: {
    key: 'responsibleDisclosure',
    label: 'Responsible Disclosure',
    href: '/responsible-disclosure',
  },
  accessibility: { key: 'accessibility', label: 'Accessibility', href: '/accessibility' },
  trademarks: { key: 'trademarks', label: 'Trademarks', href: '/trademarks' },
} satisfies Record<LegalPageKey, LegalPageRegistryEntry>;

export const complianceFooterConfig = {
  homeJurisdiction: 'MY',
  legalIdentity: {
    legalName: 'Afenda',
    registrationAuthority: 'Companies Commission of Malaysia (SSM)',
    registrationNumber: counselVerificationRequired,
    registeredOffice: counselVerificationRequired,
    countryOfIncorporation: 'Malaysia',
    taxId: accountingVerificationRequired,
    /** Public posture effective date (enforceability anchor). */
    effectiveDate: '2026-05-02',
    /** Record revision / publication cue (may match or trail effectiveDate). */
    lastUpdated: '2026-05-02',
  },
  contacts: {
    general: 'contact@afenda.io',
    support: 'support@afenda.io',
    legal: 'legal@afenda.io',
    privacy: 'privacy@afenda.io',
    compliance: 'compliance@afenda.io',
    security: 'security@afenda.io',
    complaints: 'complaints@afenda.io',
  },
  jurisdictions: [
    {
      countryCode: 'MY',
      displayName: 'Malaysia',
      localEntityStatus: 'registered',
      registrationStatus: 'verified_config',
      authorityLabel: 'Companies Commission of Malaysia (SSM)',
      publicRegistrationReference: counselVerificationRequired,
      privacyStatus: 'applicable_review',
      ecommerceStatus: 'applicable_if_selling_online',
      evidence: {
        registration: 'EVID-MY-SSM-0001',
      },
      claimBoundary: {
        summary:
          "Malaysia is Afenda's legal anchor: the Malaysian company is registered with SSM. This does not imply regulator endorsement, licensing, certification, or full legal compliance across every activity or market.",
        prohibitsOverclaim: true,
      },
    },
    {
      countryCode: 'VN',
      displayName: 'Vietnam',
      localEntityStatus: 'not_claimed',
      registrationStatus: 'not_claimed',
      authorityLabel: 'E-commerce and tax authority applicability review',
      publicRegistrationReference: counselVerificationRequired,
      privacyStatus: 'pending_review',
      ecommerceStatus: 'pending_review',
      claimBoundary: {
        summary: 'No Vietnam local entity, tax status, platform status, or regulator status is claimed.',
        prohibitsOverclaim: true,
      },
    },
    {
      countryCode: 'TH',
      displayName: 'Thailand',
      localEntityStatus: 'not_claimed',
      registrationStatus: 'not_claimed',
      authorityLabel: 'Business registration and PDPA applicability review',
      publicRegistrationReference: counselVerificationRequired,
      privacyStatus: 'pending_review',
      ecommerceStatus: 'pending_review',
      claimBoundary: {
        summary: 'No Thailand local entity, tax status, platform status, or regulator status is claimed.',
        prohibitsOverclaim: true,
      },
    },
    {
      countryCode: 'ID',
      displayName: 'Indonesia',
      localEntityStatus: 'not_claimed',
      registrationStatus: 'not_claimed',
      authorityLabel: 'PSE and PDP applicability review',
      publicRegistrationReference: counselVerificationRequired,
      privacyStatus: 'pending_review',
      ecommerceStatus: 'pending_review',
      claimBoundary: {
        summary: 'No Indonesia local entity, PSE status, tax status, or regulator status is claimed.',
        prohibitsOverclaim: true,
      },
    },
    {
      countryCode: 'SG',
      displayName: 'Singapore',
      localEntityStatus: 'not_claimed',
      registrationStatus: 'not_claimed',
      authorityLabel: 'UEN and PDPA applicability review',
      publicRegistrationReference: counselVerificationRequired,
      privacyStatus: 'applicable_review',
      ecommerceStatus: 'pending_review',
      claimBoundary: {
        summary: 'No Singapore local entity, UEN, tax status, or regulator status is claimed.',
        prohibitsOverclaim: true,
      },
    },
    {
      countryCode: 'PH',
      displayName: 'Philippines',
      localEntityStatus: 'not_claimed',
      registrationStatus: 'not_claimed',
      authorityLabel: 'SEC/DTI, NPC, and Internet Transactions Act applicability review',
      publicRegistrationReference: counselVerificationRequired,
      privacyStatus: 'pending_review',
      ecommerceStatus: 'pending_review',
      claimBoundary: {
        summary: 'No Philippines local entity, SEC/DTI status, NPC seal, tax status, or regulator status is claimed.',
        prohibitsOverclaim: true,
      },
    },
  ] satisfies ComplianceJurisdiction[],
} as const;

function capitalize(word: string) {
  return word.length ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : word;
}

/** Machine-friendly: underscores → spaces (lower snake phrases). */
export function formatDisclosureStatus(status: DisclosureStatus) {
  return status.replaceAll('_', ' ');
}

/** Sentence-style label for UI tables and footers (capitalizes leading word only). */
export function formatDisclosureLabel(status: DisclosureStatus) {
  const s = formatDisclosureStatus(status);
  return s
    .split(' ')
    .map((word, index) => (index === 0 ? capitalize(word) : word))
    .join(' ');
}

export function isVerificationPlaceholder(value: string) {
  return value === counselVerificationRequired || value === accountingVerificationRequired;
}

export function formatPublicLegalField(value: string, fallback = 'Legal details under counsel verification') {
  return isVerificationPlaceholder(value) ? fallback : value;
}

/** Throws if registry entries violate integrity rules (called from CI / API). */
export function validateLegalPageRegistry(): void {
  for (const [key, entry] of Object.entries(legalPageRegistry) as [LegalPageKey, LegalPageRegistryEntry][]) {
    if (!entry.href.startsWith('/') || entry.href.includes('://') || /\s/.test(entry.href)) {
      throw new Error(`Invalid legalPageRegistry href for "${key}": ${entry.href}`);
    }
    if (entry.key !== key) {
      throw new Error(`legalPageRegistry key mismatch: bucket "${key}" vs entry.key "${entry.key}"`);
    }
  }
}

export function generateComplianceSnapshot() {
  validateLegalPageRegistry();
  const jurisdictions = complianceFooterConfig.jurisdictions.map((jurisdiction) => ({
    ...jurisdiction,
    statusClass: {
      localEntity: getDisclosureStatusClass(jurisdiction.localEntityStatus),
      registration: getDisclosureStatusClass(jurisdiction.registrationStatus),
      privacy: getDisclosureStatusClass(jurisdiction.privacyStatus),
      ecommerce: getDisclosureStatusClass(jurisdiction.ecommerceStatus),
    },
  }));

  return {
    schemaVersion: '1.0.0' as const,
    timestamp: new Date().toISOString(),
    homeJurisdiction: complianceFooterConfig.homeJurisdiction,
    identity: complianceFooterConfig.legalIdentity,
    jurisdictions,
    documents: Object.values(legalPageRegistry),
    contacts: complianceFooterConfig.contacts,
  };
}

export type ComplianceSnapshot = ReturnType<typeof generateComplianceSnapshot>;
