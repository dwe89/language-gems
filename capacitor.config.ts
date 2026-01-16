import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor Configuration for Language Gems Mobile App
 * 
 * This configuration uses the "live URL" approach where the app loads your 
 * production website. This means:
 * - No static export required (avoids all the dynamic route issues)
 * - Updates deploy instantly without app store submissions
 * - Full API support works out of the box
 * 
 * For development, uncomment the localhost server config below.
 */

const config: CapacitorConfig = {
    appId: 'com.languagegems.app',
    appName: 'Language Gems',

    // The webDir is only used for local/offline fallback
    // Main content loads from the server URL below
    webDir: 'public', // Fallback directory (contains splash/icons)

    server: {
        // PRODUCTION: Load from your live Vercel deployment
        url: 'https://languagegems.com',

        // DEVELOPMENT: Uncomment below and comment out the production URL
        // url: 'http://localhost:3000',
        // cleartext: true, // Required for http (not https) in development

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
        // Keyboard plugin settings for better mobile experience
        Keyboard: {
            resize: 'body',
            resizeOnFullScreen: true,
        },
        // Status bar styling (matches your dark theme)
        StatusBar: {
            style: 'dark',
            backgroundColor: '#1a1a2e',
        },
        // Splash screen configuration
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#1a1a2e',
            showSpinner: true,
            spinnerColor: '#8b5cf6',
        },
    },

    ios: {
        contentInset: 'automatic',
        preferredContentMode: 'mobile',
        backgroundColor: '#1a1a2e',
        // Handle the notch/safe areas properly
        scrollEnabled: true,
    },

    android: {
        backgroundColor: '#1a1a2e',
        allowMixedContent: true,
        // Set the WebView to use hardware acceleration
        webContentsDebuggingEnabled: false, // Set to true for debugging
    },
};

export default config;
