import NextLink from 'next/link';
import { getLocale } from 'next-intl/server';

import { localizeHref } from '@/i18n/navigation';

import { hero } from '../_content/sections';

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
            {hero.title}
          </h1>

          <p className="marketing-hero__lead">{hero.lead}</p>

          <div className="marketing-hero__actions" aria-label="Afenda entry actions">
            <NextLink href={localizeHref(locale, hero.actions.primary.href)} className="marketing-hero__cta">
              <span>{hero.actions.primary.label}</span>
            </NextLink>
            <a href={hero.actions.secondary.href} className="marketing-hero__terminal-link">
              <span>{hero.actions.secondary.label}</span>
              <span aria-hidden="true">-&gt;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
