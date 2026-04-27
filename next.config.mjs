import { createMDX } from 'fumadocs-mdx/next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude pdf-parse from bundling to avoid issues with worker threads
  serverExternalPackages: ['pdf-parse'],
  async rewrites() {
    return [
      {
        source: '/docs.mdx',
        destination: '/llms.mdx/en/docs',
      },
      {
        source: '/:locale/docs.mdx',
        destination: '/llms.mdx/:locale/docs',
      },
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/en/docs/:path*',
      },
      {
        source: '/:locale/docs/:path*.mdx',
        destination: '/llms.mdx/:locale/docs/:path*',
      },
    ];
  },
};

export default withNextIntl(withMDX(nextConfig));
