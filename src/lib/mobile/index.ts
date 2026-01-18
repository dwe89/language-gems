/**
 * Mobile Services - Offline-first utilities for the mobile app
 */

// Vocabulary
export {
    loadBundledVocabulary,
    getVocabularyForCategory,
    getRandomVocabulary,
    getCategories,
    getAvailableLanguages,
    clearVocabularyCache,
    getFilteredVocabulary,
    getAvailableCategories,
    getAvailableSubcategories,
    type VocabularyWord,
    type VocabularyCategory,
    type VocabularySubcategory,
    type VocabularyBundle,
    type SupportedLanguage,
} from './VocabularyStore';

// Local Progress
export {
    getGuestProgress,
    saveGuestProgress,
    recordGameSession,
    getProgressStats,
    getRecentSessions,
    getUnsyncedSessions,
    markSessionsSynced,
    clearLocalProgress,
    getProgressForMigration,
    type GuestProgress,
    type LocalGameSession,
} from './LocalProgressService';

// Network Status
export {
    isOnline,
    useNetworkStatus,
    onNetworkChange,
} from './NetworkStatus';
