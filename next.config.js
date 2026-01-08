const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false, // Forcing this to false to speed up builds
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

  // Increase API route timeout for bulk operations
  experimental: {
    proxyTimeout: 120000, // 2 minutes
  },

  // Allow student subdomain for development
  async headers() {
    return [
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
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

  // SEO: Redirect old/incorrect URLs to correct ones
  // Based on Google Search Console soft 404s and 404s
  async redirects() {
    return [
      // === SPANISH GRAMMAR REDIRECTS ===
      { source: '/grammar/spanish/articles/definite', destination: '/grammar/spanish/articles/definite-articles', permanent: true },
      { source: '/grammar/spanish/articles/indefinite', destination: '/grammar/spanish/articles/definite-indefinite', permanent: true },
      { source: '/grammar/spanish/verbs/imperative', destination: '/grammar/spanish/verbs/present-tense', permanent: true }, // No imperative, redirect to present

      // === FRENCH GRAMMAR REDIRECTS ===
      { source: '/grammar/french/verbs/conditional', destination: '/grammar/french/verbs/conditional-tense', permanent: true },
      { source: '/grammar/french/verbs/imperative', destination: '/grammar/french/verbs/imperative-mood', permanent: true },
      { source: '/grammar/french/verbs/subjunctive', destination: '/grammar/french/verbs/subjunctive-mood', permanent: true },
      { source: '/grammar/french/verbs/future', destination: '/grammar/french/verbs/future-tense', permanent: true },
      { source: '/grammar/french/verbs/verbs-infinitive', destination: '/grammar/french/verbs/regular-conjugation', permanent: true },
      { source: '/grammar/french/verbs/auxiliary-verbs', destination: '/grammar/french/verbs/regular-conjugation', permanent: true },
      { source: '/grammar/french/adverbs/time-place', destination: '/grammar/french/adverbs/adverb-time-place', permanent: true },
      { source: '/grammar/french/adverbs/frequency', destination: '/grammar/french/adverbs/adverb-frequency', permanent: true },
      { source: '/grammar/french/adverbs/degree', destination: '/grammar/french/adverbs/adverb-degree', permanent: true },
      { source: '/grammar/french/adverbs/quantifiers', destination: '/grammar/french/adverbs/adverb-quantifiers', permanent: true },
      { source: '/grammar/french/adverbs/comparative', destination: '/grammar/french/adverbs/adverb-comparative', permanent: true },
      { source: '/grammar/french/pronouns/direct-object', destination: '/grammar/french/pronouns/direct-object-pronouns', permanent: true },
      { source: '/grammar/french/pronouns/indirect-object', destination: '/grammar/french/pronouns/indirect-object-pronouns', permanent: true },
      { source: '/grammar/french/pronouns/demonstrative', destination: '/grammar/french/pronouns/demonstrative-pronouns', permanent: true },
      { source: '/grammar/french/pronouns/possessive', destination: '/grammar/french/pronouns/possessive-pronouns', permanent: true },
      { source: '/grammar/french/pronouns/reflexive', destination: '/grammar/french/pronouns/reflexive-pronouns', permanent: true },
      { source: '/grammar/french/pronouns/interrogative', destination: '/grammar/french/pronouns/interrogative-pronouns', permanent: true },
      { source: '/grammar/french/pronouns/indefinite', destination: '/grammar/french/pronouns/indefinite-pronouns', permanent: true },
      { source: '/grammar/french/pronouns/disjunctive', destination: '/grammar/french/pronouns/disjunctive-pronouns', permanent: true },
      { source: '/grammar/french/nouns/gender-rules', destination: '/grammar/french/nouns/gender-number', permanent: true },
      { source: '/grammar/french/numbers/cardinal', destination: '/grammar/french/numbers/fractions', permanent: true },
      { source: '/grammar/french/numbers/dates-time', destination: '/grammar/french/numbers/fractions', permanent: true },
      { source: '/grammar/french/numbers/advanced-time', destination: '/grammar/french/numbers/fractions', permanent: true },

      // === GERMAN GRAMMAR REDIRECTS ===
      { source: '/grammar/german/nouns/gender-rules', destination: '/grammar/german/nouns/gender', permanent: true },
      { source: '/grammar/german/nouns/plural-formation', destination: '/grammar/german/nouns/plurals', permanent: true },
      { source: '/grammar/german/nouns/declension', destination: '/grammar/german/nouns/noun-articles', permanent: true },
      { source: '/grammar/german/nouns/compound-nouns', destination: '/grammar/german/nouns/compound-nouns', permanent: false }, // This exists!
      { source: '/grammar/german/nouns/weak-nouns', destination: '/grammar/german/nouns/noun-articles', permanent: true },
      { source: '/grammar/german/adjectives/adjective-endings', destination: '/grammar/german/adjectives/endings', permanent: true },
      { source: '/grammar/german/adjectives/comparative-superlative', destination: '/grammar/german/adjectives/comparative', permanent: true },

      // === OLD SITE STRUCTURE REDIRECTS ===
      { source: '/learn', destination: '/learners', permanent: true },
      { source: '/learn/:path*', destination: '/learners', permanent: true },
      { source: '/vocabmaster', destination: '/activities', permanent: true },
      { source: '/vocabulary', destination: '/activities', permanent: true },
      { source: '/coming-soon/:path*', destination: '/', permanent: true },
      { source: '/resources', destination: '/library', permanent: true },
      { source: '/resources/blog', destination: '/blog', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/sitemap', destination: '/sitemap.xml', permanent: true },
      { source: '/exercises', destination: '/activities', permanent: true },
      { source: '/themes', destination: '/grammar', permanent: true },
      { source: '/premium', destination: '/pricing', permanent: true },
      { source: '/shop', destination: '/library', permanent: true },

      // === GAMES TO ACTIVITIES REDIRECT (for school network compatibility) ===
      // Note: Static assets in public/games/ should NOT be redirected
      // Only redirect the root /games page
      { source: '/games', destination: '/activities', permanent: true },
      // Redirect specific game pages (not assets with file extensions)
      { source: '/games/vocab-master', destination: '/activities/vocab-master', permanent: true },
      { source: '/games/speed-builder', destination: '/activities/speed-builder', permanent: true },
      { source: '/games/word-blast', destination: '/activities/word-blast', permanent: true },
      { source: '/games/word-towers', destination: '/activities/word-towers', permanent: true },
      { source: '/games/sentence-towers', destination: '/activities/sentence-towers', permanent: true },
      { source: '/games/hangman', destination: '/activities/hangman', permanent: true },
      { source: '/games/memory-game', destination: '/activities/memory-game', permanent: true },
      { source: '/games/noughts-and-crosses', destination: '/activities/noughts-and-crosses', permanent: true },
      { source: '/games/conjugation-duel', destination: '/activities/conjugation-duel', permanent: true },
      { source: '/games/word-scramble', destination: '/activities/word-scramble', permanent: true },
      { source: '/games/detective-listening', destination: '/activities/detective-listening', permanent: true },
      { source: '/games/case-file-translator', destination: '/activities/case-file-translator', permanent: true },
      { source: '/games/lava-temple-word-restore', destination: '/activities/lava-temple-word-restore', permanent: true },
      { source: '/games/verb-quest', destination: '/activities/verb-quest', permanent: true },
      { source: '/games/vocab-blast', destination: '/activities/vocab-blast', permanent: true },
      
      { source: '/student-dashboard/games', destination: '/student-dashboard/activities', permanent: true },
      { source: '/student-dashboard/games/vocab-master', destination: '/student-dashboard/activities/vocab-master', permanent: true },
      { source: '/student-dashboard/games/speed-builder', destination: '/student-dashboard/activities/speed-builder', permanent: true },
      { source: '/student-dashboard/games/word-blast', destination: '/student-dashboard/activities/word-blast', permanent: true },
      { source: '/student-dashboard/games/word-towers', destination: '/student-dashboard/activities/word-towers', permanent: true },
      { source: '/student-dashboard/games/sentence-towers', destination: '/student-dashboard/activities/sentence-towers', permanent: true },
      { source: '/student-dashboard/games/hangman', destination: '/student-dashboard/activities/hangman', permanent: true },
      { source: '/student-dashboard/games/memory-game', destination: '/student-dashboard/activities/memory-game', permanent: true },
      { source: '/student-dashboard/games/noughts-and-crosses', destination: '/student-dashboard/activities/noughts-and-crosses', permanent: true },
      { source: '/student-dashboard/games/conjugation-duel', destination: '/student-dashboard/activities/conjugation-duel', permanent: true },
      { source: '/student-dashboard/games/word-scramble', destination: '/student-dashboard/activities/word-scramble', permanent: true },
      { source: '/student-dashboard/games/detective-listening', destination: '/student-dashboard/activities/detective-listening', permanent: true },
      { source: '/student-dashboard/games/case-file-translator', destination: '/student-dashboard/activities/case-file-translator', permanent: true },
      { source: '/student-dashboard/games/lava-temple-word-restore', destination: '/student-dashboard/activities/lava-temple-word-restore', permanent: true },
      { source: '/student-dashboard/games/verb-quest', destination: '/student-dashboard/activities/verb-quest', permanent: true },
      { source: '/student-dashboard/games/vocab-blast', destination: '/student-dashboard/activities/vocab-blast', permanent: true },
    ];
  },

  // Allow cross-origin requests from student subdomain in development
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: ['students.localhost'],
  }),

  // Optimize webpack for large template strings and Edge Runtime
  webpack: (config, { isServer }) => {
    // Disable serialization caching for large strings
    if (config.cache && config.cache.type === 'filesystem') {
      config.cache.compression = 'gzip'; // Compress cache to reduce size
      config.cache.maxAge = 1000 * 60 * 60 * 24 * 7; // 1 week cache
    }

    // Optimize module concatenation for API routes
    if (isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
      };
    }

    // Exclude source map files from webpack processing
    config.module.rules.push({
      test: /\.js\.map$/,
      use: 'ignore-loader',
    });

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

// The Sentry configuration has been disabled to speed up the build process.
// If you need to debug production errors with Sentry, you can re-enable it.
//
// const { withSentryConfig } = require("@sentry/nextjs");
//
// module.exports = withSentryConfig(
//   module.exports,
//   {
//     // For all available options, see:
//     // https://www.npmjs.com/package/@sentry/webpack-plugin#options
//
//     org: "language-gems",
//     project: "javascript-nextjs",
//
//     // Only print logs for uploading source maps in CI
//     silent: !process.env.CI,
//
//     // Disable telemetry to speed up builds
//     telemetry: false,
//
//     // For all available options, see:
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
//
//     // Upload a larger set of source maps for prettier stack traces (increases build time)
//     widenClientFileUpload: true,
//
//     // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
//     // This can increase your server load as well as your hosting bill.
//     // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
//     // side errors will fail.
//     tunnelRoute: "/monitoring",
//
//     // Automatically tree-shake Sentry logger statements to reduce bundle size
//     disableLogger: true,
//
//     // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
//     // See the following for more information:
//     // https://docs.sentry.io/product/crons/
//     // https://vercel.com/docs/cron-jobs
//     automaticVercelMonitors: true,
//   }
// );
