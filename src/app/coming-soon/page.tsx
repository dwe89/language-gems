'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ComingSoon from '../components/ComingSoon';

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const feature = searchParams.get('feature') || 'This Feature';
  
  const getDescription = (featureName: string) => {
    switch (featureName.toLowerCase()) {
      case 'games':
        return "Interactive language games to make learning fun and engaging! Challenge yourself with vocabulary, grammar, and comprehension activities.";
      case 'custom lessons':
        return "Create and customize your own learning content! Build personalized lessons, upload materials, and track student progress.";
      case 'progress tracking':
        return "Advanced analytics and progress tracking! Monitor your learning journey with detailed reports and achievements.";
      default:
        return "We're working hard to bring you this amazing feature! Stay tuned for updates.";
    }
  };

  return (
    <ComingSoon 
      featureName={feature}
      description={getDescription(feature)}
      backUrl="/"
    />
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    }>
      <ComingSoonContent />
    </Suspense>
  );
} 