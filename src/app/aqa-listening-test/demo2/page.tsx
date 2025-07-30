'use client';

import React from 'react';
import AQAListeningAssessment from '../../../components/assessments/AQAListeningAssessment';
import { Headphones, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AQAListeningTestPage() {
  const handleComplete = (results: any) => {
    console.log('AQA Listening Assessment completed:', results);
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
                <Headphones className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AQA Listening Assessment Demo</h1>
                  <p className="text-gray-600">Spanish • Foundation • Test Mode</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Content */}
      <div className="py-8">
        <AQAListeningAssessment
          language="es"
          level="KS4"
          difficulty="foundation"
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
                <p>• Based on AQA GCSE Spanish listening assessment format</p>
                <p>• 8 different question types matching AQA specification</p>
                <p>• Authentic Spanish audio content (simulated)</p>
                <p>• Automatic scoring and feedback</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Types Included</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>1. Letter matching (Carlos's week)</p>
                <p>2. Multiple choice (Family celebrations)</p>
                <p>3. Lifestyle grid (Spanish podcast)</p>
                <p>4. Opinion rating (TV chat show)</p>
                <p>5. Open response (Reality TV star)</p>
                <p>6. Activity timing (Phone conversation)</p>
                <p>7. Multi-part questions (University conversation)</p>
                <p>8. Dictation (4 sentences)</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Note for Development</h4>
            <p className="text-sm text-blue-800">
              This is a demonstration of the AQA listening assessment structure. In production, 
              actual Spanish audio files would be provided for each question. The current implementation 
              shows the complete UI/UX flow and question types as specified in the AQA style format.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
