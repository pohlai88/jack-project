export const DOCTRINE_ORDER = ['access', 'privacy', 'purpose', 'retention', 'deletion', 'ownership'] as const;

export type DataRightsDoctrineKey = (typeof DOCTRINE_ORDER)[number];

export const DEFAULT_DATA_RIGHTS_DOCTRINE: DataRightsDoctrineKey = 'deletion';

export const dataRightsDoctrines: Record<
  DataRightsDoctrineKey,
  {
    number: string;
    label: string;
    title: string;
    accent: string;
    accentSoft: string;
    summary: string;
    proof: string;
    specimenLabel: string;
  }
> = {
  access: {
    number: '01',
    label: 'Access',
    title: 'Access narrows by default',
    accent: '#78d9ff',
    accentSoft: 'rgba(120,217,255,0.18)',
    summary: 'Only the right actor, role, tenant, and purpose can open a record or trigger an action.',
    proof: 'actor · role · tenant · purpose',
    specimenLabel: 'Actor scope verified',
  },
  privacy: {
    number: '02',
    label: 'Privacy',
    title: 'Privacy reduces exposure',
    accent: '#f0c66e',
    accentSoft: 'rgba(240,198,110,0.18)',
    summary: 'Sensitive fields stay masked or withheld unless a declared business purpose permits reveal.',
    proof: 'masking · minimisation · selective reveal',
    specimenLabel: 'Privacy aperture active',
  },
  purpose: {
    number: '03',
    label: 'Purpose',
    title: 'Purpose comes first',
    accent: '#ff715f',
    accentSoft: 'rgba(255,113,95,0.18)',
    summary: 'Every data use carries a business reason before access, processing, or automation begins.',
    proof: 'reason · domain · allowed use',
    specimenLabel: 'Declared use: AP_APPROVAL',
  },
  retention: {
    number: '04',
    label: 'Retention',
    title: 'Retention has an edge',
    accent: '#9888ff',
    accentSoft: 'rgba(152,136,255,0.18)',
    summary: 'Records carry their retention class, expiry posture, and evidence requirements from the start.',
    proof: 'class · expiry · evidence posture',
    specimenLabel: 'Retention class: 90D',
  },
  deletion: {
    number: '05',
    label: 'Deletion',
    title: 'Deletion leaves accountable proof',
    accent: '#62e9a8',
    accentSoft: 'rgba(98,233,168,0.18)',
    summary:
      'Personal data can leave the active record through a deliberate path. What remains is bounded audit evidence.',
    proof: 'delete path · remnant evidence · proof of removal',
    specimenLabel: 'Personal data deleted · audit evidence retained',
  },
  ownership: {
    number: '06',
    label: 'Ownership',
    title: 'Ownership stays sovereign',
    accent: '#d8b46a',
    accentSoft: 'rgba(216,180,106,0.18)',
    summary: 'Each record remains tied to tenant, legal entity, and ownership context without cross-tenant drift.',
    proof: 'tenant · entity · boundary',
    specimenLabel: 'Tenant boundary: sovereign',
  },
};
