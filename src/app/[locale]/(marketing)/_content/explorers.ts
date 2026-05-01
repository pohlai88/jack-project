export type ExplorerId = 'ontology-object' | 'procurement' | 'operations' | 'architecture' | 'modular';

export const EXPLORERS: Record<
  ExplorerId,
  { label: string; parentSection: string; fallbackAnchor: string; hash: string }
> = {
  'ontology-object': {
    label: 'Ontology object',
    parentSection: 'ontology',
    fallbackAnchor: 'explorer-ontology-object-summary',
    hash: 'explorer=ontology-object',
  },
  procurement: {
    label: 'Procurement depth',
    parentSection: 'procurement',
    fallbackAnchor: 'explorer-procurement-summary',
    hash: 'explorer=procurement',
  },
  operations: {
    label: 'Operations explorer',
    parentSection: 'operations',
    fallbackAnchor: 'explorer-operations-summary',
    hash: 'explorer=operations',
  },
  architecture: {
    label: 'Architecture explorer',
    parentSection: 'architecture',
    fallbackAnchor: 'explorer-architecture-summary',
    hash: 'explorer=architecture',
  },
  modular: {
    label: 'SDK playground',
    parentSection: 'modular',
    fallbackAnchor: 'explorer-modular-summary',
    hash: 'explorer=modular',
  },
};
