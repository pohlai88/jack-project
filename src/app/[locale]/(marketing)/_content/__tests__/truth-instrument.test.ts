import { describe, expect, it } from 'vitest';

import { buildMarketingTruthState, marketingTruthAnchorIds, marketingTruthMilestones } from '../truth-instrument';

describe('marketing truth instrument', () => {
  it('covers every required landing anchor exactly once and in order', () => {
    expect(marketingTruthAnchorIds).toEqual([
      'hero',
      'thesis',
      'ontology',
      'procurement',
      'operations',
      'architecture',
      'security',
      'evidence',
      'modular',
      'verdict',
    ]);

    expect(new Set(marketingTruthAnchorIds).size).toBe(marketingTruthAnchorIds.length);
  });

  it('keeps the intended four milestone groups', () => {
    expect(marketingTruthMilestones.map((milestone) => milestone.id)).toEqual([
      'risk-posture',
      'decision-chain',
      'exception-route',
      'audit-state',
    ]);
  });

  it('derives active milestone, per-anchor state, and aggregate charge', () => {
    const truthState = buildMarketingTruthState(
      {
        hero: 1,
        thesis: 1,
        ontology: 1,
        procurement: 0.5,
      },
      'procurement',
    );

    expect(truthState.activeMilestoneId).toBe('decision-chain');
    expect(truthState.milestones[0]).toMatchObject({
      id: 'risk-posture',
      state: 'complete',
      charge: 1,
    });
    expect(truthState.milestones[1]).toMatchObject({
      id: 'decision-chain',
      state: 'active',
    });
    expect(truthState.milestones[1].anchors[1]).toMatchObject({
      id: 'procurement',
      state: 'active',
      charge: 0.5,
    });
    expect(truthState.milestones[3]).toMatchObject({
      id: 'audit-state',
      state: 'future',
      charge: 0,
    });
    expect(truthState.overallCharge).toBeCloseTo(0.35, 5);
  });
});
