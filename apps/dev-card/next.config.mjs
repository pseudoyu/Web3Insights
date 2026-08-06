import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'card.dev.web3insight.ai' }],
        destination: 'https://card.web3insight.ai/:path*',
        statusCode: 301,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        // Allow all HTTPS images - users can set any avatar URL
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Optimize barrel file imports for better tree-shaking
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'date-fns',
    ],
  },
  // Add empty turbopack config to satisfy Next.js but we'll use webpack flag
  turbopack: {},
  // Webpack configuration for fallback/build
  webpack: (config, { isServer, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    }

    // Ignore Node.js modules in client bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        worker_threads: false,
        child_process: false,
      }
    }

    // Ignore viem test modules completely
    config.plugins = config.plugins || []
    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource, context) {
          // Ignore test-related modules in viem
          if (context && context.includes('viem')) {
            if (resource.includes('createTestClient') ||
                resource.includes('/test.js') ||
                resource.includes('/test/')) {
              return true
            }
          }
          return false
        },
      })
    )

    return config
  },
}

export default nextConfig
