'use client';

import { ArrowRight, Scale } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';

import { HeroProductPreview } from './HeroProductPreview';
import { LandingCtaRow, LandingKicker } from './landing-primitives';

interface EnterpriseHeroProps {
  dashboardHref: string;
  isAuthenticated: boolean;
}

const assuranceItems = [
  {
    label: 'Identity authority',
    value: 'Actor-bound events',
  },
  {
    label: 'Policy boundary',
    value: 'Governed decisions',
  },
  {
    label: 'System record',
    value: 'Canonical proof',
  },
];

export function EnterpriseHero({ dashboardHref, isAuthenticated }: EnterpriseHeroProps) {
  const primaryHref = isAuthenticated ? dashboardHref : '/book-demo';

  return (
    <section className="enterprise-hero border-b border-border">
      <div className="enterprise-hero__inner">
        {/* LEFT - ENTERPRISE DECLARATION */}
        <div className="enterprise-hero__copy">
          <div className="enterprise-hero__copy-head">
            <LandingKicker className="enterprise-hero__kicker">Workforce Control System</LandingKicker>

            <div className="enterprise-hero__authority-pill" aria-label="System state">
              <Scale className="h-3.5 w-3.5" aria-hidden />
              <span>Governed resolution layer</span>
            </div>
          </div>

          <h1 className="enterprise-hero__title font-semibold text-balance">
            Workforce operations must be resolved before they can be trusted.
          </h1>

          <p className="enterprise-hero__lede">
            Afenda turns fragmented workforce signals into governed operating truth - binding every event to identity,
            policy, and a canonical record.
          </p>

          <p className="enterprise-hero__lede mt-4 text-foreground">
            The result is a control layer leaders can audit, defend, and operate from.
          </p>

          <LandingCtaRow className="enterprise-hero__actions">
            <Button asChild size="lg" className="gap-2 rounded-none">
              <Link href={primaryHref}>
                {isAuthenticated ? 'Access system' : 'Request executive briefing'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="rounded-none">
              <Link href="/docs">Read system definition</Link>
            </Button>
          </LandingCtaRow>

          <div className="enterprise-hero__assurance" aria-label="Enterprise control baseline">
            <div className="enterprise-hero__assurance-header">
              <span>Enterprise control baseline</span>
              <strong>Resolved</strong>
            </div>

            <dl className="enterprise-hero__assurance-grid">
              {assuranceItems.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* RIGHT - LIVE SYSTEM SURFACE */}
        <div className="enterprise-hero__panel-wrap">
          <HeroProductPreview />

          <div className="enterprise-hero__trace-caption">
            Live operational trace - identity-bound - policy-resolved
          </div>
        </div>
      </div>
    </section>
  );
}
