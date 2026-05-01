/**
 * Afenda Data Rights Doctrine — machine-readable contract surface.
 * Presentation (accents, typography) lives in design tokens / CSS, not here.
 */

export const DATA_RIGHTS_DOCTRINE_ORDER = [
  'access',
  'privacy',
  'purpose',
  'retention',
  'deletion',
  'ownership',
] as const;

export type DataRightsDoctrineKey = (typeof DATA_RIGHTS_DOCTRINE_ORDER)[number];

/** Default inspection state for specimen board + scroll reset. */
export const DEFAULT_DATA_RIGHTS_DOCTRINE_KEY: DataRightsDoctrineKey = 'deletion';

export type DoctrineEnforcement = 'hard' | 'soft' | 'advisory';

export type DataRightsDoctrineAppliesTo = {
  readonly read: boolean;
  readonly write: boolean;
  readonly delete: boolean;
  readonly export: boolean;
};

export type DataRightsDoctrineProofContract = {
  readonly required: boolean;
  readonly fields: readonly string[];
};

export type DataRightsEvidenceCategory = 'access_log' | 'policy_evaluation' | 'deletion_record' | 'retention_policy';

export type DataRightsDoctrineEvidenceContract = {
  readonly required: boolean;
  readonly type: DataRightsEvidenceCategory;
};

export type DataRightsDoctrineContractEntry = Readonly<{
  id: string;
  version: `${number}.${number}.${number}`;
  /** Display ordinal aligned with specimen rail order. */
  number: string;
  label: string;
  title: string;
  key: DataRightsDoctrineKey;
  enforcement: DoctrineEnforcement;
  appliesTo: DataRightsDoctrineAppliesTo;
  summary: string;
  proof: DataRightsDoctrineProofContract;
  evidence: DataRightsDoctrineEvidenceContract;
  specimenLabel: string;
}>;

/** Surfaces permitted to cite each doctrine row (coverage / orphan prevention). */
export const DATA_RIGHTS_DOCTRINE_SURFACE_BINDINGS = {
  access: ['marketing:DataRightsSpecimenBoard'],
  privacy: ['marketing:DataRightsSpecimenBoard'],
  purpose: ['marketing:DataRightsSpecimenBoard'],
  retention: ['marketing:DataRightsSpecimenBoard'],
  deletion: ['marketing:DataRightsSpecimenBoard'],
  ownership: ['marketing:DataRightsSpecimenBoard'],
} satisfies Record<DataRightsDoctrineKey, readonly string[]>;

export const DATA_RIGHTS_DOCTRINES_BY_KEY: Record<DataRightsDoctrineKey, DataRightsDoctrineContractEntry> = {
  access: {
    id: 'DRD-001',
    key: 'access',
    number: '01',
    version: '1.0.0',
    label: 'Access',
    title: 'Access narrows by default',
    enforcement: 'hard',
    appliesTo: { read: true, write: false, delete: false, export: false },
    summary: 'Only the right actor, role, tenant, and purpose can open a record or trigger an action.',
    proof: {
      required: true,
      fields: ['actor', 'role', 'tenant', 'purpose'],
    },
    evidence: {
      required: true,
      type: 'access_log',
    },
    specimenLabel: 'Actor scope verified',
  },
  privacy: {
    id: 'DRD-002',
    key: 'privacy',
    number: '02',
    version: '1.0.0',
    label: 'Privacy',
    title: 'Privacy reduces exposure',
    enforcement: 'hard',
    appliesTo: { read: true, write: true, delete: false, export: true },
    summary: 'Sensitive fields stay masked or withheld unless a declared business purpose permits reveal.',
    proof: {
      required: true,
      fields: ['masking', 'minimisation', 'selective_reveal'],
    },
    evidence: {
      required: true,
      type: 'policy_evaluation',
    },
    specimenLabel: 'Privacy aperture active',
  },
  purpose: {
    id: 'DRD-003',
    key: 'purpose',
    number: '03',
    version: '1.0.0',
    label: 'Purpose',
    title: 'Purpose comes first',
    enforcement: 'hard',
    appliesTo: { read: false, write: true, delete: false, export: false },
    summary: 'Every data use carries a business reason before access, processing, or automation begins.',
    proof: {
      required: true,
      fields: ['reason', 'domain', 'allowed_use'],
    },
    evidence: {
      required: true,
      type: 'policy_evaluation',
    },
    specimenLabel: 'Declared use: AP_APPROVAL',
  },
  retention: {
    id: 'DRD-004',
    key: 'retention',
    number: '04',
    version: '1.0.0',
    label: 'Retention',
    title: 'Retention has an edge',
    enforcement: 'soft',
    appliesTo: { read: true, write: true, delete: false, export: true },
    summary: 'Records carry their retention class, expiry posture, and evidence requirements from the start.',
    proof: {
      required: true,
      fields: ['class', 'expiry', 'evidence_posture'],
    },
    evidence: {
      required: true,
      type: 'retention_policy',
    },
    specimenLabel: 'Retention class: 90D',
  },
  deletion: {
    id: 'DRD-005',
    key: 'deletion',
    number: '05',
    version: '1.0.0',
    label: 'Deletion',
    title: 'Deletion leaves accountable proof',
    enforcement: 'hard',
    appliesTo: { read: false, write: false, delete: true, export: false },
    summary:
      'Personal data can leave the active record through a deliberate path. What remains is bounded audit evidence.',
    proof: {
      required: true,
      fields: ['delete_path', 'remnant_evidence', 'proof_of_removal'],
    },
    evidence: {
      required: true,
      type: 'deletion_record',
    },
    specimenLabel: 'Personal data deleted · audit evidence retained',
  },
  ownership: {
    id: 'DRD-006',
    key: 'ownership',
    number: '06',
    version: '1.0.0',
    label: 'Ownership',
    title: 'Ownership stays sovereign',
    enforcement: 'hard',
    appliesTo: { read: true, write: true, delete: false, export: true },
    summary: 'Each record remains tied to tenant, legal entity, and ownership context without cross-tenant drift.',
    proof: {
      required: true,
      fields: ['tenant', 'entity', 'boundary'],
    },
    evidence: {
      required: true,
      type: 'policy_evaluation',
    },
    specimenLabel: 'Tenant boundary: sovereign',
  },
};

const semverPattern = /^\d+\.\d+\.\d+$/;

/**
 * Validates contract coverage and guardrails for CI / procurement surfaces.
 */
export function validateDoctrineCoverage(): string[] {
  const errors: string[] = [];

  const orderedKeys = [...DATA_RIGHTS_DOCTRINE_ORDER];
  const recordKeys = Object.keys(DATA_RIGHTS_DOCTRINES_BY_KEY) as DataRightsDoctrineKey[];

  for (const key of orderedKeys) {
    if (!recordKeys.includes(key)) {
      errors.push(`DATA_RIGHTS_DOCTRINES_BY_KEY is missing doctrine key "${key}".`);
    }
  }
  for (const key of recordKeys) {
    if (!orderedKeys.includes(key)) {
      errors.push(`Unexpected doctrine key "${key}" not present in DATA_RIGHTS_DOCTRINE_ORDER.`);
    }
  }

  for (const key of orderedKeys) {
    const doc = DATA_RIGHTS_DOCTRINES_BY_KEY[key];
    if (!doc) continue;

    if (doc.key !== key) errors.push(`Doctrine "${key}" has mismatched entry.key "${doc.key}".`);
    if (!doc.id?.trim()) errors.push(`Doctrine "${key}" requires id.`);
    if (!semverPattern.test(doc.version)) errors.push(`Doctrine "${key}" version must be semver (e.g. 1.0.0).`);

    const { proof, evidence, enforcement } = doc;

    if (proof.required && proof.fields.length === 0) {
      errors.push(`Doctrine "${key}" proof is required but fields is empty.`);
    }

    if (enforcement === 'hard' && !evidence.required) {
      errors.push(`Doctrine "${key}" is hard-enforced but evidence.required is false.`);
    }

    const bindings = DATA_RIGHTS_DOCTRINE_SURFACE_BINDINGS[key];
    if (!bindings?.length) {
      errors.push(`Doctrine "${key}" has no surface bindings (DATA_RIGHTS_DOCTRINE_SURFACE_BINDINGS).`);
    }
  }

  return errors;
}

export function assertDataRightsDoctrineContract(): void {
  const errors = validateDoctrineCoverage();
  if (errors.length) {
    throw new Error(`Data rights doctrine contract failed:\n${errors.map((e) => `  • ${e}`).join('\n')}`);
  }
}
