import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  serverRuntimeConfig: {
    chromium: {
      headless: true,
    },
  },
}

export default nextConfig
