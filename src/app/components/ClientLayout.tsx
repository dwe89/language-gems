'use client';

import { usePathname } from 'next/navigation';
import MainNavigation from './MainNavigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  console.log("ClientLayout rendering");
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isStudentDashboard = pathname?.startsWith('/student-dashboard');
  
  console.log("ClientLayout path check:", { pathname, isDashboard, isStudentDashboard });
  
  // Render without MainNavigation for dashboard and student-dashboard routes
  if (isDashboard || isStudentDashboard) {
    return <>{children}</>;
  }
  
  // Only show MainNavigation for non-dashboard routes
  return (
    <>
      <MainNavigation />
      <main>{children}</main>
    </>
  );
} 