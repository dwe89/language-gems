'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PenTool, ArrowLeft, Clock, FileText, Award, CheckCircle, Settings } from 'lucide-react';
import FlagIcon from '../../../components/ui/FlagIcon';
import { AQAWritingAssessmentService, type AQAWritingAssessmentDefinition } from '../../../services/aqaWritingAssessmentService';
import AQAWritingAdminModal from '../../../components/admin/AQAWritingAdminModal';
import EdexcelWritingAdminModal from '../../../components/admin/EdexcelWritingAdminModal';
import GCSEWritingBoardSelector from '../../../components/admin/GCSEWritingBoardSelector';
import { useAuth } from '@/components/auth/AuthProvider';

const AVAILABLE_LANGUAGES = [
  { code: 'es', countryCode: 'ES', name: 'Spanish' },
  { code: 'fr', countryCode: 'FR', name: 'French' },
  { code: 'de', countryCode: 'DE', name: 'German' },
];

export default function GCSEWritingExamPage() {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedExamBoard, setSelectedExamBoard] = useState('');
  const [availableAssessments, setAvailableAssessments] = useState<AQAWritingAssessmentDefinition[]>([]);
  const [isLoadingAssessments, setIsLoadingAssessments] = useState(false);
  const [assessmentService] = useState(() => new AQAWritingAssessmentService());
  const [showBoardSelector, setShowBoardSelector] = useState(false);
  const [showAQAAdminModal, setShowAQAAdminModal] = useState(false);
  const [showEdexcelAdminModal, setShowEdexcelAdminModal] = useState(false);

  // Check if user is admin
  const isAdmin = user?.email === 'danieletienne89@gmail.com';

  // Handle board selection from selector
  const handleBoardSelect = (board: 'aqa' | 'edexcel') => {
    setShowBoardSelector(false);
    if (board === 'aqa') {
      setShowAQAAdminModal(true);
    } else {
      setShowEdexcelAdminModal(true);
    }
  };

  // Load available assessments when filters change
  useEffect(() => {
    const loadAssessments = async () => {
      if (selectedLanguage && selectedTier && selectedExamBoard === 'AQA') {
        setIsLoadingAssessments(true);
        try {
          const assessments = await assessmentService.getAssessmentsByLevel(
            selectedTier as 'foundation' | 'higher',
            selectedLanguage as 'es' | 'fr' | 'de'
          );
          setAvailableAssessments(assessments);
        } catch (error) {
          console.error('Error loading assessments:', error);
          setAvailableAssessments([]);
        } finally {
          setIsLoadingAssessments(false);
        }
      } else {
        setAvailableAssessments([]);
      }
    };

    loadAssessments();
  }, [selectedLanguage, selectedTier, selectedExamBoard, assessmentService]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/assessments"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessments
          </Link>
          
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white mr-4">
              <PenTool className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">GCSE Writing Exam</h1>
              <p className="text-xl text-gray-600 mt-2">
                Practice with official exam-style writing papers
              </p>
            </div>
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Choose exam board...</option>
                <option value="AQA">AQA</option>
                <option value="Edexcel">Edexcel (Coming Soon)</option>
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Papers</h2>
            
            {isLoadingAssessments ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading assessments...</p>
              </div>
            ) : availableAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableAssessments.map((assessment) => (
                  <Link
                    key={assessment.identifier}
                    href={`/aqa-writing-test/${selectedLanguage}/${selectedTier}/${assessment.identifier}`}
                    className="block bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg hover:border-purple-400 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{assessment.title}</h3>
                      <PenTool className="h-6 w-6 text-purple-600" />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{assessment.time_limit_minutes} minutes</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{assessment.total_marks} marks</span>
                      </div>
                    </div>

                    <div className="mt-4 text-purple-600 font-semibold flex items-center">
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

        {/* Edexcel Coming Soon */}
        {selectedExamBoard === 'Edexcel' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Edexcel writing papers are currently in development and will be available soon.
            </p>
          </div>
        )}

        {/* Info Section */}
        {!selectedExamBoard && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              About GCSE Writing Exams
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Expect</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Translation tasks from English to target language</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Creative writing tasks on familiar topics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Timed exam conditions to simulate the real experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Detailed feedback on grammar, vocabulary, and structure</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Exam Details</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-purple-900 mb-1">Foundation Tier</p>
                    <p className="text-sm">60 minutes • 50 marks</p>
                    <p className="text-xs mt-1">Translation + 90-word writing task</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="font-semibold text-indigo-900 mb-1">Higher Tier</p>
                    <p className="text-sm">75 minutes • 60 marks</p>
                    <p className="text-xs mt-1">Translation + 150-word writing task</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Button */}
      {isAdmin && (
        <button
          onClick={() => setShowBoardSelector(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
          title="Manage GCSE Writing Papers (Admin only)"
        >
          <Settings className="w-5 h-5" />
          <span>Manage Papers</span>
        </button>
      )}

      {/* Board Selector Modal */}
      {isAdmin && (
        <GCSEWritingBoardSelector
          isOpen={showBoardSelector}
          onClose={() => setShowBoardSelector(false)}
          onSelectBoard={handleBoardSelect}
        />
      )}

      {/* AQA Admin Modal */}
      {isAdmin && (
        <AQAWritingAdminModal
          isOpen={showAQAAdminModal}
          onClose={() => setShowAQAAdminModal(false)}
          onRefresh={() => {
            // Reload assessments after admin changes
            if (selectedLanguage && selectedTier && selectedExamBoard === 'AQA') {
              setIsLoadingAssessments(true);
              assessmentService.getAssessmentsByLevel(
                selectedTier as 'foundation' | 'higher',
                selectedLanguage as 'es' | 'fr' | 'de'
              ).then(setAvailableAssessments)
                .catch(console.error)
                .finally(() => setIsLoadingAssessments(false));
            }
          }}
        />
      )}

      {/* Edexcel Admin Modal */}
      {isAdmin && (
        <EdexcelWritingAdminModal
          isOpen={showEdexcelAdminModal}
          onClose={() => setShowEdexcelAdminModal(false)}
          onRefresh={() => {
            // Reload assessments after admin changes
            if (selectedLanguage && selectedTier && selectedExamBoard === 'Edexcel') {
              setIsLoadingAssessments(true);
              // TODO: Create Edexcel assessment service
              setIsLoadingAssessments(false);
            }
          }}
        />
      )}
    </div>
  );
}

