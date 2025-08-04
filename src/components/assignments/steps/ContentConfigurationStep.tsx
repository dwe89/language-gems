'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Gamepad2, FileCheck } from 'lucide-react';
import { StepProps } from '../types/AssignmentTypes';
import SmartAssignmentConfig from '../SmartAssignmentConfig';

export default function ContentConfigurationStep({
  gameConfig,
  setGameConfig,
  assessmentConfig,
  setAssessmentConfig,
  onStepComplete,
}: StepProps) {
  const [activeTab, setActiveTab] = useState<'games' | 'assessments'>('games');

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
        // Check if vocabulary config has a source selected
        gameConfigComplete = gameConfigComplete &&
          gameConfig.vocabularyConfig.source !== '' &&
          (gameConfig.vocabularyConfig.language || '') !== '';
      }
      if (hasSentenceGames) {
        // Check if sentence config has a source selected
        gameConfigComplete = gameConfigComplete &&
          gameConfig.sentenceConfig.source !== '';
      }
      if (hasGrammarGames) {
        // Check if grammar config has language and at least one verb type and tense
        gameConfigComplete = gameConfigComplete &&
          gameConfig.grammarConfig.language !== '' &&
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

      {/* Content */}
      <div className="min-h-[400px]">
        {/* Games Configuration */}
        {((hasGames && !hasAssessments) || (hasGames && hasAssessments && activeTab === 'games')) && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Settings className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Game Content Configuration</h3>
              </div>
              <p className="text-sm text-gray-600">Configure the content settings for your selected games.</p>
            </div>

            <SmartAssignmentConfig
              selectedGames={gameConfig.selectedGames}
              vocabularyConfig={gameConfig.vocabularyConfig}
              sentenceConfig={gameConfig.sentenceConfig}
              grammarConfig={gameConfig.grammarConfig}
              onVocabularyChange={(config) => setGameConfig(prev => ({ ...prev, vocabularyConfig: config }))}
              onSentenceChange={(config) => setGameConfig(prev => ({ ...prev, sentenceConfig: config }))}
              onGrammarChange={(config) => setGameConfig(prev => ({ ...prev, grammarConfig: config }))}
            />
          </div>
        )}

        {/* Assessment Configuration */}
        {((hasAssessments && !hasGames) || (hasAssessments && hasGames && activeTab === 'assessments')) && (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FileCheck className="h-5 w-5 text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Assessment Configuration</h3>
              </div>
              <p className="text-sm text-gray-600">Configure content categories and settings for each assessment.</p>
            </div>

            {/* Enhanced assessment configuration */}
            <div className="space-y-4">
              {assessmentConfig.selectedAssessments.map((assessment, index) => (
                <div key={assessment.id} className="bg-white border border-indigo-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{assessment.name}</h5>
                      <p className="text-sm text-gray-600">{assessment.estimatedTime} • {assessment.skills?.join(', ') || 'Assessment skills'}</p>
                    </div>
                  </div>

                  {/* Assessment-specific configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={assessment.instanceConfig?.language || assessmentConfig.generalLanguage}
                        onChange={(e) => {
                          const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                            a.id === assessment.id
                              ? { ...a, instanceConfig: { ...a.instanceConfig, language: e.target.value as any } }
                              : a
                          );
                          setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                      </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                      <select
                        value={assessment.instanceConfig?.difficulty || assessmentConfig.generalDifficulty}
                        onChange={(e) => {
                          const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                            a.id === assessment.id
                              ? { ...a, instanceConfig: { ...a.instanceConfig, difficulty: e.target.value as any } }
                              : a
                          );
                          setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="foundation">Foundation</option>
                        <option value="higher">Higher</option>
                      </select>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={assessment.instanceConfig?.category || ''}
                        onChange={(e) => {
                          const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                            a.id === assessment.id
                              ? { ...a, instanceConfig: { ...a.instanceConfig, category: e.target.value, subcategory: '' } }
                              : a
                          );
                          setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select category...</option>
                        <option value="identity-relationships">Identity and relationships</option>
                        <option value="local-national-international">Local, national, international and global areas of interest</option>
                        <option value="current-future-study-work">Current and future study and employment</option>
                        <option value="family-friends">Family and friends</option>
                        <option value="technology-social-media">Technology and social media</option>
                        <option value="free-time-activities">Free-time activities</option>
                        <option value="customs-festivals">Customs, festivals and celebrations</option>
                        <option value="home-town-region">Home, town, neighbourhood and region</option>
                        <option value="environment">Environment</option>
                        <option value="travel-tourism">Travel and tourism</option>
                        <option value="school-college">School/college and future plans</option>
                        <option value="jobs-career">Jobs, career choices and ambitions</option>
                      </select>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                      <select
                        value={assessment.instanceConfig?.subcategory || ''}
                        onChange={(e) => {
                          const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                            a.id === assessment.id
                              ? { ...a, instanceConfig: { ...a.instanceConfig, subcategory: e.target.value } }
                              : a
                          );
                          setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={!assessment.instanceConfig?.category}
                      >
                        <option value="">Select subcategory...</option>
                        {assessment.instanceConfig?.category === 'identity-relationships' && (
                          <>
                            <option value="self-family-friends">Self, family and friends</option>
                            <option value="relationships-choices">Relationships and choices</option>
                            <option value="role-models">Role models</option>
                          </>
                        )}
                        {assessment.instanceConfig?.category === 'local-national-international' && (
                          <>
                            <option value="local-areas-interest">Local areas of interest</option>
                            <option value="national-areas-interest">National areas of interest</option>
                            <option value="global-areas-interest">Global areas of interest</option>
                          </>
                        )}
                        {assessment.instanceConfig?.category === 'current-future-study-work' && (
                          <>
                            <option value="current-study">Current study</option>
                            <option value="future-aspirations">Future aspirations, study and work</option>
                            <option value="jobs-career-choices">Jobs, career choices and ambitions</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Additional settings */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (min)</label>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={assessment.instanceConfig?.timeLimit || assessmentConfig.generalTimeLimit}
                        onChange={(e) => {
                          const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                            a.id === assessment.id
                              ? { ...a, instanceConfig: { ...a.instanceConfig, timeLimit: parseInt(e.target.value) } }
                              : a
                          );
                          setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={assessment.instanceConfig?.maxAttempts || assessmentConfig.generalMaxAttempts}
                        onChange={(e) => {
                          const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                            a.id === assessment.id
                              ? { ...a, instanceConfig: { ...a.instanceConfig, maxAttempts: parseInt(e.target.value) } }
                              : a
                          );
                          setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`autograde-${assessment.id}`}
                        checked={assessment.instanceConfig?.autoGrade ?? assessmentConfig.generalAutoGrade}
                        onChange={(e) => {
                          const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                            a.id === assessment.id
                              ? { ...a, instanceConfig: { ...a.instanceConfig, autoGrade: e.target.checked } }
                              : a
                          );
                          setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <label htmlFor={`autograde-${assessment.id}`} className="ml-2 text-sm text-gray-700">Auto-grade</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`feedback-${assessment.id}`}
                        checked={assessment.instanceConfig?.feedbackEnabled ?? assessmentConfig.generalFeedbackEnabled}
                        onChange={(e) => {
                          const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                            a.id === assessment.id
                              ? { ...a, instanceConfig: { ...a.instanceConfig, feedbackEnabled: e.target.checked } }
                              : a
                          );
                          setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <label htmlFor={`feedback-${assessment.id}`} className="ml-2 text-sm text-gray-700">Show feedback</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {hasGames && (
              <div>
                <span className="text-gray-600">Games:</span>
                <span className="ml-2 font-medium text-purple-600">{gameConfig.selectedGames.length} configured</span>
              </div>
            )}
            {hasAssessments && (
              <div>
                <span className="text-gray-600">Assessments:</span>
                <span className="ml-2 font-medium text-purple-600">{assessmentConfig.selectedAssessments.length} configured</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
