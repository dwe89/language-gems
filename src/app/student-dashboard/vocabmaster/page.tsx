'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VocabMasterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to VocabMaster game with default settings
    router.replace('/student-dashboard/games/vocab-master?lang=es&level=KS3&cat=basics_core_language&subcat=greetings_introductions&theme=default');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-white mb-4">Loading VocabMaster...</h1>
        <p className="text-blue-100">Preparing your vocabulary adventure...</p>
      </div>
    </div>
  );
}
