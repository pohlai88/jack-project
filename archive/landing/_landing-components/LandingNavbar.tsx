'use client';

import { Globe, Menu, Moon, Sun, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useLayoutEffect, useState } from 'react';

import { SignOutButton } from '@/features/auth';
import { type Locale, localeNames, locales } from '@/i18n';
import { useChangeLocale } from '@/i18n/client';
import { Link } from '@/i18n/navigation';
import { AppLogo } from '@/shared/components/brand/Logo';
import { Button } from '@/shared/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface LandingNavbarProps {
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
  tenantSlugs?: string[];
}

const navItemKeys = ['system', 'surface', 'domains', 'guarantees', 'docs'] as const;

const navItemHref: Record<(typeof navItemKeys)[number], string> = {
  system: '#system',
  surface: '#surface',
  domains: '#domains',
  guarantees: '#guarantees',
  docs: '/docs',
};

export function LandingNavbar({ user, tenantSlugs = [] }: LandingNavbarProps) {
  const { changeLocale, isPending } = useChangeLocale();
  const { setTheme, resolvedTheme } = useTheme();
  const tAuth = useTranslations('auth');
  const tLandingNav = useTranslations('landing.nav');
  const tNav = useTranslations('nav');

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useLayoutEffect(() => setMounted(true), []);

  const getDashboardUrl = () => {
    if (tenantSlugs.length === 1) return `/t/${tenantSlugs[0]}`;
    return '/select-tenant';
  };

  return (
    <header className="landing-header">
      <div className="landing-header__inner">
        <div className="landing-header__brand">
          <AppLogo href="/" placement="nav" />

          <span className="afenda-motion-state landing-header__status">live system · governed</span>
        </div>

        <nav className="landing-header__nav" aria-label={tLandingNav('primaryNavigation')}>
          {navItemKeys.map((key) => (
            <Link key={key} href={navItemHref[key]} className="landing-header__nav-link">
              {tLandingNav(`items.${key}`)}
            </Link>
          ))}
        </nav>

        <div className="landing-header__actions">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isPending}>
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((loc) => (
                <DropdownMenuItem key={loc} onClick={() => changeLocale(loc as Locale)}>
                  {localeNames[loc as Locale]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link href={getDashboardUrl()}>
                <Button size="sm" variant="outline" className="rounded-none">
                  {tNav('dashboard')}
                </Button>
              </Link>

              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>{user.name?.[0] ?? 'U'}</AvatarFallback>
              </Avatar>

              <SignOutButton />
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button asChild size="sm" variant="outline" className="rounded-none">
                <Link href="/docs">Docs</Link>
              </Button>

              <Button asChild size="sm" className="rounded-none">
                <Link href="/login">{tAuth('signIn')}</Link>
              </Button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="landing-header__mobile-toggle"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="landing-header__mobile-menu md:hidden">
          <nav className="landing-header__mobile-nav">
            {navItemKeys.map((key) => (
              <Link
                key={key}
                href={navItemHref[key]}
                className="landing-header__mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {tLandingNav(`items.${key}`)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
