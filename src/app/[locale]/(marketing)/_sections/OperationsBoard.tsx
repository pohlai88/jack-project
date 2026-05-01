'use client';

import { useState } from 'react';

type RuntimeChain = 'who' | 'what' | 'when' | 'where' | 'why' | 'which' | 'how' | 'core' | 'record';

type RuntimeNode = {
  id: RuntimeChain;
  label: string;
  value: string;
  detail?: string;
  className: string;
  chains: readonly RuntimeChain[];
};

const RUNTIME_NODES: readonly RuntimeNode[] = [
  { id: 'who', label: 'Who', value: 'Actor bound', className: 'is-who', chains: ['who'] },
  { id: 'what', label: 'What', value: 'Variance event', className: 'is-what', chains: ['what'] },
  { id: 'when', label: 'When', value: '09:42 UTC', className: 'is-when', chains: ['when'] },
  { id: 'where', label: 'Where', value: 'Site HCM-02', className: 'is-where', chains: ['where'] },
  {
    id: 'core',
    label: 'Resolution core',
    value: 'Policy + evidence',
    detail: '7W1H sealed route',
    className: 'is-core',
    chains: ['who', 'what', 'when', 'where', 'why', 'which', 'how', 'core'],
  },
  { id: 'why', label: 'Why', value: 'Policy path', className: 'is-why', chains: ['why'] },
  { id: 'which', label: 'Which', value: 'SKU-4419', className: 'is-which', chains: ['which'] },
  {
    id: 'record',
    label: 'Canonical record',
    value: 'CR-7831',
    detail: 'Resolved state',
    className: 'is-record',
    chains: ['record'],
  },
  { id: 'how', label: 'How', value: 'Approved flow', className: 'is-how', chains: ['how'] },
] as const;

const RUNTIME_PATHS = [
  { id: 'who', d: 'M 180 120 L 320 200 L 520 320' },
  { id: 'what', d: 'M 600 120 L 600 220 L 600 320' },
  { id: 'when', d: 'M 1020 120 L 880 200 L 680 320' },
  { id: 'where', d: 'M 180 360 L 380 340 L 520 360' },
  { id: 'why', d: 'M 1020 360 L 820 340 L 680 360' },
  { id: 'which', d: 'M 180 600 L 340 520 L 520 440' },
  { id: 'how', d: 'M 1020 600 L 860 520 L 680 440' },
  { id: 'record', d: 'M 600 400 L 600 520 L 600 620' },
] as const satisfies readonly { id: RuntimeChain; d: string }[];

function getActiveChains(active: RuntimeChain | 'all') {
  if (active === 'all') {
    return new Set<RuntimeChain>(RUNTIME_PATHS.map((path) => path.id));
  }

  if (active === 'core') {
    return new Set<RuntimeChain>(['who', 'what', 'when', 'where', 'why', 'which', 'how', 'record']);
  }

  return new Set<RuntimeChain>([active, 'record']);
}

export function OperationsBoard() {
  const [hovered, setHovered] = useState<RuntimeChain | null>(null);
  const [pinned, setPinned] = useState<RuntimeChain | null>(null);
  const active = pinned ?? hovered ?? 'all';
  const activeChains = getActiveChains(active);

  return (
    <div className="operations-runtime" data-pinned={pinned ? 'true' : 'false'}>
      <div className="operations-runtime__caption">
        <span className="marketing-mono-strong">Runtime trace · 7W1H bound</span>
        <span className="marketing-mono">Hover to inspect · click to pin</span>
      </div>

      <div className="operations-runtime__stage">
        <svg
          className="operations-runtime__circuit"
          viewBox="0 0 1200 720"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {RUNTIME_PATHS.map((path) => (
            <path
              key={path.id}
              className={`operations-runtime__path${activeChains.has(path.id) ? ' is-active' : ''}`}
              data-chain={path.id}
              d={path.d}
            />
          ))}
        </svg>

        <div className="operations-runtime__board" aria-label="Signal resolution board">
          {RUNTIME_NODES.map((node) => {
            const nodeActive = node.chains.some((chain) => activeChains.has(chain)) || active === 'all';
            const pressed = pinned === node.id;

            return (
              <button
                key={node.id}
                type="button"
                className={`operations-runtime__node ${node.className}${nodeActive ? ' is-active' : ' is-dim'}`}
                aria-pressed={pressed}
                onClick={() => setPinned(pressed ? null : node.id)}
                onFocus={() => setHovered(node.id)}
                onBlur={() => setHovered(null)}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span>{node.label}</span>
                <strong>{node.value}</strong>
                {node.detail ? <em>{node.detail}</em> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="operations-runtime__status" aria-label="Resolved runtime status">
        <span>
          Authority
          <strong>Bound</strong>
        </span>
        <span>
          Policy
          <strong>Accepted</strong>
        </span>
        <span>
          Evidence
          <strong>Sealed</strong>
        </span>
        <span>
          Record
          <strong>Committed</strong>
        </span>
      </div>
    </div>
  );
}
