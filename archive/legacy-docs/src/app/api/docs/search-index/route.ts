import { NextResponse } from 'next/server';
import { getLocale } from 'next-intl/server';

import { buildSearchIndex } from '@/features/docs';

export async function GET() {
  const locale = await getLocale();
  const index = buildSearchIndex(locale);
  return NextResponse.json(index, {
    headers: {
      'Cache-Control': 'private, no-store',
      Vary: 'Cookie, Accept-Language',
    },
  });
}
