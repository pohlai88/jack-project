import dynamic from 'next/dynamic';

import { Link } from '@/i18n/navigation';

// Code-split the dialog bundle — trigger button is still SSR'd; ssr: true (default)
const MarketingLiveDemoDialog = dynamic(() =>
  import('./MarketingLiveDemoDialog').then((m) => ({ default: m.MarketingLiveDemoDialog })),
);

export function MarketingNavActions() {
  return (
    <div className="marketing-nav__actions">
      <Link href="/login" className="marketing-nav__link">
        Log in
      </Link>
      <Link href="/login" className="marketing-nav__cta">
        Sign-up
      </Link>
      <MarketingLiveDemoDialog />
    </div>
  );
}
