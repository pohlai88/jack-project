import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { AppLogo } from '@/shared/components/brand/Logo';

export function LandingFooter() {
  const t = useTranslations('landing.footer');

  return (
    <footer className="border-t bg-card/50 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <AppLogo href="/" size="sm" className="mb-3" />
            <p className="text-sm text-muted-foreground max-w-xs">{t('blurb')}</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">{t('sections.product')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('links.features')}
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('links.pricing')}
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('links.howItWorks')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">{t('sections.resources')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('links.documentation')}
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/60 cursor-default">{t('links.blog')}</span>
              </li>
              <li>
                <span className="text-muted-foreground/60 cursor-default">{t('links.changelog')}</span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">{t('sections.company')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground/60 cursor-default">{t('links.about')}</span>
              </li>
              <li>
                <span className="text-muted-foreground/60 cursor-default">{t('links.contact')}</span>
              </li>
              <li>
                <span className="text-muted-foreground/60 cursor-default">{t('links.privacy')}</span>
              </li>
              <li>
                <span className="text-muted-foreground/60 cursor-default">{t('links.terms')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/60">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Afenda. {t('builtWith')}
          </p>
          <div className="flex items-center gap-4">
            {/* Social placeholders */}
            {['GitHub', 'LinkedIn', 'Twitter'].map((name) => (
              <span
                key={name}
                className="text-xs text-muted-foreground/60 cursor-default"
                title={t('socialComingSoon', { name })}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
