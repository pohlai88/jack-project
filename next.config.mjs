import { createMDX } from 'fumadocs-mdx/next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude pdf-parse from bundling to avoid issues with worker threads
  serverExternalPackages: ['pdf-parse'],
};

export default withNextIntl(withMDX(nextConfig));
