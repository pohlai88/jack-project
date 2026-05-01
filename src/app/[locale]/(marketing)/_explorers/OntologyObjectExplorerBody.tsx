'use client';

import { useState } from 'react';

import { ontology } from '../_content/sections';
import { OntologyGraph } from '../_sections/OntologyGraph';

type OntologyObjectRow = (typeof ontology.objects)[number];

export function OntologyObjectExplorerBody() {
  const [obj, setObj] = useState<OntologyObjectRow>(ontology.objects[5]);

  return (
    <div className="grid gap-4 bg-[#0b0d13] p-6 text-white">
      <OntologyGraph />

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Object</p>
          <ul className="mt-2 space-y-1">
            {ontology.objects.map((o) => (
              <li key={o.name}>
                <button
                  type="button"
                  className={`w-full rounded border px-2 py-1 text-left font-mono text-[10px] uppercase ${
                    obj.name === o.name
                      ? 'border-emerald-400/50 bg-emerald-500/10'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                  onClick={() => setObj(o)}
                >
                  {o.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 rounded border border-white/10 p-4">
          <h3 className="text-lg font-semibold">{obj.name}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ['Properties', obj.properties],
                ['Functions', obj.functions],
                ['Actions', obj.actions],
                ['Automations', obj.automations],
              ] as const
            ).map(([band, items]) => (
              <div key={band} className="rounded border border-white/10 p-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-emerald-300/90">{band}</p>
                <ul className="mt-2 space-y-1 font-mono text-[11px] text-white/75">
                  {items.map((it) => (
                    <li key={it}>· {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="h-32 rounded border border-dashed border-cyan-400/30 bg-linear-to-r from-cyan-500/5 to-transparent p-3 font-mono text-[10px] text-white/55">
            Animated wiring preview: writes (SAP / Workday) {'->'} {obj.name} {'->'} reads (agents / audit). Full motion
            when reduced-motion is off.
          </div>
        </div>
      </div>
    </div>
  );
}
