'use client';

import { usePathname } from 'next/navigation';
import { lazy, Suspense, useEffect, useState } from 'react';

// Dynamically import MainNavigation only when needed
const MainNavigation = lazy(() => import('./MainNavigation'));

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isOnStudentSubdomain, setIsOnStudentSubdomain] = useState(false);

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

  // Debug logging
  console.log('ClientLayout - pathname:', pathname);
  console.log('ClientLayout - isClient:', isClient);
  console.log('ClientLayout - isOnStudentSubdomain:', isOnStudentSubdomain);

  // During SSR or before client hydration, render children only to avoid hydration mismatch
  if (!isClient) {
    return <>{children}</>;
  }

  // After client hydration, check conditions and render accordingly
  if (isDashboard || isStudentDashboard || isStudentPortal || isOnStudentSubdomain) {
    console.log('ClientLayout - bypassing MainNavigation');
    return <>{children}</>;
  }

  // Only show MainNavigation for main site routes
  return (
    <>
      <Suspense fallback={<div className="h-16 bg-white border-b"></div>}>
        <MainNavigation />
      </Suspense>
      <main>{children}</main>
    </>
  );
}