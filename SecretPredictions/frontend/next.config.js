/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // FHEVM and Zama specific configurations
  webpack: (config, { isServer }) => {
    // Handle WASM files for FHEVM
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    };

    // Handle binary files
    config.module.rules.push({
      test: /\.(wasm|bin)$/,
      type: 'asset/resource',
    });

    if (!isServer) {
      // Browser-specific configurations
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        os: false,
      };
    }

    return config;
  },

  // Environment variables for Vercel
  env: {
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
    NEXT_PUBLIC_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com',
  },

  // Static file handling
  async rewrites() {
    return [
      {
        source: '/fhevm/:path*',
        destination: '/api/fhevm/:path*',
      },
    ];
  },

  // Headers for WASM support
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },

  // Output settings for Vercel
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['via.placeholder.com', 'picsum.photos'],
    unoptimized: true,
  },

  // Experimental features
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;

