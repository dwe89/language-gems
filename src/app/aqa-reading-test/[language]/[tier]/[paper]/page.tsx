'use client';

import React from 'react';
import AQAReadingAssessment from '../../../../../components/assessments/AQAReadingAssessment';
import { BookOpen, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AQAReadingAssessmentPage() {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Assessment Tier</h1>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Paper Selection</h1>
          <p className="text-gray-600 mb-4">Please select a valid paper.</p>
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
  const timeLimit = difficulty === 'foundation' ? 45 : 60;
  const paperNumber = paper.split('-')[1];

  const handleComplete = (results: any) => {
    console.log(`AQA Reading Assessment (${languageInfo.name} ${tier} ${paper}) completed:`, results);
    alert(`Assessment completed! You answered ${results.questionsCompleted} questions in ${Math.floor(results.totalTimeSpent / 60)} minutes and ${results.totalTimeSpent % 60} seconds.`);
  };

  const handleQuestionComplete = (questionId: string, answer: any, timeSpent: number) => {
    console.log(`Question ${questionId} completed:`, answer, `Time: ${timeSpent}s`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/exam-style-assessment"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Assessment Selection
              </Link>
              <div className="flex items-center">
                <span className="text-3xl mr-3">{languageInfo.flag}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    AQA Reading Assessment - {difficulty === 'foundation' ? 'Foundation' : 'Higher'} Paper {paperNumber}
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
        <AQAReadingAssessment
          language={language as 'es' | 'fr' | 'de'}
          level="KS4"
          difficulty={difficulty}
          identifier={paper}
          onComplete={handleComplete}
          onQuestionComplete={handleQuestionComplete}
        />
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Assessment</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Based on AQA GCSE {languageInfo.name} reading assessment format ({difficulty === 'foundation' ? 'Foundation' : 'Higher'})</p>
                <p>• Paper {paperNumber} with unique question content</p>
                <p>• Covers all three GCSE themes: People & lifestyle, Popular culture, Communication & world</p>
                <p>• Automatic scoring and detailed feedback</p>
                <p>• {timeLimit}-minute time limit (as per AQA specification)</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Types Included</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>1. Letter matching (Hobbies and interests)</p>
                <p>2. Multiple choice (Travel guide)</p>
                <p>3. Student grid (Weekend activities)</p>
                <p>4. Open response (School life)</p>
                <p>5. Time sequence (Celebrity interview)</p>
                <p>6. Headline matching (News articles)</p>
                <p>7. Sentence completion (Environment)</p>
                <p>8. Multiple choice (Health & lifestyle)</p>
                <p>9. Translation ({languageInfo.name} to English)</p>
              </div>
            </div>
          </div>
          
          <div className={`mt-8 p-4 ${difficulty === 'foundation' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'} border rounded-lg`}>
            <h4 className={`font-semibold ${difficulty === 'foundation' ? 'text-blue-900' : 'text-purple-900'} mb-2`}>
              {difficulty === 'foundation' ? 'Foundation Tier' : 'Higher Tier'} Information
            </h4>
            <p className={`text-sm ${difficulty === 'foundation' ? 'text-blue-800' : 'text-purple-800'}`}>
              {difficulty === 'foundation' 
                ? `This assessment follows the AQA GCSE ${languageInfo.name} Foundation reading paper format. All content is original and covers the three main themes of the GCSE specification.`
                : `This Higher tier assessment includes more complex texts, advanced vocabulary, and requires deeper analysis and inference skills. Questions test understanding of opinions, attitudes, and implicit meanings.`
              }
            </p>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-2">Legal Notice</h4>
            <p className="text-sm text-amber-800">
              This is a practice assessment created by Language Gems. While it follows AQA format and style, 
              it is not an official AQA assessment. All content is original and created for educational purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
