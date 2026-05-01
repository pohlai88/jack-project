'use client';

import { useEffect, useState } from 'react';

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

// Collapse the logo/links row once the user has scrolled past the nav itself.
// Below the threshold the full nav is restored. Hysteresis (hi > lo) prevents
// jitter when scrolling is near the boundary.
const COLLAPSE_THRESHOLD_PX = 72;
const EXPAND_THRESHOLD_PX = 24;

export function MarketingNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frame = 0;
    const evaluate = () => {
      frame = 0;
      const y = window.scrollY;
      setIsCollapsed((prev) => {
        if (!prev && y > COLLAPSE_THRESHOLD_PX) return true;
        if (prev && y < EXPAND_THRESHOLD_PX) return false;
        return prev;
      });
    };

    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="marketing-nav" data-collapsed={isCollapsed ? 'true' : 'false'}>
      <div className="marketing-nav__inner" aria-hidden={isCollapsed ? 'true' : undefined}>
        <AppLogo href="/" placement="nav" size="xl" allowTenantLogo={false} className="marketing-nav__brand" />

        <nav className="marketing-nav__links" aria-label="Afenda marketing sections">
          {sectionLinks.map((link) => (
            <a key={link.href} href={link.href} tabIndex={isCollapsed ? -1 : 0}>
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
