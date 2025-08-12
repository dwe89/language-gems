'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, GraduationCap, Target, ChevronRight, 
  Check, Search, Filter, Sparkles
} from 'lucide-react';
import { supabaseBrowser } from '../auth/AuthProvider';
import DatabaseCategorySelector from './DatabaseCategorySelector';
import KS4ThemeUnitSelector from './KS4ThemeUnitSelector';

interface CurriculumContentSelectorProps {
  curriculumLevel: 'KS3' | 'KS4';
  language: 'spanish' | 'french' | 'german';
  onConfigChange: (config: ContentConfig) => void;
  initialConfig?: ContentConfig;
}

interface ContentConfig {
  type: 'KS3' | 'KS4' | 'custom';
  language: 'spanish' | 'french' | 'german';
  // KS3 Configuration
  categories?: string[];
  subcategories?: string[];
  // KS4 Configuration
  examBoard?: 'AQA' | 'Edexcel';
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
}

export default function CurriculumContentSelector({
  curriculumLevel,
  language,
  onConfigChange,
  initialConfig
}: CurriculumContentSelectorProps) {
  const [selectedType, setSelectedType] = useState<'KS3' | 'KS4' | 'custom'>(curriculumLevel);
  const [config, setConfig] = useState<ContentConfig>(
    initialConfig || {
      type: curriculumLevel,
      language,
      categories: [],
      subcategories: []
    }
  );

  // Update config when type changes (but don't trigger infinite re-renders)
  useEffect(() => {
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
    // Only call onConfigChange when selectedType actually changes, not on every render
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
        
        <div className="grid grid-cols-3 gap-3">
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

          <button
            type="button"
            onClick={() => {
              setSelectedType('custom');
              const newConfig: ContentConfig = {
                type: 'custom',
                language,
                customCategories: [],
                customSubcategories: []
              };
              setConfig(newConfig);
              onConfigChange(newConfig);
            }}
            className={`p-4 rounded-xl text-center transition-all duration-200 ${
              selectedType === 'custom'
                ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            <Sparkles className="h-6 w-6 mx-auto mb-2" />
            <div className="font-semibold">Custom</div>
            <div className="text-xs opacity-80">Enter your own</div>
          </button>
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
                examBoard={config.examBoard || 'AQA'}
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
              {/* Custom Vocabulary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Vocabulary Words
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Enter vocabulary words, one per line. Format: "word = translation" (e.g., "casa = house")
                </p>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="casa = house&#10;perro = dog&#10;gato = cat&#10;escuela = school"
                  onChange={(e) => {
                    const newConfig = { ...config, customVocabulary: e.target.value };
                    setConfig(newConfig);
                    onConfigChange(newConfig);
                  }}
                />
              </div>

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
      </AnimatePresence>
    </div>
  );
}
