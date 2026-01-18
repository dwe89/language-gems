'use client';

import { ReactNode } from 'react';
import { useCapacitor } from './CapacitorProvider';
import { MobileTabBar } from './MobileTabBar';

interface Props {
    children: ReactNode;
    /** Content to hide when in native app mode (e.g., footer, web nav) */
    webOnlyContent?: ReactNode;
}

/**
 * Wrapper component that handles mobile app-specific layout:
 * - Hides web-only content (footer, main nav) in native app
 * - Adds safe area padding for notch/status bar
 * - Shows bottom tab bar in native app
 */
export function MobileAppWrapper({ children, webOnlyContent }: Props) {
    const { isNativeApp, isReady, platform } = useCapacitor();

    // Before detection, render normally
    if (!isReady) {
        return (
            <>
                {children}
                {webOnlyContent}
            </>
        );
    }

    // Web mode - show everything normally
    if (!isNativeApp) {
        return (
            <>
                {children}
                {webOnlyContent}
            </>
        );
    }

    // Native app mode - apply mobile layout
    return (
        <div
            className="mobile-app-container min-h-screen"
            style={{
                // Safe area insets for notch/status bar/home indicator
                paddingTop: 'env(safe-area-inset-top, 0px)',
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)', // 64px for tab bar
                paddingLeft: 'env(safe-area-inset-left, 0px)',
                paddingRight: 'env(safe-area-inset-right, 0px)',
            }}
        >
            {/* Main content */}
            {children}

            {/* Bottom tab bar (native app only) */}
            <MobileTabBar />

            {/* Web-only content is NOT rendered in native mode */}
        </div>
    );
}

/**
 * Component that only renders its children on web, hidden in native app
 */
export function WebOnly({ children }: { children: ReactNode }) {
    const { isNativeApp, isReady } = useCapacitor();

    // Show during SSR/initial load
    if (!isReady) return <>{children}</>;

    // Hide in native app
    if (isNativeApp) return null;

    return <>{children}</>;
}

/**
 * Component that only renders its children in native app, hidden on web
 */
export function NativeOnly({ children }: { children: ReactNode }) {
    const { isNativeApp, isReady } = useCapacitor();

    // Hide during SSR/initial load
    if (!isReady) return null;

    // Show only in native app
    if (!isNativeApp) return null;

    return <>{children}</>;
}

/**
 * Hook to get safe area values for custom layouts
 */
export function useSafeArea() {
    const { isNativeApp, platform } = useCapacitor();

    return {
        isNativeApp,
        platform,
        // CSS variables for safe areas
        styles: isNativeApp ? {
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            paddingLeft: 'env(safe-area-inset-left, 0px)',
            paddingRight: 'env(safe-area-inset-right, 0px)',
        } : {},
        // Extra bottom padding for tab bar
        tabBarHeight: isNativeApp ? 64 : 0,
    };
}
