/**
 * Feature Flags for LanguageGems Beta Launch
 * 
 * This system controls which features are available during different launch phases:
 * - BETA: Games and content ready, dashboards coming soon
 * - FULL: Complete platform with all dashboard features
 */

export type LaunchPhase = 'BETA' | 'FULL';

export interface FeatureFlags {
  // Launch Phase
  launchPhase: LaunchPhase;
  
  // Core Features (Always Available)
  games: boolean;
  assessments: boolean;
  authentication: boolean;
  content: boolean;
  blog: boolean;
  
  // Beta Features (Limited Functionality)
  basicTeacherDashboard: boolean;
  basicStudentDashboard: boolean;
  basicAssignments: boolean;
  
  // Full Launch Features (Coming Soon in Beta)
  advancedAnalytics: boolean;
  assignmentManagement: boolean;
  classManagement: boolean;
  progressTracking: boolean;
  subscriptionSystem: boolean;
  schoolAdminPanel: boolean;
  
  // Beta-Specific Features
  betaFeedbackCollection: boolean;
  comingSoonOverlays: boolean;
  emailCapture: boolean;
  betaMessaging: boolean;
}

// Environment-based configuration
const getEnvironmentConfig = (): Partial<FeatureFlags> => {
  const env = process.env.NODE_ENV;
  const launchPhase = (process.env.NEXT_PUBLIC_LAUNCH_PHASE as LaunchPhase) || 'BETA';
  
  if (launchPhase === 'FULL') {
    return {
      launchPhase: 'FULL',
      advancedAnalytics: true,
      assignmentManagement: true,
      classManagement: true,
      progressTracking: true,
      subscriptionSystem: true,
      schoolAdminPanel: true,
      betaFeedbackCollection: false,
      comingSoonOverlays: false,
      emailCapture: false,
      betaMessaging: false,
    };
  }
  
  // Default BETA configuration
  return {
    launchPhase: 'BETA',
    advancedAnalytics: false,
    assignmentManagement: false,
    classManagement: false,
    progressTracking: false,
    subscriptionSystem: false,
    schoolAdminPanel: false,
    betaFeedbackCollection: true,
    comingSoonOverlays: true,
    emailCapture: true,
    betaMessaging: true,
  };
};

// Default feature flags configuration
const defaultFlags: FeatureFlags = {
  // Launch Phase
  launchPhase: 'BETA',
  
  // Core Features (Always Available)
  games: true,
  assessments: true,
  authentication: true,
  content: true,
  blog: true,
  
  // Beta Features (Limited Functionality)
  basicTeacherDashboard: true,
  basicStudentDashboard: true,
  basicAssignments: true,
  
  // Full Launch Features (Coming Soon in Beta)
  advancedAnalytics: false,
  assignmentManagement: false,
  classManagement: false,
  progressTracking: false,
  subscriptionSystem: false,
  schoolAdminPanel: false,
  
  // Beta-Specific Features
  betaFeedbackCollection: true,
  comingSoonOverlays: true,
  emailCapture: true,
  betaMessaging: true,
  
  // Apply environment overrides
  ...getEnvironmentConfig(),
};

/**
 * Get current feature flags
 */
export const getFeatureFlags = (): FeatureFlags => {
  return defaultFlags;
};

/**
 * Check if a specific feature is enabled
 */
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return getFeatureFlags()[feature] as boolean;
};

/**
 * Check if we're in beta launch phase
 */
export const isBetaLaunch = (): boolean => {
  return getFeatureFlags().launchPhase === 'BETA';
};

/**
 * Check if we're in full launch phase
 */
export const isFullLaunch = (): boolean => {
  return getFeatureFlags().launchPhase === 'FULL';
};

/**
 * Get beta-specific messaging configuration
 */
export const getBetaConfig = () => {
  const flags = getFeatureFlags();
  
  return {
    showBetaMessaging: flags.betaMessaging,
    showComingSoon: flags.comingSoonOverlays,
    collectFeedback: flags.betaFeedbackCollection,
    captureEmails: flags.emailCapture,
    
    // Beta messaging content
    betaBadge: "BETA ACCESS",
    heroTagline: "Shape the Future of Language Learning",
    ctaText: "Get Free Beta Access",
    comingSoonText: "Coming Soon in Full Launch",
    
    // Feature availability messages
    gamesAvailable: "✅ All 11+ Interactive Games Available Now",
    assessmentsAvailable: "✅ Complete Assessment System Ready",
    dashboardComingSoon: "🚀 Advanced Teacher Dashboard Coming Soon",
    analyticsComingSoon: "📊 Comprehensive Analytics Coming Soon",
    
    // Email capture
    emailCaptureHeading: "Be First to Access the Complete Platform",
    emailCaptureSubtext: "Join 500+ educators already signed up for early access",
  };
};

/**
 * Feature flag hook for React components
 */
export const useFeatureFlags = () => {
  const flags = getFeatureFlags();
  const betaConfig = getBetaConfig();
  
  return {
    flags,
    betaConfig,
    isFeatureEnabled,
    isBetaLaunch: isBetaLaunch(),
    isFullLaunch: isFullLaunch(),
  };
};
