'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FourSkillsAssessment from '../../../components/assessments/FourSkillsAssessment';
import { Target } from 'lucide-react';

function FourSkillsAssessmentTestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const language = searchParams.get('language') as 'es' | 'fr' | 'de' || 'es';
  const level = searchParams.get('level') as 'KS3' | 'KS4' || 'KS3';
  const skillsParam = searchParams.get('skills') || 'reading,writing,listening,speaking';
  const skills = skillsParam.split(',') as ('reading' | 'writing' | 'listening' | 'speaking')[];
  const difficulty = searchParams.get('difficulty') as 'foundation' | 'higher' || 'foundation';
  const examBoard = searchParams.get('examBoard') as 'AQA' | 'Edexcel' | 'Eduqas' | 'General' || 'General';
  const category = searchParams.get('category') || undefined;
  const subcategory = searchParams.get('subcategory') || undefined;
  const assignmentMode = searchParams.get('assignmentMode') === 'true';

  const handleComplete = (results: any) => {
    console.log('Four skills assessment completed:', results);
    
    // If not in assignment mode, redirect to results or main page
    if (!assignmentMode) {
      setTimeout(() => {
        router.push('/four-skills-assessment');
      }, 5000);
    }
  };

  return (
    <FourSkillsAssessment
      language={language}
      level={level}
      skills={skills}
      difficulty={difficulty}
      examBoard={examBoard}
      category={category}
      subcategory={subcategory}
      assignmentMode={assignmentMode}
      onComplete={handleComplete}
    />
  );
}

export default function FourSkillsAssessmentTestPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Target className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Loading Assessment...</h2>
          <p className="text-gray-500">Preparing your four skills assessment</p>
        </div>
      </div>
    }>
      <FourSkillsAssessmentTestContent />
    </Suspense>
  );
}
