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
  trailingSlash: false,
  
  // Output file tracing to reduce serverless function size
  outputFileTracingIncludes: {
    // Only include necessary files for HTML generation
    '/api/worksheets/generate-html': [
      './src/app/api/worksheets/generate-html/**/*',
      './src/utils/wordSearchGenerator.ts',
      './node_modules/@blex41/word-search/**/*',
    ],
  },
  outputFileTracingExcludes: {
    // Exclude heavy dependencies not needed for HTML generation
    '/api/worksheets/generate-html': [
      './node_modules/puppeteer/**/*',
      './node_modules/puppeteer-core/**/*',
      './node_modules/@sparticuz/**/*',
      './node_modules/chromium-bidi/**/*',
      './node_modules/sharp/**/*',
      './node_modules/@aws-sdk/**/*',
      './node_modules/@google-cloud/**/*',
    ],
  },
  
  // Increase API route timeout for bulk operations
  experimental: {
    proxyTimeout: 120000, // 2 minutes
  },
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

    // Reduce serverless function bundle size by externalizing heavy dependencies
    if (isServer) {
      // Externalize heavy packages to reduce bundle size
      config.externals = config.externals || [];
      
      // Keep puppeteer external to prevent bundling ~100MB chromium
      if (Array.isArray(config.externals)) {
        config.externals.push({
          'puppeteer': 'commonjs puppeteer',
          'puppeteer-core': 'commonjs puppeteer-core',
          '@sparticuz/chromium': 'commonjs @sparticuz/chromium',
        });
      }
    }

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
      
      // Add chunk loading retry logic to handle 403 errors and stale chunks
      // This helps with Windows PC cache issues and CDN problems
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        if (entries['main.js'] && !entries['main.js'].includes('./scripts/chunk-retry.js')) {
          entries['main.js'].unshift('./scripts/chunk-retry.js');
        }
        return entries;
      };
    }
    
    return config;
  },
};

module.exports = withBundleAnalyzer(config); 

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "language-gems",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
