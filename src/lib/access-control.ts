// Comprehensive access control system for LanguageGems
// Enforces pricing tier restrictions exactly as specified on /pricing page

export type UserType = 'demo' | 'learner_free' | 'learner_pro' | 'teacher_basic' | 'teacher_standard' | 'teacher_large' | 'admin';

export interface AccessControlConfig {
  // Core Features
  gamesAccess: boolean;
  maxGamesPerDay: number;
  
  // Teacher Features
  individualStudentLogins: boolean;
  customVocabularyLists: boolean;
  homeworkSettingCapability: boolean;
  classManagement: boolean;
  progressTracking: boolean;
  analytics: boolean;
  assignmentCreation: boolean;
  
  // Learner Features
  unlimitedGames: boolean;
  advancedAnalytics: boolean;
  offlineMode: boolean;
  customVocabulary: boolean;
  
  // Content Access
  allLanguages: boolean;
  allCategories: boolean;
  maxVocabularyWords: number;
  
  // Support & Features
  prioritySupport: boolean;
  advancedReporting: boolean;
  
  // Limits
  maxStudents: number;
  maxTeachers: number;
}

// Access control configurations for each user type
const ACCESS_CONFIGS: Record<UserType, AccessControlConfig> = {
  demo: {
    // Core Features - Limited demo access
    gamesAccess: true,
    maxGamesPerDay: 3, // Limited demo games
    
    // Teacher Features - None
    individualStudentLogins: false,
    customVocabularyLists: false,
    homeworkSettingCapability: false,
    classManagement: false,
    progressTracking: false,
    analytics: false,
    assignmentCreation: false,
    
    // Learner Features - Basic only
    unlimitedGames: false,
    advancedAnalytics: false,
    offlineMode: false,
    customVocabulary: false,
    
    // Content Access - Very limited
    allLanguages: false, // Only ES, FR, DE
    allCategories: false, // Only basics_core_language
    maxVocabularyWords: 25,
    
    // Support & Features
    prioritySupport: false,
    advancedReporting: false,
    
    // Limits
    maxStudents: 0,
    maxTeachers: 0,
  },
  
  learner_free: {
    // Core Features
    gamesAccess: true,
    maxGamesPerDay: 5,
    
    // Teacher Features - None
    individualStudentLogins: false,
    customVocabularyLists: false,
    homeworkSettingCapability: false,
    classManagement: false,
    progressTracking: false,
    analytics: false,
    assignmentCreation: false,
    
    // Learner Features - Basic
    unlimitedGames: false,
    advancedAnalytics: false,
    offlineMode: false,
    customVocabulary: false,
    
    // Content Access
    allLanguages: true, // All 3 languages
    allCategories: false, // Limited categories
    maxVocabularyWords: 100,
    
    // Support & Features
    prioritySupport: false,
    advancedReporting: false,
    
    // Limits
    maxStudents: 0,
    maxTeachers: 0,
  },
  
  learner_pro: {
    // Core Features
    gamesAccess: true,
    maxGamesPerDay: -1, // Unlimited
    
    // Teacher Features - None
    individualStudentLogins: false,
    customVocabularyLists: false,
    homeworkSettingCapability: false,
    classManagement: false,
    progressTracking: false,
    analytics: false,
    assignmentCreation: false,
    
    // Learner Features - Full
    unlimitedGames: true,
    advancedAnalytics: true,
    offlineMode: true,
    customVocabulary: true,
    
    // Content Access - Full
    allLanguages: true,
    allCategories: true,
    maxVocabularyWords: -1, // Unlimited
    
    // Support & Features
    prioritySupport: true,
    advancedReporting: false,
    
    // Limits
    maxStudents: 0,
    maxTeachers: 0,
  },
  
  teacher_basic: {
    // Core Features
    gamesAccess: true,
    maxGamesPerDay: -1, // Unlimited for classroom use
    
    // Teacher Features - Basic Plan Restrictions (£399/year)
    individualStudentLogins: false, // NOT INCLUDED
    customVocabularyLists: false,   // NOT INCLUDED
    homeworkSettingCapability: false, // NOT INCLUDED
    classManagement: true, // Basic class management
    progressTracking: false, // No individual tracking
    analytics: false, // No individual analytics
    assignmentCreation: false, // No homework assignments
    
    // Learner Features
    unlimitedGames: true,
    advancedAnalytics: false,
    offlineMode: false,
    customVocabulary: false,
    
    // Content Access - Full for classroom
    allLanguages: true, // French, Spanish, German
    allCategories: true, // All 15+ games
    maxVocabularyWords: -1,
    
    // Support & Features
    prioritySupport: false,
    advancedReporting: false,
    
    // Limits
    maxStudents: -1, // Unlimited for whole-class use
    maxTeachers: -1, // All MFL teachers
  },
  
  teacher_standard: {
    // Core Features
    gamesAccess: true,
    maxGamesPerDay: -1,
    
    // Teacher Features - Standard Plan (£799/year)
    individualStudentLogins: true, // INCLUDED
    customVocabularyLists: true,   // INCLUDED
    homeworkSettingCapability: true, // INCLUDED
    classManagement: true,
    progressTracking: true,
    analytics: true,
    assignmentCreation: true,
    
    // Learner Features
    unlimitedGames: true,
    advancedAnalytics: true,
    offlineMode: false,
    customVocabulary: true,
    
    // Content Access - Full
    allLanguages: true,
    allCategories: true,
    maxVocabularyWords: -1,
    
    // Support & Features
    prioritySupport: false,
    advancedReporting: true,
    
    // Limits
    maxStudents: 750,
    maxTeachers: -1,
  },
  
  teacher_large: {
    // Core Features
    gamesAccess: true,
    maxGamesPerDay: -1,
    
    // Teacher Features - Large School Plan (£1199/year)
    individualStudentLogins: true,
    customVocabularyLists: true,
    homeworkSettingCapability: true,
    classManagement: true,
    progressTracking: true,
    analytics: true,
    assignmentCreation: true,
    
    // Learner Features
    unlimitedGames: true,
    advancedAnalytics: true,
    offlineMode: false,
    customVocabulary: true,
    
    // Content Access - Full
    allLanguages: true,
    allCategories: true,
    maxVocabularyWords: -1,
    
    // Support & Features
    prioritySupport: true,
    advancedReporting: true,
    
    // Limits
    maxStudents: -1, // Unlimited
    maxTeachers: -1,
  },
  
  admin: {
    // Admin gets everything
    gamesAccess: true,
    maxGamesPerDay: -1,
    individualStudentLogins: true,
    customVocabularyLists: true,
    homeworkSettingCapability: true,
    classManagement: true,
    progressTracking: true,
    analytics: true,
    assignmentCreation: true,
    unlimitedGames: true,
    advancedAnalytics: true,
    offlineMode: true,
    customVocabulary: true,
    allLanguages: true,
    allCategories: true,
    maxVocabularyWords: -1,
    prioritySupport: true,
    advancedReporting: true,
    maxStudents: -1,
    maxTeachers: -1,
  }
};

/**
 * Get access configuration for a user type
 */
export const getAccessConfig = (userType: UserType): AccessControlConfig => {
  return ACCESS_CONFIGS[userType];
};

/**
 * Check if user can access a specific feature
 */
export const canAccessFeature = (userType: UserType, feature: keyof AccessControlConfig): boolean => {
  const config = getAccessConfig(userType);
  return config[feature] as boolean;
};

/**
 * Get user's daily game limit
 */
export const getDailyGameLimit = (userType: UserType): number => {
  return getAccessConfig(userType).maxGamesPerDay;
};

/**
 * Check if user has unlimited access to a feature
 */
export const hasUnlimitedAccess = (userType: UserType, feature: keyof AccessControlConfig): boolean => {
  const config = getAccessConfig(userType);
  const value = config[feature];
  return value === -1 || value === true;
};

/**
 * Get upgrade message for restricted features
 */
export const getUpgradeMessage = (userType: UserType, feature: string): string => {
  const messages: Record<UserType, Record<string, string>> = {
    demo: {
      default: "Sign up for a free account to access more features!",
      games: "Create a free account to play more games daily!",
      content: "Sign up to access all languages and vocabulary categories!"
    },
    learner_free: {
      default: "Upgrade to Pro for unlimited access!",
      games: "Upgrade to Pro for unlimited daily games!",
      analytics: "Upgrade to Pro for advanced progress analytics!"
    },
    teacher_basic: {
      individualStudentLogins: "Upgrade to Standard Plan (£799/year) to enable individual student logins and progress tracking.",
      customVocabularyLists: "Upgrade to Standard Plan (£799/year) to create custom vocabulary lists.",
      homeworkSettingCapability: "Upgrade to Standard Plan (£799/year) to set homework assignments with automated marking."
    },
    teacher_standard: {
      prioritySupport: "Upgrade to Large School Plan (£1199/year) for priority support and advanced features."
    },
    teacher_large: {
      default: "You have access to all features!"
    },
    learner_pro: {
      default: "You have access to all learner features!"
    },
    admin: {
      default: "You have admin access to all features!"
    }
  };
  
  return messages[userType]?.[feature] || messages[userType]?.default || "Upgrade for access to this feature.";
};
