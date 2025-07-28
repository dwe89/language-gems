'use client';

import React, { useState } from 'react';
import GeminiTTSDemo from '../../components/assessments/GeminiTTSDemo';
import { Headphones, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AQAListeningTestPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'foundation' | 'higher'>('foundation');
  const [selectedLanguage, setSelectedLanguage] = useState<'es' | 'fr' | 'de'>('es');
  const [showAssessment, setShowAssessment] = useState(false);

  const handleComplete = (results: any) => {
    console.log('AQA Listening Assessment completed:', results);
    alert(`Assessment completed! You answered ${results.questionsCompleted} questions in ${Math.floor(results.totalTimeSpent / 60)} minutes and ${results.totalTimeSpent % 60} seconds.`);
    setShowAssessment(false);
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
                href="/four-skills-assessment"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Four Skills Assessment
              </Link>
              <div className="flex items-center">
                <Headphones className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    AQA Listening Assessment Demo
                    <Sparkles className="h-6 w-6 text-yellow-500 ml-2" />
                  </h1>
                  <p className="text-gray-600">
                    {selectedLanguage === 'es' ? 'Spanish' : selectedLanguage === 'fr' ? 'French' : 'German'} •
                    {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} •
                    Powered by Google Gemini TTS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Content */}
      <div className="py-8">
        {!showAssessment ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Configure Your Assessment</h2>

              {/* Language Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Language</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
                    { code: 'fr', name: 'French', flag: '🇫🇷' },
                    { code: 'de', name: 'German', flag: '🇩🇪' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code as 'es' | 'fr' | 'de')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedLanguage === lang.code
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{lang.flag}</div>
                      <div className="font-semibold text-gray-900">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Assessment Level</h3>

                {/* This div was the culprit for the syntax error */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setSelectedDifficulty('foundation')}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      selectedDifficulty === 'foundation'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Foundation</h3>
                    <p className="text-sm text-gray-600 mb-3">40 marks total</p>
                    <ul className="text-xs text-gray-500 text-left space-y-1">
                      <li>• Q1: 4 letter-matching questions (4 marks)</li>
                      <li>• Q2: 4 multiple choice questions (4 marks)</li>
                      <li>• Q3: 2 lifestyle grid questions (4 marks)</li>
                      <li>• Q4: 4 opinion rating questions (4 marks)</li>
                      <li>• Q5: 3 open response questions (6 marks)</li>
                      <li>• Q6: 3 activity timing questions (6 marks)</li>
                      <li>• Q7: 2 multi-part questions (4 marks)</li>
                      <li>• Q8: 4 dictation sentences (8 marks)</li>
                    </ul>
                  </button>

                  <button
                    onClick={() => setSelectedDifficulty('higher')}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      selectedDifficulty === 'higher'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Higher</h3>
                    <p className="text-sm text-gray-600 mb-3">50 marks total</p>
                    <ul className="text-xs text-gray-500 text-left space-y-1">
                      <li>• Foundation questions (40 marks)</li>
                      <li>• Q9: 3 cultural exchange questions (6 marks)</li>
                      <li>• Q10: 2 environmental discussion questions (4 marks)</li>
                    </ul>
                  </button>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowAssessment(true)}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Start {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)} Assessment
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    ✨ Audio will be generated in real-time using Google Gemini TTS
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <GeminiTTSDemo
            language={selectedLanguage === 'es' ? 'spanish' : selectedLanguage === 'fr' ? 'french' : 'german'}
            onComplete={handleComplete}
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Assessment</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Based on AQA GCSE listening assessment format</p>
                <p>• 8 different question types matching AQA specification</p>
                <p>• Real-time audio generation using Google Gemini TTS</p>
                <p>• Multi-speaker conversations with natural voices</p>
                <p>• Support for Spanish, French, and German</p>
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

          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Powered by Google Gemini TTS
            </h4>
            <p className="text-sm text-green-800">
              This assessment uses Google Gemini 2.5 Pro Preview TTS to generate high-quality,
              multilingual audio in real-time. The system supports 30 different voices and can
              create both single-speaker and multi-speaker conversations for authentic listening practice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}