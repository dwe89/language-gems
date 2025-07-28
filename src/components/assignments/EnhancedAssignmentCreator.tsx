'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gem, Trophy, BookOpen, Eye, ArrowRight, ArrowLeft, CheckCircle,
  AlertCircle, Gamepad2, ClipboardList, X, Headphones, PenTool, Mic, Award, Info
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';
import { EnhancedAssignmentService, AssignmentCreationData } from '../../services/enhancedAssignmentService';
import MultiGameSelector from './MultiGameSelector';
import SmartAssignmentConfig from './SmartAssignmentConfig';
import DatabaseCategorySelector from './DatabaseCategorySelector';

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
  source: 'category' | 'theme' | 'topic' | 'custom' | 'create' | '';
  language?: string;
  categories?: string[]; // Support multiple categories
  subcategories?: string[]; // Support multiple subcategories
  category?: string; // Keep for backward compatibility
  subcategory?: string; // Keep for backward compatibility
  theme?: string;
  topic?: string;
  customListId?: string;
  customList?: any;
  wordCount?: number;
  difficulty?: string;
  curriculumLevel?: 'KS3' | 'KS4'; // Added this as per your usage
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

interface GrammarConfig {
  language: 'spanish' | 'french' | 'german';
  verbTypes: ('regular' | 'irregular' | 'stem-changing')[];
  tenses: ('present' | 'preterite' | 'imperfect' | 'future' | 'conditional' | 'subjunctive')[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  verbCount?: number;
  focusAreas?: ('conjugation' | 'recognition' | 'translation')[];
}

interface GameConfiguration {
  selectedGames: string[];
  vocabularyConfig: VocabularyConfig;
  sentenceConfig: SentenceConfig;
  grammarConfig: GrammarConfig;
  difficulty: string;
  timeLimit: number;
  maxAttempts: number;
  powerUpsEnabled: boolean;
  hintsAllowed: boolean;
  autoGrade: boolean;
  feedbackEnabled: boolean;
}

interface EnhancedAssignmentCreatorProps {
  classId?: string;
  onAssignmentCreated?: (assignmentId: string) => void;
  onCancel?: () => void;
  templateId?: string;
}

// =====================================================
// GAME NAME MAPPING
// =====================================================

const GAME_NAMES: Record<string, string> = {
  'vocabulary-mining': 'Vocabulary Mining',
  'memory-game': 'Memory Match',
  'hangman': 'Hangman',
  'word-guesser': 'Word Guesser',
  'word-blast': 'Word Blast',
  'noughts-and-crosses': 'Tic-Tac-Toe Vocabulary',
  'word-scramble': 'Word Scramble',
  'vocab-blast': 'Vocab Blast',
  'detective-listening': 'Detective Listening',
  'speed-builder': 'Speed Builder',
  'sentence-towers': 'Word Towers',
  'sentence-builder': 'Sentence Builder',
  'conjugation-duel': 'Conjugation Duel',
  'verb-quest': 'Verb Quest'
};

// =====================================================
// ASSESSMENT TYPES CONFIGURATION
// =====================================================

const ASSESSMENT_TYPES = [
  {
    id: 'reading-comprehension',
    name: 'Reading Comprehension',
    description: 'Text-based comprehension with multiple question types and automated marking',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-600',
    estimatedTime: '15-25 min',
    skills: ['Reading'],
    features: ['Multiple choice', 'True/false', 'Short answer', 'Automated marking']
  },
  {
    id: 'listening-comprehension',
    name: 'Listening Comprehension',
    description: 'Audio-based comprehension tasks with authentic materials',
    icon: <Headphones className="h-6 w-6" />,
    color: 'from-purple-500 to-purple-600',
    estimatedTime: '10-20 min',
    skills: ['Listening'],
    features: ['Audio clips', 'Multiple choice', 'Gap fill', 'Note taking']
  },
  {
    id: 'writing-tasks',
    name: 'Writing Tasks',
    description: 'Structured writing assessments with AI-powered feedback',
    icon: <PenTool className="h-6 w-6" />,
    color: 'from-green-500 to-green-600',
    estimatedTime: '20-40 min',
    skills: ['Writing'],
    features: ['Essay prompts', 'Translation', 'Creative writing', 'AI feedback']
  },
  {
    id: 'speaking-tasks',
    name: 'Speaking Tasks',
    description: 'Oral assessment with pronunciation analysis and fluency scoring',
    icon: <Mic className="h-6 w-6" />,
    color: 'from-red-500 to-red-600',
    estimatedTime: '5-15 min',
    skills: ['Speaking'],
    features: ['Voice recording', 'Pronunciation analysis', 'Fluency scoring', 'Photo description']
  },
  {
    id: 'exam-style-questions',
    name: 'Exam-Style Questions',
    description: 'UK exam board format questions across all four skills',
    icon: <Award className="h-6 w-6" />,
    color: 'from-indigo-500 to-indigo-600',
    estimatedTime: '30-60 min',
    skills: ['Reading', 'Writing', 'Listening', 'Speaking'],
    features: ['AQA/Edexcel/Eduqas format', 'Grade boundaries', 'Authentic questions', 'Full assessment']
  }
];

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

  // Services
  const [assignmentService] = useState(() => new EnhancedAssignmentService(supabaseBrowser));

  // State
  const [activeTab, setActiveTab] = useState<'practice' | 'assessments'>('practice');
  const [currentStep, setCurrentStep] = useState(0);
  const [assignmentData, setAssignmentData] = useState<Partial<AssignmentCreationData>>({
    title: '',
    description: '',
    game_type: '',
    class_id: classId || '',
    time_limit: 15,
    max_attempts: 3,
    auto_grade: true,
    feedback_enabled: true,
    hints_allowed: true,
    power_ups_enabled: true,
    curriculum_level: 'KS3',
    config: {}
  });

  const [selectedClasses, setSelectedClasses] = useState<string[]>(classId ? [classId] : []);
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);

  const [gameConfig, setGameConfig] = useState<GameConfiguration>({
    selectedGames: [],
    vocabularyConfig: {
      source: '',
      wordCount: 10,
      difficulty: 'intermediate',
      curriculumLevel: 'KS3'
    },
    sentenceConfig: {
      source: '',
      sentenceCount: 10,
      difficulty: 'intermediate'
    },
    grammarConfig: {
      language: 'spanish',
      verbTypes: ['regular'],
      tenses: ['present'],
      difficulty: 'beginner',
      verbCount: 10
    },
    difficulty: 'intermediate',
    timeLimit: 15,
    maxAttempts: 3,
    powerUpsEnabled: true,
    hintsAllowed: true,
    autoGrade: true,
    feedbackEnabled: true
  });

  // Assessment configuration state
  const [assessmentConfig, setAssessmentConfig] = useState({
    language: 'spanish' as 'spanish' | 'french' | 'german',
    level: 'KS3' as 'KS3' | 'KS4',
    difficulty: 'foundation' as 'foundation' | 'higher',
    examBoard: 'General' as 'AQA' | 'Edexcel' | 'Eduqas' | 'General',
    category: '',
    subcategory: '',
    timeLimit: 30,
    maxAttempts: 1,
    autoGrade: true,
    feedbackEnabled: true,
    // Note: selectedAssessments here is for the config, not the basket.
    // The basket is handled by 'selectedAssessments' state variable.
    selectedAssessments: [] as string[], // To track selected assessment types in the config
  });

  // Selected assessments basket (similar to selected games)
  const [selectedAssessmentsBasket, setSelectedAssessmentsBasket] = useState<Array<{ // Renamed to avoid conflict
    id: string;
    name: string;
    type: 'reading-comprehension' | 'listening-comprehension' | 'writing-tasks' | 'speaking-tasks' | 'exam-style-questions'; // Adjusted types to match ASSESSMENT_TYPES ids
    estimatedTime: string;
    skills: string[];
    config: any;
  }>>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Assessment selection functions
  const addAssessment = (assessmentType: typeof ASSESSMENT_TYPES[0]) => {
    // You were using assessmentConfig.selectedAssessments for selection logic,
    // but also had a separate 'selectedAssessments' state variable.
    // Let's ensure the single source of truth for the basket is 'selectedAssessmentsBasket'.
    const newAssessment = {
      id: `${assessmentType.id}-${Date.now()}`,
      name: assessmentType.name,
      type: assessmentType.id as 'reading-comprehension' | 'listening-comprehension' | 'writing-tasks' | 'speaking-tasks' | 'exam-style-questions',
      estimatedTime: assessmentType.estimatedTime,
      skills: assessmentType.skills,
      config: { ...assessmentConfig } // Capture the current assessment settings
    };

    setSelectedAssessmentsBasket(prev => [...prev, newAssessment]);
    // Also update the assessmentConfig's internal selectedAssessments to reflect UI state
    setAssessmentConfig(prev => ({
      ...prev,
      selectedAssessments: [...prev.selectedAssessments, assessmentType.id]
    }));
  };

  const removeAssessment = (assessmentId: string) => {
    const assessmentToRemove = selectedAssessmentsBasket.find(a => a.id === assessmentId);
    if (assessmentToRemove) {
      setSelectedAssessmentsBasket(prev => prev.filter(assessment => assessment.id !== assessmentId));
      setAssessmentConfig(prev => ({
        ...prev,
        selectedAssessments: prev.selectedAssessments.filter(id => id !== assessmentToRemove.type)
      }));
    }
  };

  // Simplified steps configuration
  const assignmentSteps: AssignmentStep[] = [
    {
      id: 'basic',
      title: 'Assignment Details',
      description: 'Set up basic assignment information',
      icon: <BookOpen className="h-5 w-5" />,
      completed: !!assignmentData.title && !!assignmentData.description && !!assignmentData.due_date && selectedClasses.length > 0
    },
    {
      id: 'activities',
      title: 'Choose Activities',
      description: 'Select games and assessments for this assignment',
      icon: <Gamepad2 className="h-5 w-5" />,
      completed: gameConfig.selectedGames.length > 0 || selectedAssessmentsBasket.length > 0
    },
    {
      id: 'content',
      title: 'Configure Content',
      description: 'Set up vocabulary and content sources',
      icon: <Gem className="h-5 w-5" />,
      completed: (gameConfig.vocabularyConfig.source !== '' || gameConfig.sentenceConfig.source !== '' || (gameConfig.grammarConfig.verbTypes.length > 0 && gameConfig.grammarConfig.tenses.length > 0)) && (gameConfig.selectedGames.length > 0 || selectedAssessmentsBasket.length > 0)
    },
    {
      id: 'review',
      title: 'Review & Launch',
      description: 'Review settings and create assignment',
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
    loadAvailableClasses();
  }, [templateId, user]); // Added user to dependency array as it's used in loadAvailableClasses

  const loadAvailableClasses = async () => {
    if (!user) return;

    try {
      const { data: classes, error } = await supabaseBrowser
        .from('classes')
        .select('id, name, description')
        .eq('teacher_id', user.id)
        .order('name');

      if (error) {
        console.error('Error loading classes:', error);
        return;
      }

      setAvailableClasses(classes || []);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  useEffect(() => {
    // Update assignment data when game config changes
    // Only update if there are actual changes to prevent unnecessary re-renders
    if (gameConfig.selectedGames.length > 0) {
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
    }
  }, [gameConfig]); // Simplified dependency array to just gameConfig for better effect management

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
          maxAttempts: template.max_attempts,
          // Ensure other gameConfig fields from template are handled if they exist
          vocabularyConfig: template.default_config?.vocabularyConfig || prev.vocabularyConfig,
          sentenceConfig: template.default_config?.sentenceConfig || prev.sentenceConfig,
          grammarConfig: template.default_config?.grammarConfig || prev.grammarConfig,
          powerUpsEnabled: template.default_config?.powerUpsEnabled ?? prev.powerUpsEnabled,
          hintsAllowed: template.default_config?.hintsAllowed ?? prev.hintsAllowed,
          autoGrade: template.default_config?.autoGrade ?? prev.autoGrade,
          feedbackEnabled: template.default_config?.feedbackEnabled ?? prev.feedbackEnabled,
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
    if (currentStep < assignmentSteps.length - 1) {
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

  const handleGrammarConfigChange = (grammarConfig: GrammarConfig) => {
    setGameConfig(prev => ({
      ...prev,
      grammarConfig
    }));
  };

  const handleCreateAssignment = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('User not authenticated');
      }

      if (selectedClasses.length === 0) {
        throw new Error('Please select at least one class');
      }

      let assignmentToCreate: AssignmentCreationData;

      if (activeTab === 'practice') {
        if (gameConfig.selectedGames.length === 0) {
          throw new Error('Please select at least one game');
        }

        // Validate content configuration for games
        const needsVocabulary = gameConfig.selectedGames.some(gameId => {
          const vocabGames = ['vocabulary-mining', 'memory-game', 'hangman', 'word-blast', 'noughts-and-crosses', 'word-scramble', 'vocab-blast', 'detective-listening'];
          return vocabGames.includes(gameId);
        });

        const needsSentences = gameConfig.selectedGames.some(gameId => {
          const sentenceGames = ['speed-builder', 'sentence-towers', 'sentence-builder'];
          return sentenceGames.includes(gameId);
        });

        const needsGrammar = gameConfig.selectedGames.some(gameId => {
          const grammarGames = ['conjugation-duel', 'verb-quest'];
          return grammarGames.includes(gameId);
        });

        if (needsVocabulary && !gameConfig.vocabularyConfig.source) {
          throw new Error('Please configure vocabulary content for the selected games');
        }

        if (needsSentences && !gameConfig.sentenceConfig.source) {
          throw new Error('Please configure sentence content for the selected games');
        }

        if (needsGrammar && (!gameConfig.grammarConfig.verbTypes.length || !gameConfig.grammarConfig.tenses.length)) {
          throw new Error('Please configure grammar content for the selected games');
        }

        assignmentToCreate = {
          ...assignmentData,
          game_type: 'multi-game', // Multi-game assignment
          config: {
            selectedGames: gameConfig.selectedGames, // All selected games
            vocabularyConfig: gameConfig.vocabularyConfig,
            sentenceConfig: gameConfig.sentenceConfig,
            difficulty: gameConfig.difficulty,
            timeLimit: gameConfig.timeLimit,
            maxAttempts: gameConfig.maxAttempts,
            powerUpsEnabled: gameConfig.powerUpsEnabled,
            hintsAllowed: gameConfig.hintsAllowed,
            autoGrade: gameConfig.autoGrade,
            feedbackEnabled: gameConfig.feedbackEnabled,
            multiGame: true,
            assignmentType: 'practice' // Explicitly mark as practice
          }
        } as AssignmentCreationData;

      } else { // activeTab === 'assessments'
        if (selectedAssessmentsBasket.length === 0) {
          throw new Error('Please select at least one assessment type');
        }
        if (!assignmentData.title) {
            throw new Error('Please enter a title for the assessment assignment.');
        }

        // Prepare assessment configuration to be saved
        assignmentToCreate = {
            ...assignmentData, // Basic title, description, due_date from assignmentData state
            game_type: 'assessment', // Indicate it's an assessment
            config: {
                // Combine the general assessment config with the specific selected types
                generalSettings: assessmentConfig,
                selectedAssessments: selectedAssessmentsBasket, // The basket of specific assessment instances
                assignmentType: 'assessment' // Explicitly mark as assessment
            }
        } as AssignmentCreationData;
      }


      const createdAssignments: string[] = [];

      // Create ONE assignment per class (not per game/assessment type)
      for (const selectedClassId of selectedClasses) {
        const assignmentForClass = {
          ...assignmentToCreate,
          class_id: selectedClassId,
        } as AssignmentCreationData;

        // Use enhanced assignment service for creation
        const assignmentId = await assignmentService.createEnhancedAssignment(user.id, assignmentForClass);
        createdAssignments.push(assignmentId);
      }

      if (onAssignmentCreated) {
        setTimeout(() => {
          try {
            onAssignmentCreated(createdAssignments[0]); // Return the first created assignment ID
          } catch (callbackError) {
            console.error('Error in onAssignmentCreated callback:', callbackError);
          }
        }, 150);
      }
    } catch (error) {
      console.error('Failed to create assignment:', error);
      setError(error instanceof Error ? error.message : 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER METHODS (Moved inside component function)
  // =====================================================

  const renderBasicDetailsStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <BookOpen className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">Assignment Details</h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Set up the basic information for your assignment</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="grid grid-cols-1 gap-8">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Assignment Title *
              </label>
              <input
                type="text"
                value={assignmentData.title || ''}
                onChange={(e) => setAssignmentData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Enter a descriptive title for your assignment..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Description *
              </label>
              <textarea
                value={assignmentData.description || ''}
                onChange={(e) => setAssignmentData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 resize-none"
                placeholder="Describe what students will learn and practice in this assignment..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Due Date *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="date"
                    value={assignmentData.due_date?.split('T')[0] || ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      const time = assignmentData.due_date?.split('T')[1] || '23:59';
                      setAssignmentData(prev => ({
                        ...prev,
                        due_date: date ? `${date}T${time}` : ''
                      }));
                    }}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={assignmentData.due_date?.split('T')[1]?.split(':')[0] || '23'}
                      onChange={(e) => {
                        const date = assignmentData.due_date?.split('T')[0] || '';
                        const minutes = assignmentData.due_date?.split('T')[1]?.split(':')[1] || '59';
                        if (date) {
                          setAssignmentData(prev => ({
                            ...prev,
                            due_date: `${date}T${e.target.value}:${minutes}`
                          }));
                        }
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-4 text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      value={assignmentData.due_date?.split('T')[1]?.split(':')[1] || '59'}
                      onChange={(e) => {
                        const date = assignmentData.due_date?.split('T')[0] || '';
                        const hours = assignmentData.due_date?.split('T')[1]?.split(':')[0] || '23';
                        if (date) {
                          setAssignmentData(prev => ({
                            ...prev,
                            due_date: `${date}T${hours}:${e.target.value}`
                          }));
                        }
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-4 text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                  </div>
                </div>
              </div>
              {!assignmentData.due_date && (
                <p className="text-sm text-red-600 mt-2">Please select a due date for the assignment</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Assign to Classes *
              </label>
              <div className="border-2 border-gray-200 rounded-xl p-4 max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {availableClasses.map((cls) => (
                    <label key={cls.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(cls.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedClasses(prev => [...prev, cls.id]);
                          } else {
                            setSelectedClasses(prev => prev.filter(id => id !== cls.id));
                          }
                        }}
                        className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{cls.name}</div>
                        {cls.description && (
                          <div className="text-sm text-gray-600 mt-1">{cls.description}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              {selectedClasses.length === 0 && (
                <p className="text-sm text-red-600 mt-2">Please select at least one class</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivitiesSelectionStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gamepad2 className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Activities</h3>
        <p className="text-gray-600">Select games and assessments for your assignment</p>
      </div>

      {/* Activity Type Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'practice'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Gamepad2 className="h-4 w-4 inline mr-2" />
          Games ({gameConfig.selectedGames.length})
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'assessments'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ClipboardList className="h-4 w-4 inline mr-2" />
          Assessments ({selectedAssessmentsBasket.length})
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'practice' ? (
        <div className="space-y-6">
          <MultiGameSelector
            selectedGames={gameConfig.selectedGames}
            onSelectionChange={handleGameSelectionChange}
            maxSelections={15}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Disclaimer Notice */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-3 flex items-start text-sm mb-6">
            <Info className="h-5 w-5 flex-shrink-0 mr-3 text-blue-500" />
            <div>
              <p className="font-medium mb-1">Important: Our Assessment Content</p>
              <p>Our exam-style questions and assessments are original content designed to reflect UK exam board formats for practice purposes. LanguageGems is not affiliated with any official examination board. <a href="/legal/disclaimer" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-900">Read our full disclaimer.</a></p>
            </div>
          </div>

          {/* Assessment Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ASSESSMENT_TYPES.map((assessment) => {
              const isSelected = assessmentConfig.selectedAssessments.includes(assessment.id);

              return (
                <motion.div
                  key={assessment.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => {
                    if (isSelected) {
                      removeAssessment(assessment.id);
                    } else {
                      addAssessment(assessment);
                    }
                  }}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                  )}

                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${assessment.color} flex items-center justify-center text-white mb-3`}>
                    {assessment.icon}
                  </div>

                  <h4 className="text-lg font-bold text-gray-800 mb-2">{assessment.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{assessment.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{assessment.estimatedTime}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Assessments Display */}
          {selectedAssessmentsBasket.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Selected Assessments</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAssessmentsBasket.map(item => (
                  <span key={item.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {item.name}
                    <button
                      type="button"
                      onClick={() => removeAssessment(item.id)}
                      className="ml-2 -mr-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-600 hover:text-indigo-900 hover:bg-indigo-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderContentConfigurationStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Gem className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">Configure Content</h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Set up content sources for your selected activities</p>
      </div>

      {/* Curriculum Level Selection - At the top */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Curriculum Level *
          </h4>
          <div className="flex bg-gray-100 rounded-xl p-2">
            <button
              type="button"
              onClick={() => {
                setAssignmentData(prev => ({ ...prev, curriculum_level: 'KS3' }));
                setGameConfig(prev => ({
                  ...prev,
                  vocabularyConfig: { ...prev.vocabularyConfig, curriculumLevel: 'KS3' }
                }));
              }}
              className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                assignmentData.curriculum_level === 'KS3'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              KS3 (Year 7-9)
            </button>
            <button
              type="button"
              onClick={() => {
                setAssignmentData(prev => ({ ...prev, curriculum_level: 'KS4' }));
                setGameConfig(prev => ({
                  ...prev,
                  vocabularyConfig: { ...prev.vocabularyConfig, curriculumLevel: 'KS4' }
                }));
              }}
              className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                assignmentData.curriculum_level === 'KS4'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              KS4 (GCSE)
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3 text-center">
            {assignmentData.curriculum_level === 'KS3'
              ? 'Foundation level vocabulary and topics for Years 7-9'
              : 'Advanced GCSE-level vocabulary and exam topics'
            }
          </p>
        </div>
      </div>

      {/* Games Configuration */}
      {gameConfig.selectedGames.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Gamepad2 className="h-5 w-5 text-purple-600" />
              </div>
              Game Content Configuration
            </h4>
            <SmartAssignmentConfig
              selectedGames={gameConfig.selectedGames}
              vocabularyConfig={gameConfig.vocabularyConfig}
              sentenceConfig={gameConfig.sentenceConfig}
              grammarConfig={gameConfig.grammarConfig}
              onVocabularyChange={handleVocabularyConfigChange}
              onSentenceChange={handleSentenceConfigChange}
              onGrammarChange={handleGrammarConfigChange}
            />
          </div>
        </div>
      )}

      {/* Assessment Configuration */}
      {selectedAssessmentsBasket.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <ClipboardList className="h-5 w-5 text-indigo-600" />
              </div>
              Assessment Content Configuration
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Language */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Language
                </label>
                <select
                  value={assessmentConfig.language}
                  onChange={(e) => setAssessmentConfig(prev => ({
                    ...prev,
                    language: e.target.value as 'spanish' | 'french' | 'german'
                  }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Difficulty
                </label>
                <select
                  value={assessmentConfig.difficulty}
                  onChange={(e) => setAssessmentConfig(prev => ({
                    ...prev,
                    difficulty: e.target.value as 'foundation' | 'higher'
                  }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="foundation">Foundation</option>
                  <option value="higher">Higher</option>
                </select>
              </div>

              {/* Time Limit */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={assessmentConfig.timeLimit}
                  onChange={(e) => setAssessmentConfig(prev => ({
                    ...prev,
                    timeLimit: parseInt(e.target.value) || 30
                  }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Category and Subcategory Selection using DatabaseCategorySelector */}
            <div className="border-t border-gray-100 pt-6">
              <h5 className="text-lg font-semibold text-gray-900 mb-3">Content Categories (Optional)</h5>
              <p className="text-sm text-gray-600 mb-6">Select specific vocabulary categories and topics for your assessments</p>

              <DatabaseCategorySelector
                language={assessmentConfig.language === 'spanish' ? 'es' : assessmentConfig.language === 'french' ? 'fr' : 'de'}
                curriculumLevel={assignmentData.curriculum_level}
                selectedCategories={assessmentConfig.category ? [assessmentConfig.category] : []}
                selectedSubcategories={assessmentConfig.subcategory ? [assessmentConfig.subcategory] : []}
                onChange={(categories, subcategories) => {
                  setAssessmentConfig(prev => ({
                    ...prev,
                    category: categories[0] || '',
                    subcategory: subcategories[0] || ''
                  }));
                }}
                maxSelections={5}
              />
            </div>
          </div>
        </div>
      )}

      {/* Show message if no activities selected */}
      {gameConfig.selectedGames.length === 0 && selectedAssessmentsBasket.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Gem className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No activities selected</p>
          <p className="text-sm">Go back to select games or assessments to configure their content</p>
        </div>
      )}
    </div>
  );



  const renderReviewStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Trophy className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">Review & Launch</h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Review your assignment settings and launch when ready</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h4 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            Assignment Overview
          </h4>

          <div className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Title</div>
                <div className="text-lg font-medium text-gray-900">{assignmentData.title || 'Untitled Assignment'}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Due Date</div>
                <div className="text-lg font-medium text-gray-900">
                  {assignmentData.due_date
                    ? new Date(assignmentData.due_date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'No due date'
                  }
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Description</div>
              <div className="text-gray-900">{assignmentData.description || 'No description provided'}</div>
            </div>

            {/* Curriculum Level */}
            {assignmentData.curriculum_level && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Curriculum Level</div>
                <div className="text-lg font-medium text-blue-900">
                  {assignmentData.curriculum_level === 'KS3' ? 'KS3 (Years 7-9)' : 'KS4 (GCSE)'}
                </div>
              </div>
            )}

            {/* Games Configuration */}
            {gameConfig.selectedGames.length > 0 && (
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-4">Game Activities</div>
                <div className="mb-4">
                  <span className="text-lg font-semibold text-purple-900">Selected Games ({gameConfig.selectedGames.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  {gameConfig.selectedGames.map(gameId => (
                    <div key={gameId} className="bg-white rounded-lg p-3 border border-purple-200">
                      <div className="font-medium text-purple-900">
                        {GAME_NAMES[gameId] || gameId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Game Content Configuration */}
                {gameConfig.vocabularyConfig.source && (
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="text-sm font-semibold text-purple-600 mb-2">Content Source</div>
                    <div className="text-purple-900 capitalize">
                      {gameConfig.vocabularyConfig.source.replace(/_/g, ' ')}
                      {gameConfig.vocabularyConfig.category && (
                        <span className="ml-2 text-sm">
                          ({gameConfig.vocabularyConfig.category.replace(/_/g, ' ')})
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Assessment Configuration */}
            {selectedAssessmentsBasket.length > 0 && (
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                <div className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-4">Assessment Activities</div>
                <div className="mb-4">
                  <span className="text-lg font-semibold text-indigo-900">Selected Assessments ({selectedAssessmentsBasket.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {selectedAssessmentsBasket.map(assessment => (
                    <div key={assessment.id} className="bg-white rounded-lg p-3 border border-indigo-200">
                      <div className="font-medium text-indigo-900">{assessment.name}</div>
                      <div className="text-sm text-indigo-700">{assessment.estimatedTime}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm font-semibold text-indigo-600 mb-1">Language</div>
                    <div className="text-indigo-900 capitalize">{assessmentConfig.language}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm font-semibold text-indigo-600 mb-1">Difficulty</div>
                    <div className="text-indigo-900 capitalize">{assessmentConfig.difficulty}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm font-semibold text-indigo-600 mb-1">Time Limit</div>
                    <div className="text-indigo-900">{assessmentConfig.timeLimit} minutes</div>
                  </div>
                </div>
              </div>
            )}

            {/* Classes */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-4">Assigned Classes</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedClasses.map(classId => {
                  const classInfo = availableClasses.find(c => c.id === classId);
                  return (
                    <div key={classId} className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="font-medium text-green-900">{classInfo?.name || classId}</div>
                      {classInfo?.description && (
                        <div className="text-sm text-green-700">{classInfo.description}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCreateAssignment}
          disabled={loading}
          className="px-12 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white rounded-2xl font-bold text-xl transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-4"></div>
              Creating Assignment...
            </>
          ) : (
            <>
              <Trophy className="h-6 w-6 mr-3" />
              Create Assignment
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (assignmentSteps[currentStep]?.id) {
      case 'basic':
        return renderBasicDetailsStep();
      case 'activities':
        return renderActivitiesSelectionStep();
      case 'content':
        return renderContentConfigurationStep();
      case 'review':
        return renderReviewStep();
      default:
        return null;
    }
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Assignment</h1>
        <p className="text-gray-600">Set up activities and assessments for your students</p>
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
          {assignmentSteps.map((step, index) => (
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
              {index < assignmentSteps.length - 1 && (
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
            key={`step-${currentStep}-${assignmentSteps[currentStep]?.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => {
              // Ensure DOM is stable after animation
              setTimeout(() => {
                // Force a small reflow to prevent DOM issues
                document.body.offsetHeight;
              }, 10);
            }}
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

          {currentStep < assignmentSteps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!assignmentSteps[currentStep].completed}
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