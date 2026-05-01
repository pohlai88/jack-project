import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import {
  LandingCtaRow,
  landingEditorialDotTw,
  landingEditorialIndexTw,
  landingEditorialTimelineTw,
  LandingPanel,
  landingPanelHeaderRowTw,
  LandingSection,
  LandingSectionHeader,
  landingStatusPillTw,
} from './landing-primitives';

const reviewKeys = ['governance', 'implementation', 'security', 'commercial'] as const;

export function EnterpriseCommercialSection() {
  const t = useTranslations('landing.commercial');

  return (
    <LandingSection titleId="commercial-heading">
      <div className="grid gap-14 lg:grid-cols-[0.76fr_1.24fr] lg:items-start">
        <div>
          <LandingSectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            titleId="commercial-heading"
            description={t('description')}
          />

          <LandingCtaRow className="mt-10">
            <Button asChild size="lg" className="gap-2 rounded-none">
              <Link href="/book-demo">
                {t('cta.primary')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="rounded-none">
              <Link href="/docs">{t('cta.secondary')}</Link>
            </Button>
          </LandingCtaRow>
        </div>

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
            {reviewKeys.map((key, index) => (
              <article key={key} className="bg-card p-5">
                <div className="flex items-center justify-between gap-4">
                  {key === 'governance' || key === 'security' ? (
                    <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
                  ) : (
                    <FileText className="h-4 w-4 text-primary" aria-hidden />
                  )}

                  <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                </div>

                <h4 className="mt-8 text-base font-semibold leading-6 text-foreground">{t(`review.${key}.title`)}</h4>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">{t(`review.${key}.body`)}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-px bg-border/70 lg:grid-cols-[0.92fr_1.08fr]">
            <section className="bg-background p-5 md:p-6" aria-labelledby="commercial-process-heading">
              <p className={landingEditorialIndexTw}>{t('process.index')}</p>

              <h3
                id="commercial-process-heading"
                className="mt-3 text-xl font-semibold tracking-normal text-foreground"
              >
                {t('process.title')}
              </h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">{t('process.description')}</p>

              <ol className={landingEditorialTimelineTw}>
                {(['scope', 'validate', 'align', 'commit'] as const).map((key, index) => (
                  <li key={key} className="relative">
                    <span className={landingEditorialDotTw} />

                    <p className={landingEditorialIndexTw}>
                      {String(index + 1).padStart(2, '0')} · {t(`process.steps.${key}.label`)}
                    </p>

                    <p className="mt-1 text-sm font-medium leading-6 text-foreground">
                      {t(`process.steps.${key}.value`)}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="bg-card p-5 md:p-6" aria-labelledby="commercial-record-heading">
              <div className="border border-border/70 bg-background/70">
                <div className="border-b border-border/70 px-5 py-4">
                  <p className={landingEditorialIndexTw}>{t('record.label')}</p>

                  <h3
                    id="commercial-record-heading"
                    className="mt-3 text-2xl font-semibold leading-tight tracking-normal text-foreground"
                  >
                    {t('record.title')}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{t('record.description')}</p>
                </div>

                <dl className="divide-y divide-border/70">
                  {(['model', 'basis', 'review', 'outcome'] as const).map((key) => (
                    <div key={key} className="grid gap-2 px-5 py-3 text-sm sm:grid-cols-[0.74fr_1.26fr]">
                      <dt className="text-muted-foreground">{t(`record.fields.${key}.term`)}</dt>
                      <dd className="font-medium leading-6 text-foreground">{t(`record.fields.${key}.value`)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-5 text-xs leading-6 text-muted-foreground">{t('record.footer')}</div>
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
