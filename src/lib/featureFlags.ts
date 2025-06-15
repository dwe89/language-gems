// Feature flags configuration based on environment
// In development: all features work
// In production: only Blog and Shop are enabled, others show "Coming Soon"

export interface FeatureFlags {
  games: boolean;
  customLessons: boolean;
  progressTracking: boolean;
  blog: boolean;
  shop: boolean;
  auth: boolean;
}

// Check if we're in development environment
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Feature flags based on environment
export const featureFlags: FeatureFlags = {
  // Always enabled features
  blog: true,
  shop: true,
  auth: true,
  
  // Development vs Production feature flags
  games: isDevelopment, // Only in development
  customLessons: isDevelopment, // Only in development  
  progressTracking: isDevelopment, // Only in development
};

// Helper functions
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return featureFlags[feature];
};

export const getFeatureStatus = (feature: keyof FeatureFlags): 'enabled' | 'coming-soon' => {
  return featureFlags[feature] ? 'enabled' : 'coming-soon';
};

// Navigation items with feature flag support
export const getNavigationItems = (isAuthenticated: boolean = false) => {
  const baseItems = [
    {
      name: 'Games',
      path: '/games',
      enabled: featureFlags.games,
      comingSoon: !featureFlags.games,
      comingSoonPath: '/coming-soon/games'
    },
    {
      name: 'Custom Lessons',
      path: isAuthenticated ? '/dashboard' : '/themes',
      enabled: featureFlags.customLessons,
      comingSoon: !featureFlags.customLessons,
      comingSoonPath: '/coming-soon/themes'
    },
    {
      name: 'Blog',
      path: '/blog',
      enabled: featureFlags.blog,
      comingSoon: false,
      comingSoonPath: null
    },
    {
      name: 'Shop',
      path: '/shop',
      enabled: featureFlags.shop,
      comingSoon: false,
      comingSoonPath: null
    },
    {
      name: 'Progress Tracking',
      path: isAuthenticated ? '/dashboard/progress' : '/premium',
      enabled: featureFlags.progressTracking,
      comingSoon: !featureFlags.progressTracking,
      comingSoonPath: '/coming-soon/progress'
    }
  ];

  return baseItems;
}; 