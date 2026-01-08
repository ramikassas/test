/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Image optimization for Netlify
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
