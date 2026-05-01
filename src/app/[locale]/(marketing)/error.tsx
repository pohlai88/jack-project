'use client';

import Link from 'next/link';
import { useEffect } from 'react';

type MarketingErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MarketingError({ error, reset }: MarketingErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.error('[marketing:error]', {
        digest: error.digest,
        message: error.message,
      });
    }
  }, [error]);

  return (
    <main className="marketing-error" role="alert">
      <p className="marketing-error__eyebrow">Marketing surface interrupted</p>

      <h1 className="marketing-error__title">The operating surface could not be resolved.</h1>

      <p className="marketing-error__copy">
        Afenda stopped this view before presenting an uncertain state. Retry the surface, or return to the canonical
        entry point.
      </p>

      {error.digest ? <p className="marketing-error__reference">Reference · {error.digest}</p> : null}

      <div className="marketing-error__actions">
        <button type="button" onClick={reset} className="marketing-error__primary">
          Retry surface
        </button>

        <Link href="/" className="marketing-error__secondary">
          Return home
        </Link>
      </div>
    </main>
  );
}
