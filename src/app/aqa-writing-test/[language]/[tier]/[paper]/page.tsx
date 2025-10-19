'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, ArrowLeft, PenTool } from 'lucide-react';
import { AQAWritingAssessment } from '../../../../../components/assessments/AQAWritingAssessment';

// Language mapping
const languageMap: Record<string, { name: string; flag: string }> = {
  'es': { name: 'Spanish', flag: '🇪🇸' },
  'fr': { name: 'French', flag: '🇫🇷' },
  'de': { name: 'German', flag: '🇩🇪' }
};

export default function AQAWritingAssessmentPage() {
  const params = useParams();
  const language = params.language as string;
  const tier = params.tier as string;
  const paper = params.paper as string;
  
  // Validate parameters
  if (!language || !['es', 'fr', 'de'].includes(language)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Language</h1>
          <p className="text-gray-600 mb-4">Please select a valid language (Spanish, French, or German).</p>
          <Link href="/assessments/gcse-writing" className="text-blue-600 hover:text-blue-800">
            Back to Assessment Selection
          </Link>
        </div>
      </div>
    );
  }

  if (!tier || !['foundation', 'higher'].includes(tier)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Assessment Tier</h1>
          <p className="text-gray-600 mb-4">Please select either Foundation or Higher tier.</p>
          <Link href="/assessments/gcse-writing" className="text-blue-600 hover:text-blue-800">
            Back to Assessment Selection
          </Link>
        </div>
      </div>
    );
  }

  if (!paper || !paper.startsWith('paper-')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Paper</h1>
          <p className="text-gray-600 mb-4">Please select a valid paper (paper-1, paper-2, etc.).</p>
          <Link href="/assessments/gcse-writing" className="text-blue-600 hover:text-blue-800">
            Back to Assessment Selection
          </Link>
        </div>
      </div>
    );
  }

  const languageInfo = languageMap[language];
  const difficulty = tier as 'foundation' | 'higher';
  const timeLimit = difficulty === 'foundation' ? 60 : 75; // Foundation: 60 min, Higher: 75 min
  const paperNumber = paper.split('-')[1];

  const handleComplete = (results: any) => {
    console.log(`AQA Writing Assessment (${languageInfo.name} ${tier} ${paper}) completed:`, results);
    alert(`Assessment completed! You answered ${results.questionsCompleted} questions in ${Math.floor(results.totalTimeSpent / 60)} minutes and ${results.totalTimeSpent % 60} seconds.`);
  };

  const handleQuestionComplete = (questionId: string, answer: any, timeSpent: number) => {
    console.log(`Question ${questionId} completed:`, answer, `Time: ${timeSpent}s`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/assessments/gcse-writing"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Assessment Selection
              </Link>
              
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-lg mr-4">
                  <PenTool className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    AQA Writing Assessment - Paper {paperNumber}
                  </h1>
                  <p className="text-gray-600">{languageInfo.name} • {difficulty === 'foundation' ? 'Foundation' : 'Higher'} • {timeLimit} minutes</p>
                </div>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">{timeLimit} minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Content */}
      <div className="py-8">
        <AQAWritingAssessment
          language={language as 'es' | 'fr' | 'de'}
          level="KS4"
          difficulty={difficulty}
          identifier={paper}
          onComplete={handleComplete}
          onQuestionComplete={handleQuestionComplete}
        />
      </div>
    </div>
  );
}
