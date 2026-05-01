export type MarketingTruthAccent = 'resolved' | 'signal' | 'exception' | 'proof';

export type MarketingTruthAnchorId =
  | 'hero'
  | 'thesis'
  | 'ontology'
  | 'procurement'
  | 'operations'
  | 'architecture'
  | 'security'
  | 'evidence'
  | 'modular'
  | 'verdict';

export type MarketingTruthMilestoneId = 'risk-posture' | 'decision-chain' | 'exception-route' | 'audit-state';

export type MarketingTruthAnchor = {
  id: MarketingTruthAnchorId;
  label: string;
};

export type MarketingTruthMilestone = {
  id: MarketingTruthMilestoneId;
  label: string;
  shortLabel: string;
  accent: MarketingTruthAccent;
  anchors: readonly MarketingTruthAnchor[];
};

export type MarketingTruthNodeState = 'future' | 'active' | 'complete';

export type MarketingTruthAnchorState = MarketingTruthAnchor & {
  charge: number;
  state: MarketingTruthNodeState;
};

export type MarketingTruthMilestoneState = {
  id: MarketingTruthMilestoneId;
  label: string;
  shortLabel: string;
  accent: MarketingTruthAccent;
  charge: number;
  state: MarketingTruthNodeState;
  anchors: MarketingTruthAnchorState[];
};

export type MarketingTruthState = {
  activeAnchorId: MarketingTruthAnchorId | null;
  activeMilestoneId: MarketingTruthMilestoneId | null;
  overallCharge: number;
  milestones: MarketingTruthMilestoneState[];
};

export const marketingTruthMilestones: readonly MarketingTruthMilestone[] = [
  {
    id: 'risk-posture',
    label: 'Risk posture',
    shortLabel: 'Risk',
    accent: 'resolved',
    anchors: [
      { id: 'hero', label: 'Entry signal' },
      { id: 'thesis', label: 'Operating thesis' },
    ],
  },
  {
    id: 'decision-chain',
    label: 'Decision chain',
    shortLabel: 'Decision',
    accent: 'signal',
    anchors: [
      { id: 'ontology', label: 'Business ontology' },
      { id: 'procurement', label: 'Procurement chain' },
      { id: 'operations', label: 'Operating flow' },
    ],
  },
  {
    id: 'exception-route',
    label: 'Exception route',
    shortLabel: 'Exception',
    accent: 'exception',
    anchors: [
      { id: 'architecture', label: 'System boundary' },
      { id: 'security', label: 'Control posture' },
    ],
  },
  {
    id: 'audit-state',
    label: 'Audit state',
    shortLabel: 'Audit',
    accent: 'proof',
    anchors: [
      { id: 'evidence', label: 'Evidence surface' },
      { id: 'modular', label: 'Modular proof' },
      { id: 'verdict', label: 'Executive verdict' },
    ],
  },
] as const;

export const marketingTruthAnchors: readonly MarketingTruthAnchor[] = marketingTruthMilestones.flatMap(
  (milestone) => milestone.anchors,
);

export const marketingTruthAnchorIds: readonly MarketingTruthAnchorId[] = marketingTruthAnchors.map(
  (anchor) => anchor.id,
);

export const marketingTruthAnchorIndex = new Map(marketingTruthAnchorIds.map((id, index) => [id, index]));

export const marketingTruthMilestoneIndex = new Map(
  marketingTruthMilestones.map((milestone, index) => [milestone.id, index]),
);

export function clampMarketingTruthCharge(value: number) {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

export function getMarketingTruthTickPosition(index: number, count: number) {
  if (count <= 1) return 50;
  const inset = count === 2 ? 8 : 6;
  const available = 100 - inset * 2;
  return inset + (index / (count - 1)) * available;
}

export function findMarketingTruthMilestoneByAnchor(
  anchorId: MarketingTruthAnchorId | null,
): MarketingTruthMilestoneId | null {
  if (!anchorId) return null;

  const milestone = marketingTruthMilestones.find((candidate) =>
    candidate.anchors.some((anchor) => anchor.id === anchorId),
  );

  return milestone?.id ?? null;
}

export function buildMarketingTruthState(
  anchorProgress: Partial<Record<MarketingTruthAnchorId, number>>,
  activeAnchorId: MarketingTruthAnchorId | null,
): MarketingTruthState {
  const activeMilestoneId = findMarketingTruthMilestoneByAnchor(activeAnchorId);

  const milestones = marketingTruthMilestones.map<MarketingTruthMilestoneState>((milestone) => {
    const anchors = milestone.anchors.map<MarketingTruthAnchorState>((anchor) => {
      const charge = clampMarketingTruthCharge(anchorProgress[anchor.id] ?? 0);
      const state: MarketingTruthNodeState =
        charge >= 0.999 ? 'complete' : anchor.id === activeAnchorId || charge > 0 ? 'active' : 'future';

      return {
        ...anchor,
        charge,
        state,
      };
    });

    const totalCharge = anchors.reduce((sum, anchor) => sum + anchor.charge, 0);
    const charge = anchors.length > 0 ? totalCharge / anchors.length : 0;
    const state: MarketingTruthNodeState =
      charge >= 0.999 ? 'complete' : milestone.id === activeMilestoneId || charge > 0 ? 'active' : 'future';

    return {
      ...milestone,
      charge,
      state,
      anchors,
    };
  });

  const overallCharge =
    marketingTruthAnchors.length > 0
      ? marketingTruthAnchors.reduce(
          (sum, anchor) => sum + clampMarketingTruthCharge(anchorProgress[anchor.id] ?? 0),
          0,
        ) / marketingTruthAnchors.length
      : 0;

  return {
    activeAnchorId,
    activeMilestoneId,
    overallCharge,
    milestones,
  };
}
