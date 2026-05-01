import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Afenda',
    short_name: 'Afenda',
    description:
      'Enterprise workforce intelligence platform for deterministic skills telemetry, governed identity, and operational evidence.',
    start_url: '/',
    display: 'standalone',

    background_color: '#0B0B0F',
    theme_color: '#161619',

    icons: [
      {
        src: '/icons/afenda-icon-192-transparent.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/afenda-icon-512-transparent.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
