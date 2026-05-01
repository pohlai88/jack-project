import type { Metadata } from 'next';

import { defaultLocale, locales } from '@/i18n/config';
import { AFENDA_METADATA_IMAGE, AFENDA_METADATA_IMAGE_URL } from '@/shared/components/brand/metadata';

type BuildFooterDocMetadataArgs = {
  locale: string;
  /** Path after locale, e.g. `footer` or `footer/compliance-packet` */
  pathAfterLocale: string;
  title: string;
  description: string;
};

export function buildFooterDocPageMetadata({
  locale,
  pathAfterLocale,
  title,
  description,
}: BuildFooterDocMetadataArgs): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://afenda.com';
  const canonicalUrl = `${siteUrl}/${locale}/${pathAfterLocale}`;

  const languageAlternates = Object.fromEntries(
    locales.map((l) => [l, `${siteUrl}/${l}/${pathAfterLocale}`]),
  ) as Record<string, string>;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languageAlternates,
        'x-default': `${siteUrl}/${defaultLocale}/${pathAfterLocale}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'Afenda',
      locale: locale.replace('-', '_'),
      images: [
        {
          ...AFENDA_METADATA_IMAGE,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [AFENDA_METADATA_IMAGE_URL],
    },
  };
}
