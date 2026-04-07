/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  compress: false,
  poweredByHeader: false,
  trailingSlash: true,
};

module.exports = nextConfig;
