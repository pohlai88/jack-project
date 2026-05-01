/**
 * Six-audience matrix for the marketing landing (coverage + equilibrium).
 * Each audience: ≥2 sections on page + ≥1 explorer (end user via tenant/operator paths).
 */
export const AUDIENCES = ['tenant', 'user', 'ceoCfo', 'ctoCio', 'investor', 'developer'] as const;

export type AudienceId = (typeof AUDIENCES)[number];

/** Short labels rendered as audience chips on section eyebrows. */
export const AUDIENCE_LABEL: Record<AudienceId, string> = {
  tenant: 'Tenant',
  user: 'Operator',
  ceoCfo: 'CEO·CFO',
  ctoCio: 'CTO·CIO',
  investor: 'Investor',
  developer: 'Developer',
};

/** Section id → audiences (x in plan matrix). */
export const SECTION_AUDIENCE_MAP: Record<string, readonly AudienceId[]> = {
  hero: ['tenant', 'user', 'ceoCfo', 'ctoCio', 'investor', 'developer'],
  thesis: ['ceoCfo', 'ctoCio', 'investor'],
  ontology: ['tenant', 'ctoCio', 'developer'],
  procurement: ['tenant', 'user', 'ceoCfo'],
  operations: ['tenant', 'user', 'ceoCfo'],
  architecture: ['ctoCio', 'developer'],
  security: ['tenant', 'ceoCfo', 'ctoCio'],
  evidence: ['tenant', 'ceoCfo', 'ctoCio'],
  modular: ['ctoCio', 'developer'],
  verdict: ['ceoCfo', 'ctoCio', 'investor'],
  footer: ['tenant', 'user', 'ceoCfo', 'ctoCio', 'investor', 'developer'],
};

export const EXPLORER_AUDIENCE_MAP: Record<string, readonly AudienceId[]> = {
  'ontology-object': ['tenant', 'ctoCio', 'developer'],
  procurement: ['tenant', 'ceoCfo'],
  operations: ['tenant', 'user', 'ceoCfo'],
  architecture: ['ctoCio', 'developer'],
  modular: ['ctoCio', 'developer'],
};
