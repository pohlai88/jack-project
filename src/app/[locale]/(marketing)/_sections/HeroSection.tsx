import NextLink from 'next/link';
import { getLocale } from 'next-intl/server';

import { localizeHref } from '@/i18n/navigation';

export async function HeroSection() {
  const locale = await getLocale();

  return (
    <section id="hero" className="marketing-hero marketing-hero--quiet" aria-labelledby="marketing-hero-title">
      <div className="marketing-hero__backdrop" aria-hidden="true">
        <span className="marketing-hero__grain" />
        <span className="marketing-hero__rules" />
      </div>

      <div className="marketing-hero__composition marketing-hero__grid">
        <div className="marketing-hero__content">
          <h1 id="marketing-hero-title" className="marketing-hero__title">
            Business truth infrastructure
          </h1>

          <p className="marketing-hero__lead">
            Canonical records, evidence, and policy-bound execution for teams that need audit-ready state.
          </p>

          <div className="marketing-hero__actions" aria-label="Afenda entry actions">
            <NextLink href={localizeHref(locale, '/login')} className="marketing-hero__cta">
              <span>Enter Afenda</span>
            </NextLink>
            <a href="#evidence" className="marketing-hero__terminal-link">
              <span>View Evidence</span>
              <span aria-hidden="true">-&gt;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
