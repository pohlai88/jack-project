import { AppLogo } from '@/shared/components/brand/Logo';

import { footer } from '../_content/sections';

export function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <div className="marketing-footer__inner">
        <div className="marketing-footer__brand">
          <AppLogo href="/" placement="footer" size="xl" allowTenantLogo={false} />
          <p className="marketing-footer__tagline">Business Machine</p>
          <p className="marketing-mono marketing-footer__note">{footer.note}</p>
        </div>
        <ul className="marketing-footer__links">
          {footer.links.map((link) => (
            <li key={link.href}>
              <a className="marketing-link" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
