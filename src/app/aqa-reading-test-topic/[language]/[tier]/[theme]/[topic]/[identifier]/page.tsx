'use client';

import React from 'react';
import AQATopicReadingAssessment from '../../../../../../../components/assessments/AQATopicReadingAssessment';
import { BookOpen, ArrowLeft, Clock, Target } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AQATopicReadingAssessmentPage() {
  const params = useParams();
  const language = params.language as string;
  const tier = params.tier as string;
  const theme = decodeURIComponent(params.theme as string);
  const topic = decodeURIComponent(params.topic as string);
  const identifier = params.identifier as string;
  
  // Validate parameters
  if (!language || !['es', 'fr', 'de'].includes(language)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Language</h1>
          <p className="text-gray-600 mb-4">Please select a valid language (Spanish, French, or German).</p>
          <Link href="/exam-style-assessment-topic" className="text-blue-600 hover:text-blue-800">
            Back to Topic Assessment Selection
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
          <Link href="/exam-style-assessment-topic" className="text-blue-600 hover:text-blue-800">
            Back to Topic Assessment Selection
          </Link>
        </div>
      </div>
    );
  }

  if (!theme || !topic || !identifier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Assessment Parameters</h1>
          <p className="text-gray-600 mb-4">Missing theme, topic, or assessment identifier.</p>
          <Link href="/exam-style-assessment-topic" className="text-blue-600 hover:text-blue-800">
            Back to Topic Assessment Selection
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
  const timeLimit = difficulty === 'foundation' ? 20 : 25; // Topic assessments are shorter
  const assessmentNumber = identifier.split('-')[1];

  // Get theme display name (remove "Theme X: " prefix)
  const themeDisplayName = theme.includes(': ') ? theme.split(': ')[1] : theme;

  const handleComplete = (results: any) => {
    console.log(`AQA Topic Reading Assessment (${languageInfo.name} ${tier} - ${topic}) completed:`, results);
    alert(`Topic assessment completed! You answered ${results.questionsCompleted} questions in ${Math.floor(results.totalTimeSpent / 60)} minutes and ${results.totalTimeSpent % 60} seconds.`);
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
                href="/exam-style-assessment-topic"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Topic Assessment Selection
              </Link>
              <div className="flex items-center">
                <span className="text-3xl mr-3">{languageInfo.flag}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    AQA Topic Assessment - {difficulty === 'foundation' ? 'Foundation' : 'Higher'} #{assessmentNumber}
                  </h1>
                  <p className="text-gray-600">{languageInfo.name} • {difficulty === 'foundation' ? 'Foundation' : 'Higher'} • {timeLimit} minutes</p>
                  <div className="flex items-center mt-1">
                    <Target className="h-4 w-4 mr-1 text-purple-600" />
                    <span className="text-sm text-purple-700 font-medium">{themeDisplayName}: {topic}</span>
                  </div>
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
        <AQATopicReadingAssessment
          language={language as 'es' | 'fr' | 'de'}
          level="KS4"
          difficulty={difficulty}
          theme={theme}
          topic={topic}
          identifier={identifier}
          onComplete={handleComplete}
          onQuestionComplete={handleQuestionComplete}
        />
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Topic Assessment</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Based on AQA GCSE {languageInfo.name} reading assessment format ({difficulty === 'foundation' ? 'Foundation' : 'Higher'})</p>
                <p>• Focused on: <span className="font-medium text-purple-700">{topic}</span></p>
                <p>• Theme: <span className="font-medium">{themeDisplayName}</span></p>
                <p>• Assessment #{assessmentNumber} with topic-specific content</p>
                <p>• Automatic scoring and detailed feedback</p>
                <p>• {timeLimit}-minute time limit (shorter than full papers)</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Types Included</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>1. Multiple choice (Topic-specific reading)</p>
                <p>2. Open response (Comprehension questions)</p>
                <p>3. Translation ({languageInfo.name} to English)</p>
                <p className="mt-3 text-xs text-gray-500">
                  * Topic assessments contain 10 questions focused specifically on {topic.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`mt-8 p-4 ${difficulty === 'foundation' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'} border rounded-lg`}>
            <h4 className={`font-semibold ${difficulty === 'foundation' ? 'text-blue-900' : 'text-purple-900'} mb-2`}>
              {difficulty === 'foundation' ? 'Foundation Tier' : 'Higher Tier'} Topic Focus
            </h4>
            <p className={`text-sm ${difficulty === 'foundation' ? 'text-blue-800' : 'text-purple-800'}`}>
              {difficulty === 'foundation' 
                ? `This topic assessment focuses specifically on "${topic}" within the ${themeDisplayName} theme. Content is designed to build confidence with targeted practice on this specific area.`
                : `This Higher tier topic assessment includes more complex texts and vocabulary related to "${topic}". Questions require deeper analysis and understanding of nuanced meanings within this specific topic area.`
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
