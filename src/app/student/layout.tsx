'use client';

import { usePathname } from 'next/navigation';
import StudentNavigation from '../../components/student/StudentNavigation';
import StudentHeader from '../../components/student/StudentHeader';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Show full navigation for dashboard pages
  const showNavigation = pathname &&
    !pathname.endsWith('/student') &&
    !pathname.includes('/auth/');

  // Show simple header for pre-login pages (homepage and auth)
  const showHeader = pathname &&
    (pathname.endsWith('/student') || pathname.includes('/auth/'));

  return (
    <div className="student-portal min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {showNavigation && <StudentNavigation />}
      {showHeader && <StudentHeader />}
      <main className={showNavigation ? 'pt-0' : ''}>
        {children}
      </main>
    </div>
  );
}
