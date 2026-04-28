import Link from 'fumadocs-core/link';
import { ArrowRight, BookOpen, Braces, Building2, FileText, GitBranch, Search, Sparkles } from 'lucide-react';

import { cn } from '@/shared/lib/cn';

interface DocsHomeProps {
  locale: string;
}

const audiencePaths = [
  {
    title: 'Start here',
    label: 'Orientation',
    description: 'Understand what Afenda is, how the docs are organized, and where product truth lives.',
    href: '/curated/overview',
    icon: BookOpen,
  },
  {
    title: 'Admin / Operator',
    label: 'Run the system',
    description: 'Operate tenants, members, integrations, settings, roles, and production controls.',
    href: '/generated/workflows/admin.tenant-settings',
    icon: Building2,
  },
  {
    title: 'Developer / API',
    label: 'Build safely',
    description: 'Inspect API surfaces, generated feature evidence, permissions, and troubleshooting contracts.',
    href: '/generated/api/platform.health',
    icon: Braces,
  },
  {
    title: 'AI / LLM',
    label: 'Machine readable',
    description: 'Use Markdown exports and generated docs evidence as fast context for assistants and agents.',
    href: '/generated/api/docs.llms.full',
    icon: Sparkles,
  },
] as const;

const popularGuides = [
  {
    title: 'Documentation evidence generation',
    section: 'Workflow',
    description: 'How Afenda turns governed product truth into Fumadocs pages.',
    href: '/generated/workflows/docs.evidence-generation',
  },
  {
    title: 'Admin member lifecycle',
    section: 'Workflow',
    description: 'Invite, manage, and deactivate members with role-aware operations.',
    href: '/generated/workflows/admin.member-lifecycle',
  },
  {
    title: 'GitHub OAuth connect',
    section: 'Workflow',
    description: 'Connect GitHub integrations without losing tenant or user boundaries.',
    href: '/generated/workflows/github.oauth-connect',
  },
  {
    title: 'Admin settings AI test',
    section: 'API',
    description: 'Validate the AI provider test endpoint and failure surface.',
    href: '/generated/api/admin.settings.ai.test',
  },
] as const;

const recentlyUpdated = [
  {
    label: 'Current',
    title: 'Release rollout evidence',
    href: '/curated/release-notes',
  },
  {
    label: 'Generated',
    title: 'Integration sync readiness',
    href: '/generated/troubleshooting/integration-sync-no-metrics',
  },
  {
    label: 'Generated',
    title: 'Docs generated stale troubleshooting',
    href: '/generated/troubleshooting/docs-generated-stale',
  },
] as const;

function docsHref(locale: string, href: string) {
  return `/${locale}/docs${href}`;
}

export function DocsHome({ locale }: DocsHomeProps) {
  return (
    <div className="not-prose docs-home">
      <section className="docs-home-hero" aria-labelledby="docs-home-title">
        <div className="docs-home-hero__kicker">
          <span>Afenda Docs</span>
          <span>Product truth, readable by humans and agents</span>
        </div>

        <h1 id="docs-home-title" className="docs-home-hero__title">
          Build, operate, and verify Afenda with confidence.
        </h1>

        <p className="docs-home-hero__lede">
          A premium documentation surface for teams that need enterprise clarity, fast navigation, and AI-ready source
          material without dashboard clutter.
        </p>

        <div className="docs-home-hero__actions" aria-label="Primary documentation actions">
          <Link href={docsHref(locale, '/curated/overview')} className="docs-home-button docs-home-button--primary">
            Start here
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href="/llms-full.txt" className="docs-home-button docs-home-button--secondary">
            LLM full export
            <FileText className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="docs-home-section" aria-labelledby="docs-home-paths">
        <div className="docs-home-section__header">
          <p className="docs-home-section__eyebrow">Choose a path</p>
          <h2 id="docs-home-paths">Find the right entry point in seconds.</h2>
        </div>

        <div className="docs-home-path-grid">
          {audiencePaths.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.title} href={docsHref(locale, item.href)} className="docs-home-path-card">
                <div className="docs-home-path-card__topline">
                  <span>{item.label}</span>
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="docs-home-card-link">
                  Open path
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="docs-home-section docs-home-section--split" aria-labelledby="docs-home-popular">
        <div>
          <div className="docs-home-section__header docs-home-section__header--sticky">
            <p className="docs-home-section__eyebrow">Popular guides</p>
            <h2 id="docs-home-popular">High-signal pages for first-time operators.</h2>
            <p>
              These links prioritize practical entry points over a raw file tree. The sidebar still carries the full
              Fumadocs page structure.
            </p>
          </div>
        </div>

        <div className="docs-home-guide-grid">
          {popularGuides.map((item) => (
            <Link key={item.href} href={docsHref(locale, item.href)} className="docs-home-guide-card">
              <span>{item.section}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="docs-home-section docs-home-section--band" aria-labelledby="docs-home-llm">
        <div className="docs-home-llm-copy">
          <p className="docs-home-section__eyebrow">AI-ready documentation</p>
          <h2 id="docs-home-llm">Use the docs as source material.</h2>
          <p>
            Afenda exposes Markdown routes for agents while keeping the visual docs optimized for humans. The same
            source powers both.
          </p>
        </div>

        <div className="docs-home-llm-links" aria-label="LLM documentation exports">
          <Link href="/llms.txt">
            <Search className="size-4" aria-hidden="true" />
            LLM page index
          </Link>
          <Link href="/llms-full.txt">
            <FileText className="size-4" aria-hidden="true" />
            Full Markdown export
          </Link>
          <Link href={docsHref(locale, '/generated/workflows/docs.evidence-generation')}>
            <GitBranch className="size-4" aria-hidden="true" />
            Evidence pipeline
          </Link>
        </div>
      </section>

      <section className="docs-home-section docs-home-section--updates" aria-labelledby="docs-home-updates">
        <div className="docs-home-section__header">
          <p className="docs-home-section__eyebrow">Recently updated</p>
          <h2 id="docs-home-updates">Current pages worth checking.</h2>
        </div>

        <div className="docs-home-update-list">
          {recentlyUpdated.map((item, index) => (
            <Link
              key={item.href}
              href={docsHref(locale, item.href)}
              className={cn('docs-home-update-row', index === 0 && 'docs-home-update-row--first')}
            >
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
