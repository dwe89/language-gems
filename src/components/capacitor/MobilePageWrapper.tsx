'use client';

import React, { ReactNode } from 'react';
import { useCapacitor } from './CapacitorProvider';
import { MobileHeader } from './MobileHeader';

interface Props {
    children: ReactNode;
    title?: string;
    showBackButton?: boolean;
    showHeader?: boolean;
    headerRight?: ReactNode;
    safeAreaTop?: boolean;
    safeAreaBottom?: boolean;
    className?: string;
}

export function MobilePageWrapper({
    children,
    title,
    showBackButton = false,
    showHeader = true,
    headerRight,
    safeAreaTop = true,
    safeAreaBottom = true,
    className = '',
}: Props) {
    const { isNativeApp } = useCapacitor();

    if (!isNativeApp) {
        return <>{children}</>;
    }

    const paddingTopStyle = showHeader
        ? 'calc(3.5rem + env(safe-area-inset-top, 20px))'
        : safeAreaTop ? 'env(safe-area-inset-top, 20px)' : '0px';

    return (
        <div
            className={`min-h-screen bg-gradient-to-b from-[#2c2c54] to-[#1a1a2e] ${className}`}
            style={{
                paddingTop: paddingTopStyle,
                paddingBottom: safeAreaBottom ? 'calc(env(safe-area-inset-bottom, 20px) + 80px)' : 0,
            }}
        >
            {showHeader && (
                <MobileHeader
                    title={title}
                    showBackButton={showBackButton}
                    rightContent={headerRight}
                />
            )}

            <div className="animate-in fade-in duration-300">
                {children}
            </div>
        </div>
    );
}
