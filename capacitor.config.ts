import type { CapacitorConfig } from '@capacitor/cli';

/**
 * INTELLIGENT CAPACITOR CONFIG
 * 
 * This file automatically switches between Dev and Prod based on the 
 * environment variable 'CAP_MODE'.
 */

const IS_PROD = process.env.CAP_MODE === 'prod';

// Physical device IP for LAN dev, or localhost for simulator
const DEV_URL = 'http://192.168.1.120:3000';
const PROD_URL = 'https://www.languagegems.com';

const config: CapacitorConfig = {
    appId: 'com.languagegems.app',
    appName: 'Language Gems',
    webDir: 'public', // Always use public for hybrid remote mode

    server: {
        // Switch URL based on mode
        url: IS_PROD ? PROD_URL : DEV_URL,
        cleartext: !IS_PROD, // Allow insecure http only in dev

        allowNavigation: [
            'languagegems.com',
            '*.languagegems.com',
            '*.supabase.co',
            '*.stripe.com',
            'accounts.google.com',
        ],
    },

    plugins: {
        PushNotifications: {
            presentationOptions: ["badge", "sound", "alert"],
        },
        Keyboard: {
            resize: 'body',
            resizeOnFullScreen: true,
        },
        StatusBar: {
            style: 'dark',
            backgroundColor: '#1a1a2e',
        },
        SplashScreen: {
            launchShowDuration: 0,
            launchAutoHide: false, // Use our JS handover logic
            backgroundColor: '#1a1a2e',
            showSpinner: false,
            androidScaleType: 'CENTER_CROP',
            splashFullScreen: true,
            splashImmersive: true,
        },
    },

    ios: {
        contentInset: 'automatic',
        preferredContentMode: 'mobile',
        backgroundColor: '#1a1a2e',
        scrollEnabled: true,
    },

    android: {
        backgroundColor: '#1a1a2e',
        allowMixedContent: !IS_PROD,
        webContentsDebuggingEnabled: !IS_PROD,
    },
};

export default config;
