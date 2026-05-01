'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { type CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';

import { cn } from '@/shared/lib/utils';

import { useMarketingTruthInstrument } from './MarketingTruthInstrumentProvider';
import {
  getMarketingTruthTickPosition,
  type MarketingTruthAccent,
  type MarketingTruthAnchorId,
  type MarketingTruthAnchorState,
  type MarketingTruthMilestoneState,
} from '../_content/truth-instrument';

type TruthInstrumentStyle = CSSProperties & {
  '--truth-overall-charge'?: string;
  '--truth-anchor-position'?: string;
  '--truth-label-lane-offset'?: string;
  '--truth-label-shift'?: string;
  '--truth-leg-height'?: string;
  '--truth-hover-bar-left'?: string;
  '--truth-hover-bar-width'?: string;
  '--truth-hover-bar-shift'?: string;
  '--accent-solid'?: string;
  '--accent-glow'?: string;
};

/* -------------------------------------------------------------------------- */
/*  Accent tokens                                                              */
/* -------------------------------------------------------------------------- */

const accentVarsByAccent: Record<MarketingTruthAccent, TruthInstrumentStyle> = {
  resolved: { '--accent-solid': 'rgba(99,230,168,1)', '--accent-glow': 'rgba(99,230,168,0.18)' },
  signal: { '--accent-solid': 'rgba(127,217,255,1)', '--accent-glow': 'rgba(127,217,255,0.18)' },
  exception: { '--accent-solid': 'rgba(232,193,104,1)', '--accent-glow': 'rgba(232,193,104,0.18)' },
  proof: { '--accent-solid': 'rgba(141,229,193,1)', '--accent-glow': 'rgba(141,229,193,0.18)' },
};

/* -------------------------------------------------------------------------- */
/*  3-lane label stagger — designed rhythm, not mechanical modulo              */
/* -------------------------------------------------------------------------- */

const ANCHOR_LABEL_LANE_SEQUENCE = [0, 2, 1, 0, 2, 1, 0, 2, 1, 0] as const;
const ANCHOR_LABEL_LANE_OFFSETS = ['1.18rem', '2.38rem', '3.58rem'] as const;

function getAnchorLabelLane(globalAnchorIndex: number) {
  return ANCHOR_LABEL_LANE_SEQUENCE[globalAnchorIndex % ANCHOR_LABEL_LANE_SEQUENCE.length];
}

function getAnchorLabelLaneOffset(globalAnchorIndex: number) {
  return ANCHOR_LABEL_LANE_OFFSETS[getAnchorLabelLane(globalAnchorIndex)];
}

type LedgerAnchorRecord = {
  anchor: MarketingTruthAnchorState;
  milestone: MarketingTruthMilestoneState;
  globalAnchorIndex: number;
  globalPosition: number;
  /** Vertical offset for both the label position and the leg height — keeps them flush. */
  laneOffset: string;
};

function getLedgerAnchors(milestones: MarketingTruthMilestoneState[]): LedgerAnchorRecord[] {
  const total = milestones.length;
  let globalAnchorIndex = 0;
  const records: LedgerAnchorRecord[] = [];

  milestones.forEach((milestone, milestoneIndex) => {
    milestone.anchors.forEach((anchor, anchorIndex) => {
      const localTickPercent = getMarketingTruthTickPosition(anchorIndex, milestone.anchors.length);
      const globalPosition = ((milestoneIndex + localTickPercent / 100) / total) * 100;

      records.push({
        anchor,
        milestone,
        globalAnchorIndex,
        globalPosition,
        laneOffset: getAnchorLabelLaneOffset(globalAnchorIndex),
      });

      globalAnchorIndex += 1;
    });
  });

  return records;
}

/* -------------------------------------------------------------------------- */
/*  Segment fill variants — keep approved gradient palette                     */
/* -------------------------------------------------------------------------- */

const segmentIndicatorVariants = cva(
  cn(
    'size-full origin-left',
    'transition-transform duration-[420ms]',
    'ease-[var(--marketing-ease)] motion-reduce:transition-none',
  ),
  {
    variants: {
      accent: {
        resolved: 'bg-gradient-to-r from-[rgba(99,230,168,0.24)] to-[rgba(99,230,168,0.92)]',
        signal: 'bg-gradient-to-r from-[rgba(127,217,255,0.24)] to-[rgba(127,217,255,0.92)]',
        exception: 'bg-gradient-to-r from-[rgba(232,193,104,0.22)] to-[rgba(232,193,104,0.92)]',
        proof: 'bg-gradient-to-r from-[rgba(155,140,255,0.2)] to-[rgba(99,230,168,0.85)]',
      },
    },
    defaultVariants: { accent: 'signal' },
  },
);

type SegmentAccent = NonNullable<VariantProps<typeof segmentIndicatorVariants>['accent']>;

/* -------------------------------------------------------------------------- */
/*  Static class presets                                                       */
/* -------------------------------------------------------------------------- */

const ledgerRootClass = cn(
  'marketing-scanline-ledger',
  'relative mx-auto hidden w-[var(--landing-nav-width)]',
  'pb-[length:var(--landing-truth-ledger-block-end)] min-[68.751rem]:block',
);

const ledgerTrackClass = cn(
  'marketing-scanline-ledger__track',
  'relative isolate min-h-[length:var(--landing-truth-ledger-track-min-height)] w-full',
);

const railBackdropClass = cn(
  'pointer-events-none absolute inset-x-0 top-1.5 z-0',
  'h-[length:var(--landing-truth-ledger-rail-height)]',
  'bg-[linear-gradient(90deg,rgba(255,255,255,0.03),rgba(255,255,255,0.08)),rgba(255,255,255,0.03)]',
  /* No bottom stroke — reads as extra air under the scanline rail */
  'shadow-[0_-1px_0_0_rgba(255,255,255,0.02),-1px_0_0_0_rgba(255,255,255,0.02),1px_0_0_0_rgba(255,255,255,0.02),0_0_20px_rgba(127,217,255,0.05)]',
);

const segmentsGridClass = cn('relative z-[1] grid w-full grid-cols-4 items-start');

const segmentRootClass = cn('marketing-scanline-ledger__segment', 'relative h-[0.875rem]');

const segmentProgressClass = cn(
  'marketing-scanline-ledger__segment-fill',
  'absolute inset-x-0 top-1.5 z-[3] overflow-hidden',
  'h-[length:var(--landing-truth-ledger-rail-height)]',
  'opacity-[0.78]',
);

const overallSignalClass = cn(
  'marketing-scanline-ledger__signal',
  'pointer-events-none absolute top-1.5 z-[4]',
  'left-[calc(var(--truth-overall-charge,_0)*100%)]',
  'size-[0.625rem] -translate-x-1/2 -translate-y-[18%]',
  'rounded-full border border-white/[0.18]',
  'bg-[radial-gradient(circle,rgba(245,246,251,0.95)_0%,rgba(127,217,255,0.72)_55%,rgba(127,217,255,0)_100%)]',
  'shadow-[0_0_0_0.15rem_rgba(127,217,255,0.09),0_0_24px_rgba(127,217,255,0.22)]',
  'transition-[left] duration-[420ms] ease-[var(--marketing-ease)] motion-reduce:transition-none',
);

/* -------------------------------------------------------------------------- */
/*  Hover intent bar — appears on hover, fades out smoothly                    */
/* -------------------------------------------------------------------------- */

const hoverIntentBarBaseClass = cn(
  'marketing-scanline-ledger__hover-intent-bar',
  'pointer-events-none absolute top-[0.47rem] z-[5]',
  'left-[var(--truth-hover-bar-left)]',
  'h-[0.16rem] w-[var(--truth-hover-bar-width)]',
  // Same clamp trick as labels: left-aligns at 0%, centers at 50%, right-aligns at 100%
  '[transform:translateX(var(--truth-hover-bar-shift))]',
  'rounded-full',
  'bg-[linear-gradient(90deg,transparent,var(--accent-solid),transparent)]',
  'blur-[0.5px]',
  'shadow-[0_0_18px_var(--accent-glow)]',
  'transition-[left,width,opacity] duration-[460ms] ease-[var(--marketing-ease)]',
  'motion-reduce:transition-none',
);

const hoverIntentBarVisibleClass = 'opacity-100';
const hoverIntentBarHiddenClass = 'opacity-0';

/* -------------------------------------------------------------------------- */
/*  Anchor marker layer — 10 ticks, 10 legs, 10 staggered labels              */
/* -------------------------------------------------------------------------- */

const anchorMarkerLayerClass = cn(
  'marketing-scanline-ledger__anchor-marker-layer',
  'pointer-events-none absolute inset-x-0 top-0 z-[6] min-h-[5.5rem]',
);

const anchorMarkerClass = cn(
  'marketing-scanline-ledger__anchor-marker',
  'group pointer-events-auto absolute top-1.5',
  'left-[var(--truth-anchor-position)]',
  '-translate-x-1/2',
  'flex flex-col items-center outline-none',
  // Invisible hit-zone: wide + tall enough to catch hover/focus on the dot
  // AND the lane area beneath it where the label will appear.
  'px-3 pb-10',
  'transition-[left,opacity,transform] duration-[360ms] ease-[var(--marketing-ease)]',
  'motion-reduce:transition-none',
  'rounded-sm focus-visible:ring-2 focus-visible:ring-white/30',
);

const anchorMarkerLegClass = cn(
  'marketing-scanline-ledger__anchor-marker-leg',
  'h-[var(--truth-leg-height)] w-px',
  'bg-[linear-gradient(180deg,var(--accent-solid)_0%,rgba(255,255,255,0.16)_62%,transparent_100%)]',
  'transition-[opacity,box-shadow] duration-[240ms] ease-out motion-reduce:transition-none',

  // 1. Base state: Dim
  'opacity-[0.30]',

  // 2 & 3. Sticky Shined & Live Hover
  'group-[.is-shined]:opacity-100 group-[.is-shined]:shadow-[0_0_16px_var(--accent-glow)]',
  'group-[.is-hovered]:opacity-100 group-[.is-hovered]:shadow-[0_0_20px_var(--accent-glow),0_0_2px_var(--accent-solid)]',
);

const anchorMarkerDotClass = cn(
  'marketing-scanline-ledger__anchor-marker-dot',
  'absolute top-[-0.15rem] z-[2] size-[0.32rem] rounded-full',
  'border border-white/20 bg-[var(--accent-solid)]',
  'transition-[transform,box-shadow,border-color,opacity] duration-[240ms] ease-out motion-reduce:transition-none',

  // 1. Base state: Dim
  'opacity-[0.40] shadow-none',

  // 2 & 3. Sticky Shined & Live Hover
  'group-[.is-shined]:opacity-100 group-[.is-shined]:scale-125 group-[.is-shined]:border-white/40',
  'group-[.is-shined]:shadow-[0_0_20px_var(--accent-glow),0_0_0_0.20rem_rgba(255,255,255,0.10)]',
  'group-[.is-hovered]:opacity-100 group-[.is-hovered]:scale-150 group-[.is-hovered]:border-white/70',
  'group-[.is-hovered]:shadow-[0_0_24px_var(--accent-glow),0_0_0_0.26rem_rgba(255,255,255,0.14)]',
);

const anchorMarkerLabelClass = cn(
  'marketing-scanline-ledger__anchor-marker-label',
  'pointer-events-none absolute left-1/2 top-[var(--truth-label-lane-offset)] z-[3]',
  'w-max min-w-[4.5rem] max-w-[7.75rem]',
  // Horizontal shift: left-aligns at 0%, centers at 50%, right-aligns at 100%
  // — single linear formula prevents edge overflow without branching.
  '[transform:translate(var(--truth-label-shift),0.25rem)]',
  'rounded-full border border-white/[0.08] bg-black/[0.40]',
  'px-2.5 py-1 text-center uppercase',
  'font-[family-name:var(--marketing-mono)] text-[0.54rem] font-bold leading-[1.12]',
  'tracking-[0.105em] text-white/[0.42]',
  'backdrop-blur-[2px] whitespace-normal break-words',
  '[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [line-clamp:2]',
  'transition-[opacity,color,border-color,background-color,box-shadow,filter] duration-[320ms] ease-out motion-reduce:transition-none',

  // 1. Base state: Dim
  'opacity-[0.35]',

  // 2. Sticky Shined (pointer left — keeps prior visit visible)
  'group-[.is-shined]:opacity-100',
  'group-[.is-shined]:text-white/[0.94]',
  'group-[.is-shined]:border-white/25',
  'group-[.is-shined]:bg-black/[0.72]',
  'group-[.is-shined]:shadow-[0_8px_22px_rgba(0,0,0,0.38),0_0_18px_var(--accent-glow)]',

  // 3. Live Hover (pointer/focus in now — full shine)
  'group-[.is-hovered]:opacity-100',
  'group-[.is-hovered]:text-white',
  'group-[.is-hovered]:border-[var(--accent-solid)]',
  'group-[.is-hovered]:bg-black/[0.86]',
  'group-[.is-hovered]:shadow-[0_12px_32px_rgba(0,0,0,0.48),0_0_28px_var(--accent-glow),0_0_3px_var(--accent-solid)]',
  'group-[.is-hovered]:[filter:brightness(1.14)_saturate(1.12)]',
);

/* -------------------------------------------------------------------------- */
/*  Chapter label layer — quiet 4-group grid below anchor labels              */
/* -------------------------------------------------------------------------- */

const chapterLabelLayerClass = cn(
  'marketing-scanline-ledger__chapter-label-layer',
  'pointer-events-none absolute inset-x-0 top-[5.35rem] z-[2]',
  'grid grid-cols-4 items-start',
);

const chapterLabelClass = cn(
  'marketing-scanline-ledger__chapter-label',
  'text-center uppercase',
  'font-[family-name:var(--marketing-mono)] text-[0.58rem] font-extrabold leading-none',
  'tracking-[0.18em] text-white/30',
);

/* -------------------------------------------------------------------------- */
/*  Segment — renders progress only                                            */
/* -------------------------------------------------------------------------- */

function LedgerSegmentProgress({
  accent,
  charge,
  milestoneLabel,
  labelId,
}: {
  accent: SegmentAccent;
  charge: number;
  milestoneLabel: string;
  labelId: string;
}) {
  const percent = Math.max(0, Math.min(100, Math.round(charge * 100)));

  return (
    <ProgressPrimitive.Root
      value={percent}
      max={100}
      aria-labelledby={labelId}
      aria-valuetext={`${milestoneLabel}: ${percent}%`}
      className={segmentProgressClass}
    >
      <ProgressPrimitive.Indicator
        className={segmentIndicatorVariants({ accent })}
        style={{ transform: `scaleX(${percent / 100})` }}
      />
    </ProgressPrimitive.Root>
  );
}

function LedgerSegment({ milestone }: { milestone: MarketingTruthMilestoneState }) {
  const labelId = `ledger-${milestone.id}-label`;

  const segmentStyle = {
    ...accentVarsByAccent[milestone.accent],
  } as TruthInstrumentStyle;

  return (
    <div className={cn(segmentRootClass, `is-${milestone.state}`)} style={segmentStyle}>
      <LedgerSegmentProgress
        accent={milestone.accent}
        charge={milestone.charge}
        milestoneLabel={milestone.label}
        labelId={labelId}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Anchor marker                                                              */
/* -------------------------------------------------------------------------- */

function AnchorMarker({
  record,
  activeAnchorId,
  hoveredAnchorId,
  shinedAnchorIds,
  onHoverChange,
}: {
  record: LedgerAnchorRecord;
  activeAnchorId: MarketingTruthAnchorId | null;
  hoveredAnchorId: MarketingTruthAnchorId | null;
  shinedAnchorIds: ReadonlySet<MarketingTruthAnchorId>;
  onHoverChange: (id: MarketingTruthAnchorId | null) => void;
}) {
  const { anchor, milestone, globalPosition, laneOffset } = record;
  const isCurrent = anchor.id === activeAnchorId;
  const isHovered = anchor.id === hoveredAnchorId;
  // Shined is driven by TWO sources, unioned:
  //   1. Scroll progress — any anchor the signal has reached (state !== 'future')
  //   2. Pointer/focus history — any anchor the user has hovered or tabbed into
  // Mutually exclusive with is-hovered so CSS variant sort order can't let
  // `.is-shined` rules mask the live `.is-hovered` rules at the same specificity.
  const hasBeenReached = anchor.state !== 'future';
  const isShined = !isHovered && (hasBeenReached || shinedAnchorIds.has(anchor.id));

  const markerStyle = {
    '--truth-anchor-position': `${globalPosition}%`,
    '--truth-label-lane-offset': laneOffset,
    '--truth-leg-height': laneOffset,
    // Pulls the label from left-aligned at 0% → centered at 50% → right-aligned at 100%
    '--truth-label-shift': `-${globalPosition}%`,
    ...accentVarsByAccent[milestone.accent],
  } as TruthInstrumentStyle;

  return (
    <a
      href={`#${anchor.id}`}
      className={cn(
        anchorMarkerClass,
        `is-${anchor.state}`,
        isCurrent && 'is-current',
        isShined && 'is-shined',
        isHovered && 'is-hovered',
      )}
      aria-current={isCurrent ? 'step' : undefined}
      aria-label={anchor.label}
      style={markerStyle}
      onPointerEnter={() => onHoverChange(anchor.id)}
      onPointerLeave={() => onHoverChange(null)}
      onFocus={() => onHoverChange(anchor.id)}
      onBlur={() => onHoverChange(null)}
    >
      <span className={anchorMarkerLegClass} aria-hidden />
      <span className={anchorMarkerDotClass} aria-hidden />
      <span className={anchorMarkerLabelClass} title={anchor.label}>
        {anchor.label}
      </span>
    </a>
  );
}

function AnchorMarkerLayer({
  anchors,
  activeAnchorId,
  hoveredAnchorId,
  shinedAnchorIds,
  onHoverChange,
}: {
  anchors: LedgerAnchorRecord[];
  activeAnchorId: MarketingTruthAnchorId | null;
  hoveredAnchorId: MarketingTruthAnchorId | null;
  shinedAnchorIds: ReadonlySet<MarketingTruthAnchorId>;
  onHoverChange: (id: MarketingTruthAnchorId | null) => void;
}) {
  return (
    <div className={anchorMarkerLayerClass} aria-label="Truth ledger anchor labels">
      {anchors.map((record) => (
        <AnchorMarker
          key={record.anchor.id}
          record={record}
          activeAnchorId={activeAnchorId}
          hoveredAnchorId={hoveredAnchorId}
          shinedAnchorIds={shinedAnchorIds}
          onHoverChange={onHoverChange}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hover intent bar                                                           */
/* -------------------------------------------------------------------------- */

function HoverIntentBar({
  anchors,
  hoveredAnchorId,
}: {
  anchors: LedgerAnchorRecord[];
  hoveredAnchorId: MarketingTruthAnchorId | null;
}) {
  const hoveredRecord = hoveredAnchorId ? anchors.find((record) => record.anchor.id === hoveredAnchorId) : null;
  const [lastHoveredRecord, setLastHoveredRecord] = useState<LedgerAnchorRecord | null>(null);

  useEffect(() => {
    if (hoveredRecord) {
      setLastHoveredRecord(hoveredRecord);
    }
  }, [hoveredRecord]);

  const visible = Boolean(hoveredRecord);
  const intentRecord = hoveredRecord ?? lastHoveredRecord;
  const position = intentRecord?.globalPosition ?? 0;

  const barStyle = {
    '--truth-hover-bar-left': `${position}%`,
    '--truth-hover-bar-width': intentRecord ? '6.5rem' : '0rem',
    '--truth-hover-bar-shift': `-${position}%`,
    ...(intentRecord ? accentVarsByAccent[intentRecord.milestone.accent] : {}),
  } as TruthInstrumentStyle;

  return (
    <span
      className={cn(hoverIntentBarBaseClass, visible ? hoverIntentBarVisibleClass : hoverIntentBarHiddenClass)}
      style={barStyle}
      aria-hidden
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Chapter labels                                                             */
/* -------------------------------------------------------------------------- */

function ChapterLabelLayer({ milestones }: { milestones: MarketingTruthMilestoneState[] }) {
  return (
    <div className={chapterLabelLayerClass} aria-hidden>
      {milestones.map((milestone) => (
        <span
          key={milestone.id}
          className={chapterLabelClass}
          style={accentVarsByAccent[milestone.accent] as TruthInstrumentStyle}
        >
          {milestone.shortLabel}
        </span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Root                                                                       */
/* -------------------------------------------------------------------------- */

export function MarketingScanlineLedger() {
  const { enabled, state } = useMarketingTruthInstrument();
  const [hoveredAnchorId, setHoveredAnchorId] = useState<MarketingTruthAnchorId | null>(null);
  const [shinedAnchorIds, setShinedAnchorIds] = useState<ReadonlySet<MarketingTruthAnchorId>>(() => new Set());
  const anchors = useMemo(() => getLedgerAnchors(state.milestones), [state.milestones]);

  // Sticky shine — once an anchor is hovered/focused, it stays in the "shined" set.
  const handleHoverChange = useCallback((id: MarketingTruthAnchorId | null) => {
    setHoveredAnchorId(id);
    if (!id) return;
    setShinedAnchorIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  if (!enabled) return null;

  return (
    <div
      className={ledgerRootClass}
      aria-label="Truth instrument scanline ledger"
      role="group"
      style={{ '--truth-overall-charge': `${state.overallCharge}` } as TruthInstrumentStyle}
    >
      <div className={ledgerTrackClass}>
        <div className={railBackdropClass} aria-hidden />

        <div className={segmentsGridClass}>
          {state.milestones.map((milestone) => (
            <LedgerSegment key={milestone.id} milestone={milestone} />
          ))}
        </div>

        <HoverIntentBar anchors={anchors} hoveredAnchorId={hoveredAnchorId} />

        <AnchorMarkerLayer
          anchors={anchors}
          activeAnchorId={state.activeAnchorId}
          hoveredAnchorId={hoveredAnchorId}
          shinedAnchorIds={shinedAnchorIds}
          onHoverChange={handleHoverChange}
        />

        <ChapterLabelLayer milestones={state.milestones} />

        <span className={overallSignalClass} aria-hidden />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- *
 *  NOTE: `marketing-scanline-ledger__track` is kept as the single track      *
 *  wrapper so `verify-landing-design-system` still sees both contract        *
 *  selectors (`.marketing-scanline-ledger` + `.marketing-scanline-ledger__   *
 *  track`). Visual layout + palette live here in Tailwind v4 + `cva`.        *
 * -------------------------------------------------------------------------- */
