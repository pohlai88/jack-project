import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-safe navigation helpers. Prefer `Link` / `useRouter` from here so URLs stay
 * correct if locale-in-URL is enabled later. With `localePrefix: "never"`, behavior
 * matches `next/link` and `next/navigation` for same-origin links.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
