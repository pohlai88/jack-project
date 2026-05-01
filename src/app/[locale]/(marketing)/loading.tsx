/**
 * Marketing route loading state — shown by Next.js App Router while the
 * page segment is streaming. Keeps the hero area from collapsing to zero
 * height and prevents layout shift on slower connections.
 *
 * Because the marketing hero is server-rendered and typically fast,
 * this skeleton is only visible on slow networks or during RSC refetch.
 */
export default function MarketingLoading() {
  return (
    <div className="marketing-root" aria-hidden="true">
      {/* Nav placeholder */}
      <div className="marketing-nav" style={{ minHeight: 'var(--landing-nav-content-height, 3.5rem)' }} />

      {/* Hero skeleton */}
      <div
        style={{
          minHeight: '80dvh',
          padding: 'clamp(4rem, 8vw, 7rem) clamp(4.75rem, 7.5vw, 8.75rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          maxWidth: '48rem',
        }}
      >
        {/* Kicker */}
        <div
          style={{
            height: '0.75rem',
            width: '12rem',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.07)',
            animation: 'marketing-skeleton-pulse 1.8s ease-in-out infinite',
          }}
        />
        {/* Title line 1 */}
        <div
          style={{
            height: '2.5rem',
            width: '80%',
            borderRadius: '0.5rem',
            background: 'rgba(255,255,255,0.07)',
            animation: 'marketing-skeleton-pulse 1.8s ease-in-out 0.1s infinite',
          }}
        />
        {/* Title line 2 */}
        <div
          style={{
            height: '2.5rem',
            width: '60%',
            borderRadius: '0.5rem',
            background: 'rgba(255,255,255,0.07)',
            animation: 'marketing-skeleton-pulse 1.8s ease-in-out 0.2s infinite',
          }}
        />
        {/* Lead */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          {[80, 90, 70].map((w, i) => (
            <div
              key={i}
              style={{
                height: '1rem',
                width: `${w}%`,
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.05)',
                animation: `marketing-skeleton-pulse 1.8s ease-in-out ${0.3 + i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
        {/* Proofline */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            marginTop: '0.5rem',
            border: '1px solid rgba(255,255,255,0.07)',
            width: 'fit-content',
          }}
        >
          {['Authority', 'Evidence', 'Decision'].map((_, i) => (
            <div
              key={i}
              style={{
                width: '6rem',
                height: '2.25rem',
                background: 'rgba(255,255,255,0.04)',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                animation: `marketing-skeleton-pulse 1.8s ease-in-out ${0.6 + i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marketing-skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
