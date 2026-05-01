/** Three editorial states drawn as real SVG dot patterns: scattered → wired → governed. */

type Props = {
  title: string;
  caption: string;
  mode: 0 | 1 | 2;
};

const COLS = 7;
const ROWS = 9;

function dotsScattered() {
  const out: { x: number; y: number; o: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const jitterX = ((c * 7 + r * 13) % 5) - 2;
      const jitterY = ((c * 11 + r * 5) % 5) - 2;
      const o = 0.25 + (((c + r) * 17) % 60) / 100;
      out.push({ x: c * 22 + 16 + jitterX * 1.2, y: r * 22 + 14 + jitterY * 1.4, o });
    }
  }
  return out;
}

function dotsWired() {
  const out: { x: number; y: number; o: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      out.push({ x: c * 22 + 16, y: r * 22 + 14, o: 0.45 });
    }
  }
  return out;
}

function dotsGoverned() {
  const out: { x: number; y: number; o: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      out.push({ x: c * 22 + 16, y: r * 22 + 14, o: 0.85 });
    }
  }
  return out;
}

export function ThesisDotPanel({ title, caption, mode }: Props) {
  const dots = mode === 0 ? dotsScattered() : mode === 1 ? dotsWired() : dotsGoverned();
  const accent = mode === 0 ? 'rgba(232,236,250,.35)' : mode === 1 ? 'var(--marketing-cyan)' : 'var(--marketing-green)';

  // Wires for mode 1: connect a few near-neighbours
  const wires =
    mode === 1
      ? [
          [0, 0, 1, 0],
          [1, 0, 1, 1],
          [1, 1, 2, 1],
          [2, 1, 3, 1],
          [3, 1, 3, 2],
          [3, 2, 4, 2],
          [4, 2, 5, 2],
          [5, 2, 5, 3],
          [5, 3, 6, 3],
          [2, 4, 3, 4],
          [3, 4, 3, 5],
          [3, 5, 4, 5],
          [4, 5, 4, 6],
          [4, 6, 5, 6],
        ]
      : [];

  return (
    <figure className="marketing-panel" style={{ padding: 0 }}>
      <div style={{ padding: '0.9rem 1rem 0.6rem' }}>
        <p className="marketing-mono-strong" style={{ color: accent }}>
          {String(mode + 1).padStart(2, '0')} {title}
        </p>
      </div>
      <svg viewBox="0 0 180 220" className="marketing-diagram" role="img" aria-label={`${title} pattern`}>
        <defs>
          <linearGradient id={`tdpGrad${mode}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={mode === 2 ? 'rgba(99,230,168,.10)' : 'transparent'} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="180" height="220" fill={`url(#tdpGrad${mode})`} />
        {/* outline frame for the governed grid */}
        {mode === 2 && (
          <rect
            x="8"
            y="6"
            width="164"
            height="208"
            stroke="rgba(99,230,168,.45)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2 3"
          />
        )}
        {wires.map(([c1, r1, c2, r2], i) => (
          <line
            key={i}
            x1={c1 * 22 + 16}
            y1={r1 * 22 + 14}
            x2={c2 * 22 + 16}
            y2={r2 * 22 + 14}
            stroke="rgba(127,217,255,.35)"
            strokeWidth="1"
          />
        ))}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={mode === 2 ? 1.6 : 1.4} fill={accent} opacity={d.o} />
        ))}
      </svg>
      <figcaption className="marketing-mono" style={{ padding: '0.6rem 1rem 1rem', color: 'var(--marketing-muted)' }}>
        {caption}
      </figcaption>
    </figure>
  );
}
