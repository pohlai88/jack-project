export type ExplorerId =
  | 'ontology-object'
  | 'procurement'
  | 'operations'
  | 'architecture'
  | 'security'
  | 'evidence'
  | 'modular';

export const EXPLORERS: Record<ExplorerId, { label: string; parentSection: string }> = {
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
};
