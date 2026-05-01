/** Audit-pack diagram — quiet, after-the-fact. Hash chip + lineage chain + signature ring. */

const CHAIN = ['INV-2041', 'INV-2042', 'INV-2043', 'INV-2044', 'PMT-9981'];

export function EvidencePack() {
  return (
    <div className="marketing-stage" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="marketing-stage__caption">
        <span className="marketing-mono-strong">Audit pack · INV-2044</span>
        <span className="marketing-mono">After the action · replayable</span>
      </div>

      {/* Hash chip */}
      <div
        style={{
          border: '1px solid var(--marketing-line-2)',
          padding: '1rem 1.1rem',
          background: 'rgba(255,255,255,.02)',
          fontFamily: 'var(--marketing-mono)',
        }}
      >
        <p className="marketing-mono">Canonical hash</p>
        <p
          style={{
            marginTop: 6,
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--marketing-green)',
            letterSpacing: '0.06em',
          }}
        >
          sha256:8b3a4d…7e21fc
        </p>
        <p className="marketing-mono" style={{ marginTop: 6, color: 'var(--marketing-muted)' }}>
          512 B · canonicalised JSON · stable across replays
        </p>
      </div>

      {/* Lineage chain */}
      <svg viewBox="0 0 720 110" className="marketing-diagram" role="img" aria-label="Lineage chain">
        <line x1="40" x2="680" y1="55" y2="55" stroke="var(--marketing-line-2)" />
        {CHAIN.map((id, i) => {
          const cx = 40 + i * ((680 - 40) / (CHAIN.length - 1));
          const focus = i === 3;
          return (
            <g key={id}>
              <circle
                cx={cx}
                cy="55"
                r={focus ? 8 : 5}
                stroke={focus ? 'var(--marketing-green)' : 'var(--marketing-line-2)'}
                strokeWidth="1.4"
                fill="var(--marketing-paper)"
              />
              {focus && <circle cx={cx} cy="55" r="3" fill="var(--marketing-green)" />}
              <text
                x={cx}
                y="32"
                textAnchor="middle"
                className="mono-text"
                fill={focus ? 'var(--marketing-ink)' : 'var(--marketing-dim)'}
              >
                {id}
              </text>
              <text x={cx} y="80" textAnchor="middle" className="mono-text dim-fill">
                {focus ? 'CURRENT' : i < 3 ? 'PRIOR' : 'NEXT'}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Signature ring */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          alignItems: 'center',
          gap: '1rem',
          border: '1px solid var(--marketing-line-2)',
          padding: '0.85rem 1rem',
          background: 'rgba(127,217,255,.04)',
        }}
      >
        <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
          <circle cx="28" cy="28" r="22" stroke="rgba(127,217,255,.55)" fill="none" />
          <circle cx="28" cy="28" r="14" stroke="rgba(127,217,255,.35)" fill="none" strokeDasharray="2 3" />
          <circle cx="28" cy="28" r="4" fill="var(--marketing-cyan)" />
        </svg>
        <div>
          <p className="marketing-mono-strong" style={{ color: 'var(--marketing-cyan)' }}>
            Tenant signature accepted
          </p>
          <p className="marketing-mono" style={{ color: 'var(--marketing-muted)' }}>
            ed25519 · key id 0x7e…a4 · purpose AP.MATCH
          </p>
        </div>
      </div>
    </div>
  );
}
