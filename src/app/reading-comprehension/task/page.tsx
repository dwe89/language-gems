'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReadingComprehensionTask from '../../../components/reading-comprehension/ReadingComprehensionTask';
import { BookOpen } from 'lucide-react';

function ReadingComprehensionTaskContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const language = searchParams.get('language') as 'spanish' | 'french' | 'german' || 'spanish';
  const category = searchParams.get('category') || undefined;
  const subcategory = searchParams.get('subcategory') || undefined;
  const difficulty = searchParams.get('difficulty') as 'foundation' | 'intermediate' | 'higher' || undefined;
  const assignmentMode = searchParams.get('assignmentMode') === 'true';

  const handleComplete = (results: any) => {
    console.log('Reading comprehension task completed:', results);
    
    // If not in assignment mode, redirect to results or main page
    if (!assignmentMode) {
      setTimeout(() => {
        router.push('/reading-comprehension');
      }, 3000);
    }
  };

  return (
    <ReadingComprehensionTask
      language={language}
      category={category}
      subcategory={subcategory}
      difficulty={difficulty}
      assignmentMode={assignmentMode}
      onComplete={handleComplete}
    />
  );
}

export default function ReadingComprehensionTaskPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Loading reading task...</h2>
          <p className="text-gray-500">Preparing content for you</p>
        </div>
      </div>
    }>
      <ReadingComprehensionTaskContent />
    </Suspense>
  );
}
