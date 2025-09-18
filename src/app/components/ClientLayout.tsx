'use client';

import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';
import MainNavigation from './MainNavigation';
import StudentNavigation from '../../components/student/StudentNavigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isOnStudentSubdomain, setIsOnStudentSubdomain] = useState(false);
  const { isStudent, isLoading: authLoading } = useAuth();

  useEffect(() => {
    setIsClient(true);
    const hostname = window.location.hostname;
    const isStudentDomain = hostname.startsWith('students.') || hostname === 'students.localhost';
    setIsOnStudentSubdomain(isStudentDomain);


  }, []);

  const isDashboard = pathname?.startsWith('/dashboard');
  const isStudentDashboard = pathname?.startsWith('/student-dashboard');
  const isStudentPortal = pathname?.startsWith('/student');
  const isStudentLogin = pathname === '/auth/student-login';
  const isLearnerDashboard = pathname?.startsWith('/learner-dashboard');



  // During SSR or before client hydration, render children only to avoid hydration mismatch
  if (!isClient || authLoading) {
    return <>{children}</>;
  }

  // Pages that should never show any navigation (completely standalone)
  const noNavigationPages = [isStudentLogin];
  if (noNavigationPages.some(Boolean)) {
    return <>{children}</>;
  }

  // Teacher/Admin dashboard pages - no navigation (they have their own internal nav)
  if (isDashboard) {
    return <>{children}</>;
  }

  // Learner dashboard pages - no main navigation (they have their own learner nav)
  if (isLearnerDashboard) {
    return <>{children}</>;
  }

    // If user is a student, always show student navigation everywhere
  if (isStudent) {
    return (
      <>
        <Suspense fallback={<div className="h-16 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400"></div>}>
          <StudentNavigation />
        </Suspense>
        <main>{children}</main>
      </>
    );
  }

  // For non-students (teachers, admins, visitors), show main navigation
  return (
    <>
      <MainNavigation />
      <main>{children}</main>
    </>
  );
}