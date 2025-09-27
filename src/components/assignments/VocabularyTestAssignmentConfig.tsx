'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Target,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus,
  Eye
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { VocabularyTestService, VocabularyTest } from '../../services/vocabularyTestService';
import DatabaseCategorySelector from './DatabaseCategorySelector';

interface VocabularyTestAssignmentConfigProps {
  config: any;
  onConfigChange: (config: any) => void;
  language: string;
  curriculumLevel: 'KS3' | 'KS4';
}

interface ExistingTest {
  id: string;
  title: string;
  description?: string;
  word_count: number;
  time_limit_minutes: number;
  test_type: string;
  status: string;
  created_at: string;
}

export default function VocabularyTestAssignmentConfig({
  config,
  onConfigChange,
  language,
  curriculumLevel
}: VocabularyTestAssignmentConfigProps) {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [testService] = useState(() => new VocabularyTestService(supabase));

  // State
  const [mode, setMode] = useState<'existing' | 'create'>('existing');
  const [existingTests, setExistingTests] = useState<ExistingTest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New test configuration
  const [newTestConfig, setNewTestConfig] = useState({
    title: '',
    description: '',
    test_type: 'mixed' as const,
    vocabulary_source: 'category' as const,
    vocabulary_criteria: {},
    word_count: 20,
    time_limit_minutes: 30,
    max_attempts: 3,
    randomize_questions: true,
    show_immediate_feedback: false,
    allow_hints: false,
    passing_score_percentage: 70,
    points_per_question: 5,
    time_bonus_enabled: true
  });

  useEffect(() => {
    if (user) {
      loadExistingTests();
    }
  }, [user, language, curriculumLevel]);

  useEffect(() => {
    // Update parent config when local config changes
    if (mode === 'existing' && selectedTestId) {
      onConfigChange({
        ...config,
        vocabularyTestConfig: {
          test_id: selectedTestId,
          mode: 'existing'
        }
      });
    } else if (mode === 'create') {
      onConfigChange({
        ...config,
        vocabularyTestConfig: {
          ...newTestConfig,
          language,
          curriculum_level: curriculumLevel,
          mode: 'create'
        }
      });
    }
  }, [mode, selectedTestId, newTestConfig, language, curriculumLevel]);

  const loadExistingTests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const tests = await testService.getTestsByTeacher(user.id);
      
      // Filter tests by language and curriculum level
      const filteredTests = tests.filter(test => 
        test.language === language && 
        test.curriculum_level === curriculumLevel &&
        test.status === 'active'
      );

      setExistingTests(filteredTests);
    } catch (error: any) {
      setError(error.message || 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const handleVocabularySelection = (selection: any) => {
    setNewTestConfig(prev => ({
      ...prev,
      vocabulary_criteria: selection,
      vocabulary_source: selection.source || 'category'
    }));
  };

  const testTypes = [
    { value: 'translation_to_english', label: 'Target → English', description: 'Translate from target language to English' },
    { value: 'translation_to_target', label: 'English → Target', description: 'Translate from English to target language' },
    { value: 'multiple_choice', label: 'Multiple Choice', description: 'Choose correct translation from options' },
    { value: 'spelling_audio', label: 'Audio Spelling', description: 'Listen and spell words correctly' },
    { value: 'mixed', label: 'Mixed Questions', description: 'Combination of all question types' }
  ];

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setMode('existing')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              mode === 'existing'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Use Existing Test</h4>
                <p className="text-sm text-gray-600">Select from your previously created tests</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode('create')}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              mode === 'create'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Plus className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Create New Test</h4>
                <p className="text-sm text-gray-600">Configure a new test for this assignment</p>
              </div>
            </div>
          </button>
        </div>

        {/* Existing Test Selection */}
        {mode === 'existing' && (
          <div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading tests...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600">{error}</p>
                <button
                  onClick={loadExistingTests}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : existingTests.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">No existing tests found</p>
                <p className="text-sm text-gray-500">
                  Create a new test or switch to a different language/level
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select Test
                </label>
                {existingTests.map((test) => (
                  <label
                    key={test.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedTestId === test.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="existing_test"
                      value={test.id}
                      checked={selectedTestId === test.id}
                      onChange={(e) => setSelectedTestId(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{test.title}</h4>
                      {test.description && (
                        <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{test.word_count} questions</span>
                        <span>{test.time_limit_minutes} minutes</span>
                        <span className="capitalize">{test.test_type.replace(/_/g, ' ')}</span>
                        <span>Created {new Date(test.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* New Test Configuration */}
        {mode === 'create' && (
          <div className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Title *
                </label>
                <input
                  type="text"
                  value={newTestConfig.title}
                  onChange={(e) => setNewTestConfig(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter test title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Type
                </label>
                <select
                  value={newTestConfig.test_type}
                  onChange={(e) => setNewTestConfig(prev => ({ ...prev, test_type: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {testTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newTestConfig.description}
                onChange={(e) => setNewTestConfig(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Optional test description..."
              />
            </div>

            {/* Vocabulary Selection */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Vocabulary Selection</h4>
              <DatabaseCategorySelector
                language={language}
                curriculumLevel={curriculumLevel}
                onSelectionChange={handleVocabularySelection}
                allowMultiple={false}
                showWordCount={true}
              />
            </div>

            {/* Test Settings */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Test Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newTestConfig.word_count}
                    onChange={(e) => setNewTestConfig(prev => ({ ...prev, word_count: parseInt(e.target.value) || 20 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={newTestConfig.time_limit_minutes}
                    onChange={(e) => setNewTestConfig(prev => ({ ...prev, time_limit_minutes: parseInt(e.target.value) || 30 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newTestConfig.passing_score_percentage}
                    onChange={(e) => setNewTestConfig(prev => ({ ...prev, passing_score_percentage: parseInt(e.target.value) || 70 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Advanced Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTestConfig.randomize_questions}
                      onChange={(e) => setNewTestConfig(prev => ({ ...prev, randomize_questions: e.target.checked }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Randomize question order</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTestConfig.allow_hints}
                      onChange={(e) => setNewTestConfig(prev => ({ ...prev, allow_hints: e.target.checked }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Allow hints</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTestConfig.show_immediate_feedback}
                      onChange={(e) => setNewTestConfig(prev => ({ ...prev, show_immediate_feedback: e.target.checked }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show immediate feedback</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTestConfig.time_bonus_enabled}
                      onChange={(e) => setNewTestConfig(prev => ({ ...prev, time_bonus_enabled: e.target.checked }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Enable time bonus</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Summary */}
      {((mode === 'existing' && selectedTestId) || (mode === 'create' && newTestConfig.title)) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-green-800">Test Configuration Complete</h4>
          </div>
          <p className="text-sm text-green-700">
            {mode === 'existing' 
              ? 'Selected existing test will be used for this assignment.'
              : 'New test will be created when assignment is saved.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
