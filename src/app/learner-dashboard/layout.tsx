'use client';

import { usePathname } from 'next/navigation';
import LearnerNavigation from '../../components/learner/LearnerNavigation';

export default function LearnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Show navigation for all learner dashboard pages
  const showNavigation = pathname && pathname.startsWith('/learner-dashboard');

  return (
    <div className="learner-portal min-h-screen bg-gray-50">
      {showNavigation && <LearnerNavigation />}
      <main>
        {children}
      </main>
    </div>
  );
}
