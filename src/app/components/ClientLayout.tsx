'use client';

import { usePathname } from 'next/navigation';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';

// Dynamically import navigations only when needed
const MainNavigation = lazy(() => import('./MainNavigation'));
const StudentNavigation = lazy(() => import('../../components/student/StudentNavigation'));

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

    console.log('ClientLayout - hostname:', hostname);
    console.log('ClientLayout - isStudentDomain:', isStudentDomain);
  }, []);

  const isDashboard = pathname?.startsWith('/dashboard');
  const isStudentDashboard = pathname?.startsWith('/student-dashboard');
  const isStudentPortal = pathname?.startsWith('/student');
  const isStudentLogin = pathname === '/auth/student-login';

  // Debug logging
  console.log('ClientLayout - pathname:', pathname);
  console.log('ClientLayout - isClient:', isClient);
  console.log('ClientLayout - isOnStudentSubdomain:', isOnStudentSubdomain);
  console.log('ClientLayout - isStudent:', isStudent);
  console.log('ClientLayout - authLoading:', authLoading);

  // During SSR or before client hydration, render children only to avoid hydration mismatch
  if (!isClient || authLoading) {
    return <>{children}</>;
  }

  // Pages that should never show any navigation (completely standalone)
  const noNavigationPages = [isStudentLogin];
  if (noNavigationPages.some(Boolean)) {
    console.log('ClientLayout - no navigation page');
    return <>{children}</>;
  }

  // Teacher/Admin dashboard pages - no navigation (they have their own internal nav)
  if (isDashboard) {
    console.log('ClientLayout - teacher dashboard, no navigation');
    return <>{children}</>;
  }

  // If user is a student, always show student navigation everywhere
  if (isStudent) {
    console.log('ClientLayout - showing StudentNavigation for student');

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
  console.log('ClientLayout - showing MainNavigation for non-student');
  return (
    <>
      <Suspense fallback={<div className="h-16 bg-white border-b"></div>}>
        <MainNavigation />
      </Suspense>
      <main>{children}</main>
    </>
  );
}