'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, PenTool, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import DictationAssessment from '../../../../../components/assessments/DictationAssessment';

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

export default function DictationTestPage() {
  const params = useParams();
  const router = useRouter();

  const language = params.language as 'es' | 'fr' | 'de';
  const tier = params.tier as 'foundation' | 'higher';
  const paper = params.paper as string;

  const [isStarted, setIsStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Validate parameters
  useEffect(() => {
    if (!['es', 'fr', 'de'].includes(language)) {
      router.replace('/dictation/es/foundation/paper-1');
      return;
    }

    if (!['foundation', 'higher'].includes(tier)) {
      router.replace(`/dictation/${language}/foundation/paper-1`);
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



  if (isStarted && !showInstructions) {
    return (
      <DictationAssessment
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
              href="/dictation"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dictation
            </Link>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dictation Assessment
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
                    You will hear {tier === 'foundation' ? '4' : '5'} sentences in {LANGUAGE_NAMES[language]}
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold mr-2">•</span>
One sentence will be played at normal speed, then section by section, and finally at normal speed again
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
                <h3 className="text-lg font-semibold text-green-900 mb-3">Audio Playback Sequence</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-green-100 p-3 rounded-lg mb-2">
                      <Play className="h-6 w-6 text-green-600 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-green-900">1. Normal Speed</h4>
                    <p className="text-sm text-green-700">First time at normal pace</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 p-3 rounded-lg mb-2">
                      <Volume2 className="h-6 w-6 text-green-600 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-green-900">2. Word-by-Word</h4>
                    <p className="text-sm text-green-700">Section by section pace</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 p-3 rounded-lg mb-2">
                      <VolumeX className="h-6 w-6 text-green-600 mx-auto" />
                    </div>
                    <h4 className="font-semibold text-green-900">3. Normal Speed</h4>
                    <p className="text-sm text-green-700">Final time at normal pace</p>
                  </div>
                </div>
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