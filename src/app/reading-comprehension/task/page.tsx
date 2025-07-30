'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReadingComprehensionEngine from '../../../components/assessments/ReadingComprehensionEngine';
import { BookOpen } from 'lucide-react';

function ReadingComprehensionTaskContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  if (!searchParams) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Loading...</h2>
          <p className="text-gray-500">Preparing reading task</p>
        </div>
      </div>
    );
  }

  const assessmentId = searchParams.get('assessmentId') || undefined;
  const language = (searchParams.get('language') as 'spanish' | 'french' | 'german') || 'spanish';
  const category = searchParams.get('category') || undefined;
  const subcategory = searchParams.get('subcategory') || undefined;
  const difficulty = (searchParams.get('difficulty') as 'foundation' | 'intermediate' | 'higher') || undefined;
  const assignmentMode = searchParams.get('assignmentMode') === 'true';
  const curriculumLevel = searchParams.get('curriculumLevel') || undefined;
  const examBoard = searchParams.get('examBoard') || undefined;
  const themeTopic = searchParams.get('themeTopic') || undefined;

  const handleComplete = (results: any) => {
    console.log('Reading comprehension task completed:', results);
    // Results are now shown in the component itself, no redirect needed
  };

  return (
    <ReadingComprehensionEngine
      assessmentId={assessmentId}
      language={language}
      difficulty={difficulty as 'foundation' | 'higher'}
      theme={examBoard === 'aqa' ? themeTopic?.split('_')[0] : undefined}
      topic={examBoard === 'aqa' ? themeTopic?.split('_')[1] : category}
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
