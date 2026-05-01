'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';

import { LandingSection, LandingSectionHeader, landingStatusPillTw } from './landing-primitives';

const capabilityKeys = [
  'canonicalRecords',
  'evidenceBinding',
  'governanceControls',
  'auditContinuity',
  'operationalResolution',
  'enterpriseIntegration',
] as const;

export function FeatureTabShowcase() {
  const t = useTranslations('landing.capabilities');

  return (
    <LandingSection id="domains" titleId="capability-doctrine-heading" tone="muted">
      <LandingSectionHeader
        className="mb-16"
        eyebrow="System capabilities"
        title={
          <>
            Capability is not a feature layer.
            <br />
            It is a system guarantee.
          </>
        }
        titleId="capability-doctrine-heading"
        description={
          <>
            Afenda does not expose isolated features. Each capability enforces a structural property of the operating
            model - identity, control, resolution, and evidence.
          </>
        }
      />

      <div className="divide-y divide-border">
        {capabilityKeys.map((key, index) => (
          <article key={key} className="grid gap-8 py-10 lg:grid-cols-[0.12fr_0.58fr_0.3fr]">
            <div className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</div>

            <div>
              <h3 className="text-xl font-semibold tracking-normal text-foreground">{t(`${key}.title`)}</h3>

              <p className="mt-4 text-base leading-8 text-muted-foreground">{t(`${key}.body`)}</p>
            </div>

            <div className="border-l border-border pl-6">
              <p className={cn(landingStatusPillTw, 'inline-flex px-2.5 py-1 text-muted-foreground')}>Proof</p>

              <p className="mt-3 text-sm leading-7 text-foreground">{t(`${key}.proof`)}</p>
            </div>
          </article>
        ))}
      </div>
    </LandingSection>
  );
}
