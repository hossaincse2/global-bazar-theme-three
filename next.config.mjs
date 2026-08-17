/** @type {import('next').NextConfig} */

// Safely extract hostname from API URL, fallback to localhost
const getApiHostname = () => {
  try {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      return new URL(process.env.NEXT_PUBLIC_API_BASE_URL).hostname;
    }
  } catch (e) {
    // Invalid URL, use fallback
  }
  return 'localhost';
};

const nextConfig = {
  reactStrictMode: false,
  
  experimental: {
    optimizeCss: true,
  },

  images: {
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: getApiHostname(),
      },
      {
        protocol: 'https',
        hostname: 'admin.karbar.shop',
      },
      {
        protocol: 'https',
        hostname: '*.karbar.shop',
      },
    ],
  },
};

export default nextConfig;
