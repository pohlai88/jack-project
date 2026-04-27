import { redirect } from 'next/navigation';

import { defaultLocale } from '@/i18n/config';

/** Legacy unprefixed `/login` → locale-aware sign-in. */
export default function LegacyLoginRedirect() {
  redirect(`/${defaultLocale}/login`);
}
