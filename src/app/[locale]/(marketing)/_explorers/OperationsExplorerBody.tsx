'use client';

import { useState } from 'react';

import { labPalantir } from '../_content/assets';
import { operations } from '../_content/sections';

/** Full-fidelity interactive isometric board (v5-derived). Explorer-only: perspective + 3D allowed here. */
export function OperationsExplorerBody() {
  const [tab, setTab] = useState(0);
  const hot = tab === 1;

  return (
    <div className="bg-[#17181c] p-4 text-[#f4f6ff]">
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
        Operations explorer · v5 isometric board
      </p>
      <div className="mx-auto mb-4 flex w-fit gap-1 rounded-full border border-white/15 bg-white/3 p-1">
        {operations.tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(i)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              tab === i ? 'bg-white text-black' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="relative mx-auto h-[420px] max-w-[900px]" style={{ perspective: '2000px' }}>
        <div
          className="absolute left-[10%] right-[10%] top-10 bottom-10"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(56deg) rotateZ(-42deg)',
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl border border-white/8 bg-linear-to-br from-[#15171b] to-[#0e0f13]"
            style={{ boxShadow: '-12px 12px 40px rgba(0,0,0,0.75)' }}
          />
          {operations.modules.slice(0, 5).map((m, idx) => {
            const positions = [
              'left-[8%] top-[18%] w-[22%] h-[18%]',
              'left-[38%] top-[12%] w-[22%] h-[18%]',
              'left-[68%] top-[22%] w-[22%] h-[18%]',
              'left-[22%] top-[52%] w-[22%] h-[18%]',
              'left-[52%] top-[58%] w-[22%] h-[18%]',
            ];
            return (
              <div
                key={m}
                className={`absolute flex items-center justify-center rounded-md border border-white/10 bg-linear-to-br from-[#1c1e24] to-[#15171b] text-center text-[8px] font-bold uppercase tracking-widest text-[#666] ${positions[idx] ?? ''}`}
                style={hot && idx < 3 ? { boxShadow: '0 0 18px rgba(92,205,241,0.35)', color: '#5ccdf1' } : undefined}
              >
                {m}
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-center font-mono text-[9px] text-white/40">
        Reference:{' '}
        <a className="text-cyan-300 underline" href={labPalantir.manufacturingFinance} target="_blank" rel="noreferrer">
          1-manufacturing finance.png
        </a>
      </p>
    </div>
  );
}
