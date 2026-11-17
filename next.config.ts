import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  async redirects() {
    return [
      {
        source: '/style/fusion',
        destination: '/',
        permanent: true,
      },
      {
        source: '/style/fusion/scanner',
        destination: '/scanner',
        permanent: true,
      },
      {
        source: '/style/fusion/card/:token*',
        destination: '/card/:token*',
        permanent: true,
      },
      {
        source: '/style/airbnb/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/style/granola/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
