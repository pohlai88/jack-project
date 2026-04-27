import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { defaultLocale, locales } from '@/i18n/config';
import { resolveLocaleCookie } from '@/i18n/locale-cookie';
import { localizeHref } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { TenantRole } from '@/shared/db/schema/auth';
import { auth } from '@/shared/lib/auth';
import { env } from '@/shared/lib/env';
import {
  buildTenantHostRewritePathname,
  parseTenantSubdomainSlugFromHost,
  pickLocaleFromAcceptLanguage,
} from '@/shared/lib/tenant-subdomain-host';

const handleI18nRouting = createMiddleware(routing);

const { rewrite: rewriteDocsPathToLlmMdx } = rewritePath('/:locale/docs{/*path}', '/llms.mdx/:locale/docs{/*path}');

function getLocaleFromPath(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }

  return routing.defaultLocale;
}

function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) {
      return '/';
    }

    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || '/';
    }
  }

  return pathname;
}

/** Copy `Set-Cookie` from next-intl `next()` onto a `rewrite()` response (Edge-safe). */
function appendSetCookieHeadersFrom(from: NextResponse, to: NextResponse) {
  const getSetCookie = (from.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie;
  if (typeof getSetCookie === 'function') {
    for (const cookie of getSetCookie.call(from.headers)) {
      to.headers.append('Set-Cookie', cookie);
    }
    return;
  }
  from.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      to.headers.append(key, value);
    }
  });
}

export default auth((request) => {
  const hostSlug = parseTenantSubdomainSlugFromHost(request.headers.get('host'), env.TENANT_ROOT_DOMAIN);
  let requestForIntl: NextRequest = request;
  let rewriteTarget: URL | null = null;

  if (hostSlug) {
    const cookieLocale = resolveLocaleCookie(request.headers.get('cookie') ?? undefined);
    const resolvedLocale =
      cookieLocale ?? pickLocaleFromAcceptLanguage(request.headers.get('accept-language'), locales, defaultLocale);
    const pathname = request.nextUrl.pathname || '/';
    const newPathname = buildTenantHostRewritePathname({
      hostSlug,
      pathname,
      locales,
      resolvedLocale,
    });
    if (newPathname !== pathname) {
      rewriteTarget = new URL(newPathname, request.url);
      requestForIntl = new NextRequest(rewriteTarget, { headers: request.headers });
    }
  }

  let response = handleI18nRouting(requestForIntl);
  const location = response.headers.get('location');
  if (location) {
    return response;
  }

  if (rewriteTarget && hostSlug) {
    const rewriteRes = NextResponse.rewrite(rewriteTarget);
    appendSetCookieHeadersFrom(response, rewriteRes);
    response = rewriteRes;
    response.headers.set('x-pathname', stripLocalePrefix(rewriteTarget.pathname));
    response.headers.set('x-tenant-slug', hostSlug);
  }

  const pathnameForExtras = rewriteTarget?.pathname ?? request.nextUrl.pathname;

  if (isMarkdownPreferred(request)) {
    const rewrittenPath = rewriteDocsPathToLlmMdx(pathnameForExtras);
    if (rewrittenPath) {
      const rewriteResponse = NextResponse.rewrite(new URL(rewrittenPath, request.url));
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          rewriteResponse.headers.append(key, value);
        }
      });
      return rewriteResponse;
    }
  }

  const locale = getLocaleFromPath(pathnameForExtras);
  const pathname = stripLocalePrefix(pathnameForExtras);

  // Inject pathname for server components to access current path
  response.headers.set('x-pathname', pathname);

  // Inject tenant slug if in tenant route
  const tenantMatch = pathname.match(/^\/t\/([^/]+)/);
  if (tenantMatch) {
    const tenantSlug = tenantMatch[1];
    response.headers.set('x-tenant-slug', tenantSlug);

    // Skip auth check for tenant login page (handled by the page itself)
    if (pathname === `/t/${tenantSlug}/login`) {
      return response;
    }

    // Check for admin routes: /t/[tenant]/admin/*
    if (pathname.match(/^\/t\/[^/]+\/admin/)) {
      const userRoles = request.auth?.user?.roles as Record<string, TenantRole> | undefined;
      const userRole = userRoles?.[tenantSlug];

      // Fast path: require admin role for admin routes. Real authorization is always by permissions in layout/API (hasPermission); this hint avoids sending unauthenticated users into admin layout.
      if (userRole !== 'admin') {
        // Redirect to tenant dashboard with error
        const url = request.nextUrl.clone();
        url.pathname = localizeHref(locale, `/t/${tenantSlug}`);
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }

      // Inject role header for admin pages
      response.headers.set('x-user-role', userRole);
    }
  }

  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets with file extensions
     */
    '/((?!api|_next/static|_next/image|_vercel|favicon.ico|.*\\..*).*)',
  ],
};
