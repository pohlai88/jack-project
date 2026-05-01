/** Flat operations board — three lanes of labelled tiles connected with truth-flow lines. */

import { operations } from '../_content/sections';

type Props = { tab: (typeof operations.tabs)[number] };

const TAB_HIGHLIGHTS: Record<(typeof operations.tabs)[number], readonly string[]> = {
  Procurement: ['Suppliers', 'Purchase orders', 'Inventory'],
  Operations: ['BOM', 'Inventory', 'Work orders', 'Quality'],
  Logistics: ['Delivery', 'Sales orders', 'Inventory'],
  Finance: ['Sales orders', 'Purchase orders', 'Quality'],
};

export function OperationsBoard({ tab }: Props) {
  const highlight = new Set<string>(TAB_HIGHLIGHTS[tab]);
  const inputs = operations.inputs;
  const modules = operations.modules;
  const outputs = operations.outputs;

  const w = 1240;
  const h = 460;

  // Lane Xs
  const inputX = 80;
  const moduleX = 470;
  const outputX = 1080;

  const inputBoxW = 200;
  const moduleBoxW = 280;
  const outputBoxW = 220;
  const boxH = 40;

  const inputYs = inputs.map((_, i) => 60 + i * ((h - 120) / Math.max(1, inputs.length - 1)));
  const moduleYs = modules.map((_, i) => 40 + i * ((h - 80) / Math.max(1, modules.length - 1)));
  const outputYs = outputs.map((_, i) => 100 + i * ((h - 200) / Math.max(1, outputs.length - 1)));

  return (
    <div className="marketing-stage" style={{ minHeight: 480 }}>
      <div className="marketing-stage__caption">
        <span className="marketing-mono-strong">{tab} lane · highlighted modules</span>
        <span className="marketing-mono">Static board — full motion in the explorer</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="marketing-diagram" role="img" aria-label={`${tab} flat board`}>
        <defs>
          <linearGradient id="opLane" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(99,230,168,.0)" />
            <stop offset="50%" stopColor="rgba(99,230,168,.45)" />
            <stop offset="100%" stopColor="rgba(127,217,255,.0)" />
          </linearGradient>
        </defs>

        {/* Lane labels */}
        <text x={inputX} y="30" className="mono-text dim-fill">
          Inputs
        </text>
        <text x={moduleX} y="30" className="mono-text dim-fill">
          Modules · {tab}
        </text>
        <text x={outputX} y="30" className="mono-text dim-fill">
          Outputs
        </text>

        {/* Wires from inputs to active modules */}
        {inputs.map((inp, i) =>
          modules
            .map((m, j) => ({ m, j }))
            .filter(({ m }) => highlight.has(m))
            .map(({ j }) => (
              <path
                key={`${inp}-${j}`}
                d={`M ${inputX + inputBoxW} ${inputYs[i] + boxH / 2} C ${inputX + inputBoxW + 90} ${inputYs[i] + boxH / 2}, ${moduleX - 90} ${moduleYs[j] + boxH / 2}, ${moduleX} ${moduleYs[j] + boxH / 2}`}
                stroke="rgba(99,230,168,.32)"
                strokeWidth="0.9"
                fill="none"
              />
            )),
        )}

        {/* Wires from active modules to all outputs */}
        {modules
          .map((m, j) => ({ m, j }))
          .filter(({ m }) => highlight.has(m))
          .flatMap(({ j }) =>
            outputs.map((_o, k) => (
              <path
                key={`m${j}-o${k}`}
                d={`M ${moduleX + moduleBoxW} ${moduleYs[j] + boxH / 2} C ${moduleX + moduleBoxW + 110} ${moduleYs[j] + boxH / 2}, ${outputX - 110} ${outputYs[k] + boxH / 2}, ${outputX} ${outputYs[k] + boxH / 2}`}
                stroke="rgba(127,217,255,.36)"
                strokeWidth="0.9"
                fill="none"
              />
            )),
          )}

        {/* Input boxes */}
        {inputs.map((inp, i) => (
          <g key={inp}>
            <rect
              x={inputX}
              y={inputYs[i]}
              width={inputBoxW}
              height={boxH}
              fill="rgba(255,255,255,0.025)"
              stroke="var(--marketing-line-2)"
            />
            <text x={inputX + 14} y={inputYs[i] + 25} className="mono-text ink-fill">
              {inp}
            </text>
          </g>
        ))}

        {/* Module boxes */}
        {modules.map((m, j) => {
          const active = highlight.has(m);
          return (
            <g key={m}>
              <rect
                x={moduleX}
                y={moduleYs[j]}
                width={moduleBoxW}
                height={boxH}
                fill={active ? 'rgba(99,230,168,.10)' : 'rgba(255,255,255,0.02)'}
                stroke={active ? 'rgba(99,230,168,.55)' : 'var(--marketing-line-2)'}
              />
              <text
                x={moduleX + 14}
                y={moduleYs[j] + 25}
                className="mono-text"
                fill={active ? 'var(--marketing-green)' : 'var(--marketing-dim)'}
              >
                {m}
              </text>
            </g>
          );
        })}

        {/* Output boxes */}
        {outputs.map((o, k) => (
          <g key={o}>
            <rect
              x={outputX}
              y={outputYs[k]}
              width={outputBoxW}
              height={boxH}
              fill="rgba(127,217,255,0.06)"
              stroke="rgba(127,217,255,.35)"
            />
            <text x={outputX + 14} y={outputYs[k] + 25} className="mono-text" fill="var(--marketing-cyan)">
              {o}
            </text>
          </g>
        ))}

        {/* Lane spine */}
        <line x1={inputX} x2={outputX + outputBoxW} y1={h - 20} y2={h - 20} stroke="url(#opLane)" />
      </svg>
    </div>
  );
}
