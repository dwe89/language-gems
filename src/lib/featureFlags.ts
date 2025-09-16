// Feature flags configuration based on environment
// In development: all features work
// In production: Blog, Shop, and Games (DEMO) are enabled, others show "Coming Soon"
// Admin override: specific admin email can access all features even in production

export interface FeatureFlags {
  games: boolean;
  customLessons: boolean;
  progressTracking: boolean;
  blog: boolean;
  shop: boolean;
  auth: boolean;
  assessments: boolean;
  worksheets: boolean;
}

// Check if we're in development environment
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Admin email that can access all features even in production
const ADMIN_EMAIL = 'danieletienne89@gmail.com';

// Helper function to check if current user is admin
export const isAdminUser = (userEmail?: string | null): boolean => {
  return userEmail === ADMIN_EMAIL;
};

// Feature flags based on environment and user role
export const getFeatureFlags = (userEmail?: string | null): FeatureFlags => {
  const isAdmin = isAdminUser(userEmail);
  
  // Admin can access all features regardless of environment
  if (isAdmin) {
    return {
      blog: true,
      shop: true,
      auth: true,
      games: true,
      customLessons: true,
      progressTracking: true,
      assessments: true,
      worksheets: true,
    };
  }
  
  // Non-admin users follow environment-based flags
  return {
    // Always enabled features
    blog: true,
    shop: true,
    auth: true,

    // Development vs Production feature flags
    games: true, // Now enabled in production with DEMO status
    customLessons: isDevelopment,
    progressTracking: isDevelopment,
    assessments: isDevelopment, // Only enable assessments in development for non-admin users
    worksheets: isDevelopment, // Only enable worksheets in development for non-admin users
  };
};

// Default feature flags (for backward compatibility)
export const featureFlags: FeatureFlags = getFeatureFlags();

// Helper functions
export const isFeatureEnabled = (feature: keyof FeatureFlags, userEmail?: string | null): boolean => {
  const flags = getFeatureFlags(userEmail);
  return flags[feature];
};

export const getFeatureStatus = (feature: keyof FeatureFlags, userEmail?: string | null): 'enabled' | 'coming-soon' => {
  return isFeatureEnabled(feature, userEmail) ? 'enabled' : 'coming-soon';
};

// Navigation items with feature flag support
export const getNavigationItems = (isAuthenticated: boolean = false, userEmail?: string | null) => {
  const flags = getFeatureFlags(userEmail);
  
  const baseItems = [
    {
      name: 'Games',
      path: '/games',
      enabled: flags.games,
      comingSoon: !flags.games,
      comingSoonPath: '/coming-soon/games'
    },
    {
      name: 'Worksheets',
      path: '/worksheets',
      enabled: flags.worksheets,
      comingSoon: !flags.worksheets,
      comingSoonPath: '/coming-soon/worksheets'
    },
    {
      name: 'Assessments',
      path: '/assessments',
      enabled: flags.assessments,
      comingSoon: !flags.assessments,
      comingSoonPath: '/coming-soon/assessments'
    },
    {
      name: 'Resources',
      path: '/resources',
      enabled: true,
      comingSoon: false,
      comingSoonPath: null
    },
    {
      name: 'Blog',
      path: '/blog',
      enabled: flags.blog,
      comingSoon: false,
      comingSoonPath: null
    },
    {
      name: 'About',
      path: '/about',
      enabled: true,
      comingSoon: false,
      comingSoonPath: null
    },
  ];

  return baseItems;
}; 