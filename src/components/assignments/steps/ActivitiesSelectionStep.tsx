'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, FileCheck, Plus, X, Brain } from 'lucide-react';
import { StepProps } from '../types/AssignmentTypes';
import MultiGameSelector from '../MultiGameSelector';

// Available assessment types - matches the main ASSESSMENT_TYPES list
const AVAILABLE_ASSESSMENTS = [
  {
    id: 'reading-comprehension',
    name: 'Reading Comprehension',
    type: 'reading',
    estimatedTime: '15-25 minutes',
    skills: ['Reading'],
    description: 'Text-based comprehension with multiple question types and automated marking'
  },
  {
    id: 'aqa-reading',
    name: 'AQA Reading Assessment',
    type: 'reading',
    estimatedTime: '45-60 minutes',
    skills: ['Reading'],
    description: 'Official AQA-style reading assessment with authentic exam questions'
  },
  {
    id: 'aqa-listening',
    name: 'AQA Listening Assessment',
    type: 'listening',
    estimatedTime: '35-45 minutes',
    skills: ['Listening'],
    description: 'Official AQA-style listening assessment with audio materials'
  },
  {
    id: 'dictation',
    name: 'Dictation Assessment',
    type: 'listening',
    estimatedTime: '20-30 minutes',
    skills: ['Listening', 'Writing'],
    description: 'Listen and write dictation exercises with accuracy scoring'
  },
  {
    id: 'four-skills',
    name: 'Four Skills Assessment',
    type: 'comprehensive',
    estimatedTime: '60-90 minutes',
    skills: ['Reading', 'Writing', 'Listening', 'Speaking'],
    description: 'Comprehensive assessment covering reading, writing, listening, and speaking'
  },
  {
    id: 'listening-comprehension',
    name: 'Listening Comprehension',
    type: 'listening',
    estimatedTime: '10-20 minutes',
    skills: ['Listening'],
    description: 'Audio-based comprehension tasks with authentic materials'
  },
  {
    id: 'exam-style-questions',
    name: 'Exam-Style Questions',
    type: 'comprehensive',
    estimatedTime: '30-60 minutes',
    skills: ['Reading', 'Writing', 'Listening', 'Speaking'],
    description: 'UK exam board format questions across all four skills'
  }
];

// Available skills activities - Grammar lessons, practice, and quizzes
const AVAILABLE_SKILLS = [
  {
    id: 'grammar-lesson',
    name: 'Grammar Lesson',
    type: 'lesson',
    estimatedTime: '15-25 minutes',
    skills: ['Grammar'],
    description: 'Interactive grammar lessons with explanations, examples, and conjugation tables'
  },
  {
    id: 'grammar-practice',
    name: 'Grammar Practice',
    type: 'practice',
    estimatedTime: '10-20 minutes',
    skills: ['Grammar'],
    description: 'Hands-on grammar practice with immediate feedback and hints'
  },
  {
    id: 'grammar-quiz',
    name: 'Grammar Quiz',
    type: 'quiz',
    estimatedTime: '10-15 minutes',
    skills: ['Grammar'],
    description: 'Grammar assessment with multiple question types and detailed explanations'
  }
];

export default function ActivitiesSelectionStep({
  gameConfig,
  setGameConfig,
  assessmentConfig,
  setAssessmentConfig,
  skillsConfig,
  setSkillsConfig,
  onStepComplete,
}: StepProps) {
  const [activeTab, setActiveTab] = useState<'games' | 'assessments' | 'skills'>('games');

  // Check if step is completed
  useEffect(() => {
    const hasGames = gameConfig.selectedGames.length > 0;
    const hasAssessments = assessmentConfig.selectedAssessments.length > 0;
    const hasSkills = skillsConfig.selectedSkills.length > 0;
    const isCompleted = hasGames || hasAssessments || hasSkills;
    onStepComplete('activities', isCompleted);
  }, [gameConfig.selectedGames, assessmentConfig.selectedAssessments, skillsConfig.selectedSkills, onStepComplete]);

  const addAssessmentToBasket = (assessmentType: typeof AVAILABLE_ASSESSMENTS[0]) => {
    const instanceId = `${assessmentType.id}-${Date.now()}`;
    const newAssessment = {
      id: instanceId,
      type: assessmentType.id,
      name: assessmentType.name,
      estimatedTime: assessmentType.estimatedTime,
      skills: assessmentType.skills,
      instanceConfig: {
        language: assessmentConfig.generalLanguage,
        difficulty: assessmentConfig.generalDifficulty,
        timeLimit: assessmentConfig.generalTimeLimit,
        maxAttempts: assessmentConfig.generalMaxAttempts,
        autoGrade: assessmentConfig.generalAutoGrade,
        feedbackEnabled: assessmentConfig.generalFeedbackEnabled,
      }
    };

    setAssessmentConfig(prev => ({
      ...prev,
      selectedAssessments: [...prev.selectedAssessments, newAssessment]
    }));
  };

  const removeAssessmentFromBasket = (assessmentId: string) => {
    setAssessmentConfig(prev => ({
      ...prev,
      selectedAssessments: prev.selectedAssessments.filter(a => a.id !== assessmentId)
    }));
  };

  const addSkillToBasket = (skillType: typeof AVAILABLE_SKILLS[0]) => {
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
        contentTypes: [skillType.type as 'lesson' | 'quiz' | 'practice'],
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

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('games')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'games'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Gamepad2 className="h-4 w-4 mr-2" />
          Practice Games ({gameConfig.selectedGames.length})
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'assessments'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileCheck className="h-4 w-4 mr-2" />
          Assessments ({assessmentConfig.selectedAssessments.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'skills'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Brain className="h-4 w-4 mr-2" />
          Skills ({skillsConfig.selectedSkills.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'games' ? (
          <div>
            <MultiGameSelector
              selectedGames={gameConfig.selectedGames}
              onSelectionChange={(selectedGames) => {
                setGameConfig(prev => ({
                  ...prev,
                  selectedGames
                }));
              }}
            />
          </div>
        ) : activeTab === 'assessments' ? (
          <div className="space-y-6">
            {/* Available Assessments */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Assessments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_ASSESSMENTS.map(assessment => (
                  <div key={assessment.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{assessment.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{assessment.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>⏱️ {assessment.estimatedTime}</span>
                          <span>🎯 {assessment.skills.join(', ')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => addAssessmentToBasket(assessment)}
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

            {/* Selected Assessments */}
            {assessmentConfig.selectedAssessments.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Assessments ({assessmentConfig.selectedAssessments.length})
                </h3>
                <div className="space-y-3">
                  {assessmentConfig.selectedAssessments.map((assessment, index) => (
                    <div key={assessment.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{assessment.name}</h4>
                            <p className="text-sm text-gray-600">{assessment.estimatedTime} • {assessment.skills.join(', ')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeAssessmentFromBasket(assessment.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                          title="Remove assessment"
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
        ) : (
          <div className="space-y-6">
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
        )}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Selection Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Practice Games:</span>
            <span className="ml-2 font-medium text-purple-600">{gameConfig.selectedGames.length} selected</span>
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
        {(gameConfig.selectedGames.length === 0 && assessmentConfig.selectedAssessments.length === 0 && skillsConfig.selectedSkills.length === 0) && (
          <p className="text-sm text-amber-600 mt-2">⚠️ Please select at least one activity to continue.</p>
        )}
      </div>
    </motion.div>
  );
}
