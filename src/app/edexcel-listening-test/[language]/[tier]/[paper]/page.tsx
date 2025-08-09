'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Headphones, Clock, FileText } from 'lucide-react';
import EdexcelListeningAssessment from '../../../../../components/assessments/EdexcelListeningAssessment';

export default function EdexcelListeningAssessmentPage() {
  const params = useParams();
  const language = params.language as string;
  const tier = params.tier as string;
  const paper = params.paper as string;

  // State to control visibility of the assessment
  const [assessmentStarted, setAssessmentStarted] = useState(false);

  // Validate parameters
  if (!language || !['es', 'fr', 'de'].includes(language)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Language</h1>
          <p className="text-gray-600 mb-4">Please select a valid language (Spanish, French, or German).</p>
          <Link href="/exam-style-assessment" className="text-blue-600 hover:text-blue-800">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Tier</h1>
          <p className="text-gray-600 mb-4">Please select either Foundation or Higher tier.</p>
          <Link href="/exam-style-assessment" className="text-blue-600 hover:text-blue-800">
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
          <p className="text-gray-600 mb-4">Please select a valid paper (e.g., paper-1, paper-2).</p>
          <Link href="/exam-style-assessment" className="text-blue-600 hover:text-blue-800">
            Back to Assessment Selection
          </Link>
        </div>
      </div>
    );
  }

  // Language mapping
  const languageMap: Record<string, { name: string; flag: string }> = {
    'es': { name: 'Spanish', flag: '🇪🇸' },
    'fr': { name: 'French', flag: '🇫🇷' },
    'de': { name: 'German', flag: '🇩🇪' }
  };

  const languageInfo = languageMap[language];
  const difficulty = tier as 'foundation' | 'higher';
  const timeLimit = difficulty === 'foundation' ? 45 : 60; // Edexcel time limits
  const paperNumber = paper.split('-')[1];

  const handleComplete = (results: any) => {
    console.log(`Edexcel Listening Assessment (${languageInfo.name} ${tier} ${paper}) completed:`, results);
    alert(`Assessment completed! You answered ${results.questionsCompleted || 'all'} questions in ${Math.floor((results.totalTimeSpent || 0) / 60)} minutes and ${(results.totalTimeSpent || 0) % 60} seconds.`);
  };

  const handleQuestionComplete = (questionId: string, answer: any, timeSpent: number) => {
    console.log(`Question ${questionId} completed:`, answer, `Time: ${timeSpent}s`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/exam-style-assessment"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Assessments
              </Link>

              <div className="h-6 w-px bg-gray-300"></div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Headphones className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold text-gray-900">Edexcel Listening</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="text-lg">{languageInfo.flag}</span>
                  <span>{languageInfo.name}</span>
                  <span>•</span>
                  <span className="capitalize">{difficulty}</span>
                  <span>•</span>
                  <span>Paper {paperNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{timeLimit} minutes</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                <span>50 marks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Rendering based on assessmentStarted state */}
      {!assessmentStarted ? (
        // Assessment Instructions
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Edexcel GCSE {languageInfo.name} Listening Assessment
            </h1>

            <div className="text-base text-gray-700 mb-6 space-y-4">
              <p>This assessment consists of two sections: Listening Comprehension and Dictation.</p>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Information:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li><strong>Total Marks:</strong> 50</li>
                  <li><strong>Time Limit:</strong> {timeLimit} minutes</li>
                  <li>All transcripts are played <strong>3 times</strong>.</li>
                  <li>Questions, rubrics, and answers are in <strong>English</strong>.</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Before You Begin:</h4>
              <p className="text-sm text-yellow-800">
                Ensure you have a stable internet connection and your audio is working.
                The timer starts automatically once you begin.
              </p>
            </div>

            <button
              onClick={() => setAssessmentStarted(true)}
              className="mt-6 w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Start Assessment
            </button>
          </div>
        </div>
      ) : (
        // Assessment Component (rendered only when assessmentStarted is true)
        <EdexcelListeningAssessment
          language={language as 'es' | 'fr' | 'de'}
          level="KS4"
          difficulty={difficulty}
          identifier={paper}
          onComplete={handleComplete}
          onQuestionComplete={handleQuestionComplete}
        />
      )}
    </div>
  );
}