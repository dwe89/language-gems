'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ExamStyleAssessmentTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const language = searchParams?.get('language');
    const level = searchParams?.get('level');
    const difficulty = searchParams?.get('difficulty');
    const examBoard = searchParams?.get('examBoard');
    const skill = searchParams?.get('skill');

    // Handle listening assessments
    if (skill === 'listening') {
      let languageCode = 'es'; // default to Spanish

      // Map language names to codes
      switch (language?.toLowerCase()) {
        case 'french':
          languageCode = 'fr';
          break;
        case 'german':
          languageCode = 'de';
          break;
        case 'spanish':
        default:
          languageCode = 'es';
          break;
      }

      // Map difficulty to tier
      const tier = difficulty === 'higher' ? 'higher' : 'foundation';

      // Default to paper-1
      const paper = 'paper-1';

      // Redirect based on exam board
      if (examBoard === 'Edexcel') {
        const redirectUrl = `/edexcel-listening-test/${languageCode}/${tier}/${paper}`;
        console.log('Redirecting to Edexcel:', redirectUrl);
        router.replace(redirectUrl);
      } else {
        // Default to AQA for backward compatibility
        const redirectUrl = `/aqa-listening-test/${languageCode}/${tier}/${paper}`;
        console.log('Redirecting to AQA:', redirectUrl);
        router.replace(redirectUrl);
      }
      return;
    }

    // Handle other skills (reading, writing, speaking) - redirect to main exam page
    const params = new URLSearchParams();
    if (language) params.set('language', language);
    if (level) params.set('level', level);
    if (difficulty) params.set('difficulty', difficulty);
    if (examBoard) params.set('examBoard', examBoard);
    if (skill) params.set('skill', skill);

    router.replace(`/exam-style-assessment?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h2>
        <p className="text-gray-600">
          Taking you to the appropriate assessment page.
        </p>
      </div>
    </div>
  );
}
