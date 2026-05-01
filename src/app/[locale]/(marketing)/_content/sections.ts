/** English copy for the marketing landing page (no i18n). */

export const thesis = {
  kicker: 'Act I — Declaration',
  headlineLines: ['Afenda is not where business data goes.', 'Afenda is where business truth is resolved.'] as const,
  pullQuotes: [
    '01 Software — tenant-scoped execution surfaces',
    '02 Privacy — purpose-bound access and redaction',
    '03 Trust — evidence at action time, audit-ready records',
  ] as const,
  panels: [
    { title: 'Fragmented facts', caption: 'Systems disagree; spreadsheets win.' },
    { title: 'Connected signals', caption: 'Events wire; lineage becomes visible.' },
    { title: 'Governed truth', caption: 'Policy decides; the canonical record resolves.' },
  ] as const,
};

/**
 * Each object follows Afenda ontology doctrine: every card carries
 * four bands — Properties, Functions, Actions, Automations.
 */
export const ontology = {
  kicker: 'Act II — Business model of truth',
  title: 'If you cannot draw your business as one ontology, you are operating on opinion.',
  lead: 'Objects, links, and automations — not screens. Every card carries Properties · Functions · Actions · Automations in Afenda doctrine.',
  bandLabels: ['Properties', 'Functions', 'Actions', 'Automations'] as const,
  objects: [
    {
      name: 'Tenant',
      properties: ['Scope', 'Region'],
      functions: ['Policy packs', 'Quota'],
      actions: ['Provision', 'Suspend'],
      automations: ['Drift watch', 'Compliance refresh'],
    },
    {
      name: 'Customer',
      properties: ['Identity', 'Credit posture'],
      functions: ['Order', 'Quote'],
      actions: ['Onboard', 'Block'],
      automations: ['Renewal nudge', 'Churn flag'],
    },
    {
      name: 'Supplier',
      properties: ['KYC', 'Risk tier'],
      functions: ['Bid', 'Award'],
      actions: ['Onboard', 'Penalise'],
      automations: ['Score refresh', 'Watchlist sync'],
    },
    {
      name: 'Item',
      properties: ['SKU', 'BOM role'],
      functions: ['Plan', 'Cost'],
      actions: ['Substitute', 'Recall'],
      automations: ['Stock refresh', 'Obsolescence flag'],
    },
    {
      name: 'Contract',
      properties: ['Terms', 'Obligations'],
      functions: ['Amend', 'Compare'],
      actions: ['Sign', 'Terminate'],
      automations: ['Compliance scan', 'Renewal alert'],
    },
    {
      name: 'Invoice',
      properties: ['7W1H record', 'Tax posture'],
      functions: ['3-way match', 'Reconcile'],
      actions: ['Approve / dispute', 'Pay'],
      automations: ['OTP bind', 'Penalty calc'],
    },
    {
      name: 'Payment',
      properties: ['Rail', 'Currency'],
      functions: ['Settle', 'Allocate'],
      actions: ['Release', 'Recall'],
      automations: ['Reconcile', 'FX hedge'],
    },
    {
      name: 'Shipment',
      properties: ['ASN', 'Carrier'],
      functions: ['Track', 'Receive'],
      actions: ['Dispatch', 'Reject'],
      automations: ['POD bind', 'OTIF score'],
    },
    {
      name: 'Audit Event',
      properties: ['Actor', 'Purpose'],
      functions: ['Hash', 'Sign'],
      actions: ['Approve', 'Replay'],
      automations: ['Lineage emit', 'Evidence pin'],
    },
  ] as const,
};

export const procurement = {
  title: 'Procurement closes when evidence matches.',
  lead: 'PO, receipt, invoice, supplier risk, contract terms, and payment state resolve in one governed flow.',
  columns: [
    { name: 'Contract lifecycle', bullets: ['Authoring', 'Obligations', 'Renewals', 'Deviation alerts'] },
    { name: 'Category & sourcing', bullets: ['Spend classes', 'RFx', 'Award', 'Policy gates'] },
    { name: 'Ordering', bullets: ['PR → PO', 'Budget caps', 'Split shipments', 'Backorder truth'] },
    { name: 'Supplier relations', bullets: ['Scorecards', 'Incidents', 'Corrective actions', 'SLA proof'] },
    { name: 'AP', bullets: ['Invoice intake', 'Match tolerances', 'Dispute', 'Settlement evidence'] },
  ] as const,
  spineNote: 'The spine these capabilities ride on — see Architecture explorer.',
};

export const operations = {
  title: 'How a signal becomes truth.',
  lead: 'A business event is bound to actor, policy, evidence, and state before it becomes a canonical record.',
  tabs: ['Procurement', 'Operations', 'Logistics', 'Finance'] as const,
  inputs: ['SAP', 'Oracle NetSuite', 'Infor', 'Workday', 'Rippling'],
  modules: [
    'Inventory',
    'BOM',
    'Suppliers',
    'Customers',
    'Sales orders',
    'Purchase orders',
    'Delivery',
    'ECO',
    'Quality',
    'Work orders',
  ],
  outputs: ['Variance analysis', 'COGS', 'OTIF'],
};

export const architecture = {
  kicker: 'Act III — Platform proof',
  title: "Why it can't be faked.",
  lead: 'The same resolved record carries policy, evidence, authority, and lineage through the platform stack.',
  decks: [
    'Ontology language & toolchain',
    'Ontology engine',
    'Security & governance',
    'Data, logic & action services',
  ] as const,
  tiles: ['App', 'Agent', 'Workflow', 'SDK', 'Automation', 'Code'] as const,
};

export const security = {
  title: 'Purpose-bound access to business truth.',
  lead: 'Purpose, redaction, retention, lineage, role-vs-purpose, evidence of access — precise controls, not vague “secure your data”.',
};

export const evidence = {
  title: 'Trust is a property of the record.',
  lead: 'Hash, signatures, timestamp, lineage chain — the audit file after the event. Quieter than the hero; no second climax.',
};

export const modular = {
  kicker: 'Act IV — Extensibility',
  title: 'Build on the spine. Do not rebuild the spine.',
  lead: 'SDK, API, container, federation, custom functions, actions — static surface; playground lives in the explorer.',
  codeSample: `import { afenda } from "@afenda/sdk";

const record = await afenda.resolve({
  tenant: "acme",
  object: "Invoice",
  id: "INV-2044",
  evidence: true,
});`,
};

export const verdict = {
  kicker: 'Act V — Close',
  line: 'If your business cannot explain who changed what, why it was allowed, and which record became official, it is not governed.',
  strip: ['Risk posture', 'Decision chain', 'Audit state', 'Capital efficiency'] as const,
  ctaPrimary: {
    label: 'Request an architecture review',
    href: 'mailto:architecture-review@afenda.io?subject=Architecture%20review%20request',
  },
  ctaSecondary: { label: 'Open dossier', href: '#evidence' },
};

export const footer = {
  note: '© Afenda — business truth infrastructure.',
  links: [
    { label: 'Investor relations', href: 'mailto:investors@example.com' },
    { label: 'Docs', href: '/docs' },
    { label: 'Book a demo', href: '/book-demo' },
  ] as const,
};
