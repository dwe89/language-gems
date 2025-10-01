'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, GraduationCap, Target, ChevronRight,
  Check, Search, Filter, Sparkles, Plus, AlertCircle, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../auth/AuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';
import { useUserAccess } from '@/hooks/useUserAccess';
import DatabaseCategorySelector from './DatabaseCategorySelector';
import KS4ThemeUnitSelector from './KS4ThemeUnitSelector';

interface CurriculumContentSelectorProps {
  curriculumLevel: 'KS3' | 'KS4' | 'custom' | 'my-vocabulary';
  language: 'spanish' | 'french' | 'german';
  onConfigChange: (config: ContentConfig) => void;
  initialConfig?: ContentConfig;
}

interface ContentConfig {
  type: 'KS3' | 'KS4' | 'custom' | 'my-vocabulary';
  language: 'spanish' | 'french' | 'german';
  // KS3 Configuration
  categories?: string[];
  subcategories?: string[];
  // KS4 Configuration
  examBoard?: 'AQA' | 'Edexcel' | 'edexcel';
  tier?: 'foundation' | 'higher';
  themes?: string[];
  units?: string[];
  // Legacy KS4 fields (for backward compatibility)
  topics?: string[];
  // Custom Configuration
  customCategories?: string[];
  customSubcategories?: string[];
  customVocabulary?: string;
  customSentences?: string;
  customPhrases?: string;
  // My Vocabulary Configuration
  customListId?: string;
  customListName?: string;
}

export default function CurriculumContentSelector({
  curriculumLevel,
  language,
  onConfigChange,
  initialConfig
}: CurriculumContentSelectorProps) {
  console.log('🔧 [CURRICULUM SELECTOR] Component rendered with props:', {
    curriculumLevel,
    language,
    hasOnConfigChange: !!onConfigChange,
    initialConfig
  });
  const { canAccessFeature } = useUserAccess();
  const [selectedType, setSelectedType] = useState<'KS3' | 'KS4' | 'custom' | 'my-vocabulary' | undefined>(initialConfig?.type);
  const [config, setConfig] = useState<ContentConfig>(
    initialConfig || {
      // Default config stays inert until a selection is made
      type: 'KS3',
      language,
      categories: [],
      subcategories: []
    }
  );

  // Keep selectedType in sync with incoming initialConfig.type (e.g., when parent persists selection)
  useEffect(() => {
    if (initialConfig?.type && initialConfig.type !== selectedType) {
      setSelectedType(initialConfig.type);
    }
  }, [initialConfig?.type]);

  // Update config when type changes (but don't trigger infinite re-renders)
  useEffect(() => {
    // Wait until the user explicitly selects a type
    if (!selectedType) return;

    // Don't override config for 'my-vocabulary' or 'custom' types - they're handled by button clicks and user input
    if (selectedType === 'my-vocabulary' || selectedType === 'custom') {
      return;
    }

    const newConfig: ContentConfig = {
      type: selectedType,
      language,
      categories: [],
      subcategories: []
    };

    if (selectedType === 'KS4') {
      newConfig.examBoard = 'AQA';
      newConfig.tier = 'foundation';
      newConfig.themes = [];
      newConfig.units = [];
    }

    setConfig(newConfig);
    // Don't call onConfigChange here to avoid infinite loops
    // onConfigChange will be called by button clicks and other user interactions
  }, [selectedType, language]); // Removed onConfigChange from dependencies

  return (
    <div className="space-y-6">
      {/* Curriculum Level Selection */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          Content Level
        </h3>
        
        <div className="grid grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedType('KS3');
              const newConfig: ContentConfig = {
                type: 'KS3',
                language,
                categories: [],
                subcategories: []
              };
              setConfig(newConfig);
              onConfigChange(newConfig);
            }}
            className={`p-4 rounded-xl text-center transition-all duration-200 ${
              selectedType === 'KS3'
                ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            <BookOpen className="h-6 w-6 mx-auto mb-2" />
            <div className="font-semibold">KS3</div>
            <div className="text-xs opacity-80">Years 7-9</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedType('KS4');
              const newConfig: ContentConfig = {
                type: 'KS4',
                language,
                categories: [],
                subcategories: [],
                examBoard: 'AQA',
                tier: 'foundation',
                themes: [],
                units: []
              };
              setConfig(newConfig);
              onConfigChange(newConfig);
            }}
            className={`p-4 rounded-xl text-center transition-all duration-200 ${
              selectedType === 'KS4'
                ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            <GraduationCap className="h-6 w-6 mx-auto mb-2" />
            <div className="font-semibold">KS4 (GCSE)</div>
            <div className="text-xs opacity-80">Years 10-11</div>
          </button>

          {canAccessFeature('customVocabularyLists') && (
            <button
              type="button"
              onClick={() => {
                console.log('🎯 [CURRICULUM SELECTOR] ===== CUSTOM BUTTON CLICKED =====');
                console.log('🎯 [CURRICULUM SELECTOR] BEFORE - selectedType:', selectedType);
                console.log('🎯 [CURRICULUM SELECTOR] BEFORE - config:', config);

                setSelectedType('custom');
                const newConfig: ContentConfig = {
                  type: 'custom',
                  language,
                  customCategories: [],
                  customSubcategories: []
                };

                console.log('🎯 [CURRICULUM SELECTOR] NEW config being set:', newConfig);
                setConfig(newConfig);

                console.log('🎯 [CURRICULUM SELECTOR] About to call onConfigChange with:', newConfig);
                onConfigChange(newConfig);
                console.log('🎯 [CURRICULUM SELECTOR] onConfigChange called - DONE');
              }}
              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                selectedType === 'custom'
                  ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              <Sparkles className="h-6 w-6 mx-auto mb-2" />
              <div className="font-semibold">Custom</div>
              <div className="text-xs opacity-80">Enter your own</div>
            </button>
          )}

          {canAccessFeature('customVocabularyLists') && (
            <button
              type="button"
              onClick={() => {
                console.log('🎯 [CURRICULUM SELECTOR] My Lists clicked - BEFORE state change');
                console.log('🎯 [CURRICULUM SELECTOR] Current selectedType:', selectedType);
                console.log('🎯 [CURRICULUM SELECTOR] Current config:', config);

                setSelectedType('my-vocabulary');
                const newConfig: ContentConfig = {
                  type: 'my-vocabulary',
                  language,
                  customListId: ''
                };
                console.log('🎯 [CURRICULUM SELECTOR] NEW config being set:', newConfig);
                setConfig(newConfig);

                console.log('🎯 [CURRICULUM SELECTOR] About to call onConfigChange with:', newConfig);
                console.log('🎯 [CURRICULUM SELECTOR] onConfigChange function:', onConfigChange);
                console.log('🎯 [CURRICULUM SELECTOR] onConfigChange type:', typeof onConfigChange);
                onConfigChange(newConfig);
                console.log('🎯 [CURRICULUM SELECTOR] onConfigChange called successfully');
              }}
              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                selectedType === 'my-vocabulary'
                  ? 'bg-green-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
              }`}
            >
              <BookOpen className="h-6 w-6 mx-auto mb-2" />
              <div className="font-semibold">My Lists</div>
              <div className="text-xs opacity-80">Your vocabulary</div>
            </button>
          )}
        </div>
      </div>

      {/* Content Configuration */}
      <AnimatePresence mode="wait">
        {selectedType === 'KS3' && (
          <motion.div
            key="ks3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                <Target className="h-4 w-4 text-green-600" />
              </div>
              KS3 Content Selection
            </h4>
            <p className="text-sm text-gray-600 mb-6">
              Choose categories and topics for Years 7-9 students
            </p>
            
            <DatabaseCategorySelector
              language={language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'de'}
              curriculumLevel="KS3"
              selectedCategories={config.categories || []}
              selectedSubcategories={config.subcategories || []}
              onChange={(categories, subcategories) => {
                const newConfig = { ...config, categories, subcategories };
                setConfig(newConfig);
                onConfigChange(newConfig);
              }}
              showSearch={true}
            />
          </motion.div>
        )}

        {selectedType === 'KS4' && (
          <motion.div
            key="ks4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                <GraduationCap className="h-4 w-4 text-purple-600" />
              </div>
              GCSE Configuration
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exam Board Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Exam Board
                </label>
                <div className="space-y-2">
                  {['AQA', 'Edexcel'].map((board) => (
                    <button
                      key={board}
                      type="button"
                      onClick={() => {
                        const newConfig = { ...config, examBoard: board as 'AQA' | 'Edexcel' };
                        setConfig(newConfig);
                        onConfigChange(newConfig);
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                        config.examBoard === board
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{board}</span>
                        {config.examBoard === board && <Check className="h-4 w-4" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tier
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'foundation', name: 'Foundation', desc: 'Grades 1-5' },
                    { id: 'higher', name: 'Higher', desc: 'Grades 4-9' }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => {
                        const newConfig = { ...config, tier: tier.id as 'foundation' | 'higher' };
                        setConfig(newConfig);
                        onConfigChange(newConfig);
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                        config.tier === tier.id
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{tier.name}</div>
                          <div className="text-xs opacity-80">{tier.desc}</div>
                        </div>
                        {config.tier === tier.id && <Check className="h-4 w-4" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* KS4 Content Selection */}
            <div className="mt-6 pt-6 border-t border-purple-100">
              <h5 className="text-md font-semibold text-gray-900 mb-3">
                GCSE Content Areas
              </h5>
              <KS4ThemeUnitSelector
                language={language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'de'}
                examBoard={(config.examBoard === 'edexcel' ? 'Edexcel' : (config.examBoard || 'AQA')) as 'AQA' | 'Edexcel'}
                selectedThemes={config.themes || []}
                selectedUnits={config.units || []}
                onChange={(themes, units) => {
                  const newConfig = { ...config, themes, units };
                  setConfig(newConfig);
                  onConfigChange(newConfig);
                }}
                showSearch={true}
              />
            </div>
          </motion.div>
        )}

        {selectedType === 'custom' && (
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-2">
                <Sparkles className="h-4 w-4 text-orange-600" />
              </div>
              Custom Content Entry
            </h4>
            <p className="text-sm text-gray-600 mb-6">
              Enter your own vocabulary words, sentences, or phrases for the assignment
            </p>

            <div className="space-y-6">
              {/* Custom Vocabulary with Format Selector */}
              <CustomVocabularyInput
                value={config.customVocabulary || ''}
                onChange={(value) => {
                  const newConfig = { ...config, customVocabulary: value };
                  setConfig(newConfig);
                  onConfigChange(newConfig);
                }}
              />

              {/* Custom Sentences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Sentences
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Enter sentences, one per line. Format: "sentence = translation"
                </p>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Me gusta la pizza = I like pizza&#10;¿Cómo estás? = How are you?"
                  onChange={(e) => {
                    const newConfig = { ...config, customSentences: e.target.value };
                    setConfig(newConfig);
                    onConfigChange(newConfig);
                  }}
                />
              </div>

              {/* Custom Phrases */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Phrases or Expressions
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Enter phrases or expressions, one per line
                </p>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Buenos días = Good morning&#10;Por favor = Please"
                  onChange={(e) => {
                    const newConfig = { ...config, customPhrases: e.target.value };
                    setConfig(newConfig);
                    onConfigChange(newConfig);
                  }}
                />
              </div>

              {/* Instructions */}
              <div className="bg-orange-100 border border-orange-200 rounded-lg p-4">
                <h5 className="font-medium text-orange-800 mb-2">Tips for Custom Content:</h5>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Use the format "original = translation" for vocabulary and sentences</li>
                  <li>• Put each item on a new line</li>
                  <li>• Mix different difficulty levels as needed</li>
                  <li>• Include context-specific vocabulary for your lesson</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {selectedType === 'my-vocabulary' && (
          <motion.div
            key="my-vocabulary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                <BookOpen className="h-4 w-4 text-green-600" />
              </div>
              My Vocabulary Lists
            </h4>
            <p className="text-gray-600 mb-6">
              Select from your custom vocabulary lists created in Vocabulary Management
            </p>

            <CustomVocabularySelector
              value={config.customListId || ''}
              onChange={(customListId, customListName) => {
                console.log('🎯 [CURRICULUM SELECTOR] Custom list selected:', customListId, customListName);
                const newConfig = { ...config, customListId, customListName };
                console.log('🎯 [CURRICULUM SELECTOR] Updated config:', newConfig);
                setConfig(newConfig);
                console.log('🎯 [CURRICULUM SELECTOR] About to call onConfigChange with custom list:', newConfig);
                console.log('🎯 [CURRICULUM SELECTOR] onConfigChange function (custom):', onConfigChange);
                onConfigChange(newConfig);
                console.log('🎯 [CURRICULUM SELECTOR] onConfigChange called with custom list - DONE');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom Vocabulary Selector Component
function CustomVocabularySelector({
  value,
  onChange
}: {
  value: string;
  onChange: (customListId: string, customListName?: string) => void;
}) {
  const { user } = useAuth();
  const [customLists, setCustomLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedListDetails, setSelectedListDetails] = useState<any>(null);
  const supabase = supabaseBrowser;

  // Load user's custom vocabulary lists
  useEffect(() => {
    if (!user) return;

    const loadCustomLists = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('enhanced_vocabulary_lists')
          .select(`
            id,
            name,
            description,
            language,
            word_count,
            difficulty_level,
            content_type,
            created_at
          `)
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCustomLists(data || []);
      } catch (error) {
        console.error('Error loading custom vocabulary lists:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomLists();
  }, [user]);

  // Load selected list details
  useEffect(() => {
    if (!value) {
      setSelectedListDetails(null);
      return;
    }

    const loadListDetails = async () => {
      try {
        const { data: listData, error: listError } = await supabase
          .from('enhanced_vocabulary_lists')
          .select('*')
          .eq('id', value)
          .single();

        if (listError) throw listError;

        const { data: itemsData, error: itemsError } = await supabase
          .from('enhanced_vocabulary_items')
          .select('*')
          .eq('list_id', value)
          .limit(5); // Just get first 5 for preview

        if (itemsError) throw itemsError;

        setSelectedListDetails({
          ...listData,
          items: itemsData || []
        });
      } catch (error) {
        console.error('Error loading list details:', error);
      }
    };

    loadListDetails();
  }, [value]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Your Custom Vocabulary List
        </label>
        <select
          value={value}
          onChange={(e) => {
            const selectedList = customLists.find(list => list.id === e.target.value);
            onChange(e.target.value, selectedList?.name);
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="">
            {loading ? 'Loading your vocabulary lists...' : 'Select a vocabulary list...'}
          </option>
          {customLists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name} ({list.word_count} words, {list.language})
            </option>
          ))}
        </select>
      </div>

      {customLists.length === 0 && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-yellow-800">No custom vocabulary lists found</p>
              <p className="text-sm text-yellow-700 mt-1">
                Create vocabulary lists in the{' '}
                <Link href="/dashboard/vocabulary" className="underline hover:text-yellow-900">
                  Vocabulary Management
                </Link>{' '}
                section first.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedListDetails && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Selected List Preview</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-700">Name:</span>
              <span className="font-medium text-green-900">{selectedListDetails.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-700">Language:</span>
              <span className="font-medium text-green-900 capitalize">{selectedListDetails.language}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-700">Word Count:</span>
              <span className="font-medium text-green-900">{selectedListDetails.word_count} words</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-700">Difficulty:</span>
              <span className="font-medium text-green-900 capitalize">{selectedListDetails.difficulty_level}</span>
            </div>

            {selectedListDetails.items && selectedListDetails.items.length > 0 && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <p className="text-sm font-medium text-green-900 mb-2">Sample Words:</p>
                <div className="space-y-1">
                  {selectedListDetails.items.slice(0, 3).map((item: any, index: number) => (
                    <div key={index} className="text-sm text-green-800">
                      <span className="font-medium">{item.term}</span> → {item.translation}
                    </div>
                  ))}
                  {selectedListDetails.word_count > 3 && (
                    <div className="text-sm text-green-600 italic">
                      ...and {selectedListDetails.word_count - 3} more words
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/vocabulary"
          className="flex items-center text-sm text-green-600 hover:text-green-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Manage Vocabulary Lists
        </Link>

        <Link
          href="/vocabulary/new"
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Create New List
        </Link>
      </div>
    </div>
  );
}

// Custom Vocabulary Input Component
// Custom Vocabulary Input Component
function CustomVocabularyInput({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [parsedCount, setParsedCount] = useState(0);
  const [parsedItems, setParsedItems] = useState<{ term: string; translation: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const parseVocabularyText = useCallback((text: string) => {
    if (!text || text.trim() === '') {
      return [];
    }

    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        // Look for common delimiters first
        const delimiterMatch = line.match(/\s*(=|,|;|\||\t|:)\s*/);

        if (delimiterMatch) {
          const delimiter = delimiterMatch[1];
          const parts = line.split(delimiter);
          const term = (parts.shift() || '').trim();
          const translation = parts.join(delimiter).trim();
          return { term, translation };
        }

        // Handle " - " as a delimiter if present
        if (line.includes(' - ')) {
          const [term, ...rest] = line.split(' - ');
          return {
            term: term.trim(),
            translation: rest.join(' - ').trim()
          };
        }

        // Handle spacing copied from spreadsheets (two or more spaces)
        const spaceSplit = line.split(/\s{2,}/);
        if (spaceSplit.length > 1) {
          const term = (spaceSplit.shift() || '').trim();
          const translation = spaceSplit.join(' ').trim();
          return { term, translation };
        }

        // Default: keep the term, leave translation blank
        return { term: line, translation: '' };
      })
      .filter((item) => item.term !== '');
  }, []);

  const updateParsedItems = useCallback((text: string, showErrors = false) => {
    if (!text || text.trim() === '') {
      setParsedItems([]);
      setParsedCount(0);
      if (showErrors) {
        setError(null);
      }
      return;
    }

    const items = parseVocabularyText(text);
    setParsedItems(items);
    setParsedCount(items.length);

    if (showErrors) {
      setError(
        items.length === 0
          ? 'We couldn\'t detect the format. Try adding a separator like "=", ",", ";", "|", or a tab between the word and its translation.'
          : null
      );
    } else {
      setError(null);
    }
  }, [parseVocabularyText]);

  useEffect(() => {
    updateParsedItems(value);
  }, [value, updateParsedItems]);

  const handleParseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    updateParsedItems(value, true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Custom Vocabulary Words
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Copy and paste your vocabulary words
      </p>

      {/* Text Area */}
      <textarea
        rows={8}
        value={value}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
        placeholder="casa = house&#10;perro, dog&#10;gato\tcat"
      />

      {/* Error Display */}
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Parse Button and Count */}
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={handleParseClick}
          className="px-4 py-2 bg-orange-100 text-orange-700 border border-orange-300 rounded-lg hover:bg-orange-200 text-sm font-medium"
        >
          Parse Vocabulary
        </button>
        {parsedCount > 0 && (
          <span className="text-sm text-gray-600">
            {parsedCount} items parsed
          </span>
        )}
      </div>

      {/* Parsed Items Display */}
      {parsedItems.length > 0 && (
        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Parsed Vocabulary:</h5>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto">
            <div className="space-y-1">
              {parsedItems.map((item, index) => (
                <div key={index} className="flex justify-between text-sm gap-3">
                  <span className="font-medium text-gray-900 truncate">{item.term}</span>
                  <span className="text-gray-600 text-right truncate">
                    {item.translation ? `= ${item.translation}` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {parsedItems.length === 0 && value.trim() !== '' && !error && (
        <div className="mt-4 text-sm text-gray-500">
          We\'ll save your text exactly as typed if no separator is detected.
        </div>
      )}
    </div>
  );
}
