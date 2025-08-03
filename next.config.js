const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: '.next',
  // Allow student subdomain for development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' 
              ? 'http://students.localhost:3000'
              : 'https://students.languagegems.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // Allow cross-origin requests from student subdomain in development
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['students.localhost'],
  }),
  webpack: (config, { isServer }) => {
    // Exclude source map files from webpack processing
    config.module.rules.push({
      test: /\.js\.map$/,
      use: 'ignore-loader',
    });

    // Keep general .js.map ignore for any future needs

    // Exclude server-only packages from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
      
      // No longer need to externalize puppeteer/chromium
    }
    
    return config;
  },
};

module.exports = withBundleAnalyzer(config); 