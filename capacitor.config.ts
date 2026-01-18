import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Capacitor Configuration for Language Gems Mobile App
 * 
 * SWITCH BETWEEN DEVELOPMENT AND PRODUCTION:
 * - Development: Uses localhost:3000 (see changes instantly)
 * - Production: Uses languagegems.com (deploy to Vercel first)
 */

const config: CapacitorConfig = {
    appId: 'com.languagegems.app',
    appName: 'Language Gems',

    // The webDir is only used for local/offline fallback
    webDir: 'public',

    server: {
        // ============================================
        // DEVELOPMENT MODE - See changes instantly
        // ============================================
        // Run `npm run dev` first, then run the app
        //
        // iOS SIMULATOR: Use localhost (simulator runs on Mac)
        // url: 'http://localhost:3000',
        //
        // ANDROID EMULATOR: Use 10.0.2.2 (emulator's loopback to host)
        // url: 'http://10.0.2.2:3000',
        //
        // PHYSICAL DEVICES: Use your Mac's LAN IP (run: ifconfig | grep inet)
        // url: 'http://192.168.1.120:3000',
        //
        cleartext: true, // Required for http (not https)

        // ============================================
        // PRODUCTION MODE - Uncomment when ready
        // ============================================
        // url: 'https://languagegems.com',

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
            launchShowDuration: 0, // Don't auto-hide - JS will call hide()
            launchAutoHide: false, // Keep native splash until JS is ready
            backgroundColor: '#1a1a2e',
            showSpinner: false, // Don't show native spinner - JS handles UI
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
        allowMixedContent: true,
        webContentsDebuggingEnabled: true, // Enable for development
    },
};

export default config;
