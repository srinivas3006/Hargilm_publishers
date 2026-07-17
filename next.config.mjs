/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  // Trigger config reload
}

export default nextConfig
