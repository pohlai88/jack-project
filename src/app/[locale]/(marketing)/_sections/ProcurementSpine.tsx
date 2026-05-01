/** Procurement spine — flat axonometric line drawing of the lifecycle. */

const STAGES = ['Need', 'Source', 'Award', 'Order', 'Match', 'Pay'];

export function ProcurementSpine() {
  const w = 720;
  const h = 220;
  const padX = 50;
  const stepX = (w - padX * 2) / (STAGES.length - 1);

  return (
    <div className="marketing-stage" style={{ minHeight: 220 }}>
      <div className="marketing-stage__caption">
        <span className="marketing-mono-strong">Spine · canonical lifecycle</span>
        <span className="marketing-mono">No screen — a record progression</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="marketing-diagram" role="img" aria-label="Procurement spine">
        <defs>
          <linearGradient id="psSpine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(99,230,168,.0)" />
            <stop offset="20%" stopColor="rgba(99,230,168,.55)" />
            <stop offset="80%" stopColor="rgba(127,217,255,.55)" />
            <stop offset="100%" stopColor="rgba(127,217,255,0)" />
          </linearGradient>
        </defs>

        {/* Background grid */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1="0" x2={w} y1={20 + i * 32} y2={20 + i * 32} stroke="rgba(255,255,255,0.04)" />
        ))}

        {/* Spine line */}
        <line x1={padX} x2={w - padX} y1={h / 2} y2={h / 2} stroke="url(#psSpine)" strokeWidth="2" />

        {/* Stage nodes */}
        {STAGES.map((s, i) => {
          const cx = padX + stepX * i;
          return (
            <g key={s}>
              <line x1={cx} x2={cx} y1={h / 2 - 32} y2={h / 2 + 32} stroke="rgba(255,255,255,0.12)" />
              <circle
                cx={cx}
                cy={h / 2}
                r="6"
                fill="var(--marketing-bg)"
                stroke="var(--marketing-green)"
                strokeWidth="1.5"
              />
              <circle cx={cx} cy={h / 2} r="2" fill="var(--marketing-green)" />
              <text x={cx} y={h / 2 - 42} textAnchor="middle" className="mono-text ink-fill">
                {String(i + 1).padStart(2, '0')}
              </text>
              <text x={cx} y={h / 2 + 50} textAnchor="middle" className="mono-text dim-fill">
                {s}
              </text>
            </g>
          );
        })}

        {/* Evidence note arcs */}
        <path
          d={`M ${padX + stepX * 3.0} ${h / 2 + 18} q 36 24 80 0`}
          stroke="rgba(127,217,255,.45)"
          fill="none"
          strokeDasharray="3 3"
        />
        <text
          x={padX + stepX * 3.6}
          y={h / 2 + 56}
          textAnchor="middle"
          className="mono-text"
          fill="var(--marketing-cyan)"
        >
          3-way match
        </text>

        <path
          d={`M ${padX + stepX * 0.0} ${h / 2 - 20} q 38 -28 84 0`}
          stroke="rgba(232,193,104,.45)"
          fill="none"
          strokeDasharray="3 3"
        />
        <text
          x={padX + stepX * 0.55}
          y={h / 2 - 32}
          textAnchor="middle"
          className="mono-text"
          fill="var(--marketing-amber)"
        >
          Policy gate
        </text>
      </svg>
    </div>
  );
}
