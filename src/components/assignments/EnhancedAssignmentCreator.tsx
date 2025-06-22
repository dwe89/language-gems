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
import EnhancedVocabularySelector from '../vocabulary/EnhancedVocabularySelector';

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

interface GameConfiguration {
  gameType: string;
  difficulty: string;
  timeLimit: number;
  maxAttempts: number;
  powerUpsEnabled: boolean;
  hintsAllowed: boolean;
  autoGrade: boolean;
  feedbackEnabled: boolean;
  theme: string;
  customSettings: Record<string, any>;
}

interface EnhancedAssignmentCreatorProps {
  classId: string;
  onAssignmentCreated?: (assignmentId: string) => void;
  onCancel?: () => void;
  templateId?: string;
}

// =====================================================
// GAME TYPE CONFIGURATIONS
// =====================================================

const GAME_TYPES = {
  gem_collector: {
    name: 'Gem Collector Adventure',
    description: 'Collect vocabulary gems by building sentences word by word',
    icon: <Gem className="h-6 w-6" />,
    color: 'from-purple-500 to-blue-500',
    features: ['Power-ups', 'Achievements', 'Real-time scoring', 'Sentence building'],
    estimatedTime: '10-15 minutes',
    difficulty: 'Beginner to Advanced',
    theme: 'gem_mining'
  },
  memory_game: {
    name: 'Memory Crystal Mine',
    description: 'Match vocabulary pairs to discover hidden crystals',
    icon: <Brain className="h-6 w-6" />,
    color: 'from-green-500 to-teal-500',
    features: ['Memory training', 'Progressive difficulty', 'Visual learning'],
    estimatedTime: '8-12 minutes',
    difficulty: 'Beginner to Intermediate',
    theme: 'crystal_caves'
  },
  speed_builder: {
    name: 'Diamond Rush',
    description: 'Race against time to build vocabulary combinations',
    icon: <Zap className="h-6 w-6" />,
    color: 'from-yellow-500 to-orange-500',
    features: ['Speed challenges', 'Combo multipliers', 'Time pressure'],
    estimatedTime: '5-10 minutes',
    difficulty: 'Intermediate to Advanced',
    theme: 'diamond_rush'
  },
  word_scramble: {
    name: 'Treasure Hunt',
    description: 'Unscramble words to find hidden vocabulary treasures',
    icon: <Crown className="h-6 w-6" />,
    color: 'from-pink-500 to-red-500',
    features: ['Word puzzles', 'Hint system', 'Progressive unlocking'],
    estimatedTime: '12-18 minutes',
    difficulty: 'All levels',
    theme: 'treasure_hunt'
  }
};

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
    game_type: 'gem_collector',
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
  const [selectedVocabulary, setSelectedVocabulary] = useState<any[]>([]);
  const [vocabularyConfig, setVocabularyConfig] = useState<any>({});
  const [gameConfig, setGameConfig] = useState<GameConfiguration>({
    gameType: 'gem_collector',
    difficulty: 'intermediate',
    timeLimit: 15,
    maxAttempts: 3,
    powerUpsEnabled: true,
    hintsAllowed: true,
    autoGrade: true,
    feedbackEnabled: true,
    theme: 'gem_mining',
    customSettings: {}
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
      id: 'game',
      title: 'Choose Adventure',
      description: 'Select the game type and theme',
      icon: <Gamepad2 className="h-5 w-5" />,
      completed: !!assignmentData.game_type
    },
    {
      id: 'vocabulary',
      title: 'Select Gems',
      description: 'Choose vocabulary for the adventure',
      icon: <Gem className="h-5 w-5" />,
      completed: selectedVocabulary.length > 0
    },
    {
      id: 'settings',
      title: 'Configure Quest',
      description: 'Set difficulty and game settings',
      icon: <Settings className="h-5 w-5" />,
      completed: true // Always completed as it has defaults
    },
    {
      id: 'review',
      title: 'Launch Mission',
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
      game_type: gameConfig.gameType,
      time_limit: gameConfig.timeLimit,
      max_attempts: gameConfig.maxAttempts,
      auto_grade: gameConfig.autoGrade,
      feedback_enabled: gameConfig.feedbackEnabled,
      hints_allowed: gameConfig.hintsAllowed,
      power_ups_enabled: gameConfig.powerUpsEnabled,
      config: {
        ...prev.config,
        difficulty: gameConfig.difficulty,
        theme: gameConfig.theme,
        customSettings: gameConfig.customSettings,
        vocabularyConfig
      }
    }));
  }, [gameConfig, vocabularyConfig]);

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
          gameType: template.game_type,
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

  const handleVocabularyChange = (vocabulary: any[], listId?: string) => {
    setSelectedVocabulary(vocabulary);
    setAssignmentData(prev => ({
      ...prev,
      vocabulary_list_id: listId
    }));
  };

  const handleVocabularyConfigChange = (config: any) => {
    setVocabularyConfig(config);
  };

  const handleGameTypeChange = (gameType: string) => {
    const gameInfo = GAME_TYPES[gameType];
    setGameConfig(prev => ({
      ...prev,
      gameType,
      theme: gameInfo?.theme || 'gem_mining'
    }));
  };

  const handleCreateAssignment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!assignmentData.title || !assignmentData.description) {
        setError('Please fill in all required fields');
        return;
      }

      if (selectedVocabulary.length === 0) {
        setError('Please select vocabulary for the assignment');
        return;
      }

      // Create vocabulary list if needed
      let vocabularyListId = assignmentData.vocabulary_list_id;
      
      if (!vocabularyListId && selectedVocabulary.length > 0) {
        // Create a new vocabulary list
        const { data: listData, error: listError } = await supabase
          .from('vocabulary_assignment_lists')
          .insert({
            name: `${assignmentData.title} - Vocabulary`,
            description: `Vocabulary for ${assignmentData.title}`,
            teacher_id: user?.id,
            theme: vocabularyConfig.theme,
            topic: vocabularyConfig.topic,
            difficulty_level: gameConfig.difficulty,
            vocabulary_items: selectedVocabulary.map(v => v.id),
            word_count: selectedVocabulary.length,
            is_public: false
          })
          .select()
          .single();

        if (listError) throw listError;
        vocabularyListId = listData.id;
      }

      // Create the assignment
      const assignmentId = await assignmentService.createEnhancedAssignment(
        user?.id || '',
        {
          ...assignmentData,
          vocabulary_list_id: vocabularyListId,
          due_date: assignmentData.due_date ? new Date(assignmentData.due_date) : undefined
        } as AssignmentCreationData
      );

      onAssignmentCreated?.(assignmentId);
      
    } catch (err: any) {
      setError('Failed to create assignment: ' + err.message);
      console.error('Error creating assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER STEP CONTENT
  // =====================================================

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'basic':
        return renderBasicDetailsStep();
      case 'game':
        return renderGameSelectionStep();
      case 'vocabulary':
        return renderVocabularyStep();
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
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Your Learning Adventure</h3>
        <p className="text-gray-600">Set up the basic details for your vocabulary quest</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adventure Title *
          </label>
          <input
            type="text"
            value={assignmentData.title || ''}
            onChange={(e) => setAssignmentData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Spanish Food Vocabulary Quest"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adventure Description *
          </label>
          <textarea
            value={assignmentData.description || ''}
            onChange={(e) => setAssignmentData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe what students will learn and accomplish in this adventure..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quest Points
          </label>
          <input
            type="number"
            value={assignmentData.points || 100}
            onChange={(e) => setAssignmentData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
            min="10"
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
  );

  const renderGameSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gamepad2 className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Adventure Type</h3>
        <p className="text-gray-600">Select the perfect game experience for your students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(GAME_TYPES).map(([key, game]) => (
          <motion.button
            key={key}
            onClick={() => handleGameTypeChange(key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              gameConfig.gameType === key
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${game.color} flex items-center justify-center text-white`}>
                {game.icon}
              </div>
              {gameConfig.gameType === key && (
                <CheckCircle className="h-6 w-6 text-purple-600" />
              )}
            </div>

            <h4 className="text-lg font-bold text-gray-800 mb-2">{game.name}</h4>
            <p className="text-gray-600 mb-4">{game.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Duration:</span>
                <span className="font-medium">{game.estimatedTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Difficulty:</span>
                <span className="font-medium">{game.difficulty}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-2">Features:</div>
              <div className="flex flex-wrap gap-1">
                {game.features.map((feature) => (
                  <span key={feature} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderVocabularyStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gem className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Select Your Vocabulary Gems</h3>
        <p className="text-gray-600">Choose the words students will discover on their adventure</p>
      </div>

      <EnhancedVocabularySelector
        onSelectionChange={handleVocabularyChange}
        onConfigChange={handleVocabularyConfigChange}
        maxItems={50}
        defaultSelection="theme"
        showPreview={true}
        gameType={gameConfig.gameType}
        assignmentMode={true}
        difficulty={gameConfig.difficulty}
      />
    </div>
  );

  const renderSettingsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Configure Your Quest</h3>
        <p className="text-gray-600">Fine-tune the adventure settings for optimal learning</p>
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
                Difficulty Level
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
            Adventure Features
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
                <div className="font-medium text-gray-800">Detailed Feedback</div>
                <div className="text-sm text-gray-600">Provide learning insights and suggestions</div>
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
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Launch Your Adventure</h3>
        <p className="text-gray-600">Review your quest settings and deploy to students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assignment Summary */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            Adventure Summary
          </h4>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Title</div>
              <div className="font-medium">{assignmentData.title}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Description</div>
              <div className="text-sm">{assignmentData.description}</div>
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
              <div className="text-sm text-gray-500">Adventure Type</div>
              <div className="font-medium">{GAME_TYPES[gameConfig.gameType]?.name}</div>
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
            <div>
              <div className="text-sm text-gray-500">Features Enabled</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {gameConfig.powerUpsEnabled && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Power-ups</span>
                )}
                {gameConfig.hintsAllowed && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Hints</span>
                )}
                {gameConfig.autoGrade && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Auto-grade</span>
                )}
                {gameConfig.feedbackEnabled && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Feedback</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vocabulary Summary */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 lg:col-span-2">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Gem className="h-5 w-5 mr-2 text-purple-600" />
            Vocabulary Gems ({selectedVocabulary.length})
          </h4>

          {selectedVocabulary.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {selectedVocabulary.slice(0, 12).map((item) => (
                <div key={item.id} className="flex items-center space-x-2 bg-gray-50 rounded px-3 py-2">
                  <Gem className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">
                    <strong>{item.spanish}</strong> - {item.english}
                  </span>
                </div>
              ))}
              {selectedVocabulary.length > 12 && (
                <div className="flex items-center justify-center bg-gray-100 rounded px-3 py-2">
                  <span className="text-sm text-gray-600">+{selectedVocabulary.length - 12} more gems</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Gem className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No vocabulary selected</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}
    </div>
  );

  // =====================================================
  // MAIN RENDER
  // =====================================================

  if (loading && !templateId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Creating your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Adventure Creator</h1>
          <p className="text-gray-600">Design engaging vocabulary adventures for your students</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    index <= currentStep
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : step.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {step.completed && index !== currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`text-sm font-medium ${
                    index <= currentStep ? 'text-purple-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-purple-600' : 'bg-gray-300'
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
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <span>Cancel</span>
          </button>

          <div className="flex space-x-4">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!steps[currentStep].completed}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateAssignment}
                disabled={loading || selectedVocabulary.length === 0}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4" />
                    <span>Launch Adventure</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
