/**
 * Marketing route loading fallback — streamed by the App Router while the page resolves.
 *
 * Renders inside `<main class="marketing-shell__main">`; the real nav, ledger, ladder, and
 * footer remain outer shell chrome. Structure is markup-only — motion and sizing live in `landing.css`.
 */
export default function MarketingLoading() {
  return (
    <div className="marketing-loading" aria-hidden="true">
      <div className="marketing-loading__nav" />

      <div className="marketing-loading__hero">
        <span className="marketing-loading__line marketing-loading__line--kicker" />
        <span className="marketing-loading__line marketing-loading__line--title-lg" />
        <span className="marketing-loading__line marketing-loading__line--title-md" />

        <div className="marketing-loading__copy">
          <span />
          <span />
          <span />
        </div>

        <div className="marketing-loading__proofline">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
