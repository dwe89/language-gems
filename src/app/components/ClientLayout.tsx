'use client';

import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import MainNavigation from './MainNavigation';
import StudentNavigation from '../../components/student/StudentNavigation';
import BetaBanner from '../../components/beta/BetaBanner';
import SmartSignupSelector from '../../components/auth/SmartSignupSelector';
import BetaFeedbackWidget from '../../components/ui/BetaFeedbackWidget';
import { useCapacitor, WebOnly } from '../../components/capacitor';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { isStudent, isLoading: authLoading } = useAuth();
  const { isNativeApp } = useCapacitor();

  const isDashboard = pathname?.startsWith('/dashboard');
  const isStudentLogin = pathname === '/auth/student-login';
  const isLearnerDashboard = pathname?.startsWith('/learner-dashboard');
  const isAuthResolved = !authLoading;

  // Hide navigation completely in native app mode
  const shouldHideNavigation =
    isStudentLogin ||
    isDashboard ||
    isLearnerDashboard;

  const shouldShowStudentNav =
    isAuthResolved &&
    isStudent &&
    !shouldHideNavigation;

  const shouldShowMainNav =
    isAuthResolved &&
    !isStudent &&
    !shouldHideNavigation;

  const shouldShowNavSkeleton =
    !isAuthResolved &&
    !shouldHideNavigation;

  return (
    <div
      className="min-h-screen"
    >
      {/* Beta Banner - Web only */}
      <WebOnly>
        <div data-slot="beta-banner">
          <BetaBanner variant="top" onSignupClick={() => setIsSignupModalOpen(true)} />
        </div>
      </WebOnly>

      {/* Student Navigation - Web only */}
      <WebOnly>
        <div data-slot="student-navigation">
          {shouldShowStudentNav ? (
            <Suspense fallback={<div className="h-16 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400"></div>}>
              <StudentNavigation />
            </Suspense>
          ) : null}
        </div>
      </WebOnly>

      {/* Main Navigation - Web only */}
      <WebOnly>
        <div data-slot="main-navigation">
          {shouldShowMainNav ? (
            <MainNavigation />
          ) : shouldShowNavSkeleton ? (
            <div className="h-16 bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700"></div>
          ) : null}
        </div>
      </WebOnly>

      <main className={isNativeApp ? 'pb-20' : ''}>{children}</main>

      {/* Signup Modal & Feedback Widget - Web only */}
      <WebOnly>
        <div data-slot="signup-modal">
          <SmartSignupSelector
            isOpen={isSignupModalOpen}
            onClose={() => setIsSignupModalOpen(false)}
          />
          <BetaFeedbackWidget />
        </div>
      </WebOnly>
    </div>
  );
}