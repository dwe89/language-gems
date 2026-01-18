'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useCapacitor } from './CapacitorProvider';

interface Props {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: Props) {
    const { isNativeApp } = useCapacitor();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const isDragging = useRef(false);

    // Only enable on native app
    if (!isNativeApp) {
        return <>{children}</>;
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        if (window.scrollY === 0) {
            startY.current = e.touches[0].clientY;
            isDragging.current = true;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current) return;

        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;

        if (diff > 0 && window.scrollY === 0) {
            // Add resistance
            const distance = Math.min(diff * 0.5, 120);
            setPullDistance(distance);

            // Prevent default scroll if pulling down at top
            if (diff > 10) {
                e.preventDefault?.();
            }
        } else {
            setPullDistance(0);
        }
    };

    const handleTouchEnd = async () => {
        isDragging.current = false;

        if (pullDistance > 60) {
            setIsRefreshing(true);
            setPullDistance(60); // Keep loading indicator visible

            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                setPullDistance(0);
            }
        } else {
            setPullDistance(0);
        }
    };

    return (
        <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative min-h-screen"
        >
            {/* Refresh Indicator */}
            <div
                className="absolute left-0 right-0 flex justify-center items-center pointer-events-none z-10"
                style={{
                    top: 0,
                    height: pullDistance,
                    opacity: pullDistance > 0 ? 1 : 0,
                    transition: isDragging.current ? 'none' : 'all 0.3s ease-out'
                }}
            >
                <div className={`
                    bg-white/10 backdrop-blur-md rounded-full p-2
                    ${isRefreshing ? 'animate-spin' : ''}
                `}>
                    <Loader2
                        className="w-6 h-6 text-purple-400"
                        style={{
                            transform: `rotate(${pullDistance * 2}deg)`
                        }}
                    />
                </div>
            </div>

            {/* Content */}
            <div
                style={{
                    transform: `translateY(${pullDistance}px)`,
                    transition: isDragging.current ? 'none' : 'all 0.3s ease-out'
                }}
            >
                {children}
            </div>
        </div>
    );
}
