'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCapacitor } from './CapacitorProvider';

interface MobileHeaderProps {
    title?: string;
    showBackButton?: boolean;
    rightContent?: React.ReactNode;
    onBack?: () => void;
    className?: string;
}

export function MobileHeader({
    title,
    showBackButton = false,
    rightContent,
    onBack,
    className = '',
}: MobileHeaderProps) {
    const router = useRouter();
    const { platform } = useCapacitor();
    const isIOS = platform === 'ios';

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <header
            className={`
                fixed top-0 left-0 right-0 z-[40]
                flex items-center justify-between
                px-4 h-14
                bg-[#1a1a2e]/80 backdrop-blur-md
                border-b border-white/5
                transition-all duration-200
                ${className}
            `}
            style={{
                paddingTop: 'env(safe-area-inset-top, 20px)',
                height: 'calc(3.5rem + env(safe-area-inset-top, 20px))',
            }}
        >
            <div className="flex items-center min-w-[40px]">
                {showBackButton && (
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                )}
            </div>

            <div className="flex-1 flex justify-center">
                {title && (
                    <h1 className={`
                        text-white font-semibold truncate max-w-[200px]
                        ${isIOS ? 'text-lg' : 'text-xl'}
                    `}>
                        {title}
                    </h1>
                )}
            </div>

            <div className="flex items-center justify-end min-w-[40px]">
                {rightContent}
            </div>
        </header>
    );
}
