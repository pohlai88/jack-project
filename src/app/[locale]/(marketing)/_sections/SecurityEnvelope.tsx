/** Concentric purpose envelope — flat editorial security diagram. */

const RINGS = [
  { r: 200, label: 'Tenant scope', tone: 'rgba(127,217,255,.5)' },
  { r: 160, label: 'Identity', tone: 'rgba(155,140,255,.55)' },
  { r: 120, label: 'Purpose', tone: 'rgba(232,193,104,.6)' },
  { r: 80, label: 'Policy decision', tone: 'rgba(255,111,111,.55)' },
  { r: 40, label: 'Record', tone: 'rgba(99,230,168,.7)' },
];

export function SecurityEnvelope() {
  return (
    <div className="marketing-stage" style={{ aspectRatio: '1 / 1' }}>
      <div className="marketing-stage__caption">
        <span className="marketing-mono-strong">Purpose envelope</span>
        <span className="marketing-mono">Five rings · evaluated outside-in</span>
      </div>
      <svg viewBox="0 0 480 480" className="marketing-diagram" role="img" aria-label="Purpose envelope">
        <defs>
          <radialGradient id="secCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(99,230,168,.16)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle cx="240" cy="240" r="220" fill="url(#secCore)" />

        {RINGS.map((r) => (
          <g key={r.label}>
            <circle cx="240" cy="240" r={r.r} stroke={r.tone} fill="none" strokeDasharray="2 5" />
            <text x={240 + r.r - 6} y="244" className="mono-text" textAnchor="end" fill={r.tone}>
              {r.label}
            </text>
          </g>
        ))}

        {/* Radial purpose tickets */}
        {[18, 90, 162, 234, 306].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x = 240 + Math.cos(rad) * 220;
          const y = 240 + Math.sin(rad) * 220;
          return (
            <g key={deg}>
              <line
                x1={240 + Math.cos(rad) * 30}
                y1={240 + Math.sin(rad) * 30}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,.12)"
              />
              <circle cx={x} cy={y} r="3" fill="var(--marketing-cyan)" />
            </g>
          );
        })}

        {/* Centre record */}
        <circle cx="240" cy="240" r="14" fill="var(--marketing-bg)" stroke="var(--marketing-green)" strokeWidth="2" />
        <circle cx="240" cy="240" r="4" fill="var(--marketing-green)" />
      </svg>
    </div>
  );
}
