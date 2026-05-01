/** Flat 4-deck editorial diagram with central node and labelled tiles. */

import { architecture } from '../_content/sections';

const DECK_TILES: Record<(typeof architecture.decks)[number], readonly string[]> = {
  'Ontology language & toolchain': ['Object model', 'Function lib', 'Action sets', 'Pipelines'],
  'Ontology engine': ['Resolver', 'Policy planner', 'Evidence binder', 'Replay'],
  'Security & governance': ['Identity', 'Purpose envelope', 'Lineage', 'Retention'],
  'Data, logic & action services': ['Stream ingest', 'Logic kernel', 'Action exec', 'Connectors'],
};

export function ArchitectureDeck() {
  const w = 1240;
  const deckH = 88;
  const gap = 14;
  const totalH = deckH * 4 + gap * 3 + 80;

  return (
    <div className="marketing-stage">
      <div className="marketing-stage__caption">
        <span className="marketing-mono-strong">Four decks · governed architecture</span>
        <span className="marketing-mono">No glow without flow · No tile without label</span>
      </div>

      <svg viewBox={`0 0 ${w} ${totalH}`} className="marketing-diagram" role="img" aria-label="Architecture decks">
        <defs>
          <linearGradient id="archEdge" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(99,230,168,0)" />
            <stop offset="50%" stopColor="rgba(99,230,168,.45)" />
            <stop offset="100%" stopColor="rgba(99,230,168,0)" />
          </linearGradient>
        </defs>

        {/* Central node and primary halo */}
        <g>
          <line x1={w / 2} x2={w / 2} y1="20" y2={totalH - 20} stroke="rgba(99,230,168,.18)" strokeDasharray="2 4" />
          <circle cx={w / 2} cy={totalH / 2} r="22" fill="rgba(99,230,168,.04)" stroke="rgba(99,230,168,.45)" />
          <circle cx={w / 2} cy={totalH / 2} r="6" fill="var(--marketing-green)" />
          <text x={w / 2} y={totalH / 2 - 32} textAnchor="middle" className="mono-text ink-fill">
            Object graph node
          </text>
        </g>

        {architecture.decks.map((deck, i) => {
          const y = 30 + i * (deckH + gap);
          const tiles = DECK_TILES[deck];
          return (
            <g key={deck}>
              {/* deck label */}
              <text x="20" y={y + 22} className="mono-text dim-fill">
                Deck {String(i + 1).padStart(2, '0')}
              </text>
              <text x="20" y={y + 42} className="mono-text ink-fill">
                {deck}
              </text>

              {/* deck frame */}
              <rect
                x="220"
                y={y}
                width={w - 240}
                height={deckH}
                fill="rgba(255,255,255,.018)"
                stroke="var(--marketing-line-2)"
              />
              <line x1="220" x2={w - 20} y1={y + 14} y2={y + 14} stroke="url(#archEdge)" />

              {/* tiles */}
              {tiles.map((t, j) => {
                const tileW = (w - 280) / tiles.length - 14;
                const x = 240 + j * (tileW + 14);
                return (
                  <g key={t}>
                    <rect
                      x={x}
                      y={y + 28}
                      width={tileW}
                      height={deckH - 44}
                      fill="rgba(255,255,255,.025)"
                      stroke="var(--marketing-line)"
                    />
                    <text x={x + 14} y={y + 50} className="mono-text ink-fill">
                      {t}
                    </text>
                    <text x={x + 14} y={y + 68} className="mono-text dim-fill">
                      ARTEFACT
                    </text>
                  </g>
                );
              })}

              {/* connector to centre */}
              <line x1={w / 2} x2={w / 2} y1={y} y2={y + deckH} stroke="rgba(99,230,168,.18)" strokeWidth="1" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
