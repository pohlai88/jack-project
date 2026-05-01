'use client';

import Image from 'next/image';

import { labPalantir } from '../_content/assets';
import { modular } from '../_content/sections';

export function ModularExplorerBody() {
  return (
    <div className="grid gap-4 bg-[#0b0d13] p-6 text-white lg:grid-cols-2">
      <div className="relative min-h-[320px]">
        <Image src={labPalantir.modular} alt="" fill className="object-contain opacity-70" sizes="500px" />
        <Image
          src={labPalantir.agentsSvg}
          alt=""
          width={200}
          height={120}
          className="absolute bottom-4 right-4 opacity-80"
        />
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">SDK · API · Federation</p>
        <pre className="mt-3 max-h-[360px] overflow-auto rounded border border-white/10 bg-black/50 p-4 font-mono text-[10px] leading-relaxed text-emerald-200/90">
          {modular.codeSample}
          {'\n\n'}
          {`// Federation graph (animated 3D in full build)
const edges = await afenda.graph.edges({ tenant: "acme" });
`}
        </pre>
      </div>
    </div>
  );
}
