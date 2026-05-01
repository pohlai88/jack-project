'use client';

const graphEdges = [
  { tone: 'cold', d: 'M110 116 C 210 105 264 110 344 170' },
  { tone: 'warn', d: 'M344 170 C 432 112 488 88 554 96' },
  { tone: 'hot', d: 'M554 96 C 612 142 630 188 586 240' },
  { tone: 'hot', d: 'M586 240 C 520 298 460 318 382 322' },
  { tone: 'red', d: 'M382 322 C 290 330 210 322 70 314' },
  { tone: 'hot', d: 'M70 314 C 160 410 230 458 346 500' },
  { tone: 'cold', d: 'M346 500 C 438 570 520 550 628 500' },
  { tone: 'hot', d: 'M628 500 C 584 418 502 364 382 322' },
  { tone: 'cold', d: 'M150 494 C 240 452 312 390 382 322' },
  { tone: 'hot', d: 'M382 322 C 392 238 374 210 344 170' },
] as const;

const ontologyNodes = [
  { id: 'supplier', label: 'Supplier', tone: 'cold' },
  { id: 'contract', label: 'Contract', tone: 'warn' },
  { id: 'invoice', label: 'Invoice', tone: 'cold' },
  { id: 'payment', label: 'Payment', tone: 'neutral' },
  { id: 'shipment', label: 'Shipment', tone: 'cold' },
  { id: 'item', label: 'Item', tone: 'cold' },
  { id: 'tenant', label: 'Tenant', tone: 'neutral' },
  { id: 'policy', label: 'Policy', tone: 'red' },
] as const;

const bindingLines = [
  'M 76 115 C 200 200 290 260 380 318',
  'M 258 70 C 300 180 340 260 380 318',
  'M 562 90 C 500 180 442 260 388 318',
  'M 700 230 C 620 270 510 300 392 320',
  'M 638 500 C 540 440 460 380 392 326',
  'M 440 564 C 420 480 400 400 388 328',
  'M 138 486 C 210 420 290 360 380 326',
  'M 46 320 C 150 320 260 320 376 320',
] as const;

const provenance = [
  { label: 'Authority', value: 'Ops Lead · u_412' },
  { label: 'Policy', value: 'Q4-PERF-2026' },
  { label: 'State', value: 'Committed · t+47ms' },
] as const;

const signatures = ['identity', 'policy', 'evidence', 'audit'] as const;

export function MarketingIntroDiagram() {
  return (
    <div
      className="marketing-pre-landing__diagram marketing-intro--animate"
      aria-label="Operational truth graph resolving into canonical record"
    >
      <div className="marketing-intro__stage" aria-hidden="true">
        <svg className="marketing-intro__graph" viewBox="0 0 760 640" preserveAspectRatio="none" aria-hidden="true">
          {graphEdges.map((edge) => (
            <path key={edge.d} className={`marketing-intro__edge marketing-intro__edge--${edge.tone}`} d={edge.d} />
          ))}
        </svg>

        {ontologyNodes.map((node) => (
          <div
            key={node.id}
            className={`marketing-intro__node marketing-intro__node--${node.id} marketing-intro__node--${node.tone}`}
          >
            <span className="marketing-intro__node-dot" aria-hidden />
            <span className="marketing-intro__node-label">{node.label}</span>
          </div>
        ))}

        <svg className="marketing-intro__binding" viewBox="0 0 760 640" preserveAspectRatio="none" aria-hidden="true">
          {bindingLines.map((d) => (
            <path key={d} d={d} />
          ))}
        </svg>

        <div className="marketing-intro__truth-object" aria-label="Canonical record CR-7831 resolved at execution">
          <div className="marketing-intro__truth-card">
            <div className="marketing-intro__face marketing-intro__face--top">
              <div className="marketing-intro__commit-ring" aria-hidden="true" />
              <div className="marketing-intro__aftershock" aria-hidden="true" />
              <div className="marketing-intro__record">
                <div>
                  <div className="marketing-intro__record-id">CR-7831 / TENANT-AF</div>
                  <div className="marketing-intro__verdict">RESOLVED</div>
                  <div className="marketing-intro__subverdict">
                    <span className="marketing-intro__hash">0xaf3e…c14d</span>
                    <span className="marketing-intro__dotsep" aria-hidden="true" />
                    <span>decision path intact</span>
                  </div>
                </div>
              </div>
              <div className="marketing-intro__provenance" aria-hidden="true">
                {provenance.map((item) => (
                  <div key={item.label}>
                    {item.label}
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="marketing-intro__face marketing-intro__face--front">
              {signatures.map((signature) => (
                <span key={signature} className="marketing-intro__signature">
                  {signature}
                </span>
              ))}
            </div>
            <div className="marketing-intro__face marketing-intro__face--left">Lineage intact</div>
          </div>
        </div>
      </div>
    </div>
  );
}
