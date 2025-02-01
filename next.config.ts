import { type NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
    ],
  },
  async rewrites() {
    return [
      // Hivemind chatbot
      // The python backend runs on port 3001 locally, and on a vercel
      // edge function for production
      {
        source: '/api/v1/hivemind/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3001/:path*'
            : '/api/app.py',
      },
      // PostHog Analytics proxy to bypass ad blockers
      // make sure the api_host is set to /api/v1/ingest in PostHogProvider
      // or whatever you want to call it
      {
        source: '/api/v1/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/api/v1/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/api/v1/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
