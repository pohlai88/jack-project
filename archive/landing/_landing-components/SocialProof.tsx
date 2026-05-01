import { useTranslations } from 'next-intl';

import { LandingSectionHeader } from './LandingSectionHeader';

const guaranteeKeys = [
  'canonicalState',
  'decisionPath',
  'tenantBounded',
  'auditReady',
  'controlledChange',
  'integrationDiscipline',
] as const;

export function SocialProof() {
  const t = useTranslations('landing.guarantees');

  return (
    <div>
      <LandingSectionHeader
        titleId="guarantees-heading"
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        align="left"
        className="mb-14"
      />

      <div className="border-y border-border/70">
        {guaranteeKeys.map((key) => (
          <article
            key={key}
            className="grid gap-4 border-b border-border/70 py-6 last:border-b-0 md:grid-cols-[0.36fr_0.64fr] md:gap-10"
          >
            <h3 className="text-xl font-semibold leading-tight text-foreground">{t(`items.${key}.title`)}</h3>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">{t(`items.${key}.body`)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
