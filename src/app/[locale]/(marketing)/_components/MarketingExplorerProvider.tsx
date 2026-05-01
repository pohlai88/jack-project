'use client';

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import type { ExplorerId } from '../_content/explorers';

type MarketingExplorerContextValue = {
  openId: ExplorerId | null;
  open: (id: ExplorerId) => void;
  close: () => void;
};

const MarketingExplorerContext = createContext<MarketingExplorerContextValue | null>(null);

export function MarketingExplorerProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<ExplorerId | null>(null);

  const open = useCallback((id: ExplorerId) => {
    setOpenId(id);
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
  }, []);

  const value = useMemo(
    () => ({
      openId,
      open,
      close,
    }),
    [close, open, openId],
  );

  return <MarketingExplorerContext.Provider value={value}>{children}</MarketingExplorerContext.Provider>;
}

export function useMarketingExplorer() {
  const context = useContext(MarketingExplorerContext);

  if (!context) {
    throw new Error('useMarketingExplorer must be used within MarketingExplorerProvider');
  }

  return context;
}
