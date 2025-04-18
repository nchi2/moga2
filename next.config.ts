import { NextConfig } from 'next'

const config: NextConfig = {
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
  experimental: {
    taint: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'choon-market.vercel.app',
        pathname: '/**',
      }
    ],
    domains: ['avatars.githubusercontent.com', "localhost", "cloudflare-ipfs.com", "utfs.io", "k.kakaocdn.net", "choon-market.vercel.app"]
  },
  typescript: {
    ignoreBuildErrors: true
  },
};

export default config;