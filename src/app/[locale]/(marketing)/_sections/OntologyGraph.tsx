'use client';

/** Wired 3x3 ontology grid - Audit Event hub, every surrounding cell shows the four doctrine bands. */

import { ontology } from '../_content/sections';

type Cell = (typeof ontology.objects)[number];

const CELLS: readonly Cell[] = [
  ontology.objects[0], // Tenant
  ontology.objects[1], // Customer
  ontology.objects[2], // Supplier
  ontology.objects[3], // Item
  ontology.objects[8], // Audit Event (centre)
  ontology.objects[4], // Contract
  ontology.objects[7], // Shipment
  ontology.objects[6], // Payment
  ontology.objects[5], // Invoice
];

const COLS = 3;
const ROWS = 3;

export function OntologyGraph() {
  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid var(--marketing-line-2)',
        background: 'var(--marketing-paper)',
      }}
    >
      <div
        className="marketing-stage__caption"
        style={{ padding: '0.85rem 1rem 0.5rem', borderBottom: '1px solid var(--marketing-line)' }}
      >
        <span className="marketing-mono-strong">Ontology — bound objects · 4 doctrine bands</span>
        <span className="marketing-mono">Properties · Functions · Actions · Automations</span>
      </div>

      <div style={{ position: 'relative' }}>
        <svg
          aria-hidden
          viewBox="0 0 300 300"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(99,230,168,.22)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect x="100" y="100" width="100" height="100" fill="url(#hubGlow)" />
          {[
            [50, 50],
            [150, 50],
            [250, 50],
            [50, 150],
            [250, 150],
            [50, 250],
            [150, 250],
            [250, 250],
          ].map(([x, y], i) => (
            <line
              key={i}
              x1="150"
              y1="150"
              x2={x}
              y2={y}
              stroke="rgba(99,230,168,.28)"
              strokeWidth="0.7"
              strokeDasharray="2 3"
            />
          ))}
        </svg>

        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, minmax(180px, 1fr))`,
          }}
        >
          {CELLS.map((cell, i) => {
            const isHub = i === 4;
            return (
              <div
                key={cell.name + i}
                style={{
                  position: 'relative',
                  borderRight: (i + 1) % COLS !== 0 ? '1px solid var(--marketing-line)' : 'none',
                  borderBottom: i < CELLS.length - COLS ? '1px solid var(--marketing-line)' : 'none',
                  padding: '0.95rem 1rem',
                  background: isHub ? 'rgba(99,230,168,.04)' : 'transparent',
                }}
              >
                {isHub ? <HubCell cell={cell} /> : <FacetCell cell={cell} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FacetCell({ cell }: { cell: Cell }) {
  return (
    <>
      <p className="marketing-onto__name">{cell.name}</p>
      <div
        style={{
          marginTop: 8,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px 10px',
        }}
      >
        <Band label="Prop." items={cell.properties} tone="rgba(232,236,250,.78)" />
        <Band label="Func." items={cell.functions} tone="var(--marketing-cyan)" />
        <Band label="Act." items={cell.actions} tone="var(--marketing-amber)" />
        <Band label="Auto." items={cell.automations} tone="var(--marketing-green)" />
      </div>
    </>
  );
}

function Band({ label, items, tone }: { label: string; items: readonly string[]; tone: string }) {
  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--marketing-mono)',
          fontSize: 8.5,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: tone,
          marginBottom: 2,
        }}
      >
        {label}
      </p>
      <ul style={{ listStyle: 'none', display: 'grid', gap: 1 }}>
        {items.map((it) => (
          <li
            key={it}
            style={{
              fontFamily: 'var(--marketing-mono)',
              fontSize: 9,
              color: 'var(--marketing-muted)',
              lineHeight: 1.35,
            }}
          >
            · {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HubCell({ cell }: { cell: Cell }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        gap: '8px',
      }}
    >
      <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden>
        <circle cx="23" cy="23" r="18" stroke="rgba(99,230,168,.6)" fill="none" />
        <circle cx="23" cy="23" r="11" stroke="rgba(99,230,168,.45)" fill="none" strokeDasharray="2 2" />
        <circle cx="23" cy="23" r="3" fill="var(--marketing-green)" />
      </svg>
      <p className="marketing-mono-strong" style={{ color: 'var(--marketing-green)' }}>
        {cell.name}
      </p>
      <p
        className="marketing-mono"
        style={{ fontSize: 9, color: 'var(--marketing-muted)', maxWidth: '14ch', lineHeight: 1.4 }}
      >
        Hub · all writes pin lineage here
      </p>
    </div>
  );
}
