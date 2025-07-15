/** @type {import('next').NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: '.next',
  webpack: (config, { isServer }) => {
    // Exclude source map files from webpack processing
    config.module.rules.push({
      test: /\.js\.map$/,
      use: 'ignore-loader',
    });

    // Add ignore-loader for problematic chrome-aws-lambda files
    config.module.rules.push({
      test: /chrome-aws-lambda.*\.js\.map$/,
      loader: 'ignore-loader',
    });

    // Exclude server-only packages from client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
      
      config.externals = config.externals || [];
      config.externals.push({
        'puppeteer-core': 'puppeteer-core',
        'chrome-aws-lambda': 'chrome-aws-lambda',
      });
    }
    
    return config;
  },
};

module.exports = config; 