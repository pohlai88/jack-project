'use client';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';

import { LandingSection, LandingSectionHeader, landingStatusPillTw } from './landing-primitives';

const resolutionStageKeys = ['input', 'control', 'truth'] as const;

export function HowItWorks() {
  const t = useTranslations('landing.resolutionStages');

  return (
    <LandingSection>
      <LandingSectionHeader
        className="mb-16"
        eyebrow="Resolution model"
        title="Every workforce signal passes through one path."
        description={
          <>
            Afenda does not allow parallel interpretations. All signals are processed through a single deterministic
            pipeline before becoming part of the workforce record.
          </>
        }
      />

      <div className="landing-panel relative grid gap-px bg-border lg:grid-cols-3">
        {resolutionStageKeys.map((stage, index) => (
          <article key={stage} className="relative bg-background px-6 py-10">
            {index !== resolutionStageKeys.length - 1 && (
              <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 lg:block">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            <p className={cn(landingStatusPillTw, 'inline-flex px-2.5 py-1 text-primary')}>{t(`${stage}.step`)}</p>

            <h3 className="mt-5 text-xl font-semibold tracking-normal text-foreground">{t(`${stage}.title`)}</h3>

            <p className={`mt-5 leading-7 ${stage === 'truth' ? 'text-foreground' : 'text-sm text-muted-foreground'}`}>
              {t(`${stage}.description`)}
            </p>

            {stage === 'truth' && (
              <div className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
                canonical record · audit-ready · identity-bound
              </div>
            )}
          </article>
        ))}
      </div>
    </LandingSection>
  );
}
