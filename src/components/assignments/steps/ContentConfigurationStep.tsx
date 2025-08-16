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

  // State for sentence configuration API data
  const [sentenceCategories, setSentenceCategories] = useState<string[]>([]);
  const [sentenceSubcategories, setSentenceSubcategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);

  // Load sentence categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch('/api/sentences/categories');
        if (response.ok) {
          const data = await response.json();
          setSentenceCategories(data.categories || []);
        } else {
          console.error('Failed to fetch sentence categories');
        }
      } catch (error) {
        console.error('Error fetching sentence categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Load sentence subcategories from API
  useEffect(() => {
    const fetchSubcategories = async () => {
      setLoadingSubcategories(true);
      try {
        const response = await fetch('/api/sentences/subcategories');
        if (response.ok) {
          const data = await response.json();
          setSentenceSubcategories(data.subcategories || []);
        } else {
          console.error('Failed to fetch sentence subcategories');
        }
      } catch (error) {
        console.error('Error fetching sentence subcategories:', error);
      } finally {
        setLoadingSubcategories(false);
      }
    };

    fetchSubcategories();
  }, []);

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
        // Check if grammar config has language, at least one verb type, tense, and person
        gameConfigComplete = gameConfigComplete &&
          gameConfig.grammarConfig.language &&
          gameConfig.grammarConfig.verbTypes.length > 0 &&
          gameConfig.grammarConfig.tenses.length > 0 &&
          (gameConfig.grammarConfig.persons?.length || 0) > 0;
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
            {/* Content Configuration (only for vocabulary and sentence games, not grammar games) */}
            {(hasVocabGames || hasSentenceGames || hasAssessments) && (
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
            )}

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
                        disabled={loadingCategories}
                      >
                        <option value="">
                          {loadingCategories ? 'Loading themes...' : 'Select theme...'}
                        </option>
                        {sentenceCategories.map(category => (
                          <option key={category} value={category}>
                            {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
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
                        disabled={loadingSubcategories}
                      >
                        <option value="">
                          {loadingSubcategories ? 'Loading topics...' : 'Select topic...'}
                        </option>
                        {sentenceSubcategories.map(subcategory => (
                          <option key={subcategory} value={subcategory}>
                            {subcategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </option>
                        ))}
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
                      {[
                        { id: 'regular', name: 'Regular', description: 'Follow standard patterns' },
                        { id: 'irregular', name: 'Irregular', description: 'Unique conjugation patterns' },
                        { id: 'stem-changing', name: 'Stem-Changing', description: 'Change stem vowels' },
                        { id: 'reflexive', name: 'Reflexive', description: 'Used with reflexive pronouns' }
                      ].map((type) => (
                        <label key={type.id} className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            checked={gameConfig.grammarConfig.verbTypes.includes(type.id as any)}
                            onChange={(e) => {
                              const verbTypes = e.target.checked
                                ? [...gameConfig.grammarConfig.verbTypes, type.id as any]
                                : gameConfig.grammarConfig.verbTypes.filter(t => t !== type.id);
                              setGameConfig(prev => ({
                                ...prev,
                                grammarConfig: { ...prev.grammarConfig, verbTypes }
                              }));
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4 mt-1"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{type.name}</div>
                            <div className="text-xs text-gray-500">{type.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Person/Pronoun Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Persons/Pronouns
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { id: 'yo', name: 'Yo (I)', example: 'hablo' },
                        { id: 'tu', name: 'Tú (You)', example: 'hablas' },
                        { id: 'el_ella_usted', name: 'Él/Ella/Usted', example: 'habla' },
                        { id: 'nosotros', name: 'Nosotros (We)', example: 'hablamos' },
                        { id: 'vosotros', name: 'Vosotros', example: 'habláis' },
                        { id: 'ellos_ellas_ustedes', name: 'Ellos/Ellas/Ustedes', example: 'hablan' }
                      ].map((person) => (
                        <label key={person.id} className="flex items-start space-x-2 p-2 rounded border hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={gameConfig.grammarConfig.persons?.includes(person.id as any) || false}
                            onChange={(e) => {
                              const persons = e.target.checked
                                ? [...(gameConfig.grammarConfig.persons || []), person.id as any]
                                : (gameConfig.grammarConfig.persons || []).filter(p => p !== person.id);
                              setGameConfig(prev => ({
                                ...prev,
                                grammarConfig: { ...prev.grammarConfig, persons }
                              }));
                            }}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4 mt-1"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{person.name}</div>
                            <div className="text-xs text-gray-500 italic">e.g., {person.example}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tenses */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tenses
                    </label>

                    {/* Simple Tenses */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Simple Tenses</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          { id: 'present', name: 'Present', level: 'beginner' },
                          { id: 'preterite', name: 'Preterite', level: 'intermediate' },
                          { id: 'imperfect', name: 'Imperfect', level: 'intermediate' },
                          { id: 'future', name: 'Future', level: 'intermediate' },
                          { id: 'conditional', name: 'Conditional', level: 'advanced' },
                          { id: 'present_subjunctive', name: 'Present Subjunctive', level: 'advanced' },
                          { id: 'imperfect_subjunctive', name: 'Imperfect Subjunctive', level: 'advanced' }
                        ].map((tense) => (
                          <label key={tense.id} className="flex items-start space-x-2 p-2 rounded border hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={gameConfig.grammarConfig.tenses.includes(tense.id as any)}
                              onChange={(e) => {
                                const tenses = e.target.checked
                                  ? [...gameConfig.grammarConfig.tenses, tense.id as any]
                                  : gameConfig.grammarConfig.tenses.filter(t => t !== tense.id);
                                setGameConfig(prev => ({
                                  ...prev,
                                  grammarConfig: { ...prev.grammarConfig, tenses }
                                }));
                              }}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4 mt-1"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{tense.name}</div>
                              <div className={`text-xs px-1 py-0.5 rounded inline-block ${
                                tense.level === 'beginner' ? 'bg-green-100 text-green-700' :
                                tense.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {tense.level}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Compound Tenses */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Compound Tenses (Perfect)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[
                          { id: 'present_perfect', name: 'Present Perfect', example: 'he hablado', level: 'intermediate' },
                          { id: 'past_perfect', name: 'Past Perfect', example: 'había hablado', level: 'advanced' },
                          { id: 'future_perfect', name: 'Future Perfect', example: 'habré hablado', level: 'advanced' },
                          { id: 'conditional_perfect', name: 'Conditional Perfect', example: 'habría hablado', level: 'advanced' },
                          { id: 'present_perfect_subjunctive', name: 'Present Perfect Subjunctive', example: 'haya hablado', level: 'advanced' },
                          { id: 'past_perfect_subjunctive', name: 'Past Perfect Subjunctive', example: 'hubiera hablado', level: 'advanced' }
                        ].map((tense) => (
                          <label key={tense.id} className="flex items-start space-x-2 p-2 rounded border hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={gameConfig.grammarConfig.tenses.includes(tense.id as any)}
                              onChange={(e) => {
                                const tenses = e.target.checked
                                  ? [...gameConfig.grammarConfig.tenses, tense.id as any]
                                  : gameConfig.grammarConfig.tenses.filter(t => t !== tense.id);
                                setGameConfig(prev => ({
                                  ...prev,
                                  grammarConfig: { ...prev.grammarConfig, tenses }
                                }));
                              }}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4 mt-1"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{tense.name}</div>
                              <div className="text-xs text-gray-500 italic">e.g., {tense.example}</div>
                              <div className={`text-xs px-1 py-0.5 rounded inline-block mt-1 ${
                                tense.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {tense.level}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
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
                  {(gameConfig.sentenceConfig.source && (gameConfig.sentenceConfig.theme || gameConfig.sentenceConfig.topic || gameConfig.sentenceConfig.customSetId)) ? '✓ Configured' : '⚠ Needs setup'}
                </span>
              </div>
            )}
            {hasGrammarGames && (
              <div>
                <span className="text-gray-600">Grammar:</span>
                <span className="ml-2 font-medium text-purple-600">
                  {gameConfig.grammarConfig.verbTypes.length > 0 && gameConfig.grammarConfig.tenses.length > 0 && (gameConfig.grammarConfig.persons?.length || 0) > 0 ? '✓ Configured' : '⚠ Needs setup'}
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
