import { MarketingSection } from '../_components/landing-primitives';
import { verdict } from '../_content/sections';

export function VerdictSection() {
  return (
    <MarketingSection id="verdict" aria-labelledby="verdict-title">
      <div
        style={{
          textAlign: 'center',
          maxWidth: '64rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <p className="marketing-eyebrow" style={{ justifyContent: 'center' }}>
          {verdict.kicker} · Verdict
        </p>

        <h2 id="verdict-title" className="marketing-verdict">
          {verdict.line}
        </h2>

        <div className="marketing-strip" aria-label="Verdict strip">
          {verdict.strip.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '0.5rem',
          }}
        >
          <a className="marketing-btn marketing-btn--primary" href={verdict.ctaPrimary.href}>
            {verdict.ctaPrimary.label}
          </a>
          <a className="marketing-btn" href={verdict.ctaSecondary.href}>
            {verdict.ctaSecondary.label}
          </a>
        </div>

        <p className="marketing-mono" style={{ color: 'var(--marketing-faint)', marginTop: '1rem' }}>
          {verdict.note}
        </p>
      </div>
    </MarketingSection>
  );
}
