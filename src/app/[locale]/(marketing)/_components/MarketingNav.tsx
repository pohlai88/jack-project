import { AppLogo } from '@/shared/components/brand/Logo';

import { MarketingNavActions } from './MarketingNavActions';
import { MarketingScanlineLedger } from './MarketingScanlineLedger';

const sectionLinks = [
  { href: '#thesis', label: 'Thesis' },
  { href: '#ontology', label: 'Ontology' },
  { href: '#operations', label: 'Operations' },
  { href: '#evidence', label: 'Evidence' },
  { href: '#verdict', label: 'Verdict' },
] as const;

export function MarketingNav() {
  return (
    <header className="marketing-nav">
      <div className="marketing-nav__inner">
        <AppLogo href="/" placement="nav" size="xl" allowTenantLogo={false} className="marketing-nav__brand" />

        <nav className="marketing-nav__links" aria-label="Afenda marketing sections">
          {sectionLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <MarketingNavActions />
      </div>

      <MarketingScanlineLedger />
    </header>
  );
}
