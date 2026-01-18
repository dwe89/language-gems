'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { PushNotificationService } from '../../lib/notifications/PushNotificationService';

interface CapacitorContextType {
    isNativeApp: boolean;
    platform: 'ios' | 'android' | 'web';
    isReady: boolean;
}

const CapacitorContext = createContext<CapacitorContextType>({
    isNativeApp: false,
    platform: 'web',
    isReady: false,
});

export function useCapacitor() {
    return useContext(CapacitorContext);
}

/**
 * Detects if running inside a Capacitor native app
 * This allows us to conditionally show/hide UI elements
 */
function detectCapacitor(): { isNative: boolean; platform: 'ios' | 'android' | 'web' } {
    if (typeof window === 'undefined') {
        return { isNative: false, platform: 'web' };
    }

    // Check for Capacitor global object
    const capacitor = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string } }).Capacitor;

    if (capacitor?.isNativePlatform?.()) {
        const platform = capacitor.getPlatform?.() || 'web';
        return {
            isNative: true,
            platform: platform as 'ios' | 'android' | 'web',
        };
    }

    // Fallback: Check User Agent for common WebView patterns
    const ua = navigator.userAgent.toLowerCase();

    // Capacitor iOS WebView
    if (ua.includes('capacitor') || ua.includes('ionic')) {
        if (ua.includes('iphone') || ua.includes('ipad')) {
            return { isNative: true, platform: 'ios' };
        }
        if (ua.includes('android')) {
            return { isNative: true, platform: 'android' };
        }
    }

    // Android WebView detection
    if (ua.includes('wv') && ua.includes('android')) {
        return { isNative: true, platform: 'android' };
    }

    // iOS WKWebView detection (standalone mode)
    if ((window.navigator as Navigator & { standalone?: boolean }).standalone === true) {
        return { isNative: true, platform: 'ios' };
    }

    return { isNative: false, platform: 'web' };
}

interface Props {
    children: ReactNode;
}

export function CapacitorProvider({ children }: Props) {
    const [state, setState] = useState<CapacitorContextType>({
        isNativeApp: false,
        platform: 'web',
        isReady: false,
    });

    useEffect(() => {
        const { isNative, platform } = detectCapacitor();

        setState({
            isNativeApp: isNative,
            platform,
            isReady: true,
        });

        // Log for debugging
        if (isNative) {
            console.log(`[Capacitor] Running as native ${platform} app`);
            // NOTE: Push notifications are disabled by default to prevent crashes 
            // on Android when Firebase is not configured.
            // PushNotificationService.init();
        }
    }, []);

    return (
        <CapacitorContext.Provider value={state}>
            {children}
        </CapacitorContext.Provider>
    );
}
