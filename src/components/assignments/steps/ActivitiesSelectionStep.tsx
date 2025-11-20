'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, FileCheck, Plus, X, Brain, Settings, Crown, GraduationCap } from 'lucide-react';
import { StepProps } from '../types/AssignmentTypes';
import MultiGameSelector from '../MultiGameSelector';
import AssessmentConfigModal from '../AssessmentConfigModal';

// Available assessment types - matches the main ASSESSMENT_TYPES list
const AVAILABLE_ASSESSMENTS = [
  {
    id: 'reading-comprehension',
    name: 'Reading Comprehension',
    type: 'reading',
    estimatedTime: '15-25 minutes',
    skills: ['Reading', 'Comprehension'],
    description: 'Test your understanding of written texts'
  },
  {
    id: 'gcse-reading',
    name: 'GCSE Reading Exam',
    type: 'reading',
    estimatedTime: '45-60 min',
    skills: ['Reading'],
    description: 'AQA & Edexcel papers',
    requiresExamBoard: true,
    requiresPaper: true
  },
  {
    id: 'gcse-listening',
    name: 'GCSE Listening Exam',
    type: 'listening',
    estimatedTime: '35-45 min',
    skills: ['Listening'],
    description: 'AQA & Edexcel papers',
    requiresExamBoard: true,
    requiresPaper: true
  },
  {
    id: 'gcse-writing',
    name: 'GCSE Writing Exam',
    type: 'writing',
    estimatedTime: '60-75 min',
    skills: ['Writing'],
    description: 'AQA papers available',
    requiresExamBoard: true,
    requiresPaper: true
  },
  {
    id: 'gcse-speaking',
    name: 'GCSE Speaking Exam',
    type: 'speaking',
    estimatedTime: '7-12 min',
    skills: ['Speaking'],
    description: 'AQA & Edexcel speaking assessments',
    requiresExamBoard: true,
    requiresPaper: false
  },
  {
    id: 'topic-based',
    name: 'Topic-Based Assessments',
    type: 'reading',
    estimatedTime: '15-25 minutes',
    skills: ['Reading', 'Vocabulary', 'Grammar'],
    description: 'Focused practice on specific AQA themes and topics'
  },
  {
    id: 'dictation',
    name: 'Dictation Practice',
    type: 'listening',
    estimatedTime: '10-15 minutes',
    skills: ['Listening', 'Writing', 'Spelling'],
    description: 'Improve listening and writing skills with GCSE-style dictation exercises'
  }
];

// Available skills activities - Grammar lessons, practice, and quizzes
const AVAILABLE_SKILLS = [
  {
    id: 'grammar-activity',
    name: 'Grammar Activity',
    type: 'combined',
    estimatedTime: 'Varies by selection',
    skills: ['Grammar'],
    description: 'Create a complete grammar learning sequence with lessons, practice, and quizzes'
  }
];

// Available VocabMaster learning modes
const AVAILABLE_VOCABMASTER_MODES = [
  {
    id: 'flashcard_review',
    name: 'Flashcards',
    description: 'Classic flashcard review with digital cards',
    estimatedTime: '8-12 min',
    difficulty: 'Beginner',
    category: 'core'
  },
  {
    id: 'multiple_choice_quiz',
    name: 'Multiple Choice',
    description: 'Choose the correct translation from multiple options',
    estimatedTime: '5-10 min',
    difficulty: 'Beginner',
    category: 'core'
  },
  {
    id: 'listening_practice',
    name: 'Listening Practice',
    description: 'Improve listening skills with audio exercises',
    estimatedTime: '10-15 min',
    difficulty: 'Intermediate',
    category: 'skills'
  },
  {
    id: 'dictation_practice',
    name: 'Dictation',
    description: 'Listen and type what you hear',
    estimatedTime: '8-12 min',
    difficulty: 'Intermediate',
    category: 'skills'
  },
  {
    id: 'context_practice',
    name: 'Context Practice',
    description: 'Fill in missing words in sentences',
    estimatedTime: '10-15 min',
    difficulty: 'Intermediate',
    category: 'skills'
  },
  {
    id: 'speed_challenge',
    name: 'Speed Challenge',
    description: 'Test your vocabulary knowledge under time pressure',
    estimatedTime: '5-8 min',
    difficulty: 'Advanced',
    category: 'challenge'
  },
  {
    id: 'word_matching',
    name: 'Word Matching',
    description: 'Match words with their translations',
    estimatedTime: '6-10 min',
    difficulty: 'Intermediate',
    category: 'challenge'
  }
];

export default function ActivitiesSelectionStep({
  gameConfig,
  setGameConfig,
  assessmentConfig,
  setAssessmentConfig,
  skillsConfig,
  setSkillsConfig,
  vocabMasterConfig,
  setVocabMasterConfig,
  onStepComplete,
  isAdvancedMode = true, // Default to advanced mode for backward compatibility
}: StepProps & { isAdvancedMode?: boolean }) {
  const [activeTab, setActiveTab] = useState<'games' | 'assessments' | 'skills' | 'vocabmaster'>('games');
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [selectedAssessmentForConfig, setSelectedAssessmentForConfig] = useState<typeof AVAILABLE_ASSESSMENTS[0] | null>(null);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);
  
  // Simple mode: track which activity type user selected
  const [simpleActivityType, setSimpleActivityType] = useState<'games' | 'vocabmaster' | 'assessments' | 'skills' | null>(null);

  // Check if step is completed
  useEffect(() => {
    const hasGames = gameConfig.selectedGames.length > 0;
    const hasAssessments = assessmentConfig.selectedAssessments.length > 0;
    const hasSkills = skillsConfig.selectedSkills.length > 0;
    const hasVocabMaster = vocabMasterConfig.selectedModes.length > 0;
    const isCompleted = hasGames || hasAssessments || hasSkills || hasVocabMaster;
    onStepComplete('activities', isCompleted);
  }, [gameConfig.selectedGames, assessmentConfig.selectedAssessments, skillsConfig.selectedSkills, vocabMasterConfig.selectedModes, onStepComplete]);

  const openConfigModal = (assessmentType: typeof AVAILABLE_ASSESSMENTS[0]) => {
    setSelectedAssessmentForConfig(assessmentType);
    setEditingAssessmentId(null);
    setConfigModalOpen(true);
  };

  const openEditModal = (assessment: any) => {
    const assessmentType = AVAILABLE_ASSESSMENTS.find(a => a.id === assessment.type);
    if (assessmentType) {
      setSelectedAssessmentForConfig(assessmentType);
      setEditingAssessmentId(assessment.id);
      setConfigModalOpen(true);
    }
  };

  const handleConfigSave = (config: any) => {
    if (editingAssessmentId) {
      // Update existing assessment
      setAssessmentConfig(prev => ({
        ...prev,
        selectedAssessments: prev.selectedAssessments.map(a =>
          a.id === editingAssessmentId
            ? { ...a, instanceConfig: config }
            : a
        )
      }));
    } else if (selectedAssessmentForConfig) {
      // In Simple Mode, only allow 1 assessment
      if (!isAdvancedMode && assessmentConfig.selectedAssessments.length >= 1) {
        return;
      }

      // Add new assessment
      const instanceId = `${selectedAssessmentForConfig.id}-${Date.now()}`;
      const newAssessment = {
        id: instanceId,
        type: selectedAssessmentForConfig.id,
        name: selectedAssessmentForConfig.name,
        estimatedTime: selectedAssessmentForConfig.estimatedTime,
        skills: selectedAssessmentForConfig.skills,
        instanceConfig: config
      };

      setAssessmentConfig(prev => ({
        ...prev,
        selectedAssessments: [...prev.selectedAssessments, newAssessment]
      }));
    }
  };

  const removeAssessmentFromBasket = (assessmentId: string) => {
    setAssessmentConfig(prev => ({
      ...prev,
      selectedAssessments: prev.selectedAssessments.filter(a => a.id !== assessmentId)
    }));
  };

  const addSkillToBasket = (skillType: typeof AVAILABLE_SKILLS[0]) => {
    // In Simple Mode, only allow 1 skill
    if (!isAdvancedMode && skillsConfig.selectedSkills.length >= 1) {
      return;
    }

    const newSkill = {
      id: `${skillType.id}-${Date.now()}`,
      type: skillType.type,
      name: skillType.name,
      estimatedTime: skillType.estimatedTime,
      skills: skillType.skills,
      instanceConfig: {
        language: skillsConfig.generalLanguage || 'spanish',
        category: '', // Will be set in configuration step
        topicIds: [], // Will be set in configuration step
        contentTypes: ['lesson', 'practice', 'quiz'] as ('lesson' | 'quiz' | 'practice')[], // All types by default
        timeLimit: skillsConfig.generalTimeLimit || 20,
        maxAttempts: skillsConfig.generalMaxAttempts || 3,
        showHints: skillsConfig.generalShowHints ?? true,
        randomizeQuestions: skillsConfig.generalRandomizeQuestions ?? false,
      }
    };

    setSkillsConfig(prev => ({
      ...prev,
      selectedSkills: [...prev.selectedSkills, newSkill]
    }));
  };

  const removeSkillFromBasket = (skillId: string) => {
    setSkillsConfig(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.filter(s => s.id !== skillId)
    }));
  };

  const addVocabMasterModeToBasket = (mode: typeof AVAILABLE_VOCABMASTER_MODES[0]) => {
    // In Simple Mode, only allow 1 VocabMaster mode
    if (!isAdvancedMode && vocabMasterConfig.selectedModes.length >= 1) {
      return;
    }

    const newMode = {
      id: `${mode.id}-${Date.now()}`,
      modeId: mode.id,
      name: mode.name,
      estimatedTime: mode.estimatedTime,
      difficulty: mode.difficulty,
      instanceConfig: {
        language: 'spanish', // Default language
        wordsPerSession: 20,
        sessionLength: 15,
        enableAudio: true,
        enableSpacedRepetition: true,
        adaptiveDifficulty: true,
        showHints: true,
        timeLimit: 0, // 0 means no time limit
        vocabularySource: {
          source: '' as 'category' | 'theme' | 'topic' | 'custom' | 'create' | '',
          language: 'spanish',
          curriculumLevel: 'KS3' as 'KS3' | 'KS4'
        }
      }
    };

    setVocabMasterConfig(prev => ({
      ...prev,
      selectedModes: [...prev.selectedModes, newMode]
    }));
  };

  const removeVocabMasterModeFromBasket = (modeId: string) => {
    setVocabMasterConfig(prev => ({
      ...prev,
      selectedModes: prev.selectedModes.filter(m => m.id !== modeId)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select Activities</h2>
        <p className="text-sm text-gray-600">Choose games and assessments for your assignment</p>
      </div>

      {/* Tab Navigation - Only show in Advanced Mode */}
      {isAdvancedMode ? (
        <div className="grid grid-cols-3 gap-2 bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={() => setActiveTab('games')}
            className={`flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 transform ${
              activeTab === 'games'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 border-2 border-blue-400'
                : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md border border-gray-200'
            }`}
          >
            <Gamepad2 className={`h-5 w-5 mr-2 ${activeTab === 'games' ? 'text-white' : 'text-blue-600'}`} />
            <span>Games</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'games'
                ? 'bg-white bg-opacity-20 text-white'
                : gameConfig.selectedGames.length > 0
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-500'
            }`}>
              {gameConfig.selectedGames.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('vocabmaster')}
            className={`flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 transform ${
              activeTab === 'vocabmaster'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105 border-2 border-purple-400'
                : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md border border-gray-200'
            }`}
          >
            <Brain className={`h-5 w-5 mr-2 ${activeTab === 'vocabmaster' ? 'text-white' : 'text-purple-600'}`} />
            <span>VocabMaster</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'vocabmaster'
                ? 'bg-white bg-opacity-20 text-white'
                : vocabMasterConfig.selectedModes.length > 0
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-500'
            }`}>
              {vocabMasterConfig.selectedModes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 transform ${
              activeTab === 'skills'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105 border-2 border-orange-400'
                : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md border border-gray-200'
            }`}
          >
            <Settings className={`h-5 w-5 mr-2 ${activeTab === 'skills' ? 'text-white' : 'text-orange-600'}`} />
            <span>Skills</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'skills'
                ? 'bg-white bg-opacity-20 text-white'
                : skillsConfig.selectedSkills.length > 0
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-500'
            }`}>
              {skillsConfig.selectedSkills.length}
            </span>
          </button>
        </div>
      ) : (
        <div className="text-center py-2 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Choose Activity Type</h3>
          <p className="text-sm text-gray-600">Select one activity type for this assignment</p>
        </div>
      )}

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Simple Mode: Show activity type selector first */}
        {!isAdvancedMode && !simpleActivityType ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Games Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSimpleActivityType('games');
                setActiveTab('games');
              }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 cursor-pointer hover:border-blue-400 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Gamepad2 className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Practice Games</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Quick vocabulary and sentence building games for engaging practice
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                  <span className="px-3 py-1 bg-blue-100 rounded-full">5-15 min</span>
                  <span className="px-3 py-1 bg-blue-100 rounded-full">Fun & Interactive</span>
                </div>
              </div>
            </motion.div>

            {/* VocabMaster Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSimpleActivityType('vocabmaster');
                setActiveTab('vocabmaster');
              }}
              className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8 cursor-pointer hover:border-purple-400 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">VocabMaster</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive vocabulary learning with flashcards, dictation, and spaced repetition
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-purple-600">
                  <span className="px-3 py-1 bg-purple-100 rounded-full">10-20 min</span>
                  <span className="px-3 py-1 bg-purple-100 rounded-full">Adaptive Learning</span>
                </div>
              </div>
            </motion.div>

            {/* Skills Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSimpleActivityType('skills');
                setActiveTab('skills');
              }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-8 cursor-pointer hover:border-orange-400 hover:shadow-xl transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Grammar Skills</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Complete grammar learning with lessons, practice exercises, and quizzes
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-orange-600">
                  <span className="px-3 py-1 bg-orange-100 rounded-full">15-60 min</span>
                  <span className="px-3 py-1 bg-orange-100 rounded-full">Structured Learning</span>
                </div>
              </div>
            </motion.div>
          </div>
        ) : activeTab === 'games' ? (
          <div>
            {!isAdvancedMode && (
              <div className="mb-4 space-y-3">
                <button
                  onClick={() => setSimpleActivityType(null)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Choose Different Activity Type
                </button>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Simple Mode:</strong> Select one game for focused practice. Switch to Advanced Mode for multi-activity assignments.
                  </p>
                </div>
              </div>
            )}
            <MultiGameSelector
              selectedGames={gameConfig.selectedGames}
              onSelectionChange={(selectedGames) => {
                setGameConfig(prev => ({
                  ...prev,
                  selectedGames
                }));
              }}
              maxSelections={isAdvancedMode ? 15 : 1}
            />
          </div>
        ) : activeTab === 'vocabmaster' ? (
          <div>
            {!isAdvancedMode && (
              <div className="mb-4 space-y-3">
                <button
                  onClick={() => setSimpleActivityType(null)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Choose Different Activity Type
                </button>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Simple Mode:</strong> Select one VocabMaster learning mode for comprehensive vocabulary practice. Switch to Advanced Mode for multi-activity assignments.
                  </p>
                </div>
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-4">VocabMaster Learning Modes</h3>
            <p className="text-sm text-gray-600 mb-6">
              Select comprehensive vocabulary learning activities with adaptive difficulty and spaced repetition
            </p>

            {/* VocabMaster Modes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {AVAILABLE_VOCABMASTER_MODES.map((mode) => (
                <motion.div
                  key={mode.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-5 cursor-pointer hover:border-purple-400 hover:shadow-lg transition-all"
                  onClick={() => addVocabMasterModeToBasket(mode)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{mode.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{mode.description}</p>
                    </div>
                    <button
                      className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        addVocabMasterModeToBasket(mode);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {mode.difficulty}
                    </span>
                    <span className="text-gray-500">{mode.estimatedTime}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selected VocabMaster Modes */}
            {vocabMasterConfig.selectedModes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Learning Modes ({vocabMasterConfig.selectedModes.length})
                </h3>
                <div className="space-y-3">
                  {vocabMasterConfig.selectedModes.map((mode, index) => (
                    <div key={mode.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{mode.name}</h4>
                            <p className="text-sm text-gray-600">
                              {mode.estimatedTime} • {mode.difficulty}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeVocabMasterModeFromBasket(mode.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                          title="Remove mode"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'skills' ? (
          <div className="space-y-6">
            {!isAdvancedMode && (
              <div className="mb-4 space-y-3">
                <button
                  onClick={() => setSimpleActivityType(null)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Choose Different Activity Type
                </button>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Simple Mode:</strong> Select one grammar skill activity for targeted practice. Switch to Advanced Mode for multi-activity assignments.
                  </p>
                </div>
              </div>
            )}
            {/* Available Skills */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Skills Activities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_SKILLS.map(skill => (
                  <div key={skill.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{skill.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{skill.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>⏱️ {skill.estimatedTime}</span>
                          <span>🎯 {skill.skills.join(', ')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => addSkillToBasket(skill)}
                        className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Skills */}
            {skillsConfig.selectedSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Skills ({skillsConfig.selectedSkills.length})
                </h3>
                <div className="space-y-3">
                  {skillsConfig.selectedSkills.map((skill, index) => (
                    <div key={skill.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                            <p className="text-sm text-gray-600">{skill.estimatedTime} • {skill.skills.join(', ')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSkillFromBasket(skill.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                          title="Remove skill"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Selection Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Practice Games:</span>
            <span className="ml-2 font-medium text-purple-600">{gameConfig.selectedGames.length} selected</span>
          </div>
          <div>
            <span className="text-gray-600">VocabMaster:</span>
            <span className="ml-2 font-medium text-purple-600">{vocabMasterConfig.selectedModes.length} selected</span>
          </div>
          <div>
            <span className="text-gray-600">Assessments:</span>
            <span className="ml-2 font-medium text-purple-600">{assessmentConfig.selectedAssessments.length} selected</span>
          </div>
          <div>
            <span className="text-gray-600">Skills:</span>
            <span className="ml-2 font-medium text-purple-600">{skillsConfig.selectedSkills.length} selected</span>
          </div>
        </div>
        {(gameConfig.selectedGames.length === 0 && vocabMasterConfig.selectedModes.length === 0 && assessmentConfig.selectedAssessments.length === 0 && skillsConfig.selectedSkills.length === 0) && (
          <p className="text-sm text-amber-600 mt-2">⚠️ Please select at least one activity to continue.</p>
        )}
      </div>

      {/* Assessment Configuration Modal */}
      {selectedAssessmentForConfig && (
        <AssessmentConfigModal
          isOpen={configModalOpen}
          onClose={() => {
            setConfigModalOpen(false);
            setSelectedAssessmentForConfig(null);
            setEditingAssessmentId(null);
          }}
          assessmentType={selectedAssessmentForConfig}
          currentConfig={
            editingAssessmentId
              ? assessmentConfig.selectedAssessments.find(a => a.id === editingAssessmentId)?.instanceConfig
              : undefined
          }
          onSave={handleConfigSave}
        />
      )}
    </motion.div>
  );
}
