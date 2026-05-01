# Marketing Landing Route

This route group owns the public landing surface at `/{locale}/`.

- `layout.tsx` imports the shared landing stylesheet, mounts the persistent marketing nav/footer, and provides the explorer dialog context.
- `page.tsx` composes the canonical act-based landing sequence: hero, acts, sections, inline explorer fallbacks, and the dev-only user panel.
- `_sections/HeroSection.tsx` is typed React. Runtime code must not parse or inject `.html` artifacts.
- `_components/landing-primitives.tsx` contains the route-local section, panel, status, and metadata primitives used by the landing design-system audit.
- `src/shared/styles/landing.css` is scoped under `.marketing-root`; it must not define global document selectors or import fonts. Ledger contract selectors `.marketing-scanline-ledger` / `__track` stay here for audits; visuals use Tailwind + `cva` in `_components/MarketingScanlineLedger.tsx`.
- Landing geometry is tokenized in `.marketing-root`: `--landing-page-x`, `--landing-edge-x`, `--landing-outer-gutter`, `--landing-container-width`, section spacing tokens, and hero spacing tokens. Nav, hero, sections, acts, and footer must use those tokens for left/right alignment.

Governance:

- `pnpm landing:audit` verifies the landing stylesheet, required route primitives, raw artifact bans, and surface ownership rules.
- Keep anchors stable: `#hero`, `#thesis`, `#ontology`, `#procurement`, `#operations`, `#architecture`, `#security`, `#evidence`, `#modular`, `#verdict`.
