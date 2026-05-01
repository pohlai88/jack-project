import type { ExplorerId } from '../_content/explorers';
import { EXPLORERS } from '../_content/explorers';

type Props = {
  explorerId: ExplorerId;
  bullets: readonly string[];
};

/**
 * Non-modal fallback summary for users with reduced motion / no JS — and a
 * deep-link target for the explorer trigger's `Summary` link.
 */
export function ExplorerSummary({ explorerId, bullets }: Props) {
  const meta = EXPLORERS[explorerId];
  return (
    <section id={meta.fallbackAnchor} className="marketing-explorer-summary" aria-label={`${meta.label} summary`}>
      <p className="marketing-mono">Non-modal summary · #{meta.fallbackAnchor}</p>
      <ul>
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </section>
  );
}
