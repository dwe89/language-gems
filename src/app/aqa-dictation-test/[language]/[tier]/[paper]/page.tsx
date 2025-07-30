'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, PenTool, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { useAuth } from '../../../../../components/auth/AuthProvider';
import AQADictationAssessment from '../../../../../components/assessments/AQADictationAssessment';

// Language mapping
const LANGUAGE_NAMES: Record<string, string> = {
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German'
};

const TIER_NAMES: Record<string, string> = {
  'foundation': 'Foundation',
  'higher': 'Higher'
};

export default function AQADictationTestPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const language = params.language as 'es' | 'fr' | 'de';
  const tier = params.tier as 'foundation' | 'higher';
  const paper = params.paper as string;
  
  const [isStarted, setIsStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Validate parameters
  useEffect(() => {
    if (!['es', 'fr', 'de'].includes(language)) {
      router.replace('/aqa-dictation-test/es/foundation/paper-1');
      return;
    }
    
    if (!['foundation', 'higher'].includes(tier)) {
      router.replace(`/aqa-dictation-test/${language}/foundation/paper-1`);
      return;
    }
  }, [language, tier, router]);

  const handleStartAssessment = () => {
    setShowInstructions(false);
    setIsStarted(true);
  };

  const handleAssessmentComplete = (results: any) => {
    console.log('Dictation assessment completed:', results);
    // Handle completion - could redirect to results page or show summary
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the dictation assessment.</p>
          <Link
            href="/login"
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (isStarted && !showInstructions) {
    return (
      <AQADictationAssessment
        language={language}
        level="KS4"
        difficulty={tier}
        identifier={paper}
        onComplete={handleAssessmentComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center mb-4">
            <Link
              href="/assessments"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Assessments
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AQA Dictation Assessment
            </h1>
            <p className="text-lg text-gray-600">
              {LANGUAGE_NAMES[language]} • {TIER_NAMES[tier]} Tier • {paper.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <PenTool className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Assessment Instructions</h2>
                <p className="text-gray-600">Please read carefully before starting</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">What to Expect</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    You will hear 5 sentences in {LANGUAGE_NAMES[language]}
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    Each sentence will be played with three speed options
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    Type exactly what you hear, including punctuation
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    Time limit: {tier === 'foundation' ? '15' : '20'} minutes
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Audio Controls</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-green-100 p-3 rounded-lg mb-2">
                      <Play className="h-6 w-6 text-green-600 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-green-900">Normal</h4>
                    <p className="text-sm text-green-700">Standard slow speed</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 p-3 rounded-lg mb-2">
                      <Volume2 className="h-6 w-6 text-green-600 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-green-900">Slow</h4>
                    <p className="text-sm text-green-700">Same as normal</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 p-3 rounded-lg mb-2">
                      <VolumeX className="h-6 w-6 text-green-600 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-green-900">Very Slow</h4>
                    <p className="text-sm text-green-700">Word-by-word pace</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-3">Tips for Success</h3>
                <ul className="space-y-2 text-amber-800">
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    Listen to the full sentence first before writing
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    Use the very slow option to catch individual words
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    Pay attention to accents and punctuation marks
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
                    You can replay each sentence multiple times
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleStartAssessment}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                Start Dictation Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
