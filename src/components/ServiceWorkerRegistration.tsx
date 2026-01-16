'use client';

import { useEffect } from 'react';

/**
 * Service Worker Registration Component
 * 
 * This component handles:
 * - Registering the service worker for offline support
 * - Detecting online/offline status
 * - Auto-reloading when coming back online
 * 
 * For mobile apps (Capacitor), this ensures:
 * - Offline pages are cached
 * - Users see a friendly offline message instead of browser errors
 * - App feels native even without connection
 */
export function ServiceWorkerRegistration() {
    useEffect(() => {
        // Only register in production or when explicitly enabled
        if (typeof window === 'undefined') return;

        // Check if running in Capacitor (native app)
        const isCapacitor =
            typeof window !== 'undefined' &&
            (window as unknown as { Capacitor?: { isNative?: boolean } }).Capacitor?.isNative;

        // Register service worker
        if ('serviceWorker' in navigator) {
            // Wait until page loads to not block initial render
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/sw.js')
                    .then((registration) => {
                        console.log('[SW] Registered with scope:', registration.scope);

                        // Check for updates periodically
                        setInterval(() => {
                            registration.update();
                        }, 60 * 60 * 1000); // Check every hour
                    })
                    .catch((error) => {
                        console.log('[SW] Registration failed:', error);
                    });
            });
        }

        // Handle online/offline events
        const handleOnline = () => {
            console.log('[Network] Back online');
            // Show a toast notification (if you have a toast system)
            // toast.success('You\'re back online!');
        };

        const handleOffline = () => {
            console.log('[Network] Gone offline');
            // Show a toast notification
            // toast.warning('You\'re offline. Some features may be unavailable.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Log initial state
        if (isCapacitor) {
            console.log('[Capacitor] Running as native app');
        }
        console.log('[Network] Initial state:', navigator.onLine ? 'online' : 'offline');

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // This component doesn't render anything
    return null;
}
