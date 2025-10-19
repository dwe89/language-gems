'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PenTool,
  ArrowRight,
  Filter,
  Clock,
  Volume2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface DictationAssessment {
  id: string;
  title: string;
  description?: string;
  level: 'foundation' | 'higher';
  language: string;
  identifier: string;
  version: string;
  total_questions: number;
  time_limit_minutes: number;
  created_at: string;
  updated_at: string;
}

export default function DictationPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'es' | 'fr' | 'de'>('es');
  const [selectedCurriculumLevel, setSelectedCurriculumLevel] = useState<string>('');
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [availableAssessments, setAvailableAssessments] = useState<DictationAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredAssessments, setFilteredAssessments] = useState<DictationAssessment[]>([]);

  // Load available assessments
  useEffect(() => {
    const loadAvailableAssessments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dictation/assessments');

        if (response.ok) {
          const data = await response.json();
          if (data.assessments && data.assessments.length > 0) {
            setAvailableAssessments(data.assessments);
          }
        }
      } catch (err) {
        console.error('Error loading available assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAvailableAssessments();
  }, []);

  // Filter assessments based on selected criteria
  useEffect(() => {
    let filtered = availableAssessments.filter(assessment => {
      // Language filter
      if (selectedLanguage && assessment.language !== selectedLanguage) return false;

      // Curriculum level filter - for dictation, we'll map KS4 to GCSE
      if (selectedCurriculumLevel && selectedCurriculumLevel !== '') {
        // For dictation, we only have foundation/higher which maps to KS4/GCSE
        if (selectedCurriculumLevel !== 'ks4') return false;
      }

      // Exam board filter - for now we'll assume all are AQA-style
      if (selectedExamBoard && selectedExamBoard !== 'aqa') return false;

      // Difficulty filter
      if (selectedDifficulty && assessment.level !== selectedDifficulty) return false;

      return true;
    });

    setFilteredAssessments(filtered);
  }, [availableAssessments, selectedLanguage, selectedCurriculumLevel, selectedExamBoard, selectedDifficulty]);

  const handleStartAssessment = (assessment: DictationAssessment) => {
    const languageCode = assessment.language;
    const tier = assessment.level;
    const paper = assessment.identifier;

    router.push(`/dictation/${languageCode}/${tier}/${paper}`);
  };

  const getLanguageName = (code: string): string => {
    const names: Record<string, string> = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German'
    };
    return names[code] || code;
  };

  const getLanguageFlag = (code: string): string => {
    const flags: Record<string, string> = {
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪'
    };
    return flags[code] || '🌐';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/assessments"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <PenTool className="h-12 w-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Dictation Practice</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Improve your listening and writing skills with GCSE-style dictation exercises
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Assessments</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'es' | 'fr' | 'de')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="es">🇪🇸 Spanish</option>
                <option value="fr">🇫🇷 French</option>
                <option value="de">🇩🇪 German</option>
              </select>
            </div>

            {/* Curriculum Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum Level
              </label>
              <select
                value={selectedCurriculumLevel}
                onChange={(e) => {
                  setSelectedCurriculumLevel(e.target.value);
                  setSelectedExamBoard(''); // Reset exam board when curriculum level changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="ks4">KS4 (GCSE)</option>
              </select>
            </div>

            {/* Exam Board Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Board
              </label>
              <select
                value={selectedExamBoard}
                onChange={(e) => setSelectedExamBoard(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Boards</option>
                <option value="aqa">AQA</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Difficulties</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
              </select>
            </div>
          </div>
        </div>

        {/* Available Assessments */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Dictation Assessments</h2>
            <div className="text-sm text-gray-600">
              {loading ? 'Loading...' : `${filteredAssessments.length} assessment${filteredAssessments.length !== 1 ? 's' : ''} found`}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dictation assessments...</p>
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <PenTool className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assessments Found</h3>
              <p className="text-gray-600 mb-4">
                No dictation assessments match your current filter criteria.
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your filters to see more content.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.map((assessment) => (
                <div key={assessment.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                  <div className="p-6">
                    {/* Assessment Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {assessment.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {getLanguageFlag(assessment.language)} {getLanguageName(assessment.language)}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {assessment.level}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assessment Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <PenTool className="h-4 w-4 mr-2" />
                        <span className="font-medium mr-2">Questions:</span>
                        <span>{assessment.total_questions} sentences</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="font-medium mr-2">Time Limit:</span>
                        <span>{assessment.time_limit_minutes} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Volume2 className="h-4 w-4 mr-2" />
                        <span className="font-medium mr-2">Audio Speeds:</span>
                        <span>Normal & Very Slow</span>
                      </div>
                      {assessment.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {assessment.description}
                        </p>
                      )}
                    </div>

                    {/* Start Assessment Button */}
                    <button
                      onClick={() => handleStartAssessment(assessment)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Start Assessment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
