'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCapacitor } from './CapacitorProvider';
import { useAuth } from '../auth/AuthProvider';
import { MobileSplashScreen } from './MobileSplashScreen';
import { SplashScreen } from '@capacitor/splash-screen';

interface Props {
    children: ReactNode;
}

/**
 * MobileAuthGate - Central authentication handler for native app
 * 
 * This component wraps the app to:
 * 1. Show a splash screen while checking auth
 * 2. Redirect to login if not authenticated (except on auth pages)
 * 3. Handle session persistence in native app
 * 4. Redirect authenticated users to appropriate home page based on role
 */
export function MobileAuthGate({ children }: Props) {
    const { isNativeApp, isReady: capacitorReady, platform } = useCapacitor();
    const { user, isLoading: authLoading, isTeacher, isStudent, isLearner } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [showSplash, setShowSplash] = useState(true);
    const [hasRedirected, setHasRedirected] = useState(false);

    // Auth-related paths that should be accessible without login
    const isAuthPage = pathname?.startsWith('/auth') ||
        pathname === '/login' ||
        pathname === '/signup' ||
        pathname === '/register';

    // Public pages accessible without login
    const isPublicPage = pathname === '/' ||
        pathname?.startsWith('/blog') ||
        pathname?.startsWith('/grammar') ||
        pathname?.startsWith('/library') ||
        pathname?.startsWith('/resources') ||
        pathname?.startsWith('/terms') ||
        pathname?.startsWith('/privacy') ||
        pathname?.startsWith('/contact');

    // Mobile home pages
    const isMobileHome = pathname === '/mobile-home' ||
        pathname === '/mobile-teacher-home';

    // REMOVED: Eager SplashScreen.hide() to prevent blank screen gap.
    // The native splash will now be hidden by the MobileSplashScreen component
    // once it has successfully mounted and rendered.

    useEffect(() => {
        // Only proceed once both capacitor and auth have loaded
        if (!capacitorReady || authLoading) {
            return;
        }

        // Delay hiding the JS splash to give content time to render
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 500); // Give content time to render underneath

        return () => clearTimeout(timer);
    }, [capacitorReady, authLoading, isNativeApp]);

    // Safety timeout to force hide splash screen if something gets stuck
    useEffect(() => {
        const safetyTimer = setTimeout(async () => {
            setShowSplash(false);
            try {
                await SplashScreen.hide({ fadeOutDuration: 200 });
            } catch (e) {
                // Ignore
            }
        }, 5000); // 5s max splash time
        return () => clearTimeout(safetyTimer);
    }, []);

    useEffect(() => {
        // Handle redirects for native app once auth is resolved
        if (!capacitorReady || authLoading || !isNativeApp || hasRedirected) {
            return;
        }

        // Allow guest access to mobile specific routes and root
        if (!user && (pathname?.startsWith('/mobile-') || pathname === '/')) {
            // Keep them here, no redirect needed
            return;
        }

        // Not logged in and trying to access protected page
        // (Only redirect if NOT on a mobile page, auth page, or public page)
        if (!user && !isAuthPage && !isPublicPage && !pathname?.startsWith('/mobile-')) {
            console.log('[MobileAuthGate] Not logged in, redirecting to login');
            router.push('/auth/login');
            setHasRedirected(true);
            return;
        }

        // Logged in and on the root/main page - redirect to appropriate home
        if (user && (pathname === '/' || pathname === '/landing')) {
            if (isTeacher) {
                console.log('[MobileAuthGate] Teacher detected, redirecting to teacher home');
                router.push('/mobile-teacher-home');
            } else if (isStudent || isLearner) {
                console.log('[MobileAuthGate] Student detected, redirecting to student home');
                router.push('/mobile-home');
            }
            setHasRedirected(true);
            return;
        }

        // Logged in and on auth page - redirect to home
        if (user && isAuthPage) {
            if (isTeacher) {
                router.push('/mobile-teacher-home');
            } else {
                router.push('/mobile-home');
            }
            setHasRedirected(true);
        }
    }, [
        capacitorReady,
        authLoading,
        isNativeApp,
        user,
        pathname,
        isTeacher,
        isStudent,
        isLearner,
        isAuthPage,
        isPublicPage,
        hasRedirected,
        router
    ]);

    // Reset redirect flag when path changes
    useEffect(() => {
        setHasRedirected(false);
    }, [pathname]);

    // Show splash screen while loading in native app
    if (isNativeApp && (showSplash || authLoading)) {
        return <MobileSplashScreen platform={platform} />;
    }

    // Wrap children with a consistent background to prevent white flash
    return (
        <div className="min-h-screen bg-[#1a1a2e]">
            {children}
        </div>
    );
}

export default MobileAuthGate;
