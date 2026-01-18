/**
 * NetworkStatus - Detect online/offline status
 */

import { useState, useEffect } from 'react';

/**
 * Check if currently online
 */
export function isOnline(): boolean {
    if (typeof window === 'undefined') return true;
    return navigator.onLine;
}

/**
 * React hook for network status
 */
export function useNetworkStatus(): { isOnline: boolean; wasOffline: boolean } {
    const [online, setOnline] = useState(true);
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleOnline = () => {
            console.log('[NetworkStatus] Back online');
            setOnline(true);
        };

        const handleOffline = () => {
            console.log('[NetworkStatus] Gone offline');
            setOnline(false);
            setWasOffline(true);
        };

        // Set initial state
        setOnline(navigator.onLine);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return { isOnline: online, wasOffline };
}

/**
 * Subscribe to network changes
 */
export function onNetworkChange(callback: (online: boolean) => void): () => void {
    if (typeof window === 'undefined') {
        return () => { };
    }

    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
}
