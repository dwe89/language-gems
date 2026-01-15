'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TeacherNavigation from '../../components/TeacherNavigation';
import { Crown, Lock, Zap } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

interface DashboardLayoutClientProps {
    children: React.ReactNode;
    hasSubscription: boolean;
    isAdmin: boolean;
}

export default function DashboardLayoutClient({
    children,
    hasSubscription,
    isAdmin,
}: DashboardLayoutClientProps) {
    const router = useRouter();

    // Show upgrade banner for free users
    const UpgradeBanner = () => {
        if (hasSubscription || isAdmin) return null;

        return (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Crown className="h-5 w-5 mr-2" />
                            <span className="text-sm font-medium">
                                You're using the free version of LanguageGems
                            </span>
                        </div>
                        <Link
                            href="/account/upgrade"
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-full text-sm font-medium transition-colors flex items-center"
                        >
                            <Zap className="h-4 w-4 mr-1" />
                            Upgrade Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex, nofollow" />
            </Head>
            <TeacherNavigation>
                <UpgradeBanner />
                {!hasSubscription && !isAdmin && (
                    <div className="bg-slate-100 border-b border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                            <div className="flex items-center text-sm text-slate-600">
                                <Lock className="h-4 w-4 mr-2" />
                                <span>Some features are locked. </span>
                                <Link
                                    href="/account/upgrade"
                                    className="text-purple-600 hover:text-purple-700 font-medium ml-1"
                                >
                                    Upgrade to unlock full access →
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                {children}
            </TeacherNavigation>
        </>
    );
}
