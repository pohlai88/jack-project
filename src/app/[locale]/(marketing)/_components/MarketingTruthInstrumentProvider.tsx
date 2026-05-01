'use client';

import { usePathname } from 'next/navigation';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import {
  buildMarketingTruthState,
  clampMarketingTruthCharge,
  type MarketingTruthAnchorId,
  marketingTruthAnchorIds,
  marketingTruthAnchorIndex,
  type MarketingTruthState,
} from '../_content/truth-instrument';

type MarketingTruthInstrumentContextValue = {
  enabled: boolean;
  state: MarketingTruthState;
};

const idleTruthState = buildMarketingTruthState({}, null);

const MarketingTruthInstrumentContext = createContext<MarketingTruthInstrumentContextValue | null>(null);

const observerThresholds = Array.from({ length: 11 }, (_, index) => index / 10);

function getActivationOffset() {
  if (typeof window === 'undefined') return 96;

  const root = document.querySelector<HTMLElement>('.marketing-root');
  const styles = root ? getComputedStyle(root) : null;
  const token = styles?.getPropertyValue('--landing-header-height')?.trim() ?? '';
  const parsed = Number.parseFloat(token);

  return (Number.isFinite(parsed) ? parsed : 57) + 36;
}

function getPageOffset(element: HTMLElement) {
  return window.scrollY + element.getBoundingClientRect().top;
}

function isMarketingRootPath(pathname: string) {
  return /^\/[^/]+\/?$/.test(pathname);
}

export function MarketingTruthInstrumentProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const enabled = isMarketingRootPath(pathname);
  const [state, setState] = useState<MarketingTruthState>(idleTruthState);

  useEffect(() => {
    if (!enabled) {
      setState(idleTruthState);
      return;
    }

    const anchorElements = marketingTruthAnchorIds
      .map((anchorId) => document.getElementById(anchorId))
      .filter((element): element is HTMLElement => element instanceof HTMLElement);

    if (anchorElements.length !== marketingTruthAnchorIds.length) {
      setState(idleTruthState);
      return;
    }

    const intersecting = new Set<MarketingTruthAnchorId>();
    let frame = 0;

    const computeState = () => {
      const activationOffset = getActivationOffset();
      const activationLine = window.scrollY + activationOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportBottom = window.scrollY + window.innerHeight;
      const bottomReached = viewportBottom >= documentHeight - 2;
      let activeAnchorId: MarketingTruthAnchorId | null = null;

      if (bottomReached) {
        const lastAnchorId = marketingTruthAnchorIds[marketingTruthAnchorIds.length - 1] ?? null;
        const completedProgress = Object.fromEntries(
          marketingTruthAnchorIds.map((anchorId) => [anchorId, 1]),
        ) as Record<MarketingTruthAnchorId, number>;

        setState(buildMarketingTruthState(completedProgress, lastAnchorId));
        return;
      }

      for (const anchorId of marketingTruthAnchorIds) {
        const element = document.getElementById(anchorId);
        if (!(element instanceof HTMLElement)) continue;

        const rect = element.getBoundingClientRect();
        const activationBand = activationOffset + Math.max(32, Math.min(rect.height * 0.18, 96));

        if (intersecting.has(anchorId) && rect.top <= activationBand) {
          activeAnchorId = anchorId;
        }
      }

      if (!activeAnchorId) {
        for (const anchorId of marketingTruthAnchorIds) {
          const element = document.getElementById(anchorId);
          if (!(element instanceof HTMLElement)) continue;

          if (getPageOffset(element) <= activationLine) {
            activeAnchorId = anchorId;
          }
        }
      }

      if (!activeAnchorId) {
        activeAnchorId = marketingTruthAnchorIds[0] ?? null;
      }

      const activeIndex = activeAnchorId ? (marketingTruthAnchorIndex.get(activeAnchorId) ?? 0) : -1;
      const progressByAnchor: Partial<Record<MarketingTruthAnchorId, number>> = {};

      for (const anchorId of marketingTruthAnchorIds) {
        const anchorIndex = marketingTruthAnchorIndex.get(anchorId) ?? -1;

        if (anchorIndex < activeIndex) {
          progressByAnchor[anchorId] = 1;
          continue;
        }

        if (anchorIndex > activeIndex) {
          progressByAnchor[anchorId] = 0;
          continue;
        }

        const currentElement = document.getElementById(anchorId);

        if (!(currentElement instanceof HTMLElement)) {
          progressByAnchor[anchorId] = 0;
          continue;
        }

        const currentStart = getPageOffset(currentElement);
        const nextAnchorId = marketingTruthAnchorIds[anchorIndex + 1];
        const nextElement = nextAnchorId ? document.getElementById(nextAnchorId) : null;

        if (nextElement instanceof HTMLElement) {
          const span = Math.max(getPageOffset(nextElement) - currentStart, 1);
          progressByAnchor[anchorId] = clampMarketingTruthCharge((activationLine - currentStart) / span);
          continue;
        }

        const tailSpan = Math.max(currentElement.offsetHeight * 0.55, window.innerHeight * 0.38, 1);
        progressByAnchor[anchorId] = clampMarketingTruthCharge((activationLine - currentStart) / tailSpan);
      }

      setState(buildMarketingTruthState(progressByAnchor, activeAnchorId));
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(computeState);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const targetId = entry.target.id as MarketingTruthAnchorId;

          if (entry.isIntersecting) {
            intersecting.add(targetId);
          } else {
            intersecting.delete(targetId);
          }
        }

        schedule();
      },
      {
        rootMargin: '-96px 0px -45% 0px',
        threshold: observerThresholds,
      },
    );

    for (const element of anchorElements) {
      observer.observe(element);
    }

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [enabled]);

  const value = useMemo(
    () => ({
      enabled,
      state,
    }),
    [enabled, state],
  );

  return <MarketingTruthInstrumentContext.Provider value={value}>{children}</MarketingTruthInstrumentContext.Provider>;
}

export function useMarketingTruthInstrument() {
  const context = useContext(MarketingTruthInstrumentContext);

  if (!context) {
    throw new Error('useMarketingTruthInstrument must be used within MarketingTruthInstrumentProvider');
  }

  return context;
}
