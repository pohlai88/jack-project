'use client';

import Image from 'next/image';

import { labPalantir } from '../_content/assets';
import { architecture } from '../_content/sections';

/** v6-style deck stack — 3D + labelled tiles (explorer only). */
export function ArchitectureExplorerBody() {
  return (
    <div className="relative min-h-[480px] overflow-hidden bg-[#0a0b0f] p-6 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Image src={labPalantir.ontology3d} alt="" fill className="object-cover" sizes="100vw" />
      </div>
      <div className="relative mx-auto flex max-w-3xl flex-col gap-4 py-8" style={{ perspective: '1600px' }}>
        {architecture.decks.map((d, i) => (
          <div
            key={d}
            className="rounded-lg border border-white/15 bg-linear-to-r from-white/6 to-transparent px-5 py-4 backdrop-blur-sm"
            style={{
              transform: `rotateX(${8 + i * 4}deg) translateZ(${i * -20}px)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-200/80">Deck {i + 1}</p>
            <p className="text-sm font-semibold">{d}</p>
          </div>
        ))}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {architecture.tiles.map((t) => (
            <span
              key={t}
              className="rounded border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-cyan-100"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <p className="relative z-1 mt-4 text-center font-mono text-[9px] text-white/45">
        Ontology engine centre shares the Section 03 hub language — glow only on live flow paths in production build.
      </p>
    </div>
  );
}
