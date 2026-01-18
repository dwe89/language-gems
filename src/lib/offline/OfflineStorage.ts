/**
 * OfflineStorage - Manages local caching of data for offline usage
 */

const STORAGE_KEYS = {
    USER_PROFILE: 'lg_offline_profile',
    VOCABULARY: 'lg_offline_vocab',
    GAME_PROGRESS: 'lg_offline_progress',
    SETTINGS: 'lg_offline_settings',
};

export const OfflineStorage = {
    /**
     * Save data to local storage
     */
    save(key: keyof typeof STORAGE_KEYS, data: any) {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEYS[key], JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
            }
        } catch (error) {
            console.error('Error saving to offline storage:', error);
        }
    },

    /**
     * Get data from local storage
     */
    get<T>(key: keyof typeof STORAGE_KEYS): T | null {
        try {
            if (typeof window !== 'undefined') {
                const item = localStorage.getItem(STORAGE_KEYS[key]);
                if (item) {
                    const parsed = JSON.parse(item);
                    return parsed.data as T;
                }
            }
        } catch (error) {
            console.error('Error reading from offline storage:', error);
        }
        return null;
    },

    /**
     * Clear specific data
     */
    clear(key: keyof typeof STORAGE_KEYS) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS[key]);
        }
    },

    /**
     * Clear all offline data
     */
    clearAll() {
        if (typeof window !== 'undefined') {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        }
    }
};
