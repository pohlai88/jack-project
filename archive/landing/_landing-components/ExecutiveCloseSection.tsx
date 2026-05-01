import { ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import {
  LandingCtaRow,
  landingEditorialIndexTw,
  LandingPanel,
  landingPanelHeaderRowTw,
  LandingSection,
  LandingSectionHeader,
} from './landing-primitives';

interface ExecutiveCloseSectionProps {
  dashboardHref: string;
  isAuthenticated: boolean;
}

export function ExecutiveCloseSection({ dashboardHref, isAuthenticated }: ExecutiveCloseSectionProps) {
  const t = useTranslations('landing.executiveClose');

  const primaryHref = isAuthenticated ? dashboardHref : '/book-demo';
  const primaryLabel = isAuthenticated ? t('cta.workspace') : t('cta.briefing');

  return (
    <LandingSection titleId="executive-close-heading">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <LandingSectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            titleId="executive-close-heading"
            description={t('description')}
          />

          <LandingCtaRow className="mt-10">
            <Button asChild size="lg" className="gap-2 rounded-none">
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="rounded-none">
              <Link href="/docs">{t('cta.systemBrief')}</Link>
            </Button>
          </LandingCtaRow>
        </div>

        <LandingPanel as="aside" ariaLabel={t('panel.ariaLabel')}>
          <header className={cn(landingPanelHeaderRowTw, 'sm:items-start')}>
            <div>
              <p className={landingEditorialIndexTw}>{t('panel.label')}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-normal text-foreground">{t('panel.title')}</h3>
            </div>
          </header>

          <div className="grid gap-px bg-border/70 md:grid-cols-2">
            <div className="bg-card p-5">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
              <p className="mt-8 text-base font-semibold leading-6 text-foreground">{t('panel.governance.title')}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{t('panel.governance.body')}</p>
            </div>

            <div className="bg-card p-5">
              <FileText className="h-4 w-4 text-primary" aria-hidden />
              <p className="mt-8 text-base font-semibold leading-6 text-foreground">{t('panel.review.title')}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{t('panel.review.body')}</p>
            </div>
          </div>

          <footer className="grid border-t border-border/70 bg-muted/15 md:grid-cols-[0.78fr_1.22fr]">
            <div className="border-b border-border/70 px-5 py-4 md:border-b-0 md:border-r">
              <p className={landingEditorialIndexTw}>{t('panel.close.label')}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{t('panel.close.title')}</p>
            </div>

            <p className="px-5 py-4 text-sm leading-7 text-muted-foreground">{t('panel.close.body')}</p>
          </footer>
        </LandingPanel>
      </div>
    </LandingSection>
  );
}
