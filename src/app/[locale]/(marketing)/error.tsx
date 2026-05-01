'use client';

import { useEffect } from 'react';

/**
 * Marketing route error boundary — required to be a Client Component.
 * Catches rendering errors in the marketing page and provides a recovery path.
 */
export default function MarketingError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[marketing] render error:', error.digest ?? error.message);
    }
  }, [error]);

  return (
    <div
      style={{
        minHeight: '80dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '4rem',
        textAlign: 'center',
        color: 'rgba(232, 236, 250, 0.72)',
        fontFamily: 'var(--marketing-mono, monospace)',
      }}
    >
      <p
        style={{
          fontSize: '0.625rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255, 111, 111, 0.7)',
        }}
      >
        Surface error {error.digest ? `· ${error.digest}` : ''}
      </p>
      <h1
        style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
          fontWeight: 700,
          color: 'rgba(245, 246, 251, 0.92)',
          fontFamily: 'var(--font-sans, sans-serif)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}
      >
        Something went wrong.
      </h1>
      <p
        style={{
          maxWidth: '34ch',
          fontSize: '0.9rem',
          lineHeight: 1.7,
          color: 'rgba(232, 236, 250, 0.5)',
          fontFamily: 'var(--font-sans, sans-serif)',
        }}
      >
        The page encountered an unexpected error. Try reloading — the issue is likely transient.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          border: '1px solid rgba(99, 230, 168, 0.35)',
          borderRadius: '999px',
          background: 'transparent',
          padding: '0.625rem 1.25rem',
          color: 'rgba(99, 230, 168, 0.82)',
          cursor: 'pointer',
          fontSize: '0.68rem',
          fontFamily: 'var(--marketing-mono, monospace)',
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          transition: 'border-color 150ms ease, color 150ms ease',
        }}
      >
        Retry
      </button>
    </div>
  );
}
