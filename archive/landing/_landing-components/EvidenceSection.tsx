import { FileCheck2, Fingerprint, GitBranch, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/shared/lib/utils';

import {
  landingEditorialDotTw,
  landingEditorialIndexTw,
  landingEditorialTimelineTw,
  LandingPanel,
  landingPanelHeaderRowTw,
  LandingSection,
  LandingSectionHeader,
  landingStatusPillTw,
} from './landing-primitives';

const evidenceKeys = ['identity', 'policy', 'record', 'audit'] as const;
const auditTrailKeys = ['actor', 'tenant', 'policy', 'decision', 'record'] as const;

const evidenceIcons = {
  identity: Fingerprint,
  policy: LockKeyhole,
  record: FileCheck2,
  audit: ShieldCheck,
} as const;

export function EvidenceSection() {
  const t = useTranslations('landing.evidence');

  return (
    <LandingSection id="guarantees" titleId="evidence-heading" tone="muted">
      <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <LandingSectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          titleId="evidence-heading"
          description={t('description')}
          quote={t('quote')}
        />

        <LandingPanel>
          <header className={cn(landingPanelHeaderRowTw, 'sm:items-start')}>
            <div>
              <p className={landingEditorialIndexTw}>{t('panel.label')}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-normal text-foreground">{t('panel.title')}</h3>
            </div>

            <div className={cn(landingStatusPillTw, 'mt-4 px-3 py-2 text-primary sm:mt-0')} data-state="controlled">
              {t('panel.state')}
            </div>
          </header>

          <div className="grid gap-px bg-border/70 md:grid-cols-4">
            {evidenceKeys.map((key, index) => {
              const Icon = evidenceIcons[key];

              return (
                <article key={key} className="bg-card p-5">
                  <div className="flex items-center justify-between gap-4">
                    <Icon className="h-4 w-4 text-primary" aria-hidden />
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h4 className="mt-8 text-base font-semibold leading-6 text-foreground">{t(`items.${key}.title`)}</h4>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{t(`items.${key}.body`)}</p>
                </article>
              );
            })}
          </div>

          <div className="grid gap-px bg-border/70 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="bg-background p-5 md:p-6" aria-labelledby="audit-path-heading">
              <p className={landingEditorialIndexTw}>{t('auditPath.index')}</p>

              <h3 id="audit-path-heading" className="mt-3 text-xl font-semibold tracking-normal text-foreground">
                {t('auditPath.title')}
              </h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">{t('auditPath.description')}</p>

              <ol className={landingEditorialTimelineTw}>
                {auditTrailKeys.map((key, index) => (
                  <li key={key} className="relative">
                    <span className={landingEditorialDotTw} />

                    <p className={landingEditorialIndexTw}>
                      {String(index + 1).padStart(2, '0')} · {t(`auditPath.steps.${key}.label`)}
                    </p>

                    <p className="mt-1 text-sm font-medium leading-6 text-foreground">
                      {t(`auditPath.steps.${key}.value`)}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="bg-card p-5 md:p-6" aria-labelledby="review-record-heading">
              <div className="border border-border/70 bg-background/70">
                <div className="border-b border-border/70 px-5 py-4">
                  <p className={landingEditorialIndexTw}>{t('record.label')}</p>

                  <h3 id="review-record-heading" className="mt-3 text-xl font-semibold tracking-normal text-foreground">
                    {t('record.title')}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{t('record.description')}</p>
                </div>

                <dl className="divide-y divide-border/70">
                  {(['source', 'control', 'result', 'review'] as const).map((key) => (
                    <div key={key} className="grid gap-2 px-5 py-3 text-sm sm:grid-cols-[0.74fr_1.26fr]">
                      <dt className="text-muted-foreground">{t(`record.fields.${key}.term`)}</dt>
                      <dd className="font-medium leading-6 text-foreground">{t(`record.fields.${key}.value`)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <GitBranch className="h-3.5 w-3.5 text-primary" aria-hidden />
                {t('record.footer')}
              </div>
            </section>
          </div>

          <footer className="grid border-t border-border/70 bg-muted/15 md:grid-cols-[0.76fr_1.24fr]">
            <div className="border-b border-border/70 px-5 py-4 md:border-b-0 md:border-r">
              <p className={landingEditorialIndexTw}>{t('consequence.label')}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{t('consequence.title')}</p>
            </div>

            <p className="px-5 py-4 text-sm leading-7 text-muted-foreground">{t('consequence.body')}</p>
          </footer>
        </LandingPanel>
      </div>
    </LandingSection>
  );
}
