/**
 * Marketing landing — audience coverage contract.
 * Typed keys prevent drift; `pnpm verify-marketing-audience` enforces balance rules.
 */
import type { ExplorerId } from './explorers';

/** Ordered surface ids for the marketing home narrative (chips + parity checks). */
export const MARKETING_SECTIONS = [
  'hero',
  'thesis',
  'ontology',
  'procurement',
  'operations',
  'architecture',
  'security',
  'evidence',
  'modular',
  'verdict',
  'footer',
] as const;

export type MarketingSectionId = (typeof MARKETING_SECTIONS)[number];

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

/** Section id → primary audiences (coverage matrix). */
export const SECTION_AUDIENCE_MAP: Record<MarketingSectionId, readonly AudienceId[]> = {
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

/**
 * Explorer modal id → audiences (deep-dive paths).
 * Keep keys aligned with `ExplorerId` in `explorers.ts` (`Record<ExplorerId, …>` enforces completeness).
 */
export const EXPLORER_AUDIENCE_MAP: Record<ExplorerId, readonly AudienceId[]> = {
  'ontology-object': ['tenant', 'ctoCio', 'developer'],
  procurement: ['tenant', 'ceoCfo', 'investor'],
  operations: ['tenant', 'user', 'ceoCfo'],
  architecture: ['ctoCio', 'developer'],
  security: ['tenant', 'ceoCfo', 'ctoCio', 'investor'],
  evidence: ['tenant', 'ceoCfo', 'ctoCio', 'investor'],
  modular: ['ctoCio', 'developer'],
};

export { EXPLORER_IDS } from './explorers';
export type { ExplorerId } from './explorers';
