'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Gamepad2, FileCheck, BookOpen } from 'lucide-react';
import { StepProps } from '../types/AssignmentTypes';

import CurriculumContentSelector from '../CurriculumContentSelector';

interface ContentConfig {
  type: 'KS3' | 'KS4' | 'custom';
  language: 'spanish' | 'french' | 'german';
  categories?: string[];
  subcategories?: string[];
  examBoard?: 'AQA' | 'Edexcel';
  tier?: 'foundation' | 'higher';
  themes?: string[];
  units?: string[];
  // Legacy KS4 fields (for backward compatibility)
  topics?: string[];
  customCategories?: string[];
  customSubcategories?: string[];
  customVocabulary?: string;
  customSentences?: string;
  customPhrases?: string;
}

export default function ContentConfigurationStep({
  gameConfig,
  setGameConfig,
  assessmentConfig,
  setAssessmentConfig,
  onStepComplete,
  assignmentDetails
}: StepProps) {
  const [activeTab, setActiveTab] = useState<'games' | 'assessments'>('games');
  const [contentConfig, setContentConfig] = useState<ContentConfig>({
    type: assignmentDetails?.curriculum_level || 'KS3',
    language: 'spanish',
    categories: [],
    subcategories: []
  });

  // Check if step is completed
  useEffect(() => {
    const hasGames = gameConfig.selectedGames.length > 0;
    const hasAssessments = assessmentConfig.selectedAssessments.length > 0;

    let gameConfigComplete = true;
    let assessmentConfigComplete = true;

    // Check game configuration completeness
    if (hasGames) {
      // Define vocabulary games by ID
      const vocabGameIds = ['vocabulary-mining', 'memory-game', 'hangman', 'word-blast', 'noughts-and-crosses', 'word-scramble', 'vocab-blast', 'detective-listening'];
      const sentenceGameIds = ['speed-builder', 'sentence-towers', 'sentence-builder'];
      const grammarGameIds = ['conjugation-duel', 'verb-quest'];

      const hasVocabGames = gameConfig.selectedGames.some(gameId => vocabGameIds.includes(gameId));
      const hasSentenceGames = gameConfig.selectedGames.some(gameId => sentenceGameIds.includes(gameId));
      const hasGrammarGames = gameConfig.selectedGames.some(gameId => grammarGameIds.includes(gameId));

      if (hasVocabGames) {
        // Check if vocabulary config has a source selected and language is set
        gameConfigComplete = gameConfigComplete &&
          gameConfig.vocabularyConfig.source !== '' &&
          (gameConfig.vocabularyConfig.language || contentConfig.language) !== '';
      }
      if (hasSentenceGames) {
        // Check if sentence config has a source selected and theme/topic if required
        gameConfigComplete = gameConfigComplete &&
          gameConfig.sentenceConfig.source !== '' &&
          (gameConfig.sentenceConfig.source === 'custom' ||
           (gameConfig.sentenceConfig.source === 'theme' && !!gameConfig.sentenceConfig.theme) ||
           (gameConfig.sentenceConfig.source === 'topic' && !!gameConfig.sentenceConfig.topic));
      }
      if (hasGrammarGames) {
        // Check if grammar config has language and at least one verb type and tense
        gameConfigComplete = gameConfigComplete &&
          gameConfig.grammarConfig.language &&
          gameConfig.grammarConfig.verbTypes.length > 0 &&
          gameConfig.grammarConfig.tenses.length > 0;
      }
    }

    // Assessment configuration completeness - check if each assessment has required fields
    if (hasAssessments) {
      assessmentConfigComplete = assessmentConfig.selectedAssessments.every(assessment => {
        const config = assessment.instanceConfig;
        return config?.language && config?.difficulty && config?.category;
      });
    }

    const isCompleted = (!hasGames || gameConfigComplete) && (!hasAssessments || assessmentConfigComplete);
    onStepComplete('content', isCompleted);
  }, [gameConfig, assessmentConfig, onStepComplete]);

  // Determine which tab to show first
  useEffect(() => {
    if (gameConfig.selectedGames.length > 0 && assessmentConfig.selectedAssessments.length === 0) {
      setActiveTab('games');
    } else if (assessmentConfig.selectedAssessments.length > 0 && gameConfig.selectedGames.length === 0) {
      setActiveTab('assessments');
    }
  }, [gameConfig.selectedGames.length, assessmentConfig.selectedAssessments.length]);

  const hasGames = gameConfig.selectedGames.length > 0;
  const hasAssessments = assessmentConfig.selectedAssessments.length > 0;

  // Define game types for different configurations
  const vocabGameIds = ['vocabulary-mining', 'memory-game', 'hangman', 'word-blast', 'noughts-and-crosses', 'word-scramble', 'vocab-blast', 'detective-listening'];
  const sentenceGameIds = ['speed-builder', 'sentence-towers', 'sentence-builder'];
  const grammarGameIds = ['conjugation-duel', 'verb-quest'];

  const hasVocabGames = gameConfig.selectedGames.some(gameId => vocabGameIds.includes(gameId));
  const hasSentenceGames = gameConfig.selectedGames.some(gameId => sentenceGameIds.includes(gameId));
  const hasGrammarGames = gameConfig.selectedGames.some(gameId => grammarGameIds.includes(gameId));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Configure Content</h2>
        <p className="text-sm text-gray-600">Set up the content and difficulty for your selected activities</p>
      </div>

      {/* Show tabs only if both games and assessments are selected */}
      {hasGames && hasAssessments && (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('games')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'games'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <Gamepad2 className="h-4 w-4 mr-2" />
            Game Configuration
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'assessments'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            <FileCheck className="h-4 w-4 mr-2" />
            Assessment Configuration
          </button>
        </div>
      )}

      {/* Unified Content Configuration */}
      <div className="min-h-[400px]">
        {(hasGames || hasAssessments) && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Content Configuration</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Configure the vocabulary and content for your assignment based on curriculum level
              </p>

              {/* Language Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Language *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['spanish', 'french', 'german'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        const newContentConfig = { ...contentConfig, language: lang as 'spanish' | 'french' | 'german' };
                        setContentConfig(newContentConfig);
                        
                        // Update game config with selected language
                        if (hasGames) {
                          setGameConfig(prev => ({
                            ...prev,
                            vocabularyConfig: {
                              ...prev.vocabularyConfig,
                              language: lang as 'spanish' | 'french' | 'german'
                            }
                          }));
                        }
                        
                        // Update assessment config with selected language
                        if (hasAssessments) {
                          setAssessmentConfig(prev => ({
                            ...prev,
                            generalLanguage: lang as 'spanish' | 'french' | 'german'
                          }));
                        }
                      }}
                      className={`p-3 rounded-lg text-center transition-all duration-200 border-2 ${
                        contentConfig.language === lang
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="font-medium capitalize">{lang}</div>
                    </button>
                  ))}
                </div>
              </div>

              <CurriculumContentSelector
                curriculumLevel={assignmentDetails?.curriculum_level || 'KS3'}
                language={contentConfig.language}
                onConfigChange={(config) => {
                  setContentConfig(config);

                  // Update both game and assessment configs based on the unified content config
                  if (hasGames) {
                    setGameConfig(prev => ({
                      ...prev,
                      vocabularyConfig: {
                        ...prev.vocabularyConfig,
                        source: 'category',
                        // For KS4, use themes/units; for others, use categories/subcategories
                        categories: config.type === 'KS4' ? config.themes : config.categories,
                        subcategories: config.type === 'KS4' ? config.units : config.subcategories,
                        category: config.type === 'KS4' ? (config.themes?.[0] || '') : (config.categories?.[0] || ''),
                        subcategory: config.type === 'KS4' ? (config.units?.[0] || '') : (config.subcategories?.[0] || ''),
                        curriculumLevel: config.type === 'custom' ? 'KS3' : config.type,
                        examBoard: config.examBoard,
                        tier: config.tier,
                        language: config.language === 'spanish' ? 'es' : config.language === 'french' ? 'fr' : 'de',
                        // Store KS4-specific data
                        themes: config.themes,
                        units: config.units
                      }
                    }));
                  }

                  if (hasAssessments) {
                    setAssessmentConfig(prev => ({
                      ...prev,
                      assessmentCategory: config.type === 'KS4' ? (config.themes?.[0] || '') : (config.categories?.[0] || ''),
                      assessmentSubcategory: config.type === 'KS4' ? (config.units?.[0] || '') : (config.subcategories?.[0] || ''),
                      generalLevel: config.type === 'custom' ? 'KS3' : config.type,
                      generalExamBoard: config.examBoard || 'General',
                      generalLanguage: config.language
                    }));
                  }
                }}
                initialConfig={contentConfig}
              />
            </div>

            {/* Sentence Configuration (for sentence games) */}
            {hasSentenceGames && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <FileCheck className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Sentence Configuration</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Configure sentence sources for games like Speed Builder and Sentence Towers
                </p>

                <div className="space-y-6">
                  {/* Sentence Source */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sentence Source
                      </label>
                      <select
                        value={gameConfig.sentenceConfig.source}
                        onChange={(e) => setGameConfig(prev => ({
                          ...prev,
                          sentenceConfig: {
                            ...prev.sentenceConfig,
                            source: e.target.value as '' | 'custom' | 'theme' | 'topic' | 'create',
                            // Reset dependent fields when source changes
                            theme: '',
                            topic: ''
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select sentence source...</option>
                        <option value="theme">By Theme</option>
                        <option value="topic">By Topic</option>
                        <option value="custom">Custom Sentences</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={gameConfig.sentenceConfig.difficulty}
                        onChange={(e) => setGameConfig(prev => ({
                          ...prev,
                          sentenceConfig: { ...prev.sentenceConfig, difficulty: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Theme/Topic Selection */}
                  {gameConfig.sentenceConfig.source === 'theme' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Theme
                      </label>
                      <select
                        value={gameConfig.sentenceConfig.theme || ''}
                        onChange={(e) => setGameConfig(prev => ({
                          ...prev,
                          sentenceConfig: { ...prev.sentenceConfig, theme: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select theme...</option>
                        <option value="family">Family & Relationships</option>
                        <option value="school">School & Education</option>
                        <option value="hobbies">Hobbies & Free Time</option>
                        <option value="food">Food & Drink</option>
                        <option value="travel">Travel & Transport</option>
                        <option value="home">Home & Local Area</option>
                        <option value="work">Work & Future Plans</option>
                        <option value="health">Health & Lifestyle</option>
                      </select>
                    </div>
                  )}

                  {gameConfig.sentenceConfig.source === 'topic' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Topic
                      </label>
                      <select
                        value={gameConfig.sentenceConfig.topic || ''}
                        onChange={(e) => setGameConfig(prev => ({
                          ...prev,
                          sentenceConfig: { ...prev.sentenceConfig, topic: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select topic...</option>
                        <option value="introducing-yourself">Introducing Yourself</option>
                        <option value="daily-routine">Daily Routine</option>
                        <option value="describing-people">Describing People</option>
                        <option value="shopping">Shopping</option>
                        <option value="weather">Weather</option>
                        <option value="directions">Asking for Directions</option>
                        <option value="restaurant">At the Restaurant</option>
                        <option value="holidays">Holidays & Vacations</option>
                      </select>
                    </div>
                  )}

                  {/* Sentence Count */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Sentences
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="50"
                        value={gameConfig.sentenceConfig.sentenceCount}
                        onChange={(e) => setGameConfig(prev => ({
                          ...prev,
                          sentenceConfig: { ...prev.sentenceConfig, sentenceCount: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grammar Configuration (for grammar games) */}
            {hasGrammarGames && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Settings className="h-6 w-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Grammar Configuration</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Configure grammar settings for games like Conjugation Duel and Verb Quest
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={gameConfig.grammarConfig.language}
                      onChange={(e) => setGameConfig(prev => ({
                        ...prev,
                        grammarConfig: { ...prev.grammarConfig, language: e.target.value as 'spanish' | 'french' | 'german' }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                    </select>
                  </div>

                  {/* Verb Count */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Verbs
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={gameConfig.grammarConfig.verbCount}
                      onChange={(e) => setGameConfig(prev => ({
                        ...prev,
                        grammarConfig: { ...prev.grammarConfig, verbCount: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Verb Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verb Types
                    </label>
                    <div className="space-y-2">
                      {['regular', 'irregular', 'stem-changing'].map((type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={gameConfig.grammarConfig.verbTypes.includes(type as 'regular' | 'irregular' | 'stem-changing')}
                            onChange={(e) => {
                              const verbTypes = e.target.checked
                                ? [...gameConfig.grammarConfig.verbTypes, type as 'regular' | 'irregular' | 'stem-changing']
                                : gameConfig.grammarConfig.verbTypes.filter(t => t !== type);
                              setGameConfig(prev => ({
                                ...prev,
                                grammarConfig: { ...prev.grammarConfig, verbTypes }
                              }));
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={gameConfig.grammarConfig.difficulty}
                      onChange={(e) => setGameConfig(prev => ({
                        ...prev,
                        grammarConfig: { ...prev.grammarConfig, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Tenses */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenses
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['present', 'preterite', 'imperfect', 'future', 'conditional', 'subjunctive'].map((tense) => (
                        <label key={tense} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={gameConfig.grammarConfig.tenses.includes(tense as 'present' | 'preterite' | 'imperfect' | 'future' | 'conditional' | 'subjunctive')}
                            onChange={(e) => {
                              const tenses = e.target.checked
                                ? [...gameConfig.grammarConfig.tenses, tense as 'present' | 'preterite' | 'imperfect' | 'future' | 'conditional' | 'subjunctive']
                                : gameConfig.grammarConfig.tenses.filter(t => t !== tense);
                              setGameConfig(prev => ({
                                ...prev,
                                grammarConfig: { ...prev.grammarConfig, tenses }
                              }));
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                          />
                          <span className="ml-2 text-sm text-gray-700 capitalize">{tense}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}



        {/* No activities selected */}
        {!hasGames && !hasAssessments && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Settings className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Selected</h3>
            <p className="text-gray-600">Please go back to the Activities step and select some games or assessments to configure.</p>
          </div>
        )}
      </div>

      {/* Configuration Summary */}
      {(hasGames || hasAssessments) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Configuration Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {hasVocabGames && (
              <div>
                <span className="text-gray-600">Vocabulary:</span>
                <span className="ml-2 font-medium text-blue-600">
                  {gameConfig.vocabularyConfig.source ? '✓ Configured' : '⚠ Needs setup'}
                </span>
              </div>
            )}
            {hasSentenceGames && (
              <div>
                <span className="text-gray-600">Sentences:</span>
                <span className="ml-2 font-medium text-green-600">
                  {gameConfig.sentenceConfig.source ? '✓ Configured' : '⚠ Needs setup'}
                </span>
              </div>
            )}
            {hasGrammarGames && (
              <div>
                <span className="text-gray-600">Grammar:</span>
                <span className="ml-2 font-medium text-purple-600">
                  {gameConfig.grammarConfig.verbTypes.length > 0 && gameConfig.grammarConfig.tenses.length > 0 ? '✓ Configured' : '⚠ Needs setup'}
                </span>
              </div>
            )}
            {hasAssessments && (
              <div>
                <span className="text-gray-600">Assessments:</span>
                <span className="ml-2 font-medium text-indigo-600">{assessmentConfig.selectedAssessments.length} configured</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
