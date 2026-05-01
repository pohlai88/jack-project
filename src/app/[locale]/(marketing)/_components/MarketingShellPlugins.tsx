import { MarketingExplorerDialog } from './MarketingExplorerDialog';
import { MarketingExplorerProvider } from './MarketingExplorerProvider';
import { MarketingIntroSceneLazy } from './MarketingIntroSceneLazy';
import { MarketingNav } from './MarketingNav';
import { MarketingTruthInstrumentProvider } from './MarketingTruthInstrumentProvider';
import { MarketingTruthLadder } from './MarketingTruthLadder';
import { MarketingFooter } from '../_sections/MarketingFooter';

export const marketingShellPlugins = {
  IntroScene: MarketingIntroSceneLazy,
  ExplorerProvider: MarketingExplorerProvider,
  TruthInstrumentProvider: MarketingTruthInstrumentProvider,
  Navigation: MarketingNav,
  NavigationPanel: MarketingTruthLadder,
  ExplorerDialog: MarketingExplorerDialog,
  Footer: MarketingFooter,
} as const;
