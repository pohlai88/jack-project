'use client';

import {
  FileText,
  GitBranch,
  Layers,
  MessageSquare,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Card, CardContent } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/lib/utils';

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  user: User,
  target: Target,
  sparkles: Sparkles,
  trending: TrendingUp,
  message: MessageSquare,
  users: Users,
  search: Search,
  'git-branch': GitBranch,
  'message-square': MessageSquare,
  layers: Layers,
  'file-text': FileText,
  shield: Shield,
};

const FEATURE_ICON_KEYS: Record<string, string> = {
  profile: 'user',
  assistant: 'message',
  knowledgeBase: 'file-text',
  directory: 'users',
  peopleDirectory: 'search',
  orgChart: 'git-branch',
  activityFeed: 'trending',
  webhooks: 'target',
  memberManagement: 'users',
  roles: 'shield',
  auditLogs: 'file-text',
  settings: 'target',
  chat: 'message',
  vectorSearch: 'search',
  githubIntegration: 'git-branch',
  integrationEngine: 'layers',
};

interface TabData {
  id: string;
  color: string;
  activeColor: string;
  featureKeys: string[];
}

const TABS: TabData[] = [
  {
    id: 'users',
    color: 'hsl(155 70% 45%)',
    activeColor: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
    featureKeys: ['profile', 'assistant', 'knowledgeBase', 'directory'],
  },
  {
    id: 'team',
    color: 'hsl(231 88% 66%)',
    activeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
    featureKeys: ['peopleDirectory', 'orgChart', 'activityFeed', 'webhooks'],
  },
  {
    id: 'admin',
    color: 'hsl(270 74% 58%)',
    activeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
    featureKeys: ['memberManagement', 'roles', 'auditLogs', 'settings'],
  },
  {
    id: 'ai',
    color: 'hsl(32 95% 52%)',
    activeColor: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30',
    featureKeys: ['chat', 'vectorSearch', 'githubIntegration', 'integrationEngine'],
  },
];

export function FeatureTabShowcase() {
  const t = useTranslations('landing.featureTabs');
  const [activeTab, setActiveTab] = useState('users');
  const tab = TABS.find((item) => item.id === activeTab) ?? TABS[0];
  const tabFeatures = tab.featureKeys.map((key) => ({
    title: t(`${tab.id}.features.${key}.title`),
    description: t(`${tab.id}.features.${key}.description`),
    iconKey: FEATURE_ICON_KEYS[key],
  }));

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-medium border transition-all duration-200',
              activeTab === item.id
                ? item.activeColor
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
            )}
          >
            {t(`${item.id}.label`)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div key={tab.id} className="grid md:grid-cols-2 gap-8 items-start entrance-fade">
        {/* Left: Description + Feature List */}
        <div>
          <p className="text-lg text-muted-foreground mb-6">{t(`${tab.id}.description`)}</p>
          <div className="space-y-3">
            {tabFeatures.map((feature) => {
              const Icon = FEATURE_ICONS[feature.iconKey] ?? Sparkles;
              return (
                <div key={feature.title} className="flex items-start gap-3 group">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Preview Card */}
        <Card className="shadow-xl border-primary/10 overflow-hidden">
          <div className="h-2 w-full" style={{ background: tab.color }} />
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge className={cn('text-xs', tab.activeColor)}>{t(`${tab.id}.label`)}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {tabFeatures.slice(0, 4).map((feature) => {
                const Icon = FEATURE_ICONS[feature.iconKey] ?? Sparkles;
                return (
                  <div key={feature.title} className="rounded-lg bg-muted/50 p-3 text-center">
                    <Icon className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                    <p className="text-xs font-medium text-foreground">{feature.title}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
