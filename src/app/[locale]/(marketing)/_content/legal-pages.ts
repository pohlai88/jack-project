import { complianceFooterConfig, type LegalPageKey, legalPageRegistry } from './compliance-footer';

export type LegalJurisdictionCode = 'MY' | 'SG' | 'BN' | 'ID' | 'TH' | 'VN' | 'PH' | 'ASEAN' | 'EU' | 'GLOBAL';

export type LegalDocumentLifecycleStatus = 'draft' | 'active' | 'deprecated';

export type LegalDocumentAuthority = 'public_notice' | 'contractual' | 'regulatory';

/** Afenda-aligned hook: asserts must map operational claims to verified controls before procurement use. */
export type LegalEvidencePolicyMode = 'must-map-to-implemented-controls';

export type LegalEvidenceAttachment = {
  readonly required: boolean;
  readonly source?: 'internal-control-plane';
};

export type LegalPageSectionContent = {
  readonly paragraphs?: readonly string[];
  readonly points?: readonly string[];
};

export type LegalPageSection = {
  readonly title: string;
  readonly content: LegalPageSectionContent;
};

export type LegalAssurancePanel = {
  readonly title: string;
  readonly content: LegalPageSectionContent;
};

export const legalAssurancePanels: readonly LegalAssurancePanel[] = [
  {
    title: 'Scope clarity',
    content: {
      paragraphs: [
        'This page states the public operating position for website, service, commercial, privacy, trust, or support interactions. Signed customer agreements, order forms, and counsel-approved terms govern where they conflict.',
      ],
    },
  },
  {
    title: 'Evidence boundary',
    content: {
      paragraphs: [
        'Operational, security, compliance, and legal assertions must map to implemented controls or verified records before being relied on in procurement, audit, or customer review.',
      ],
    },
  },
  {
    title: 'Review pathway',
    content: {
      paragraphs: [
        'Requests are routed to the named contact so the issue can be classified by subject, jurisdiction, account relationship, urgency, and required evidence trail.',
      ],
    },
  },
] satisfies readonly LegalAssurancePanel[];

const defaultMalaysiaAnchoredJurisdiction: readonly LegalJurisdictionCode[] = ['MY', 'ASEAN', 'GLOBAL'];

export type LegalPageDocument = {
  /** Stable machine identifier; immutable once assigned. */
  readonly id: string;
  readonly key: Exclude<LegalPageKey, 'legalDisclosure'>;
  readonly title: string;
  readonly kicker: string;
  readonly description: string;
  readonly version: `${number}.${number}.${number}`;
  readonly lastUpdated: `${number}-${number}-${number}`;
  readonly status: LegalDocumentLifecycleStatus;
  /** Human-readable review or publication notes (lifecycle remains in `status`). */
  readonly statusNote?: string;
  readonly authority: LegalDocumentAuthority;
  readonly jurisdiction: readonly LegalJurisdictionCode[];
  /** Optional finer-grained applicability when a document is not uniformly global. */
  readonly applicability?: Readonly<Partial<Record<'malaysia' | 'singapore' | 'eu', boolean>>>;
  readonly requiresCounselReview: boolean;
  readonly evidence: LegalEvidenceAttachment;
  readonly evidencePolicy?: LegalEvidencePolicyMode;
  readonly contact: keyof typeof complianceFooterConfig.contacts;
  readonly sections: readonly LegalPageSection[];
};

export type LegalDocumentKey = LegalPageDocument['key'];

const scaffoldCounselNotice =
  'This scaffold is maintained for enterprise review and must be finalized by counsel before production reliance.';

function legalParagraphs(...paragraphs: readonly string[]): LegalPageSectionContent {
  return { paragraphs };
}

function legalSection(title: string, content: LegalPageSectionContent): LegalPageSection {
  return { title, content };
}

export const legalPageDocuments = {
  privacy: {
    id: 'LEGAL-PRIVACY-0001',
    key: 'privacy',
    title: 'Privacy Notice',
    kicker: 'Privacy',
    description:
      'Explains how Afenda handles personal data, privacy requests, retention posture, and data protection contacts for public website and service interactions.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: 'Malaysia PDPA applicability review; ASEAN market notices require counsel confirmation.',
    authority: 'public_notice',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    evidencePolicy: 'must-map-to-implemented-controls',
    contact: 'privacy',
    sections: [
      legalSection(
        'Personal data categories',
        legalParagraphs(
          'Afenda may process contact details, account identifiers, support communications, usage telemetry, and customer-provided operational data where applicable.',
        ),
      ),
      legalSection(
        'Purpose and handling',
        legalParagraphs(
          'Processing should be limited to service delivery, security, support, legal compliance, billing, and product improvement where a valid basis applies.',
        ),
      ),
      legalSection(
        'Rights and requests',
        legalParagraphs(
          'Access, correction, deletion, objection, consent withdrawal, and complaint requests are routed through the privacy contact for classification and response.',
        ),
      ),
    ],
  },
  terms: {
    id: 'LEGAL-TOS-0001',
    key: 'terms',
    title: 'Terms of Service',
    kicker: 'Legal',
    description:
      'Sets the public terms scaffold for website use, account access, service responsibilities, prohibited use, and contractual precedence.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: scaffoldCounselNotice,
    authority: 'contractual',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'legal',
    sections: [
      legalSection(
        'Service access',
        legalParagraphs(
          'Access to Afenda services is subject to accepted order forms, account controls, user authorization, and any customer agreement that applies.',
        ),
      ),
      legalSection(
        'Customer responsibilities',
        legalParagraphs(
          'Customers are responsible for authorized users, lawful instructions, accurate configuration, and data they submit to the platform.',
        ),
      ),
      legalSection(
        'Contract precedence',
        legalParagraphs(
          'If a signed customer agreement conflicts with website terms, the signed agreement governs for that customer relationship.',
        ),
      ),
    ],
  },
  cookies: {
    id: 'LEGAL-COOKIE-0001',
    key: 'cookies',
    title: 'Cookie Policy',
    kicker: 'Privacy',
    description:
      'Describes website cookies and similar technologies used for required operation, security, preference handling, analytics, and diagnostics.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: 'Cookie categories and consent behavior require production tooling confirmation.',
    authority: 'public_notice',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'privacy',
    sections: [
      legalSection(
        'Cookie categories',
        legalParagraphs(
          'Required cookies support authentication, security, routing, locale handling, and fraud prevention. Optional cookies must be disclosed before activation.',
        ),
      ),
      legalSection(
        'Analytics and diagnostics',
        legalParagraphs(
          'Analytics use should remain privacy-minimized and documented with provider, retention, and opt-out details where applicable.',
        ),
      ),
      legalSection(
        'User controls',
        legalParagraphs(
          'Users can manage browser-level cookie settings. A consent preference surface should be added if optional cookies are deployed.',
        ),
      ),
    ],
  },
  security: {
    id: 'LEGAL-SEC-0001',
    key: 'security',
    title: 'Security',
    kicker: 'Trust',
    description:
      'Summarizes the control posture expected for Afenda: access control, encryption, audit trails, incident handling, and evidence release.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: 'Security claims must map to implemented controls and available evidence.',
    authority: 'public_notice',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: true, source: 'internal-control-plane' },
    evidencePolicy: 'must-map-to-implemented-controls',
    contact: 'security',
    sections: [
      legalSection(
        'Control posture',
        legalParagraphs(
          'Security controls should cover identity, least privilege, tenant boundaries, encryption, logging, vulnerability handling, and change control.',
        ),
      ),
      legalSection(
        'Evidence release',
        legalParagraphs(
          'Control evidence, questionnaires, and architecture details are released through scoped trust review and confidentiality controls.',
        ),
      ),
      legalSection(
        'No certification overclaim',
        legalParagraphs(
          'Afenda must not claim regulator approval, certification, or audit completion unless the relevant report is formally issued and published.',
        ),
      ),
    ],
  },
  dpa: {
    id: 'LEGAL-DPA-0001',
    key: 'dpa',
    title: 'Data Processing Addendum',
    kicker: 'Trust',
    description:
      'Provides the contracting pathway for controller-processor roles, processing instructions, subprocessors, transfers, and security obligations.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: scaffoldCounselNotice,
    authority: 'contractual',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'privacy',
    sections: [
      legalSection(
        'Role allocation',
        legalParagraphs(
          'The DPA should define customer and Afenda roles, processing purposes, data categories, duration, and documented instructions.',
        ),
      ),
      legalSection(
        'Transfers and safeguards',
        legalParagraphs(
          'Cross-border transfer terms, supplementary measures, and jurisdictional annexes must be reviewed before publication or signature.',
        ),
      ),
      legalSection(
        'Customer workflow',
        legalParagraphs(
          'Customers can request DPA review through the privacy contact with entity details and procurement requirements.',
        ),
      ),
    ],
  },
  subprocessors: {
    id: 'LEGAL-SUB-0001',
    key: 'subprocessors',
    title: 'Subprocessors',
    kicker: 'Trust',
    description:
      'Identifies the subprocessor disclosure scaffold for hosting, security, support, billing, analytics, and operational delivery providers.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: 'Provider list must be completed from production vendor inventory.',
    authority: 'public_notice',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'compliance',
    sections: [
      legalSection(
        'Disclosure scope',
        legalParagraphs(
          'Subprocessor records should include provider name, service purpose, processing location, safeguards, and change-notice process.',
        ),
      ),
      legalSection(
        'Customer notice',
        legalParagraphs(
          'Material subprocessor changes should be handled through the customer notice process defined in the applicable DPA or service terms.',
        ),
      ),
      legalSection(
        'Current publication state',
        legalParagraphs(
          'No provider list is asserted until production vendors are reconciled with procurement and security records.',
        ),
      ),
    ],
  },
  acceptableUse: {
    id: 'LEGAL-AUP-0001',
    key: 'acceptableUse',
    title: 'Acceptable Use',
    kicker: 'Commercial',
    description:
      'Defines the conduct boundaries for lawful use, system integrity, security testing, data handling, and prohibited abuse.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: scaffoldCounselNotice,
    authority: 'contractual',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'legal',
    sections: [
      legalSection(
        'Prohibited conduct',
        legalParagraphs(
          'Users must not misuse credentials, bypass controls, attack systems, upload unlawful material, interfere with service integrity, or violate third-party rights.',
        ),
      ),
      legalSection(
        'Customer data boundary',
        legalParagraphs(
          'Customers must only submit data they are authorized to process and must configure access according to their lawful business purposes.',
        ),
      ),
      legalSection(
        'Enforcement',
        legalParagraphs(
          'Afenda may investigate, suspend, or restrict access where misuse creates legal, security, or operational risk.',
        ),
      ),
    ],
  },
  billing: {
    id: 'LEGAL-BILLING-0001',
    key: 'billing',
    title: 'Billing Terms',
    kicker: 'Commercial',
    description:
      'Sets the scaffold for subscription fees, invoices, taxes, renewals, payment methods, and failed-payment handling.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: 'Pricing, invoice language, tax/SST, and e-invoicing details require accounting confirmation.',
    authority: 'contractual',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'compliance',
    sections: [
      legalSection(
        'Invoices and payment',
        legalParagraphs(
          'Billing terms should state invoice cadence, due dates, accepted payment methods, late payment treatment, and purchase order expectations.',
        ),
      ),
      legalSection(
        'Taxes',
        legalParagraphs(
          'Tax, SST, withholding, and e-invoicing language must match the verified Malaysian legal entity and customer jurisdiction.',
        ),
      ),
      legalSection(
        'Renewals',
        legalParagraphs('Renewal mechanics should be disclosed before paid plans are offered online.'),
      ),
    ],
  },
  refundCancellation: {
    id: 'LEGAL-REFUND-0001',
    key: 'refundCancellation',
    title: 'Refund & Cancellation',
    kicker: 'Commercial',
    description:
      'Explains the public scaffold for plan cancellation, refund eligibility, termination timing, and service access after cancellation.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: 'Commercial policy requires final pricing and contract review.',
    authority: 'contractual',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'support',
    sections: [
      legalSection(
        'Cancellation path',
        legalParagraphs(
          'Customers should have a documented path to request cancellation, confirm effective date, and understand service access changes.',
        ),
      ),
      legalSection(
        'Refund basis',
        legalParagraphs(
          'Refund eligibility should be tied to contracted plan, billing cycle, statutory requirement, and any promotional terms.',
        ),
      ),
      legalSection(
        'Record retention',
        legalParagraphs(
          'Cancellation does not automatically remove records needed for legal, audit, billing, or security purposes.',
        ),
      ),
    ],
  },
  serviceAvailability: {
    id: 'LEGAL-SLA-0001',
    key: 'serviceAvailability',
    title: 'Service Availability',
    kicker: 'Trust',
    description:
      'Defines the availability, maintenance, support response, incident communication, and service-credit scaffold.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: 'Operational targets must match production SLOs before publication.',
    authority: 'contractual',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'support',
    sections: [
      legalSection(
        'Availability posture',
        legalParagraphs(
          'Availability commitments should identify service scope, exclusions, planned maintenance, emergency maintenance, and measurement window.',
        ),
      ),
      legalSection(
        'Support response',
        legalParagraphs('Support response targets should vary by severity, customer agreement, and production impact.'),
      ),
      legalSection(
        'Incident communication',
        legalParagraphs(
          'Customers should receive clear incident status, remediation progress, and post-incident evidence where contractually required.',
        ),
      ),
    ],
  },
  contact: {
    id: 'LEGAL-CONTACT-0001',
    key: 'contact',
    title: 'Contact',
    kicker: 'Contact',
    description:
      'Centralizes official Afenda contact channels for general requests, support, legal, privacy, compliance, security, and complaints.',
    version: '1.0.0',
    lastUpdated: '2026-05-02',
    status: 'active',
    statusNote: 'Use the channel that best matches the request so the record is routed correctly.',
    authority: 'public_notice',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: false,
    evidence: { required: false },
    contact: 'general',
    sections: [
      legalSection('Primary channels', {
        paragraphs: [
          'General, support, legal, privacy, compliance, security, and complaints contacts are published in the contact table below.',
        ],
        points: Object.entries(complianceFooterConfig.contacts).map(([label, email]) => `${label}: ${email}`),
      }),
      legalSection(
        'Request classification',
        legalParagraphs(
          'Afenda classifies inbound requests by subject, jurisdiction, customer relationship, and urgency before response.',
        ),
      ),
      legalSection(
        'No social-only support',
        legalParagraphs(
          'Legal, privacy, security, and complaint matters should be submitted through official email channels for traceability.',
        ),
      ),
    ],
  },
  complaints: {
    id: 'LEGAL-COMPLAINT-0001',
    key: 'complaints',
    title: 'Complaints',
    kicker: 'Redress',
    description:
      'Provides the complaint and dispute-resolution scaffold for product, billing, privacy, security, and online-service concerns.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: 'Complaint workflow must be aligned with final customer terms and market applicability.',
    authority: 'public_notice',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'complaints',
    sections: [
      legalSection(
        'What to include',
        legalParagraphs(
          'Include account identity, issue summary, relevant dates, affected service, jurisdiction, and desired resolution.',
        ),
      ),
      legalSection(
        'Routing',
        legalParagraphs(
          'Complaints are classified and routed to support, legal, privacy, compliance, or security depending on subject matter.',
        ),
      ),
      legalSection(
        'Escalation',
        legalParagraphs(
          'Regulator or external dispute channels should be published where legally applicable and counsel-confirmed.',
        ),
      ),
    ],
  },
  responsibleDisclosure: {
    id: 'LEGAL-RD-0001',
    key: 'responsibleDisclosure',
    title: 'Responsible Disclosure',
    kicker: 'Security',
    description:
      'Defines the intake path for good-faith vulnerability reports, coordinated remediation, and safe-harbor boundaries.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: 'Security contact is available; full program terms require counsel and security review.',
    authority: 'public_notice',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'security',
    sections: [
      legalSection(
        'Report scope',
        legalParagraphs(
          'Reports should include affected endpoint, reproduction steps, impact, evidence, and reporter contact details.',
        ),
      ),
      legalSection(
        'Research boundaries',
        legalParagraphs(
          'Do not access customer data, disrupt service, perform destructive testing, or use social engineering.',
        ),
      ),
      legalSection(
        'Response flow',
        legalParagraphs(
          'Security reports are acknowledged, triaged, remediated by severity, and closed with appropriate reporter communication.',
        ),
      ),
    ],
  },
  accessibility: {
    id: 'LEGAL-A11Y-0001',
    key: 'accessibility',
    title: 'Accessibility',
    kicker: 'Legal',
    description:
      'States Afenda accessibility intent for public web surfaces and provides a channel for reporting barriers.',
    version: '0.1.0',
    lastUpdated: '2026-05-02',
    status: 'draft',
    statusNote: 'Accessibility conformance statement requires audit confirmation.',
    authority: 'public_notice',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'support',
    sections: [
      legalSection(
        'Public web commitment',
        legalParagraphs(
          'Afenda aims to provide perceivable, operable, understandable, and robust public web experiences.',
        ),
      ),
      legalSection(
        'Feedback channel',
        legalParagraphs(
          'Users can report accessibility barriers with page URL, assistive technology details, and the task they were trying to complete.',
        ),
      ),
      legalSection(
        'Remediation',
        legalParagraphs('Reported barriers are triaged with product defects and prioritized by user impact.'),
      ),
    ],
  },
  trademarks: {
    id: 'LEGAL-TM-0001',
    key: 'trademarks',
    title: 'Trademark Notice',
    kicker: 'Legal',
    description:
      'Trademark and brand usage notice for Afenda names, marks, product identity, and related brand assets.',
    version: '1.0.0',
    lastUpdated: '2026-05-02',
    status: 'active',
    statusNote: 'Trademark inventory and registration status require counsel confirmation.',
    authority: 'public_notice',
    jurisdiction: defaultMalaysiaAnchoredJurisdiction,
    requiresCounselReview: true,
    evidence: { required: false },
    contact: 'legal',
    sections: [
      legalSection(
        'Afenda Brand Assets',
        legalParagraphs(
          'Afenda, The Machine, Business Truth Infrastructure, and related names, marks, logos, product identifiers, interface concepts, diagrams, visual systems, and brand assets are owned by Afenda or its applicable affiliated entities.',
        ),
      ),
      legalSection(
        'Permitted Reference Use',
        legalParagraphs(
          'You may refer to Afenda by name for accurate, non-misleading identification, comparison, integration, partnership discussion, media reference, or customer communication, provided that such use does not imply endorsement, sponsorship, certification, or affiliation unless expressly authorized by Afenda in writing.',
        ),
      ),
      legalSection(
        'Restricted Use',
        legalParagraphs(
          'You may not use Afenda trademarks, logos, product names, visual identity, screenshots, diagrams, or brand assets in a way that may confuse users, misrepresent ownership, imitate Afenda products, suggest authorization, or damage the reputation, integrity, or distinctiveness of the Afenda brand.',
        ),
      ),
      legalSection(
        'No License Granted',
        legalParagraphs(
          'Nothing in this notice grants any license, assignment, ownership interest, or other right to use Afenda trademarks or brand assets except as expressly permitted in writing by Afenda.',
        ),
      ),
      legalSection(
        'Third-Party Marks',
        legalParagraphs(
          'All third-party trademarks, service marks, product names, company names, and logos referenced by Afenda remain the property of their respective owners. Their use does not imply endorsement or affiliation unless expressly stated.',
        ),
      ),
      legalSection(
        'Brand Review',
        legalParagraphs(
          'Afenda may request correction, removal, or modification of any use of its trademarks or brand assets that is inconsistent with this notice, applicable law, or Afenda brand standards.',
        ),
      ),
      legalSection(
        'Contact',
        legalParagraphs(
          'For trademark, brand, media, or permission requests, contact Afenda through the official legal or compliance contact channel published on the Afenda website.',
        ),
      ),
    ],
  },
} satisfies Record<LegalDocumentKey, LegalPageDocument>;

export function getLegalPageDocument(key: LegalDocumentKey): LegalPageDocument {
  return legalPageDocuments[key];
}

export function getLegalPageHref(key: LegalDocumentKey) {
  return legalPageRegistry[key].href;
}
