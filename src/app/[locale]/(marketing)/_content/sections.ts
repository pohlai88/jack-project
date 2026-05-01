/** English copy for the marketing landing page (no i18n). */

export const hero = {
  title: 'Business truth infrastructure for governed operators.',
  lead: 'Afenda turns fragmented operational signals into canonical records with identity, policy, evidence, and audit state attached before decisions move.',
  actions: {
    primary: { label: 'Enter Afenda', href: '/login' },
    secondary: { label: 'View evidence', href: '#evidence' },
  },
} as const;

export const metadata = {
  title: 'Afenda — Business Truth Infrastructure',
  description:
    'Afenda resolves business truth from operational signals: canonical records, 7W1H evidence, tenant-scoped policy, governed execution, and audit-ready enterprise state.',
  openGraphDescription: 'The business truth infrastructure for governed enterprise operations.',
  keywords: [
    'business truth infrastructure',
    'canonical operational records',
    '7W1H audit trail',
    'tenant-scoped governance',
    'policy-bound execution',
    'procurement evidence automation',
    'audit-ready operations',
    'governed enterprise data',
  ],
} as const;

export const thesis = {
  kicker: 'Act I — Declaration',
  headlineLines: [
    'Afenda is not another place where business data goes.',
    'Afenda is where operational truth becomes defensible.',
  ] as const,
  pullQuotes: [
    '01 Authority — every action has actor, scope, and purpose',
    '02 Evidence — source, policy, and lineage travel with the record',
    '03 Control — decisions resolve before they reach finance, audit, or customers',
  ] as const,
  panels: [
    { title: 'Fragmented facts', caption: 'Systems disagree, exceptions hide, and teams reconcile by memory.' },
    { title: 'Governed signals', caption: 'Events enter with source reliability, authority, and operating context.' },
    { title: 'Defensible truth', caption: 'Policy resolves the canonical state and preserves the evidence chain.' },
  ] as const,
};

/**
 * Each object follows Afenda ontology doctrine: every card carries
 * four bands — Properties, Functions, Actions, Automations.
 */
export const ontology = {
  kicker: 'Act II — Business model of truth',
  title: 'Model the business once. Let every workflow inherit the same truth.',
  lead: 'Afenda treats tenants, customers, suppliers, items, contracts, invoices, payments, shipments, and audit events as governed objects — each with properties, functions, actions, and automations.',
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
  title: 'Procurement closes when evidence, obligation, and payment agree.',
  lead: 'Purchase orders, receipts, service entry, invoices, supplier risk, contract terms, accruals, and payment release resolve in one governed flow before spend becomes official.',
  columns: [
    { name: 'Contract lifecycle', bullets: ['Authoring', 'Obligations', 'Renewals', 'Deviation alerts'] },
    { name: 'Category & sourcing', bullets: ['Spend classes', 'RFx', 'Award', 'Policy gates'] },
    { name: 'Ordering', bullets: ['PR → PO', 'Budget caps', 'Split shipments', 'Backorder truth'] },
    { name: 'Supplier relations', bullets: ['Scorecards', 'Incidents', 'Corrective actions', 'SLA proof'] },
    { name: 'AP', bullets: ['Invoice intake', 'Match tolerances', 'Dispute', 'Settlement evidence'] },
  ] as const,
  spineNote: 'The spine these capabilities ride on is shared by finance, operations, audit, and supplier governance.',
};

export const operations = {
  title: 'How operational movement becomes a record the business can defend.',
  lead: 'A signal is normalized, bound to actor and tenant, evaluated against policy, connected to evidence, then committed as canonical state only when the chain is explainable.',
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
  title: 'The architecture makes truth durable, not decorative.',
  lead: 'The same resolved record carries ontology, policy, evidence, authority, lineage, and release posture through every app, workflow, SDK, automation, and agent surface.',
  decks: [
    'Ontology language & toolchain',
    'Ontology engine',
    'Security & governance',
    'Data, logic & action services',
  ] as const,
  tiles: ['App', 'Agent', 'Workflow', 'SDK', 'Automation', 'Code'] as const,
};

export const security = {
  title: 'Purpose-bound access for records that matter.',
  lead: 'Tenant scope, role, purpose, redaction, retention, lineage, and evidence of access are explicit controls. Afenda avoids vague security claims and makes control posture reviewable.',
};

export const evidence = {
  title: 'Trust is carried by the record, not appended after the fact.',
  lead: 'Hashes, signatures, timestamps, source lineage, policy outcomes, exception reasons, and release authority remain attached so audit, finance, and operators inspect the same chain.',
};

export const modular = {
  kicker: 'Act IV — Extensibility',
  title: 'Build on the spine. Do not rebuild governance in every tool.',
  lead: 'SDKs, APIs, containers, federation, custom functions, and workflow actions extend the same truth layer instead of creating new islands of approval, exception, and audit logic.',
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
  line: 'If your business cannot explain who changed what, why it was allowed, and which record became official, it is not governed — it is merely reported.',
  strip: ['Risk posture', 'Decision chain', 'Audit state', 'Working capital'] as const,
  ctaPrimary: {
    label: 'Request an architecture review',
    href: 'mailto:architecture-review@afenda.io?subject=Architecture%20review%20request',
  },
  ctaSecondary: { label: 'Open dossier', href: '#evidence' },
  note: 'Not a demo. A control architecture review.',
};
