/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable Turbopack for Windows builds - use SWC instead
  // This fixes memory allocation errors on Windows
  experimental: {
    turbopack: false,
  },
}

export default nextConfig
