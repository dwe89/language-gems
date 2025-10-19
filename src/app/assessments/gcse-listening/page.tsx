'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Headphones, ArrowLeft, Clock, FileText, Award, CheckCircle, Settings } from 'lucide-react';
import FlagIcon from '../../../components/ui/FlagIcon';
import { AQAListeningAssessmentService, type AQAListeningAssessmentDefinition } from '../../../services/aqaListeningAssessmentService';
import { EdexcelListeningAssessmentService, type EdexcelListeningAssessmentDefinition } from '../../../services/edexcelListeningAssessmentService';
import AQAListeningAdminModal from '../../../components/admin/AQAListeningAdminModal';
import { useAuth } from '../../../components/auth/AuthProvider';

const AVAILABLE_LANGUAGES = [
  { code: 'es', countryCode: 'ES', name: 'Spanish' },
  { code: 'fr', countryCode: 'FR', name: 'French' },
  { code: 'de', countryCode: 'DE', name: 'German' },
];

export default function GCSEListeningExamPage() {
  const { user } = useAuth();
  const isAdmin = user?.email === 'danieletienne89@gmail.com';

  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedExamBoard, setSelectedExamBoard] = useState('');
  const [availableAQAAssessments, setAvailableAQAAssessments] = useState<AQAListeningAssessmentDefinition[]>([]);
  const [availableEdexcelAssessments, setAvailableEdexcelAssessments] = useState<EdexcelListeningAssessmentDefinition[]>([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  const [aqaAssessmentService] = useState(() => new AQAListeningAssessmentService());
  const [edexcelAssessmentService] = useState(() => new EdexcelListeningAssessmentService());
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Load available assessments when filters change
  useEffect(() => {
    const loadAssessments = async () => {
      if (selectedLanguage && selectedTier) {
        setIsLoadingAssessments(true);

        if (selectedExamBoard === 'AQA') {
          const assessments = await aqaAssessmentService.getAssessmentsByLevel(
            selectedTier as 'foundation' | 'higher',
            selectedLanguage as 'es' | 'fr' | 'de'
          );
          setAvailableAQAAssessments(assessments);
          setAvailableEdexcelAssessments([]);
        } else if (selectedExamBoard === 'Edexcel') {
          const assessments = await edexcelAssessmentService.getAssessmentsByLevel(
            selectedTier as 'foundation' | 'higher',
            selectedLanguage as 'es' | 'fr' | 'de'
          );
          setAvailableEdexcelAssessments(assessments);
          setAvailableAQAAssessments([]);
        }

        setIsLoadingAssessments(false);
      } else {
        setAvailableAQAAssessments([]);
        setAvailableEdexcelAssessments([]);
      }
    };

    loadAssessments();
  }, [selectedLanguage, selectedTier, selectedExamBoard, aqaAssessmentService, edexcelAssessmentService]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/assessments"
            className="inline-flex items-center text-green-600 hover:text-green-800 mb-4 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white mr-4">
                <Headphones className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">GCSE Listening Exam</h1>
                <p className="text-xl text-gray-600 mt-2">
                  Practice with official exam-style listening papers
                </p>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAdminModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <Settings className="h-5 w-5 mr-2" />
                Manage Papers
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Exam</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Exam Board Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Board
              </label>
              <select
                value={selectedExamBoard}
                onChange={(e) => setSelectedExamBoard(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Choose exam board...</option>
                <option value="AQA">AQA</option>
                <option value="Edexcel">Edexcel</option>
              </select>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={!selectedExamBoard}
              >
                <option value="">Choose language...</option>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tier Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tier
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={!selectedLanguage}
              >
                <option value="">Choose tier...</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
              </select>
            </div>
          </div>
        </div>

        {/* Available Papers Section - AQA */}
        {selectedExamBoard === 'AQA' && selectedLanguage && selectedTier && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available AQA Papers</h2>
            
            {isLoadingAssessments ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading assessments...</p>
              </div>
            ) : availableAQAAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableAQAAssessments.map((assessment) => (
                  <Link
                    key={assessment.identifier}
                    href={`/aqa-listening-test/${selectedLanguage}/${selectedTier}/${assessment.identifier}`}
                    className="block bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-lg p-6 hover:shadow-lg hover:border-green-400 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{assessment.title}</h3>
                      <Headphones className="h-6 w-6 text-green-600" />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{assessment.time_limit_minutes} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>{assessment.total_questions} questions</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span>{assessment.level === 'foundation' ? 'Foundation' : 'Higher'} Tier</span>
                      </div>
                    </div>

                    {assessment.description && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">{assessment.description}</p>
                      </div>
                    )}

                    <div className="mt-4 text-green-600 font-semibold flex items-center">
                      Start Paper
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No papers available for this combination.</p>
              </div>
            )}
          </div>
        )}

        {/* Available Papers Section - Edexcel */}
        {selectedExamBoard === 'Edexcel' && selectedLanguage && selectedTier && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Edexcel Papers</h2>
            
            {isLoadingAssessments ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading assessments...</p>
              </div>
            ) : availableEdexcelAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableEdexcelAssessments.map((assessment) => (
                  <Link
                    key={assessment.identifier}
                    href={`/edexcel-listening-test/${selectedLanguage}/${selectedTier}/${assessment.identifier}`}
                    className="block bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-lg p-6 hover:shadow-lg hover:border-green-400 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{assessment.title}</h3>
                      <Headphones className="h-6 w-6 text-green-600" />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{assessment.timeLimit} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{assessment.totalMarks} marks</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span>{assessment.sections.length} sections</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Sections:</p>
                      <div className="flex flex-wrap gap-2">
                        {assessment.sections.map((section, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                          >
                            {section.title}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 text-green-600 font-semibold flex items-center">
                      Start Paper
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No papers available for this combination.</p>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {!selectedExamBoard && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              About GCSE Listening Exams
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Expect</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Authentic audio recordings by native speakers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Multiple question types including multiple choice and gap-fill</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Timed exam conditions to simulate the real experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Instant feedback and detailed explanations</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Exam Details</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-semibold text-green-900 mb-1">Foundation Tier</p>
                    <p className="text-sm">35 minutes • 50 marks</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="font-semibold text-teal-900 mb-1">Higher Tier</p>
                    <p className="text-sm">45 minutes • 50 marks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Modal */}
      {isAdmin && (
        <AQAListeningAdminModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          onRefresh={() => {
            // Reload assessments after admin changes
            if (selectedLanguage && selectedTier && selectedExamBoard) {
              const loadAssessments = async () => {
                setIsLoadingAssessments(true);
                if (selectedExamBoard === 'AQA') {
                  const assessments = await aqaAssessmentService.getAssessmentsByLevel(
                    selectedTier as 'foundation' | 'higher',
                    selectedLanguage as 'es' | 'fr' | 'de'
                  );
                  setAvailableAQAAssessments(assessments);
                }
                setIsLoadingAssessments(false);
              };
              loadAssessments();
            }
          }}
        />
      )}
    </div>
  );
}

