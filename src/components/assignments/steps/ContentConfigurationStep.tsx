'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Gamepad2, FileCheck, BookOpen, Brain, Target } from 'lucide-react';
import { StepProps } from '../types/AssignmentTypes';

import CurriculumContentSelector from '../CurriculumContentSelector';

// Skills Configuration Component
function SkillsConfigurationSection({
  skillsConfig,
  setSkillsConfig
}: {
  skillsConfig: any;
  setSkillsConfig: any;
}) {
  const [grammarCategories, setGrammarCategories] = useState<any[]>([]);
  const [grammarTopics, setGrammarTopics] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);

  // Load grammar categories
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        // Use the first skill's language or default to Spanish
        const language = skillsConfig.selectedSkills[0]?.instanceConfig?.language || skillsConfig.generalLanguage || 'spanish';
        const languageCode = language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'de';

        const response = await fetch(`/api/grammar/topics?language=${languageCode}`);
        const data = await response.json();
        if (data.success) {
          // Group by category
          const categories = data.data.reduce((acc: any, topic: any) => {
            if (!acc[topic.category]) {
              acc[topic.category] = {
                id: topic.category,
                name: topic.category.charAt(0).toUpperCase() + topic.category.slice(1),
                topics: []
              };
            }
            acc[topic.category].topics.push(topic);
            return acc;
          }, {});
          setGrammarCategories(Object.values(categories));
        }
      } catch (error) {
        console.error('Error loading grammar categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (skillsConfig.selectedSkills.length > 0) {
      loadCategories();
    }
  }, [skillsConfig.selectedSkills, skillsConfig.generalLanguage]);

  const updateSkillConfig = (skillId: string, updates: any) => {
    const updatedSkills = skillsConfig.selectedSkills.map((s: any) =>
      s.id === skillId
        ? {
            ...s,
            instanceConfig: {
              ...s.instanceConfig,
              ...updates
            }
          }
        : s
    );
    setSkillsConfig((prev: any) => ({
      ...prev,
      selectedSkills: updatedSkills
    }));
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
      <div className="flex items-center mb-3">
        <Brain className="h-6 w-6 text-purple-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Skills Configuration</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Select grammar categories and topics for your skills activities
      </p>

      <div className="space-y-6">
        {skillsConfig.selectedSkills.map((skill: any, index: number) => (
          <div key={skill.id} className="bg-white border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900">{skill.name}</h5>
                  <p className="text-sm text-gray-600">{skill.type} • {skill.estimatedTime}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language *
                </label>
                <select
                  value={skill.instanceConfig?.language || skillsConfig.generalLanguage}
                  onChange={(e) => updateSkillConfig(skill.id, { language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>

              {/* Grammar Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grammar Category *
                </label>
                <select
                  value={skill.instanceConfig?.category || ''}
                  onChange={(e) => {
                    updateSkillConfig(skill.id, {
                      category: e.target.value,
                      topicIds: [] // Reset topics when category changes
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={loadingCategories}
                >
                  <option value="">Select category...</option>
                  {grammarCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grammar Topics Selection */}
            {skill.instanceConfig?.category && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grammar Topics * (Select one or more)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {grammarCategories
                    .find(cat => cat.id === skill.instanceConfig.category)
                    ?.topics.map((topic: any) => (
                      <label key={topic.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          checked={skill.instanceConfig?.topicIds?.includes(topic.id) || false}
                          onChange={(e) => {
                            const currentTopics = skill.instanceConfig?.topicIds || [];
                            const newTopics = e.target.checked
                              ? [...currentTopics, topic.id]
                              : currentTopics.filter((id: string) => id !== topic.id);
                            updateSkillConfig(skill.id, { topicIds: newTopics });
                          }}
                          className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{topic.title}</div>
                          <div className="text-xs text-gray-500">{topic.description}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${
                              topic.difficulty_level === 'beginner' ? 'bg-green-100 text-green-700' :
                              topic.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {topic.difficulty_level}
                            </span>
                            <span className="text-xs text-gray-500">{topic.curriculum_level}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ContentConfig {
  type: 'KS3' | 'KS4' | 'custom' | 'my-vocabulary';
  language: 'spanish' | 'french' | 'german';
  categories?: string[];
  subcategories?: string[];
  examBoard?: 'AQA' | 'Edexcel' | 'edexcel';
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
  skillsConfig,
  setSkillsConfig,
  onStepComplete,
  assignmentDetails
}: StepProps) {
  const [activeTab, setActiveTab] = useState<'games' | 'assessments' | 'skills'>('games');
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
    let skillsConfigComplete = true;

    // Check game configuration completeness
    if (hasGames) {
      // Define vocabulary games by ID
  const vocabGameIds = ['memory-game', 'hangman', 'word-blast', 'noughts-and-crosses', 'word-scramble', 'vocab-blast', 'detective-listening', 'vocab-master', 'word-towers'];
  const sentenceGameIds = ['speed-builder', 'case-file-translator', 'lava-temple-word-restore', 'sentence-towers'];
  const grammarGameIds = ['conjugation-duel'];

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

    // Skills configuration completeness - check if each skill has required fields
    if (hasSkills) {
      skillsConfigComplete = skillsConfig.selectedSkills.every(skill => {
        const config = skill.instanceConfig;
        return config?.language && config?.category && config?.topicIds && config?.topicIds.length > 0;
      });
    }

    const isCompleted = (!hasGames || gameConfigComplete) && (!hasAssessments || assessmentConfigComplete) && (!hasSkills || skillsConfigComplete);
    onStepComplete('content', isCompleted);
  }, [gameConfig, assessmentConfig, skillsConfig, onStepComplete]);

  // Determine which tab to show first
  useEffect(() => {
    if (gameConfig.selectedGames.length > 0 && assessmentConfig.selectedAssessments.length === 0 && skillsConfig.selectedSkills.length === 0) {
      setActiveTab('games');
    } else if (assessmentConfig.selectedAssessments.length > 0 && gameConfig.selectedGames.length === 0 && skillsConfig.selectedSkills.length === 0) {
      setActiveTab('assessments');
    } else if (skillsConfig.selectedSkills.length > 0 && gameConfig.selectedGames.length === 0 && assessmentConfig.selectedAssessments.length === 0) {
      setActiveTab('skills');
    }
  }, [gameConfig.selectedGames.length, assessmentConfig.selectedAssessments.length, skillsConfig.selectedSkills.length]);

  const hasGames = gameConfig.selectedGames.length > 0;
  const hasAssessments = assessmentConfig.selectedAssessments.length > 0;
  const hasSkills = skillsConfig.selectedSkills.length > 0;

  // Compute skills configuration completeness for display
  const skillsConfigComplete = hasSkills ? skillsConfig.selectedSkills.every(skill => {
    const config = skill.instanceConfig;
    return config?.language && config?.category && config?.topicIds && config?.topicIds.length > 0;
  }) : true;

  // Define game types for different configurations
  const vocabGameIds = ['memory-game', 'hangman', 'word-blast', 'noughts-and-crosses', 'word-scramble', 'vocab-blast', 'detective-listening', 'vocab-master', 'word-towers'];
  const sentenceGameIds = ['speed-builder', 'case-file-translator', 'lava-temple-word-restore', 'sentence-towers'];
  const grammarGameIds = ['conjugation-duel'];

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

      {/* Show tabs if multiple activity types are selected */}
      {((hasGames && hasAssessments) || (hasGames && hasSkills) || (hasAssessments && hasSkills) || (hasGames && hasAssessments && hasSkills)) && (
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {hasGames && (
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
          )}
          {hasAssessments && (
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
          )}
          {hasSkills && (
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'skills'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Brain className="h-4 w-4 mr-2" />
              Skills Configuration
            </button>
          )}
        </div>
      )}

      {/* Unified Content Configuration */}
      <div className="min-h-[400px]">
        {(hasGames || hasAssessments || hasSkills) && (
          <div className="space-y-6">
            {/* Content Configuration (only for vocabulary and sentence games, not grammar games) */}
            {(hasVocabGames || hasSentenceGames || hasAssessments || hasSkills) && (
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

                        // Update skills config with selected language
                        if (hasSkills) {
                          setSkillsConfig(prev => ({
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
                curriculumLevel={
                  contentConfig.type === 'custom' || contentConfig.type === 'my-vocabulary'
                    ? contentConfig.type
                    : (assignmentDetails?.curriculum_level || 'KS3')
                }
                language={contentConfig.language}
                onConfigChange={(config) => {
                  console.log('🎯 [CONTENT CONFIG STEP] Config received:', config);
                  setContentConfig(config);

                  // Update both game and assessment configs based on the unified content config
                  if (hasGames) {
                    // @ts-ignore - Temporarily disable TypeScript checking
                    setGameConfig(prev => {
                      // Determine the correct source based on config type
                      let vocabularyConfig;

                      // @ts-ignore - Temporarily disable TypeScript checking
                      if (config.type === 'my-vocabulary') {
                        // Custom vocabulary from user's lists
                        console.log('🎯 [CONTENT CONFIG STEP] Setting up CUSTOM vocabulary config (from lists)');
                        vocabularyConfig = {
                          ...prev.vocabularyConfig,
                          source: 'custom' as const,
                          customListId: config.customListId,
                          customList: { name: config.customListName },
                          curriculumLevel: 'KS3' as const, // Default for custom lists
                          language: config.language === 'spanish' ? 'es' : config.language === 'french' ? 'fr' : 'de',
                        };
                      } else if (config.type === 'custom') {
                        // Custom vocabulary created inline
                        console.log('🎯 [CONTENT CONFIG STEP] Setting up CREATE vocabulary config (inline custom)');
                        vocabularyConfig = {
                          ...prev.vocabularyConfig,
                          source: 'create' as const,
                          customVocabulary: config.customVocabulary,
                          curriculumLevel: 'KS3' as const, // Default for custom vocabulary
                          language: config.language === 'spanish' ? 'es' : config.language === 'french' ? 'fr' : 'de',
                        };
                      } else {
                        // Standard category-based vocabulary
                        console.log('🎯 [CONTENT CONFIG STEP] Setting up CATEGORY vocabulary config');
                        vocabularyConfig = {
                          ...prev.vocabularyConfig,
                          source: 'category' as const,
                          // For KS4, use themes/units; for others, use categories/subcategories
                          categories: config.type === 'KS4' ? config.themes : config.categories,
                          subcategories: config.type === 'KS4' ? config.units : config.subcategories,
                          category: config.type === 'KS4' ? (config.themes?.[0] || '') : (config.categories?.[0] || ''),
                          subcategory: config.type === 'KS4' ? (config.units?.[0] || '') : (config.subcategories?.[0] || ''),
                          curriculumLevel: config.type === 'my-vocabulary' ? 'KS3' : config.type as 'KS3' | 'KS4',
                          examBoard: config.examBoard,
                          tier: config.tier,
                          language: config.language === 'spanish' ? 'es' : config.language === 'french' ? 'fr' : 'de',
                        };
                      }

                      return {
                        ...prev,
                        vocabularyConfig,
                        // Store KS4-specific data
                        themes: config.themes,
                        units: config.units
                      };
                    });
                  }

                  if (hasAssessments) {
                    // @ts-ignore - Temporarily disable TypeScript checking
                    setAssessmentConfig(prev => ({
                      ...prev,
                      assessmentCategory: config.type === 'KS4' ? (config.themes?.[0] || '') : (config.categories?.[0] || ''),
                      assessmentSubcategory: config.type === 'KS4' ? (config.units?.[0] || '') : (config.subcategories?.[0] || ''),
                      generalLevel: config.type === 'my-vocabulary' ? 'KS3' : config.type as 'KS3' | 'KS4',
                      generalExamBoard: config.examBoard || 'General',
                      generalLanguage: config.language
                    }));
                  }
                }}
                initialConfig={contentConfig}
              />

              {/* Vocabulary Options */}
              {(() => {
                const shouldShow = (contentConfig.type === 'KS4' || contentConfig.type === 'KS3') && (
                  (contentConfig.categories?.length || 0) > 0 ||
                  (contentConfig.subcategories?.length || 0) > 0 ||
                  (contentConfig.themes?.length || 0) > 0 ||
                  (contentConfig.units?.length || 0) > 0
                );
                console.log('🎯 [VOCAB OPTIONS] Should show vocabulary options?', {
                  shouldShow,
                  contentConfigType: contentConfig.type,
                  categoriesLength: contentConfig.categories?.length,
                  themesLength: contentConfig.themes?.length,
                  unitsLength: contentConfig.units?.length,
                  contentConfig
                });
                return shouldShow;
              })() && (
                <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-base font-bold text-blue-900">Vocabulary Pool Settings</h4>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    Configure how many words students will practice across multiple game sessions
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Word Pool Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Word pool
                      </label>
                      <select
                        value={gameConfig.vocabularyConfig.useAllWords ? 'all' : String(gameConfig.vocabularyConfig.wordCount ?? 'all')}
                        onChange={(e) => {
                          const value = e.target.value;
                          setGameConfig(prev => ({
                            ...prev,
                            vocabularyConfig: {
                              ...prev.vocabularyConfig,
                              useAllWords: value === 'all',
                              wordCount: value === 'all' ? undefined : parseInt(value)
                            }
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">All words from selected {contentConfig.type === 'KS4' ? 'units' : 'categories'} (capped at 75)</option>
                        <option value="10">Limit to 10</option>
                        <option value="15">Limit to 15</option>
                        <option value="20">Limit to 20</option>
                        <option value="30">Limit to 30</option>
                        <option value="50">Limit to 50</option>
                      </select>
                      <p className="mt-2 text-xs text-gray-500">
                        Games pull a small set (~10 words) each session from the pool. The pool sets the total unique words students may encounter.
                      </p>
                    </div>

                    {/* Shuffle Option */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Word Selection
                      </label>
                      <select
                        value={gameConfig.vocabularyConfig.shuffleWords ? 'shuffle' : 'order'}
                        onChange={(e) => setGameConfig(prev => ({
                          ...prev,
                          vocabularyConfig: {
                            ...prev.vocabularyConfig,
                            shuffleWords: e.target.value === 'shuffle'
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="order">In order (as stored)</option>
                        <option value="shuffle">Shuffled randomly</option>
                      </select>
                    </div>
                  </div>

                  {/* Preview Info */}
                  <div className="mt-4 p-4 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-300 rounded-xl shadow-sm">
                    <div className="text-sm font-bold text-blue-900 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Pool Summary
                    </div>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="bg-white rounded-lg p-2 border border-blue-100">
                        <strong className="text-blue-900">Selected:</strong> {
                          contentConfig.type === 'KS4'
                            ? `${contentConfig.themes?.length || 0} theme(s), ${contentConfig.units?.length || 0} unit(s)`
                            : `${contentConfig.categories?.length || 0} categor${(contentConfig.categories?.length || 0) === 1 ? 'y' : 'ies'}, ${contentConfig.subcategories?.length || 0} subcategor${(contentConfig.subcategories?.length || 0) === 1 ? 'y' : 'ies'}`
                        }
                      </div>
                      <div className="bg-white rounded-lg p-2 border border-blue-100">
                        <strong className="text-blue-900">Pool size:</strong> {
                          gameConfig.vocabularyConfig.useAllWords
                            ? 'All available words (capped at 75)'
                            : `Limited to ${gameConfig.vocabularyConfig.wordCount || 10} words`
                        }
                      </div>
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-2 border border-indigo-200">
                        <strong className="text-indigo-900">Estimated sessions:</strong> {
                          gameConfig.vocabularyConfig.useAllWords
                            ? '≈ 5–8 sessions'
                            : `≈ ${Math.ceil((gameConfig.vocabularyConfig.wordCount || 10) / 10)} session(s)`
                        }
                      </div>
                      {gameConfig.vocabularyConfig.shuffleWords && (
                        <div className="text-blue-600 bg-blue-50 rounded-lg p-2 border border-blue-200">
                          🔀 Words will be shuffled for variety
                        </div>
                      )}
                      <div className="text-xs text-gray-600 mt-2 pt-2 border-t border-blue-200 flex items-start">
                        <span className="mr-1">💡</span>
                        <span>About 10 words per session. Pool rotation mixes new (~70%) and review (~30%) items across sessions.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                  <div className="grid grid-cols-1 gap-6">
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
                  Configure grammar settings for selected grammar-based games
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

            {/* Skills Configuration */}
            {hasSkills && (
              <SkillsConfigurationSection
                skillsConfig={skillsConfig}
                setSkillsConfig={setSkillsConfig}
              />
            )}
          </div>
        )}

        {/* No activities selected */}
        {!hasGames && !hasAssessments && !hasSkills && (
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
      {(hasGames || hasAssessments || hasSkills) && (
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
            {hasSkills && (
              <div>
                <span className="text-gray-600">Skills:</span>
                <span className="ml-2 font-medium text-purple-600">
                  {skillsConfigComplete ? '✓ Configured' : '⚠ Needs setup'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
