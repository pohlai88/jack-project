export type FooterDocumentSection = {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type FooterCitation = {
  label: string;
  href: string;
  note: string;
};

export type FooterDocument = {
  slug: string;
  title: string;
  subtitle: string;
  purpose: string;
  contact: string;
  responseStandard: string;
  sections: readonly FooterDocumentSection[];
  citations?: readonly FooterCitation[];
};

type FooterTranslator = {
  (key: string): string;
  has?: (key: string) => boolean;
  raw?: (key: string) => unknown;
};

export const defaultFooterDocuments = [
  {
    slug: 'documentation',
    title: 'Documentation Access Record',
    subtitle: 'Controlled entry point to product, architecture, and governance documentation.',
    purpose:
      'Provides the formal footer-linked documentation entry while preserving a traceable legal and governance context.',
    contact: 'legal@afenda.io',
    responseStandard: 'Documentation access is immediate; citation clarifications follow legal desk standards.',
    sections: [
      {
        heading: 'Document Scope',
        paragraphs: [
          'This page routes readers to official product documentation and related governance references without ambiguity.',
        ],
      },
      {
        heading: 'Operational Link',
        paragraphs: ['Authoritative documentation remains published at the main docs endpoint.'],
        bullets: ['Primary docs endpoint: /docs'],
      },
    ],
  },
  {
    slug: 'book-demo',
    title: 'Demo Engagement Docket',
    subtitle: 'Formal intake channel for demonstration and technical qualification sessions.',
    purpose:
      'Provides a footer-governed pathway for scheduling a platform demonstration with traceable request intent.',
    contact: 'architecture-review@afenda.io',
    responseStandard: 'Demo intake acknowledgments and scheduling windows are issued by commercial operations.',
    sections: [
      {
        heading: 'Engagement Inputs',
        paragraphs: [
          'Include operational objective, stakeholder roles, and priority workflows to structure the demonstration session.',
        ],
      },
      {
        heading: 'Operational Link',
        paragraphs: ['The active scheduling workflow remains available through the demo endpoint.'],
        bullets: ['Primary demo endpoint: /book-demo'],
      },
    ],
  },
  {
    slug: 'architecture-review',
    title: 'Architecture Review Intake Memorandum',
    subtitle: 'Technical governance intake for regulated processing environments.',
    purpose:
      'Establishes the submission protocol for architecture-risk review, control mapping, and evidentiary adequacy prior to deployment.',
    contact: 'architecture-review@afenda.io',
    responseStandard: 'Acknowledgment within 2 business days; substantive triage memorandum within 7 business days.',
    sections: [
      {
        heading: 'Required Submission Record',
        paragraphs: [
          'Submit a system diagram, data-flow narrative, and decision log that identifies controller, processor, and sub-processor roles.',
        ],
        bullets: [
          'Data classification table',
          'Access-control model',
          'Incident response attachment',
          'Retention and deletion schedule',
        ],
      },
      {
        heading: 'Review Output',
        paragraphs: [
          'Review outcomes include control sufficiency findings, remediation directives, and evidentiary gaps requiring closure before production approval.',
        ],
      },
    ],
  },
  {
    slug: 'security-contact',
    title: 'Security Contact Protocol',
    subtitle: 'Primary channel for security assessment and control assurance requests.',
    purpose:
      'Defines intake and handling rules for security questionnaires, control attestations, and trust-center requests.',
    contact: 'security@afenda.io',
    responseStandard:
      'Acknowledgment within 1 business day; complete response package subject to scope and NDA status.',
    sections: [
      {
        heading: 'Submission Scope',
        paragraphs: [
          'Requests must identify control family, intended regulatory use, and evidence period to ensure accurate retrieval of records.',
        ],
      },
      {
        heading: 'Disclosure Basis',
        paragraphs: [
          'Evidence is released under least-disclosure principle and contractual confidentiality obligations.',
        ],
      },
    ],
  },
  {
    slug: 'compliance-packet',
    title: 'Compliance Packet Request',
    subtitle: 'Formal request channel for regulatory and audit evidence packs.',
    purpose: 'Provides standardized packet assembly for due diligence, audit preparation, and procurement governance.',
    contact: 'compliance@afenda.io',
    responseStandard:
      'Acknowledgment within 2 business days; packet assembly timeline communicated after scope validation.',
    sections: [
      {
        heading: 'Packet Components',
        paragraphs: [
          'Compliance packets may include policy indices, control matrices, subprocessors, and incident reporting posture statements.',
        ],
      },
      {
        heading: 'Verification Controls',
        paragraphs: ['Requests are subject to requester identity verification and legitimate purpose assessment.'],
      },
    ],
  },
  {
    slug: 'dpa-request',
    title: 'Data Processing Addendum Request',
    subtitle: 'Contractual pathway for controller-processor terms and transfer safeguards.',
    purpose: 'Initiates DPA negotiation and execution with jurisdictional annexes and transfer mechanism schedules.',
    contact: 'privacy@afenda.io',
    responseStandard: 'Acknowledgment within 2 business days; redline review sequence confirmed after template intake.',
    sections: [
      {
        heading: 'Contracting Requirements',
        paragraphs: [
          'Provide legal entity details, role allocation, subprocessors constraints, and required transfer mechanism clauses.',
        ],
      },
      {
        heading: 'Cross-Border Safeguards',
        paragraphs: [
          'Transfer clauses must identify destination jurisdictions, legal basis, and supplementary measures where applicable.',
        ],
      },
    ],
  },
  {
    slug: 'privacy-request',
    title: 'Privacy Request Desk',
    subtitle: 'Unified intake channel for privacy notices, policy interpretation, and data handling questions.',
    purpose:
      'Records and routes privacy governance requests to legal and operational reviewers under documented intake controls.',
    contact: 'privacy@afenda.io',
    responseStandard: 'Acknowledgment within 2 business days; response schedule set after issue classification.',
    sections: [
      {
        heading: 'Request Classes',
        paragraphs: [
          'Includes notice interpretation, lawful-basis clarification, retention policy inquiries, and transparency obligations.',
        ],
      },
      {
        heading: 'File Integrity',
        paragraphs: ['All requests are logged with timestamped references to preserve audit traceability.'],
      },
    ],
  },
  {
    slug: 'terms-request',
    title: 'Terms and Contract Desk',
    subtitle: 'Formal channel for terms review, contract clarifications, and legal language requests.',
    purpose:
      'Centralizes legal drafting and interpretation requests related to contractual terms governing service usage.',
    contact: 'legal@afenda.io',
    responseStandard: 'Acknowledgment within 2 business days; legal analysis turnaround by complexity class.',
    sections: [
      {
        heading: 'Drafting Inputs',
        paragraphs: ['Identify clause references, redline intent, and governing-law requirements in each submission.'],
      },
      {
        heading: 'Version Control',
        paragraphs: ['Issued drafts preserve revision history to maintain negotiation traceability.'],
      },
    ],
  },
  {
    slug: 'investor-relations',
    title: 'Investor Relations Legal Channel',
    subtitle: 'Governance disclosures and legal response stream for investor diligence.',
    purpose:
      'Provides controlled access to governance statements and legally reviewable representations for financing diligence.',
    contact: 'investors@example.com',
    responseStandard:
      'Acknowledgment within 3 business days; disclosure pack subject to eligibility and confidentiality screening.',
    sections: [
      {
        heading: 'Disclosure Preconditions',
        paragraphs: ['Requests must provide fund identity, diligence purpose, and executed confidentiality terms.'],
      },
      {
        heading: 'Disclosure Scope',
        paragraphs: [
          'Responses exclude privileged material and unpublished strategic matters unless expressly authorized.',
        ],
      },
    ],
  },
  {
    slug: 'legal-desk',
    title: 'Office of General Counsel',
    subtitle: 'Primary legal operations desk for statutory interpretation and governance directives.',
    purpose:
      'Handles legal citations, interpretation requests, and jurisdictional applicability analyses for published statements.',
    contact: 'legal@afenda.io',
    responseStandard: 'Acknowledgment within 2 business days; legal memorandum issuance based on scope complexity.',
    sections: [
      {
        heading: 'Legal Citation Handling',
        paragraphs: ['Citation requests are answered with law/section precision and source traceability.'],
      },
      {
        heading: 'Publication Governance',
        paragraphs: ['External legal statements are reviewed for statutory accuracy before release.'],
      },
    ],
  },
  {
    slug: 'data-subject-rights',
    title: 'Data Subject Rights Desk',
    subtitle: 'Operational intake for access, correction, deletion, restriction, portability, and objection rights.',
    purpose: 'Registers and executes verified rights requests under documented identity and authority controls.',
    contact: 'privacy@afenda.io',
    responseStandard:
      'Acknowledgment within 2 business days; statutory response timelines applied by governing jurisdiction.',
    sections: [
      {
        heading: 'Identity Verification',
        paragraphs: [
          'Rights fulfillment requires identity verification proportionate to the sensitivity of requested actions.',
        ],
      },
      {
        heading: 'Execution Record',
        paragraphs: ['Each request receives a dated execution log, legal basis record, and completion status.'],
      },
    ],
    citations: [
      { label: 'GDPR Arts. 15-21', href: 'https://gdpr-info.eu/chapter-3/', note: 'EU data-subject rights framework.' },
      {
        label: 'Cal. Civ. Code §§ 1798.105, 1798.106, 1798.110',
        href: 'https://oag.ca.gov/privacy/ccpa',
        note: 'California deletion, correction, and know rights.',
      },
      {
        label: 'UU PDP Pasal 5-15',
        href: 'https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022',
        note: 'Indonesia rights of personal data subjects.',
      },
    ],
  },
  {
    slug: 'regulatory-evidence',
    title: 'Regulatory Evidence Office',
    subtitle: 'Evidence issuance desk for supervisory, procurement, and audit reviewers.',
    purpose: 'Produces evidentiary files that map controls and operations to statutory and contractual obligations.',
    contact: 'compliance@afenda.io',
    responseStandard:
      'Acknowledgment within 2 business days; evidentiary package target date issued after scope confirmation.',
    sections: [
      {
        heading: 'Evidence Standards',
        paragraphs: ['Evidence files are timestamped, source-linked, and prepared for independent review.'],
      },
      {
        heading: 'Admissibility Posture',
        paragraphs: ['Records are structured for verification, with clear provenance and issuance authority.'],
      },
    ],
  },
  {
    slug: 'responsible-disclosure',
    title: 'Coordinated Disclosure Desk',
    subtitle: 'Responsible vulnerability reporting channel with controlled remediation workflow.',
    purpose: 'Receives, verifies, and triages vulnerability disclosures under coordinated disclosure norms.',
    contact: 'security@afenda.io',
    responseStandard:
      'Acknowledgment within 1 business day; severity triage and remediation track opened after validation.',
    sections: [
      {
        heading: 'Minimum Report Contents',
        paragraphs: [
          'Include impacted asset, reproduction details, proof-of-concept boundary, and safe disclosure contact.',
        ],
      },
      {
        heading: 'Good-Faith Handling',
        paragraphs: ['Good-faith reports are handled under coordinated remediation and disclosure sequencing.'],
      },
    ],
  },
  {
    slug: 'authority-eu-gdpr',
    title: 'EU Authority Note — GDPR',
    subtitle: 'Primary EU statutory references used in footer legal statements.',
    purpose: 'Identifies operative GDPR provisions governing transparency, lawful basis, rights, and complaints.',
    contact: 'legal@afenda.io',
    responseStandard: 'Citation clarifications handled through Office of General Counsel workflow.',
    sections: [
      {
        heading: 'Operative Provisions',
        paragraphs: [
          'The footer references Arts. 12-14, Art. 6(1), Arts. 15-21, and Art. 77 as baseline obligations and rights instruments.',
        ],
      },
    ],
    citations: [
      { label: 'Art. 6 GDPR', href: 'https://gdpr-info.eu/art-6-gdpr/', note: 'Lawfulness of processing.' },
      { label: 'Chapter III GDPR', href: 'https://gdpr-info.eu/chapter-3/', note: 'Rights of the data subject.' },
      { label: 'Art. 77 GDPR', href: 'https://gdpr-info.eu/art-77-gdpr/', note: 'Right to lodge a complaint.' },
    ],
  },
  {
    slug: 'authority-us-ccpa-cpra',
    title: 'US Authority Note — CCPA/CPRA',
    subtitle: 'California statutory citations used in footer legal statements.',
    purpose: 'Catalogs California provisions for notice, rights execution, and anti-discrimination duties.',
    contact: 'legal@afenda.io',
    responseStandard: 'Citation clarifications handled through Office of General Counsel workflow.',
    sections: [
      {
        heading: 'Operative Provisions',
        paragraphs: [
          'The footer references §§ 1798.100, 1798.130, 1798.105, 1798.106, 1798.120, 1798.135, and 1798.125.',
        ],
      },
    ],
    citations: [
      {
        label: 'California AG — CCPA Portal',
        href: 'https://oag.ca.gov/privacy/ccpa',
        note: 'Primary public statutory guidance and enforcement context.',
      },
    ],
  },
  {
    slug: 'authority-id-pdp',
    title: 'Indonesia Authority Note — UU No. 27/2022',
    subtitle: 'Indonesian personal data protection citations used in footer legal statements.',
    purpose: 'Catalogs rights, controller obligations, and sanction provisions under Indonesia PDP law.',
    contact: 'legal@afenda.io',
    responseStandard: 'Citation clarifications handled through Office of General Counsel workflow.',
    sections: [
      {
        heading: 'Operative Provisions',
        paragraphs: [
          'The footer references Pasal 5-15, Pasal 20-50, Pasal 57, and Pasal 67-73 as the governing rights and enforcement anchors.',
        ],
      },
    ],
    citations: [
      {
        label: 'UU No. 27 Tahun 2022 (BPK)',
        href: 'https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022',
        note: 'Authoritative statute publication entry.',
      },
    ],
  },
  {
    slug: 'open-source-docket',
    title: 'Open-Source Legal Docket',
    subtitle: 'Research ledger of public legal-policy repositories referenced by the footer.',
    purpose:
      'Documents source provenance for legal drafting patterns and citation architecture used in public footer statements.',
    contact: 'legal@afenda.io',
    responseStandard: 'Source provenance clarifications handled through Office of General Counsel workflow.',
    sections: [
      {
        heading: 'Docket Scope',
        paragraphs: [
          'The docket is a research aid and does not override controlling law, regulation, or contract terms.',
        ],
      },
    ],
    citations: [
      {
        label: 'VSBS CCPA/CPRA Notice Framework',
        href: 'https://github.com/divyamohan1993/vsbs/blob/main/docs/compliance/ccpa-cpra.md',
        note: 'Notice-at-collection and rights matrix pattern.',
      },
      {
        label: 'Giant Swarm Privacy Policy',
        href: 'https://github.com/giantswarm/legal/blob/master/privacypolicy.md',
        note: 'Rights sectioning and article reference style.',
      },
      {
        label: 'UU 27/2022 Text Mirror',
        href: 'https://github.com/mashanz/peraturan-perundang-undangan/blob/main/hierarchy/03-uu-perppu/uu-27-2022.md',
        note: 'Pasal-level structure and sanction mapping.',
      },
      {
        label: 'Simple Analytics Compliance FAQ',
        href: 'https://github.com/simpleanalytics/docs/blob/main/_docs/36_legal/04_compliance-faq.md',
        note: 'Public compliance statement framing.',
      },
    ],
  },
  {
    slug: 'source-vsbs-ccpa-cpra',
    title: 'Source Dossier — VSBS CCPA/CPRA Notice Framework',
    subtitle: 'Public source record for California notice-at-collection and rights matrix drafting patterns.',
    purpose:
      'Captures provenance and drafting utility of the VSBS CCPA/CPRA source used to shape footer legal statement structure.',
    contact: 'legal@afenda.io',
    responseStandard: 'Source provenance clarifications handled through Office of General Counsel workflow.',
    sections: [
      {
        heading: 'Document Utility',
        paragraphs: [
          'Used as an open-source pattern reference for rights tables, notice-at-collection wording, and response timeline presentation.',
        ],
      },
    ],
    citations: [
      {
        label: 'VSBS — CCPA + CPRA Notice',
        href: 'https://github.com/divyamohan1993/vsbs/blob/main/docs/compliance/ccpa-cpra.md',
        note: 'Primary public source used for California rights and notice framing.',
      },
    ],
  },
  {
    slug: 'source-giant-swarm-privacy',
    title: 'Source Dossier — Giant Swarm Privacy Policy',
    subtitle: 'Public source record for article-mapped GDPR rights disclosure structure.',
    purpose:
      'Captures provenance and drafting utility of the Giant Swarm privacy policy structure used for rights indexing.',
    contact: 'legal@afenda.io',
    responseStandard: 'Source provenance clarifications handled through Office of General Counsel workflow.',
    sections: [
      {
        heading: 'Document Utility',
        paragraphs: [
          'Used as a structural reference for explicit, article-level rights mapping in public-facing privacy statements.',
        ],
      },
    ],
    citations: [
      {
        label: 'Giant Swarm — Privacy Policy',
        href: 'https://github.com/giantswarm/legal/blob/master/privacypolicy.md',
        note: 'Primary public source used for GDPR rights section architecture.',
      },
    ],
  },
  {
    slug: 'source-indonesia-uu-27-2022',
    title: 'Source Dossier — Indonesia UU 27/2022 Text Mirror',
    subtitle: 'Public source record for Pasal-level legal text and sanctions mapping.',
    purpose: 'Captures provenance and drafting utility of the machine-readable Indonesian PDP law source.',
    contact: 'legal@afenda.io',
    responseStandard: 'Source provenance clarifications handled through Office of General Counsel workflow.',
    sections: [
      {
        heading: 'Document Utility',
        paragraphs: [
          'Used to verify Pasal references, rights scope language, and sanctions mapping in the footer authority note.',
        ],
      },
    ],
    citations: [
      {
        label: 'Peraturan Perundang-Undangan — UU No. 27 Tahun 2022',
        href: 'https://github.com/mashanz/peraturan-perundang-undangan/blob/main/hierarchy/03-uu-perppu/uu-27-2022.md',
        note: 'Primary public source used for Indonesian statute structure and article mapping.',
      },
    ],
  },
  {
    slug: 'source-simple-analytics-faq',
    title: 'Source Dossier — Simple Analytics Compliance FAQ',
    subtitle: 'Public source record for concise recital/article compliance statement style.',
    purpose: 'Captures provenance and drafting utility of concise compliance-language presentation patterns.',
    contact: 'legal@afenda.io',
    responseStandard: 'Source provenance clarifications handled through Office of General Counsel workflow.',
    sections: [
      {
        heading: 'Document Utility',
        paragraphs: [
          'Used as a style reference for concise, citation-led compliance summaries in public legal surfaces.',
        ],
      },
    ],
    citations: [
      {
        label: 'Simple Analytics — Compliance FAQ',
        href: 'https://github.com/simpleanalytics/docs/blob/main/_docs/36_legal/04_compliance-faq.md',
        note: 'Primary public source used for compact compliance wording patterns.',
      },
    ],
  },
] as const satisfies readonly FooterDocument[];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isCitationArray(value: unknown): value is FooterCitation[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as FooterCitation).label === 'string' &&
        typeof (item as FooterCitation).href === 'string' &&
        typeof (item as FooterCitation).note === 'string',
    )
  );
}

function localizeFooterDocumentSection(
  translator: FooterTranslator,
  keyRoot: string,
  section: FooterDocumentSection,
  index: number,
): FooterDocumentSection {
  const headingKey = `${keyRoot}.sections.${index}.heading`;
  const paragraphsKey = `${keyRoot}.sections.${index}.paragraphs`;
  const bulletsKey = `${keyRoot}.sections.${index}.bullets`;
  const paragraphs = translator.raw?.(paragraphsKey);
  const bullets = translator.raw?.(bulletsKey);

  return {
    heading: translator.has?.(headingKey) ? translator(headingKey) : section.heading,
    paragraphs: translator.has?.(paragraphsKey) && isStringArray(paragraphs) ? paragraphs : section.paragraphs,
    bullets: translator.has?.(bulletsKey) && isStringArray(bullets) ? bullets : section.bullets,
  };
}

function localizeFooterDocument(translator: FooterTranslator, doc: FooterDocument): FooterDocument {
  const keyRoot = `documentsBySlug.${doc.slug}`;

  // Nested namespaces may not register as leaves for `has(slug)`; gate on a concrete message key.
  if (!translator?.has?.(`${keyRoot}.title`)) {
    return doc;
  }

  const localizedSections = doc.sections.map((section, index) =>
    localizeFooterDocumentSection(translator, keyRoot, section, index),
  );

  const citationsKey = `${keyRoot}.citations`;
  const citations = translator.raw?.(citationsKey);

  return {
    ...doc,
    title: translator.has(`${keyRoot}.title`) ? translator(`${keyRoot}.title`) : doc.title,
    subtitle: translator.has(`${keyRoot}.subtitle`) ? translator(`${keyRoot}.subtitle`) : doc.subtitle,
    purpose: translator.has(`${keyRoot}.purpose`) ? translator(`${keyRoot}.purpose`) : doc.purpose,
    contact: translator.has(`${keyRoot}.contact`) ? translator(`${keyRoot}.contact`) : doc.contact,
    responseStandard: translator.has(`${keyRoot}.responseStandard`)
      ? translator(`${keyRoot}.responseStandard`)
      : doc.responseStandard,
    sections: localizedSections,
    citations: translator.has(citationsKey) && isCitationArray(citations) ? citations : doc.citations,
  };
}

export function getLocalizedFooterDocuments(translator: FooterTranslator): FooterDocument[] {
  return defaultFooterDocuments.map((doc) => localizeFooterDocument(translator, doc));
}

export const defaultFooterDocumentBySlug = Object.fromEntries(
  defaultFooterDocuments.map((doc) => [doc.slug, doc]),
) as Record<string, FooterDocument>;
