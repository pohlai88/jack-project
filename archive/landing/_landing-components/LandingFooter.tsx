import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { AppLogo } from '@/shared/components/brand/Logo';

const FOOTER_LINK_KEYS = ['system', 'surface', 'domains', 'guarantees', 'docs'] as const;

const FOOTER_LINK_HREF: Record<(typeof FOOTER_LINK_KEYS)[number], string> = {
  system: '#system',
  surface: '#surface',
  domains: '#domains',
  guarantees: '#guarantees',
  docs: '/docs',
};

export function LandingFooter() {
  const t = useTranslations('landing.footer');

  return (
    <footer className="landing-footer" aria-labelledby="footer-heading">
      <div className="landing-footer__inner">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div className="max-w-xl">
            <AppLogo href="/" placement="footer" className="mb-6" />

            <h2 id="footer-heading" className="sr-only">
              {t('heading')}
            </h2>

            <p className="text-sm leading-7 text-muted-foreground">{t('blurb')}</p>
          </div>

          <nav className="grid gap-3 text-sm md:min-w-48 md:text-right" aria-label={t('navLabel')}>
            {FOOTER_LINK_KEYS.map((key) => (
              <Link
                key={key}
                href={FOOTER_LINK_HREF[key]}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(`links.${key}`)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 grid gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:grid-cols-[1fr_auto] md:items-center">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <p className="font-mono uppercase tracking-[0.12em]">{t('position')}</p>
        </div>
      </div>
    </footer>
  );
}
