'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gem, Diamond, Sparkles, Crown, Star, Zap, Trophy,
  Calendar, Clock, Users, Target, BookOpen, Settings,
  Plus, Save, Eye, ArrowRight, ArrowLeft, CheckCircle,
  AlertCircle, Info, Gamepad2, Brain, Heart
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { EnhancedAssignmentService, AssignmentCreationData } from '../../services/enhancedAssignmentService';
import MultiGameSelector from './MultiGameSelector';
import SmartAssignmentConfig from './SmartAssignmentConfig';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface AssignmentStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface VocabularyConfig {
  source: 'theme' | 'topic' | 'custom' | 'create' | '';
  theme?: string;
  topic?: string;
  customListId?: string;
  customList?: any;
  wordCount?: number;
  difficulty?: string;
}

interface SentenceConfig {
  source: 'theme' | 'topic' | 'custom' | 'create' | '';
  theme?: string;
  topic?: string;
  customSetId?: string;
  customSet?: any;
  sentenceCount?: number;
  difficulty?: string;
  grammarFocus?: string;
}

interface GameConfiguration {
  selectedGames: string[];
  vocabularyConfig: VocabularyConfig;
  sentenceConfig: SentenceConfig;
  difficulty: string;
  timeLimit: number;
  maxAttempts: number;
  powerUpsEnabled: boolean;
  hintsAllowed: boolean;
  autoGrade: boolean;
  feedbackEnabled: boolean;
}

interface EnhancedAssignmentCreatorProps {
  classId: string;
  onAssignmentCreated?: (assignmentId: string) => void;
  onCancel?: () => void;
  templateId?: string;
}

// =====================================================
// ENHANCED ASSIGNMENT CREATOR COMPONENT
// =====================================================

export default function EnhancedAssignmentCreator({
  classId,
  onAssignmentCreated,
  onCancel,
  templateId
}: EnhancedAssignmentCreatorProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  // Services
  const [assignmentService] = useState(() => new EnhancedAssignmentService(supabase));
  
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [assignmentData, setAssignmentData] = useState<Partial<AssignmentCreationData>>({
    title: '',
    description: '',
    game_type: '',
    class_id: classId,
    points: 100,
    time_limit: 15,
    max_attempts: 3,
    auto_grade: true,
    feedback_enabled: true,
    hints_allowed: true,
    power_ups_enabled: true,
    config: {}
  });

  const [gameConfig, setGameConfig] = useState<GameConfiguration>({
    selectedGames: [],
    vocabularyConfig: {
      source: '',
      wordCount: 10,
      difficulty: 'intermediate'
    },
    sentenceConfig: {
      source: '',
      sentenceCount: 10,
      difficulty: 'intermediate'
    },
    difficulty: 'intermediate',
    timeLimit: 15,
    maxAttempts: 3,
    powerUpsEnabled: true,
    hintsAllowed: true,
    autoGrade: true,
    feedbackEnabled: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Steps configuration
  const steps: AssignmentStep[] = [
    {
      id: 'basic',
      title: 'Assignment Details',
      description: 'Set up basic assignment information',
      icon: <BookOpen className="h-5 w-5" />,
      completed: !!assignmentData.title && !!assignmentData.description
    },
    {
      id: 'games',
      title: 'Choose Games',
      description: 'Select games for this assignment',
      icon: <Gamepad2 className="h-5 w-5" />,
      completed: gameConfig.selectedGames.length > 0
    },
    {
      id: 'content',
      title: 'Configure Content',
      description: 'Set up vocabulary and sentence content',
      icon: <Gem className="h-5 w-5" />,
      completed: (gameConfig.vocabularyConfig.source !== '' || gameConfig.sentenceConfig.source !== '') && gameConfig.selectedGames.length > 0
    },
    {
      id: 'settings',
      title: 'Game Settings',
      description: 'Configure difficulty and game options',
      icon: <Settings className="h-5 w-5" />,
      completed: true // Always completed as it has defaults
    },
    {
      id: 'review',
      title: 'Launch Assignment',
      description: 'Review and create assignment',
      icon: <Trophy className="h-5 w-5" />,
      completed: false
    }
  ];

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    if (templateId) {
      loadTemplate();
    }
  }, [templateId]);

  useEffect(() => {
    // Update assignment data when game config changes
    setAssignmentData(prev => ({
      ...prev,
      game_type: gameConfig.selectedGames[0] || '', // Primary game for compatibility
      time_limit: gameConfig.timeLimit,
      max_attempts: gameConfig.maxAttempts,
      auto_grade: gameConfig.autoGrade,
      feedback_enabled: gameConfig.feedbackEnabled,
      hints_allowed: gameConfig.hintsAllowed,
      power_ups_enabled: gameConfig.powerUpsEnabled,
      config: {
        ...prev.config,
        selectedGames: gameConfig.selectedGames,
        vocabularyConfig: gameConfig.vocabularyConfig,
        sentenceConfig: gameConfig.sentenceConfig,
        difficulty: gameConfig.difficulty
      }
    }));
  }, [gameConfig]);

  // =====================================================
  // DATA LOADING
  // =====================================================

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const templates = await assignmentService.getAssignmentTemplates(user?.id || '', true);
      const template = templates.find(t => t.id === templateId);
      
      if (template) {
        setAssignmentData({
          title: `${template.name} (Copy)`,
          description: template.description,
          game_type: template.game_type,
          class_id: classId,
          config: template.default_config,
          points: 100,
          time_limit: template.estimated_duration,
          max_attempts: template.max_attempts,
          auto_grade: true,
          feedback_enabled: true,
          hints_allowed: true,
          power_ups_enabled: true
        });
        
        // Update game config from template
        setGameConfig(prev => ({
          ...prev,
          selectedGames: template.default_config?.selectedGames || [template.game_type],
          difficulty: template.difficulty_level,
          timeLimit: template.estimated_duration,
          maxAttempts: template.max_attempts
        }));
      }
    } catch (error) {
      console.error('Failed to load template:', error);
      setError('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGameSelectionChange = (selectedGames: string[]) => {
    setGameConfig(prev => ({
      ...prev,
      selectedGames
    }));
  };

  const handleVocabularyConfigChange = (vocabularyConfig: VocabularyConfig) => {
    setGameConfig(prev => ({
      ...prev,
      vocabularyConfig
    }));
  };

  const handleSentenceConfigChange = (sentenceConfig: SentenceConfig) => {
    setGameConfig(prev => ({
      ...prev,
      sentenceConfig
    }));
  };

  const handleCreateAssignment = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('User not authenticated');
      }

      if (gameConfig.selectedGames.length === 0) {
        throw new Error('Please select at least one game');
      }

      // Validate content configuration
      const needsVocabulary = gameConfig.selectedGames.some(gameId => {
        const vocabGames = ['gem-collector', 'memory-game', 'word-blast', 'translation-tycoon', 'word-guesser', 'hangman', 'word-scramble', 'word-association', 'gem-rush', 'vocabulary-mining'];
        return vocabGames.includes(gameId);
      });

      const needsSentences = gameConfig.selectedGames.some(gameId => {
        const sentenceGames = ['speed-builder', 'sentence-towers', 'sentence-builder', 'verb-conjugation-ladder'];
        return sentenceGames.includes(gameId);
      });

      if (needsVocabulary && !gameConfig.vocabularyConfig.source) {
        throw new Error('Please configure vocabulary content for the selected games');
      }

      if (needsSentences && !gameConfig.sentenceConfig.source) {
        throw new Error('Please configure sentence content for the selected games');
      }

      const assignmentId = await assignmentService.createAssignment({
        ...assignmentData,
        teacher_id: user.id,
        game_type: gameConfig.selectedGames[0], // Primary game for compatibility
        config: {
          selectedGames: gameConfig.selectedGames,
          vocabularyConfig: gameConfig.vocabularyConfig,
          sentenceConfig: gameConfig.sentenceConfig,
          difficulty: gameConfig.difficulty,
          multiGame: true
        }
      } as AssignmentCreationData);

      if (onAssignmentCreated) {
        onAssignmentCreated(assignmentId);
      }
    } catch (error) {
      console.error('Failed to create assignment:', error);
      setError(error instanceof Error ? error.message : 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER METHODS
  // =====================================================

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'basic':
        return renderBasicDetailsStep();
      case 'games':
        return renderGameSelectionStep();
      case 'content':
        return renderContentConfigurationStep();
      case 'settings':
        return renderSettingsStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  const renderBasicDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Assignment Details</h3>
        <p className="text-gray-600">Set up the basic information for your assignment</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignment Title *
          </label>
          <input
            type="text"
            value={assignmentData.title || ''}
            onChange={(e) => setAssignmentData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter assignment title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={assignmentData.description || ''}
            onChange={(e) => setAssignmentData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Describe what students will learn..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points
            </label>
            <input
              type="number"
              value={assignmentData.points || 100}
              onChange={(e) => setAssignmentData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
              min="1"
              max="1000"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={assignmentData.due_date || ''}
              onChange={(e) => setAssignmentData(prev => ({ ...prev, due_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGameSelectionStep = () => (
    <div className="space-y-6">
      <MultiGameSelector
        selectedGames={gameConfig.selectedGames}
        onSelectionChange={handleGameSelectionChange}
        maxSelections={5}
      />
    </div>
  );

  const renderContentConfigurationStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gem className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Configure Content</h3>
        <p className="text-gray-600">Set up vocabulary and sentence content for your selected games</p>
      </div>

      <SmartAssignmentConfig
        selectedGames={gameConfig.selectedGames}
        vocabularyConfig={gameConfig.vocabularyConfig}
        sentenceConfig={gameConfig.sentenceConfig}
        onVocabularyChange={handleVocabularyConfigChange}
        onSentenceChange={handleSentenceConfigChange}
      />
    </div>
  );

  const renderSettingsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Game Settings</h3>
        <p className="text-gray-600">Configure difficulty and gameplay options</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Game Settings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Gamepad2 className="h-5 w-5 mr-2 text-purple-600" />
            Game Settings
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Difficulty Level
              </label>
              <select
                value={gameConfig.difficulty}
                onChange={(e) => setGameConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="beginner">Beginner Explorer</option>
                <option value="intermediate">Skilled Adventurer</option>
                <option value="advanced">Master Gem Hunter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="range"
                min="5"
                max="60"
                value={gameConfig.timeLimit}
                onChange={(e) => setGameConfig(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">{gameConfig.timeLimit} minutes</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Attempts
              </label>
              <select
                value={gameConfig.maxAttempts}
                onChange={(e) => setGameConfig(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value={1}>1 attempt (Challenge mode)</option>
                <option value={2}>2 attempts</option>
                <option value={3}>3 attempts (Recommended)</option>
                <option value={5}>5 attempts (Practice mode)</option>
                <option value={-1}>Unlimited attempts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Adventure Features */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-600" />
            Features
          </h4>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Power-ups Enabled</div>
                <div className="text-sm text-gray-600">Allow students to use special abilities</div>
              </div>
              <button
                onClick={() => setGameConfig(prev => ({ ...prev, powerUpsEnabled: !prev.powerUpsEnabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  gameConfig.powerUpsEnabled ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    gameConfig.powerUpsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Hints Allowed</div>
                <div className="text-sm text-gray-600">Students can request help when stuck</div>
              </div>
              <button
                onClick={() => setGameConfig(prev => ({ ...prev, hintsAllowed: !prev.hintsAllowed }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  gameConfig.hintsAllowed ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    gameConfig.hintsAllowed ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Auto-Grade</div>
                <div className="text-sm text-gray-600">Automatically grade completed assignments</div>
              </div>
              <button
                onClick={() => setGameConfig(prev => ({ ...prev, autoGrade: !prev.autoGrade }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  gameConfig.autoGrade ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    gameConfig.autoGrade ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-800">Feedback Enabled</div>
                <div className="text-sm text-gray-600">Show detailed feedback after completion</div>
              </div>
              <button
                onClick={() => setGameConfig(prev => ({ ...prev, feedbackEnabled: !prev.feedbackEnabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  gameConfig.feedbackEnabled ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    gameConfig.feedbackEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Launch!</h3>
        <p className="text-gray-600">Review your assignment details before creating</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assignment Overview */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            Assignment Overview
          </h4>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Title</div>
              <div className="font-medium">{assignmentData.title}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Description</div>
              <div className="font-medium text-sm">{assignmentData.description}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Points</div>
                <div className="font-medium">{assignmentData.points}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Due Date</div>
                <div className="font-medium">
                  {assignmentData.due_date 
                    ? new Date(assignmentData.due_date).toLocaleDateString()
                    : 'No due date'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Configuration */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Gamepad2 className="h-5 w-5 mr-2 text-purple-600" />
            Game Configuration
          </h4>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Selected Games ({gameConfig.selectedGames.length})</div>
              <div className="font-medium">
                {gameConfig.selectedGames.length > 0 
                  ? gameConfig.selectedGames.join(', ')
                  : 'No games selected'
                }
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Difficulty</div>
                <div className="font-medium capitalize">{gameConfig.difficulty}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Time Limit</div>
                <div className="font-medium">{gameConfig.timeLimit} minutes</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Max Attempts</div>
              <div className="font-medium">
                {gameConfig.maxAttempts === -1 ? 'Unlimited' : gameConfig.maxAttempts}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <button
          onClick={handleCreateAssignment}
          disabled={loading}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Creating Assignment...
            </>
          ) : (
            <>
              <Trophy className="h-5 w-5 mr-2" />
              Create Assignment
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (loading && !assignmentData.title) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Multi-Game Assignment</h1>
        <p className="text-gray-600">Build engaging assignments with multiple games and smart content configuration</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  index < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : index === currentStep
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="ml-3">
                <div className={`text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <div className="flex space-x-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!steps[currentStep].completed}
              className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
