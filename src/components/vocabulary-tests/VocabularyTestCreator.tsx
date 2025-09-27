'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Users,
  Settings,
  Play,
  Save,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Volume2,
  Shuffle,
  Target,
  Trophy,
  Eye,
  EyeOff,
  Plus,
  Upload
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { VocabularyTestService, TestCreationData } from '../../services/vocabularyTestService';
import CustomVocabularyUpload from './CustomVocabularyUpload';

// Component-specific interface for the form state
interface TestFormData {
  title: string;
  description: string;
  language: string;
  curriculum_level: 'KS3' | 'KS4';
  test_type: 'translation_to_english' | 'translation_to_target' | 'multiple_choice' | 'spelling_audio' | 'mixed';
  question_count: number;
  vocabulary_source: 'category' | 'custom_list';
  vocabulary_criteria: {
    categories: string[];
    subcategories: string[];
    custom_vocabulary: any[];
  };
  settings: {
    time_limit_minutes: number;
    max_attempts: number;
    show_correct_answers: boolean;
    randomize_questions: boolean;
    randomize_options: boolean;
    allow_hints: boolean;
    immediate_feedback: boolean;
    passing_score: number;
  };
}

interface VocabularyTestCreatorProps {
  onTestCreated?: (testId: string) => void;
  onCancel?: () => void;
  classId?: string;
}

interface VocabularyCategory {
  id: string;
  name: string;
  subcategories: string[];
}

export default function VocabularyTestCreator({
  onTestCreated,
  onCancel,
  classId
}: VocabularyTestCreatorProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test data
  const [testData, setTestData] = useState<TestFormData>({
    title: '',
    description: '',
    language: 'es',
    curriculum_level: 'KS3',
    test_type: 'mixed',
    question_count: 20,
    vocabulary_source: 'category',
    vocabulary_criteria: {
      categories: [],
      subcategories: [],
      custom_vocabulary: []
    },
    settings: {
      time_limit_minutes: 30,
      max_attempts: 3,
      show_correct_answers: true,
      randomize_questions: true,
      randomize_options: true,
      allow_hints: false,
      immediate_feedback: false,
      passing_score: 70
    }
  });

  // Vocabulary selection state
  const [categories, setCategories] = useState<VocabularyCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [showCustomUpload, setShowCustomUpload] = useState(false);

  // Class selection state
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');

  // Debug component mount
  useEffect(() => {
    console.log('🔍 [VocabularyTestCreator] Component mounted, user:', !!user, 'supabase:', !!supabase);
  }, []);

  // Load vocabulary categories
  useEffect(() => {
    console.log('🔍 [VocabularyTestCreator] useEffect triggered for loadCategories');
    loadCategories();
  }, [testData.language, testData.curriculum_level]);

  // Expose test function to window for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).testVocabularyTestCreation = async () => {
        if (!user || !supabase) {
          console.error('User or supabase not available');
          return;
        }

        const testTestData = {
          title: 'Debug Test',
          description: 'Test created from console',
          language: 'es',
          curriculum_level: 'KS3' as const,
          test_type: 'mixed' as const,
          vocabulary_source: 'category' as const,
          vocabulary_criteria: {
            categories: [],
            subcategories: ['clothes_accessories'],
            custom_vocabulary: []
          },
          word_count: 10,
          time_limit_minutes: 15,
          max_attempts: 2,
          randomize_questions: true,
          show_immediate_feedback: false,
          allow_hints: false,
          passing_score_percentage: 70,
          points_per_question: 5,
          time_bonus_enabled: true
        };

        console.log('Creating test with data:', testTestData);
        const testService = new VocabularyTestService(supabase);
        const result = await testService.createTest(user.id, testTestData);
        console.log('Test creation result:', result);
        return result;
      };
      console.log('🧪 [DEBUG] testVocabularyTestCreation function is now available on window object');
    }
  }, [user, supabase]);

  const loadCategories = async () => {
    console.log('🔍 [VocabularyTestCreator] loadCategories called, supabase:', !!supabase, typeof supabase);
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('centralized_vocabulary')
        .select('category, subcategory')
        .eq('language', testData.language)
        .eq('curriculum_level', testData.curriculum_level);

      if (error) throw error;

      // Group by category
      const categoryMap = new Map<string, Set<string>>();
      data?.forEach(item => {
        if (!categoryMap.has(item.category)) {
          categoryMap.set(item.category, new Set());
        }
        if (item.subcategory) {
          categoryMap.get(item.category)?.add(item.subcategory);
        }
      });

      const categoriesData = Array.from(categoryMap.entries()).map(([name, subcats]) => ({
        id: name,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        subcategories: Array.from(subcats)
      }));

      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load vocabulary categories');
    }
  };

  const loadAvailableClasses = async () => {
    if (!user || !supabase) {
      console.log('🔍 [VocabularyTestCreator] loadAvailableClasses: Missing user or supabase');
      return;
    }

    try {
      console.log('🔍 [VocabularyTestCreator] Loading classes for teacher:', user.id);
      const { data: classes, error } = await supabase
        .from('classes')
        .select('id, name, description')
        .eq('teacher_id', user.id)
        .order('name');

      if (error) throw error;

      console.log('🔍 [VocabularyTestCreator] Loaded classes:', classes);
      setAvailableClasses(classes || []);
    } catch (err) {
      console.error('Error loading classes:', err);
      setError('Failed to load classes');
    }
  };

  // Load available classes when user changes
  useEffect(() => {
    loadAvailableClasses();
  }, [user]);

  const handleCustomVocabularyCreated = (vocabulary: any[]) => {
    setTestData(prev => ({
      ...prev,
      vocabulary_source: 'custom_list',
      vocabulary_criteria: {
        ...prev.vocabulary_criteria,
        custom_vocabulary: vocabulary
      }
    }));
    setShowCustomUpload(false);
  };

  const handleSubmit = async () => {
    if (!user || !supabase) return;

    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!testData.title.trim()) {
        throw new Error('Test title is required');
      }

      if (selectedClasses.length === 0) {
        throw new Error('Please select at least one class to assign the test to');
      }

      if (testData.vocabulary_source === 'category' &&
          (!testData.vocabulary_criteria.categories.length && !testData.vocabulary_criteria.subcategories.length)) {
        throw new Error('Please select at least one vocabulary category or subcategory');
      }

      if (testData.vocabulary_source === 'custom_list' &&
          !testData.vocabulary_criteria.custom_vocabulary?.length) {
        throw new Error('Please add custom vocabulary or select categories');
      }

      // Transform testData to match database schema
      const transformedTestData = {
        title: testData.title,
        description: testData.description,
        language: testData.language,
        curriculum_level: testData.curriculum_level,
        test_type: testData.test_type,
        vocabulary_source: testData.vocabulary_source,
        vocabulary_criteria: testData.vocabulary_criteria,
        word_count: testData.question_count,
        time_limit_minutes: testData.settings.time_limit_minutes,
        max_attempts: testData.settings.max_attempts,
        randomize_questions: testData.settings.randomize_questions,
        show_immediate_feedback: testData.settings.immediate_feedback,
        allow_hints: testData.settings.allow_hints,
        passing_score_percentage: testData.settings.passing_score,
        points_per_question: 5, // Default value
        time_bonus_enabled: true // Default value
      };

      // Create test
      if (!supabase) throw new Error('Database connection not available');
      if (!user?.id) throw new Error('User not authenticated');
      const testService = new VocabularyTestService(supabase);
      const testId = await testService.createTest(user.id, transformedTestData);

      // Create assignments for each selected class
      for (const classId of selectedClasses) {
        const assignmentData = {
          title: testData.title,
          description: testData.description || 'Vocabulary Test Assignment',
          created_by: user.id,
          class_id: classId,
          game_type: 'vocabulary_test',
          type: 'vocabulary_test',
          curriculum_level: testData.curriculum_level,
          due_date: dueDate || null,
          points: testData.question_count * 5, // 5 points per question
          time_limit: testData.settings.time_limit_minutes,
          max_attempts: testData.settings.max_attempts,
          game_config: {
            vocabulary_test_id: testId,
            test_type: testData.test_type,
            question_count: testData.question_count,
            max_attempts: testData.settings.max_attempts,
            passing_score: testData.settings.passing_score
          }
        };

        const { error: assignmentError } = await supabase
          .from('assignments')
          .insert(assignmentData);

        if (assignmentError) {
          console.error('Error creating assignment for class:', classId, assignmentError);
          throw new Error(`Failed to create assignment for class: ${assignmentError.message}`);
        }
      }

      if (onTestCreated) {
        onTestCreated(testId);
      }
    } catch (err) {
      console.error('Error creating test:', err);
      setError(err instanceof Error ? err.message : 'Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep2 = () => {
    return testData.title.trim().length > 0;
  };

  const canProceedToStep3 = () => {
    if (testData.vocabulary_source === 'category') {
      return testData.vocabulary_criteria.categories.length > 0 ||
             testData.vocabulary_criteria.subcategories.length > 0;
    }
    if (testData.vocabulary_source === 'custom_list') {
      return testData.vocabulary_criteria.custom_vocabulary &&
             testData.vocabulary_criteria.custom_vocabulary.length > 0;
    }
    return false;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Details</h2>
        <p className="text-gray-600">Configure your vocabulary test settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Test Title *
          </label>
          <input
            type="text"
            value={testData.title}
            onChange={(e) => setTestData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter test title..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Description (Optional)
          </label>
          <textarea
            value={testData.description}
            onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Describe the test purpose and content..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Language
          </label>
          <select
            value={testData.language}
            onChange={(e) => setTestData(prev => ({ ...prev, language: e.target.value }))}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Curriculum Level
          </label>
          <select
            value={testData.curriculum_level}
            onChange={(e) => setTestData(prev => ({ ...prev, curriculum_level: e.target.value as 'KS3' | 'KS4' }))}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="KS3">KS3</option>
            <option value="KS4">KS4</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Test Type
          </label>
          <select
            value={testData.test_type}
            onChange={(e) => setTestData(prev => ({ ...prev, test_type: e.target.value as any }))}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="mixed">Mixed (All Types)</option>
            <option value="translation_to_english">Target Language → English</option>
            <option value="translation_to_target">English → Target Language</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="spelling_audio">Audio Spelling</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Number of Questions
          </label>
          <input
            type="number"
            min="5"
            max="50"
            value={testData.question_count}
            onChange={(e) => setTestData(prev => ({ ...prev, question_count: parseInt(e.target.value) || 20 }))}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vocabulary Selection</h2>
        <p className="text-gray-600">Choose which vocabulary to include in your test</p>
      </div>

      <div className="space-y-6">
        {/* Vocabulary Source Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-4">
            Vocabulary Source
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setTestData(prev => ({ ...prev, vocabulary_source: 'category' }))}
              className={`p-4 border-2 rounded-xl text-left transition-colors ${
                testData.vocabulary_source === 'category'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Existing Categories</h3>
                  <p className="text-sm text-gray-600">Select from curriculum vocabulary</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowCustomUpload(true)}
              className={`p-4 border-2 rounded-xl text-left transition-colors ${
                testData.vocabulary_source === 'custom_list'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Upload className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Custom Vocabulary</h3>
                  <p className="text-sm text-gray-600">Upload your own word list</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Category Selection */}
        {testData.vocabulary_source === 'category' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Categories</h3>
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading vocabulary categories...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={testData.vocabulary_criteria.categories.includes(category.id)}
                        onChange={(e) => {
                          const categories = e.target.checked
                            ? [...testData.vocabulary_criteria.categories, category.id]
                            : testData.vocabulary_criteria.categories.filter(c => c !== category.id);
                          setTestData(prev => ({
                            ...prev,
                            vocabulary_criteria: { ...prev.vocabulary_criteria, categories }
                          }));
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`category-${category.id}`} className="font-medium text-gray-900">
                        {category.name}
                      </label>
                    </div>

                    {category.subcategories.length > 0 && (
                      <div className="ml-6 space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`subcategory-${category.id}-${subcategory}`}
                              checked={testData.vocabulary_criteria.subcategories.includes(subcategory)}
                              onChange={(e) => {
                                const subcategories = e.target.checked
                                  ? [...testData.vocabulary_criteria.subcategories, subcategory]
                                  : testData.vocabulary_criteria.subcategories.filter(s => s !== subcategory);
                                setTestData(prev => ({
                                  ...prev,
                                  vocabulary_criteria: { ...prev.vocabulary_criteria, subcategories }
                                }));
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`subcategory-${category.id}-${subcategory}`} className="text-sm text-gray-700">
                              {subcategory}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom Vocabulary Summary */}
        {testData.vocabulary_source === 'custom_list' && testData.vocabulary_criteria?.custom_vocabulary && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-800">Custom Vocabulary Added</h4>
            </div>
            <p className="text-green-700">
              {testData.vocabulary_criteria.custom_vocabulary.length} words ready for testing
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Settings</h2>
        <p className="text-gray-600">Configure how your test will work</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Time Limit (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="120"
            value={testData.settings.time_limit_minutes}
            onChange={(e) => setTestData(prev => ({
              ...prev,
              settings: { ...prev.settings, time_limit_minutes: parseInt(e.target.value) || 30 }
            }))}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Maximum Attempts
          </label>
          <select
            value={testData.settings.max_attempts}
            onChange={(e) => setTestData(prev => ({
              ...prev,
              settings: { ...prev.settings, max_attempts: parseInt(e.target.value) }
            }))}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={1}>1 attempt</option>
            <option value={2}>2 attempts</option>
            <option value={3}>3 attempts</option>
            <option value={-1}>Unlimited</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Passing Score (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={testData.settings.passing_score}
            onChange={(e) => setTestData(prev => ({
              ...prev,
              settings: { ...prev.settings, passing_score: parseInt(e.target.value) || 70 }
            }))}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Test Options</h4>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={testData.settings.randomize_questions}
                onChange={(e) => setTestData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, randomize_questions: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Randomize question order</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={testData.settings.show_correct_answers}
                onChange={(e) => setTestData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, show_correct_answers: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Show correct answers after completion</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={testData.settings.immediate_feedback}
                onChange={(e) => setTestData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, immediate_feedback: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Provide immediate feedback</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={testData.settings.allow_hints}
                onChange={(e) => setTestData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, allow_hints: e.target.checked }
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Allow hints</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assign to Classes</h2>
        <p className="text-gray-600">Select which classes should take this test</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Select Classes *
          </label>
          <div className="border-2 border-gray-200 rounded-xl p-4 max-h-64 overflow-y-auto">
            {availableClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No classes found. Create a class first to assign tests.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableClasses.map((cls) => (
                  <label key={cls.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedClasses(prev => [...prev, cls.id]);
                        } else {
                          setSelectedClasses(prev => prev.filter(id => id !== cls.id));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{cls.name}</div>
                      {cls.description && (
                        <div className="text-sm text-gray-500">{cls.description}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Due Date (Optional)
          </label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Assignment Summary */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Assignment Summary
          </label>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Test Title:</span>
              <span className="font-medium">{testData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Questions:</span>
              <span className="font-medium">{testData.question_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Limit:</span>
              <span className="font-medium">{testData.settings.time_limit_minutes} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Attempts:</span>
              <span className="font-medium">{testData.settings.max_attempts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Classes Selected:</span>
              <span className="font-medium">{selectedClasses.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Vocabulary Test</h1>
              <p className="text-gray-600">Design a comprehensive vocabulary assessment</p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={
                  (currentStep === 1 && !canProceedToStep2()) ||
                  (currentStep === 2 && !canProceedToStep3()) ||
                  (currentStep === 3 && !canProceedToStep3())
                }
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || selectedClasses.length === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Create Test & Assign</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Custom Vocabulary Upload Modal */}
      {showCustomUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <CustomVocabularyUpload
              language={testData.language}
              onVocabularyCreated={handleCustomVocabularyCreated}
              onCancel={() => setShowCustomUpload(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
