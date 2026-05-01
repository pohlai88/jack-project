'use client';

import Image from 'next/image';

import { labPalantir } from '../_content/assets';
import { procurement } from '../_content/sections';

export function ProcurementExplorerBody() {
  return (
    <div className="grid gap-4 bg-[#0b0d13] p-6 text-white lg:grid-cols-2">
      <div className="relative min-h-[280px]">
        <Image src={labPalantir.procurement} alt="" fill className="object-contain opacity-60" sizes="600px" />
      </div>
      <div className="space-y-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Capability depth</p>
        {procurement.columns.map((c) => (
          <div key={c.name} className="rounded border border-white/10 p-3">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-emerald-200/90">{c.name}</p>
            <ul className="mt-2 space-y-1 font-mono text-[10px] text-white/65">
              {c.bullets.map((b) => (
                <li key={b}>— {b}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="rounded border border-amber-400/30 bg-amber-500/5 p-3 font-mono text-[10px] text-amber-100/90">
          Three-way match + evidence pack + policy gate timeline (Palantir-grade choreography placeholder).
        </div>
      </div>
    </div>
  );
}
