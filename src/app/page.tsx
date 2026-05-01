import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

/**
 * Root entry.
 * Deterministically routes to locale boundary.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
