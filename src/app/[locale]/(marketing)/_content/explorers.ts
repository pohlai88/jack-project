import type { MarketingSectionId } from './marketing-audience.contract';

export const EXPLORER_IDS = [
  'ontology-object',
  'procurement',
  'operations',
  'architecture',
  'security',
  'evidence',
  'modular',
] as const;

export type ExplorerId = (typeof EXPLORER_IDS)[number];

export type ExplorerDefinition = {
  label: string;
  parentSection: MarketingSectionId;
};

export const EXPLORERS = {
  'ontology-object': {
    label: 'Ontology object',
    parentSection: 'ontology',
  },
  procurement: {
    label: 'Procurement depth',
    parentSection: 'procurement',
  },
  operations: {
    label: 'Operations explorer',
    parentSection: 'operations',
  },
  architecture: {
    label: 'Architecture explorer',
    parentSection: 'architecture',
  },
  security: {
    label: 'Security explorer',
    parentSection: 'security',
  },
  evidence: {
    label: 'Evidence explorer',
    parentSection: 'evidence',
  },
  modular: {
    label: 'SDK playground',
    parentSection: 'modular',
  },
} satisfies Record<ExplorerId, ExplorerDefinition>;

export function getExplorer(id: ExplorerId): ExplorerDefinition {
  return EXPLORERS[id];
}
