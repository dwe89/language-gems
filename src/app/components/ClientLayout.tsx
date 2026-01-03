'use client';

import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import MainNavigation from './MainNavigation';
import StudentNavigation from '../../components/student/StudentNavigation';
import BetaBanner from '../../components/beta/BetaBanner';
import SmartSignupSelector from '../../components/auth/SmartSignupSelector';
import BetaFeedbackWidget from '../../components/ui/BetaFeedbackWidget';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { isStudent, isLoading: authLoading } = useAuth();

  const isDashboard = pathname?.startsWith('/dashboard');
  const isStudentLogin = pathname === '/auth/student-login';
  const isLearnerDashboard = pathname?.startsWith('/learner-dashboard');
  const isAuthResolved = !authLoading;
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
    <div>
      <div data-slot="beta-banner">
        <BetaBanner variant="top" onSignupClick={() => setIsSignupModalOpen(true)} />
      </div>

      <div data-slot="student-navigation">
        {shouldShowStudentNav ? (
          <Suspense fallback={<div className="h-16 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400"></div>}>
            <StudentNavigation />
          </Suspense>
        ) : null}
      </div>

      <div data-slot="main-navigation">
        {shouldShowMainNav ? (
          <MainNavigation />
        ) : shouldShowNavSkeleton ? (
          <div className="h-16 bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700"></div>
        ) : null}
      </div>

      <main>{children}</main>

      <div data-slot="signup-modal">
        <SmartSignupSelector
          isOpen={isSignupModalOpen}
          onClose={() => setIsSignupModalOpen(false)}
        />
      </div>
      <BetaFeedbackWidget />
    </div>
  );
}