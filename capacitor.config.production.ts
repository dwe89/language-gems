import type { CapacitorConfig } from '@capacitor/cli';

/**
 * PRODUCTION Capacitor Configuration for Language Gems Mobile App
 * 
 * USE THIS CONFIG FOR APP STORE/PLAY STORE SUBMISSIONS:
 * 
 * 1. Rename capacitor.config.ts to capacitor.config.dev.ts
 * 2. Rename this file to capacitor.config.ts
 * 3. Run: npx cap sync
 * 4. Build for production
 */

const config: CapacitorConfig = {
    appId: 'com.languagegems.app',
    appName: 'Language Gems',

    // Production uses the bundled web assets
    webDir: 'out',

    server: {
        // PRODUCTION: Use your live website
        url: 'https://languagegems.com',

        // Allow navigation to external URLs (OAuth, Stripe, etc.)
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
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: '#1a1a2e',
            showSpinner: false, // Production should be fast, no need for spinner
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
        allowMixedContent: false, // SECURITY: Disable mixed content in production
        webContentsDebuggingEnabled: false, // SECURITY: Disable debugging in production
    },
};

export default config;
