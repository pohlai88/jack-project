'use client';

import { Globe, Menu, Moon, Sun, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

export function LandingNavbar({ user, tenantSlugs = [] }: LandingNavbarProps) {
  const locale = useLocale();
  const { changeLocale, isPending } = useChangeLocale();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const tAuth = useTranslations('auth');
  const tLandingNav = useTranslations('landing.nav');
  const tNav = useTranslations('nav');
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useLayoutEffect(() => {
    // Required to prevent hydration mismatch with theme provider.
    setMounted(true);
  }, []);

  const getDashboardUrl = () => {
    if (tenantSlugs.length === 1) {
      return `/t/${tenantSlugs[0]}`;
    }
    if (tenantSlugs.length > 1) {
      return '/select-tenant';
    }
    return '/select-tenant';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <AppLogo href="/" size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-4" aria-label="Main navigation">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/50"
          >
            {tLandingNav('features')}
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/50"
          >
            {tLandingNav('pricing')}
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/50"
          >
            {tLandingNav('docs')}
          </Link>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-xs sm:text-sm"
                aria-label={tLandingNav('selectLanguage')}
                disabled={isPending}
              >
                <Globe className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{locale.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs">{tLandingNav('language')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {locales.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => changeLocale(loc as Locale)}
                  className={locale === loc ? 'bg-primary/10' : ''}
                >
                  {localeNames[loc as Locale]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" aria-label={tLandingNav('toggleTheme')} className="gap-2">
                  {resolvedTheme === 'dark' ? (
                    <Moon className="h-4 w-4" aria-hidden />
                  ) : (
                    <Sun className="h-4 w-4" aria-hidden />
                  )}
                  <span className="hidden sm:inline text-xs">
                    {resolvedTheme === 'dark' ? tLandingNav('themeOptions.dark') : tLandingNav('themeOptions.light')}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">{tLandingNav('theme')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setTheme('light')}
                  className={theme === 'light' ? 'bg-primary/10' : ''}
                >
                  {tLandingNav('themeOptions.light')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-primary/10' : ''}>
                  {tLandingNav('themeOptions.dark')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme('system')}
                  className={theme === 'system' ? 'bg-primary/10' : ''}
                >
                  {tLandingNav('themeOptions.system')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Auth Section */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link href={getDashboardUrl()}>
                <Button size="sm" variant="outline">
                  {tNav('dashboard')}
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarImage src={user.image ?? undefined} alt={user.name ?? 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user.name?.charAt(0).toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden lg:inline">{user.name ?? user.email}</span>
              </div>
              <SignOutButton />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button size="sm">{tAuth('signIn')}</Button>
              </Link>
              <Link href="/book-demo">
                <Button size="sm" variant="outline">
                  {tLandingNav('bookDemo')}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              aria-label={tLandingNav('toggleMenu')}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-card/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              href="#features"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {tLandingNav('features')}
            </Link>
            <Link
              href="#pricing"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {tLandingNav('pricing')}
            </Link>
            <Link
              href="/docs"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {tLandingNav('docs')}
            </Link>

            <div className="border-t border-border/40 pt-3 space-y-2">
              {user ? (
                <>
                  <Link href={getDashboardUrl()} onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" variant="outline" className="w-full">
                      {tNav('dashboard')}
                    </Button>
                  </Link>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      {tAuth('signIn')}
                    </Button>
                  </Link>
                  <Link href="/book-demo" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" variant="outline" className="w-full">
                      {tLandingNav('bookDemo')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
