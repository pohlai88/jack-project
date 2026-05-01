import { describe, expect, it } from 'vitest';

import { randomUUID } from 'node:crypto';
import { mkdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { analyzeTsxClassInventory, verifyLandingDesignSystem } from '../verify-landing-design-system';

const requiredLandingTokens = [
  '--landing-container-max',
  '--landing-page-x',
  '--landing-edge-x',
  '--landing-outer-gutter',
  '--landing-container-width',
  '--landing-nav-content-height',
  '--landing-truth-ledger-hit-height',
  '--landing-truth-ledger-rail-height',
  '--landing-truth-ladder-width',
  '--landing-truth-ladder-top',
  '--landing-header-height',
  '--landing-section-y',
  '--landing-section-y-compact',
  '--landing-act-y',
  '--landing-hero-padding-block-start',
  '--landing-hero-padding-block-end',
  '--landing-hero-gap',
  '--landing-hero-stage-min',
  '--landing-panel-radius',
  '--landing-inner-radius',
  '--landing-panel-border',
  '--landing-panel-background',
  '--landing-panel-shadow',
  '--landing-divider',
  '--landing-label-tracking',
  '--landing-status-tracking',
] as const;

const requiredLandingSelectors = [
  '.marketing-root',
  '.marketing-nav',
  '.marketing-nav__inner',
  '.marketing-scanline-ledger',
  '.marketing-scanline-ledger__track',
  '.marketing-section',
  '.marketing-section__inner',
  '.marketing-section__header',
  '.marketing-section__title',
  '.marketing-section__copy',
  '.marketing-panel',
  '.marketing-panel__header',
  '.marketing-status-pill',
  '.marketing-meta-label',
  '.marketing-footer',
  '.marketing-footer__inner',
  '.marketing-hero',
  '.marketing-hero__composition',
  '.marketing-intro__stage',
  '.marketing-intro__truth-card',
  '.marketing-pre-landing',
  '.marketing-truth-ladder',
  '.marketing-truth-ladder__module',
] as const;

function fixtureCss(cssAppend = '') {
  const tokens = requiredLandingTokens.map((token) => `  ${token}: 1rem;`).join('\n');
  const selectors = requiredLandingSelectors.map((selector) => `${selector} {}`).join('\n');

  return `.marketing-root {\n${tokens}\n}\n${selectors}\n${cssAppend}`;
}

function writeFixtureFile(rootDir: string, relativePath: string, contents: string) {
  const file = path.join(rootDir, relativePath);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, contents);
}

function createLandingFixture({
  cssAppend = '',
  files = {},
  removeFiles = [],
}: {
  cssAppend?: string;
  files?: Record<string, string>;
  removeFiles?: string[];
} = {}) {
  const rootDir = path.join(tmpdir(), `afenda-landing-audit-${randomUUID()}`);
  const marketingBase = 'src/app/[locale]/(marketing)';

  mkdirSync(rootDir, { recursive: true });
  writeFixtureFile(rootDir, 'src/shared/styles/landing.css', fixtureCss(cssAppend));

  const baseFiles: Record<string, string> = {
    [`${marketingBase}/layout.tsx`]:
      'export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }',
    [`${marketingBase}/page.tsx`]: 'export default function Page() { return <main />; }',
    [`${marketingBase}/_components/MarketingExplorerDialog.tsx`]:
      'export function MarketingExplorerDialog() { return null; }',
    [`${marketingBase}/_components/MarketingExplorerProvider.tsx`]:
      'export function MarketingExplorerProvider({ children }: { children: React.ReactNode }) { return <>{children}</>; }',
    [`${marketingBase}/_components/MarketingNav.tsx`]:
      'export function MarketingNav() { return <header className="marketing-nav"><div className="marketing-nav__inner" /></header>; }',
    [`${marketingBase}/_components/MarketingScanlineLedger.tsx`]:
      'export function MarketingScanlineLedger() { return <div className="marketing-scanline-ledger"><div className="marketing-scanline-ledger__track" /></div>; }',
    [`${marketingBase}/_components/MarketingTruthInstrumentProvider.tsx`]:
      'export function MarketingTruthInstrumentProvider({ children }: { children: React.ReactNode }) { return <>{children}</>; }',
    [`${marketingBase}/_components/MarketingTruthLadder.tsx`]:
      'export function MarketingTruthLadder() { return <aside className="marketing-truth-ladder"><div className="marketing-truth-ladder__module" /></aside>; }',
    [`${marketingBase}/_components/landing-primitives.tsx`]:
      'export function Primitives() { return <section className="marketing-section"><div className="marketing-section__inner marketing-section__header marketing-section__title marketing-section__copy marketing-panel marketing-panel__header marketing-status-pill marketing-meta-label" /></section>; }',
    [`${marketingBase}/_components/MarketingIntroDiagram.tsx`]:
      'export function MarketingIntroDiagram() { return <div className="marketing-intro__stage"><div className="marketing-intro__truth-card" /></div>; }',
    [`${marketingBase}/_components/MarketingPreLanding.tsx`]:
      'export function MarketingPreLanding() { return <div className="marketing-pre-landing" />; }',
    [`${marketingBase}/_content/truth-instrument.ts`]: 'export const marketingTruthMilestones = [];',
    [`${marketingBase}/_sections/HeroSection.tsx`]:
      'export function HeroSection() { return <section className="marketing-hero"><div className="marketing-hero__composition" /></section>; }',
    [`${marketingBase}/_sections/MarketingFooter.tsx`]:
      'export function MarketingFooter() { return <footer className="marketing-footer"><div className="marketing-footer__inner" /></footer>; }',
  };

  for (const [relativePath, contents] of Object.entries(baseFiles)) {
    writeFixtureFile(rootDir, relativePath, contents);
  }

  for (const [relativePath, contents] of Object.entries(files)) {
    writeFixtureFile(rootDir, relativePath, contents);
  }

  for (const relativePath of removeFiles) {
    unlinkSync(path.join(rootDir, relativePath));
  }

  return {
    rootDir,
    dispose: () => rmSync(rootDir, { recursive: true, force: true }),
  };
}

describe('verify landing design system', () => {
  it('ignores comments and extracts static class strings from cn, clsx, and cva calls', () => {
    const source = `
      import { cn } from '@/shared/lib/utils';
      const base = 'marketing-nav marketing-nav__inner';
      const button = cva('marketing-panel', { variants: { tone: { strong: 'marketing-status-pill' } } });
      // marketing-footer should not count from comments
      export function Example() {
        return <div className={cn(base, clsx('marketing-section__inner'))} />;
      }
    `;

    const inventory = analyzeTsxClassInventory(source, 'Example.tsx');

    expect(inventory.tokens).toContain('marketing-nav');
    expect(inventory.tokens).toContain('marketing-nav__inner');
    expect(inventory.tokens).toContain('marketing-panel');
    expect(inventory.tokens).toContain('marketing-status-pill');
    expect(inventory.tokens).toContain('marketing-section__inner');
    expect(inventory.tokens).not.toContain('marketing-footer');
  });

  it('fails dynamic structural landing classes', () => {
    const source = `
      export function Example({ variant }: { variant: string }) {
        return <div className={\`marketing-\${variant}\`} />;
      }
    `;

    const inventory = analyzeTsxClassInventory(source, 'Example.tsx');

    expect(inventory.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          verdict: 'FAIL',
          rule: 'dynamic-structural-class',
        }),
      ]),
    );
  });

  it('warns for dynamic cosmetic classes', () => {
    const source = `
      export function Example({ size }: { size: string }) {
        return <div className={\`mt-\${size}\`} />;
      }
    `;

    const inventory = analyzeTsxClassInventory(source, 'Example.tsx');

    expect(inventory.findings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          verdict: 'WARN',
          rule: 'dynamic-cosmetic-class',
        }),
      ]),
    );
  });

  it('passes the real landing design-system contract', () => {
    const report = verifyLandingDesignSystem();

    expect(report.status).not.toBe('FAIL');
    expect(report.layers['Foundation Truth']).toBe('PASS');
    expect(report.layers['Selector Truth']).toBe('PASS');
    expect(report.layers['Component Adoption Truth']).toBe('PASS');
    expect(report.layers['Surface Ownership Truth']).toBe('PASS');
  });

  it('fails committed marketing runtime html artifacts', () => {
    const fixture = createLandingFixture({
      files: {
        'src/app/[locale]/(marketing)/_assets/hero-afenda-v11.html': '<header>artifact</header>',
      },
    });

    try {
      const report = verifyLandingDesignSystem({ rootDir: fixture.rootDir });

      expect(report.status).toBe('FAIL');
      expect(report.findings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            rule: 'no-runtime-html-artifacts',
            file: path.join('src/app/[locale]/(marketing)/_assets/hero-afenda-v11.html'),
          }),
        ]),
      );
    } finally {
      fixture.dispose();
    }
  });

  it('fails raw html injection and runtime artifact loaders in marketing code', () => {
    const fixture = createLandingFixture({
      files: {
        'src/app/[locale]/(marketing)/_sections/HeroSection.tsx': `
          import { readFileSync } from 'node:fs';
          export function HeroSection() {
            readFileSync('hero-afenda-v11.html');
            return <section className="marketing-hero"><div className="marketing-hero__composition" dangerouslySetInnerHTML={{ __html: '<p />' }} /></section>;
          }
        `,
      },
    });

    try {
      const report = verifyLandingDesignSystem({ rootDir: fixture.rootDir });

      expect(report.status).toBe('FAIL');
      expect(report.findings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ rule: 'no-dangerous-html-injection' }),
          expect.objectContaining({ rule: 'no-runtime-fs-html-loader' }),
          expect.objectContaining({ rule: 'no-v2-or-hero-artifact-symbols' }),
        ]),
      );
    } finally {
      fixture.dispose();
    }
  });

  it('fails global landing css leakage', () => {
    const fixture = createLandingFixture({
      cssAppend: '\nh1 { font-size: 1rem; }\nbody .marketing-root { overflow-x: hidden; }\n',
    });

    try {
      const report = verifyLandingDesignSystem({ rootDir: fixture.rootDir });

      expect(report.status).toBe('FAIL');
      expect(report.findings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            rule: 'no-global-selector-in-landing-css',
            message: expect.stringContaining('h1'),
          }),
          expect.objectContaining({
            rule: 'no-global-selector-in-landing-css',
            message: expect.stringContaining('body .marketing-root'),
          }),
        ]),
      );
    } finally {
      fixture.dispose();
    }
  });

  it('fails when canonical landing primitives are missing', () => {
    const fixture = createLandingFixture({
      removeFiles: ['src/app/[locale]/(marketing)/_components/landing-primitives.tsx'],
    });

    try {
      const report = verifyLandingDesignSystem({ rootDir: fixture.rootDir });

      expect(report.status).toBe('FAIL');
      expect(report.findings).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            rule: 'missing-required-file',
            file: path.join('src/app/[locale]/(marketing)/_components/landing-primitives.tsx'),
          }),
        ]),
      );
    } finally {
      fixture.dispose();
    }
  });
});
