import { Link } from '@/i18n/navigation';

import { MarketingLiveDemoDialog } from './MarketingLiveDemoDialog';

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
