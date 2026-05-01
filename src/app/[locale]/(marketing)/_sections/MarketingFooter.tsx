import { Link } from '@/i18n/navigation';
import { AppLogo } from '@/shared/components/brand/Logo';

import { footerLegalDisclosure } from '../_content/footer-legal-disclosure';
import { footerNavConfig } from '../_content/footer-nav';

const FOOTER_COLUMNS = [
  footerNavConfig.product,
  footerNavConfig.legal,
  footerNavConfig.trust,
  footerNavConfig.commercial,
] as const;

type FooterLinkProps = {
  readonly href: string;
  readonly label: string;
  readonly className?: string;
};

function isExternalFooterHref(href: string): boolean {
  return href.startsWith('https://') || href.startsWith('http://');
}

function FooterLink({ href, label, className = 'marketing-footer__link' }: FooterLinkProps) {
  if (href.startsWith('/')) {
    return (
      <Link className={className} href={href}>
        {label}
      </Link>
    );
  }

  const external = isExternalFooterHref(href);

  return (
    <a
      className={className}
      href={href}
      rel={external ? 'noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      {label}
    </a>
  );
}

export function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <h2 className="sr-only">Afenda footer - product, legal, trust, and commercial links</h2>
      <div className="marketing-footer__inner">
        <section className="marketing-footer__brand" aria-label="Afenda company declaration">
          <AppLogo href="/" placement="footer" surface="dark" size="xl" allowTenantLogo={false} />

          <div className="marketing-footer__positioning">
            <p className="marketing-footer__tagline">Business truth infrastructure</p>
            <p className="marketing-footer__summary">
              Canonical records, policy-bound execution, and audit-ready evidence for enterprise operations.
            </p>
          </div>

          <ul className="marketing-footer__badges" aria-label="Disclosure posture">
            <li className="marketing-footer__badge">ASEAN disclosure map</li>
            <li className="marketing-footer__badge">Counsel review where marked</li>
          </ul>
        </section>

        <nav className="marketing-footer__nav" aria-label="Footer navigation">
          {FOOTER_COLUMNS.map((column) => (
            <section key={column.title} className="marketing-footer__group">
              <h3>{column.title}</h3>
              <ul>
                {column.links.map(({ label, href }) => (
                  <li key={`${column.title}-${label}-${href}`}>
                    <FooterLink href={href} label={label} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>

        <section className="marketing-footer__statutory" aria-labelledby="marketing-footer-statutory-heading">
          <h3 id="marketing-footer-statutory-heading" className="sr-only">
            Statutory disclosures and legal particulars
          </h3>
          <p className="marketing-footer__statutory-label">Legal operating posture</p>
          <nav className="marketing-footer__primary-legal-links" aria-label="Primary legal links">
            {footerLegalDisclosure.primaryLinks.map(({ label, href }) => (
              <FooterLink key={href} href={href} label={label} />
            ))}
          </nav>

          <ul className="marketing-footer__compliance-laws" aria-label="Applicable laws and disclosure references">
            {footerLegalDisclosure.laws.map((law) => (
              <li key={law}>
                <span>{law}</span>
                <span className="marketing-footer__placeholder-badge">Coming soon</span>
              </li>
            ))}
          </ul>

          <p className="marketing-footer__note marketing-footer__copyright">{footerLegalDisclosure.copyrightNotice}</p>
        </section>
      </div>
    </footer>
  );
}
