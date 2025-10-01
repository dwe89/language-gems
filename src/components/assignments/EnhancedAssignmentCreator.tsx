// AssignmentBuilderPage.tsx (Revised Top-Level Component)
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gem, Trophy, BookOpen, Eye, ArrowRight, ArrowLeft, CheckCircle,
  AlertCircle, Gamepad2, ClipboardList, X, Headphones, PenTool, Mic, Award, Info,
  FileText, Target, GraduationCap
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';
import { EnhancedAssignmentService, AssignmentCreationData } from '../../services/enhancedAssignmentService';
import MultiGameSelector from './MultiGameSelector';
import SmartAssignmentConfig from './SmartAssignmentConfig';
import DatabaseCategorySelector from './DatabaseCategorySelector';
import CurriculumContentSelector from './CurriculumContentSelector';
import VocabularyPreviewSection from './VocabularyPreviewSection';

// Import step components
import AssignmentDetailsStep from './steps/AssignmentDetailsStep';
import ActivitiesSelectionStep from './steps/ActivitiesSelectionStep';
import ContentConfigurationStep from './steps/ContentConfigurationStep';
import ReviewStep from './steps/ReviewStep';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface AssignmentStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean; // Dynamic based on current state
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
  customVocabulary?: string; // Inline custom vocabulary (manual entry)
  wordCount?: number;
  difficulty?: string;
  curriculumLevel?: 'KS3' | 'KS4'; // Added this as per your usage
  // KS4-specific parameters
  examBoard?: 'AQA' | 'Edexcel';
  tier?: 'foundation' | 'higher';
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
  topics?: string[];
  // Custom Configuration
  customCategories?: string[];
  customSubcategories?: string[];
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
  verbTypes: ('regular' | 'irregular' | 'stem-changing' | 'reflexive')[];
  tenses: (
    // Simple tenses
    'present' | 'preterite' | 'imperfect' | 'future' | 'conditional' |
    'present_subjunctive' | 'imperfect_subjunctive' |
    // Compound tenses
    'present_perfect' | 'past_perfect' | 'future_perfect' | 'conditional_perfect' |
    'present_perfect_subjunctive' | 'past_perfect_subjunctive'
  )[];
  persons: ('yo' | 'tu' | 'el_ella_usted' | 'nosotros' | 'vosotros' | 'ellos_ellas_ustedes')[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  verbCount?: number;
  focusAreas?: ('conjugation' | 'recognition' | 'translation')[];
}

// Unified GameConfiguration to hold settings for all selected games
interface UnifiedGameConfig {
  selectedGames: string[]; // List of game IDs
  vocabularyConfig: VocabularyConfig;
  sentenceConfig: SentenceConfig;
  grammarConfig: GrammarConfig;
  difficulty: string; // General difficulty for games
  timeLimit: number; // General time limit for games
  maxAttempts: number; // General attempts for games
  powerUpsEnabled: boolean;
  hintsAllowed: boolean;
  autoGrade: boolean;
  feedbackEnabled: boolean;
}

// Unified SkillsConfiguration to hold settings for all selected skills activities
interface SkillsConfig {
  selectedSkills: Array<{
    id: string;
    type: string;
    name: string;
    estimatedTime: string;
    skills: string[];
    instanceConfig?: {
      language?: 'spanish' | 'french' | 'german';
      level?: 'KS3' | 'KS4';
      category?: string;
      topicIds?: string[];
      contentTypes?: ('lesson' | 'quiz' | 'practice')[];
      timeLimit?: number;
      maxAttempts?: number;
      showHints?: boolean;
      randomizeQuestions?: boolean;
    };
  }>;
  generalLanguage: 'spanish' | 'french' | 'german';
  generalLevel: 'KS3' | 'KS4';
  generalTimeLimit: number;
  generalMaxAttempts: number;
  generalShowHints: boolean;
  generalRandomizeQuestions: boolean;
}

// Unified AssessmentConfiguration to hold settings for all selected assessments
interface AssessmentConfig {
  selectedAssessments: Array<{ // The basket of specific assessment instances
    id: string; // Unique instance ID (e.g., "aqa-reading-170000")
    type: string; // Original type ID (e.g., "aqa-reading")
    name: string; // Display name
    estimatedTime: string;
    skills: string[];
    // Specific config for this assessment instance if needed, or derived from general settings
    instanceConfig?: {
      language?: 'spanish' | 'french' | 'german';
      level?: 'KS3' | 'KS4';
      difficulty?: 'foundation' | 'higher';
      examBoard?: 'AQA' | 'Edexcel' | 'Eduqas' | 'General';
      category?: string;
      subcategory?: string;
      timeLimit?: number;
      maxAttempts?: number;
      autoGrade?: boolean;
      feedbackEnabled?: boolean;
    };
  }>;
  // General assessment settings that apply to all, unless overridden by instanceConfig
  generalLanguage: 'spanish' | 'french' | 'german';
  generalLevel: 'KS3' | 'KS4';
  generalDifficulty: 'foundation' | 'higher';
  generalExamBoard: 'AQA' | 'Edexcel' | 'Eduqas' | 'General';
  generalTimeLimit: number;
  generalMaxAttempts: number;
  generalAutoGrade: boolean;
  generalFeedbackEnabled: boolean;
  // Content categories for assessments
  assessmentCategory: string;
  assessmentSubcategory: string;
}

// =====================================================
// GAME NAME MAPPING
// =====================================================

const GAME_NAMES: Record<string, string> = {
  'memory-game': 'Memory Match',
  'hangman': 'Hangman',
  'word-guesser': 'Word Guesser',
  'word-blast': 'Word Blast',
  'noughts-and-crosses': 'Tic-Tac-Toe Vocabulary',
  'word-scramble': 'Word Scramble',
  'vocab-blast': 'Vocab Blast',
  'vocab-master': 'Vocab Master',
  'detective-listening': 'Detective Listening',
  'speed-builder': 'Speed Builder',
  'sentence-towers': 'Word Towers',
  'conjugation-duel': 'Conjugation Duel'
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
    id: 'aqa-reading',
    name: 'AQA Reading Assessment',
    description: 'Official AQA-style reading assessment with authentic exam questions',
    icon: <FileText className="h-6 w-6" />,
    color: 'from-indigo-500 to-indigo-600',
    estimatedTime: '45-60 min',
    skills: ['Reading'],
    features: ['AQA format', 'Exam practice', 'Automated marking', 'Progress tracking']
  },
  {
    id: 'aqa-listening',
    name: 'AQA Listening Assessment',
    description: 'Official AQA-style listening assessment with audio materials',
    icon: <Headphones className="h-6 w-6" />,
    color: 'from-purple-500 to-purple-600',
    estimatedTime: '35-45 min',
    skills: ['Listening'],
    features: ['AQA format', 'Audio clips', 'Exam practice', 'Automated marking']
  },
  {
    id: 'dictation',
    name: 'Dictation Assessment',
    description: 'Listen and write dictation exercises with accuracy scoring',
    icon: <PenTool className="h-6 w-6" />,
    color: 'from-green-500 to-green-600',
    estimatedTime: '20-30 min',
    skills: ['Listening', 'Writing'],
    features: ['Audio dictation', 'Spelling accuracy', 'Speed control', 'Instant feedback']
  },
  {
    id: 'vocabulary-test',
    name: 'Vocabulary Test',
    description: 'Comprehensive vocabulary assessment with multiple question types and detailed analytics',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'from-emerald-500 to-emerald-600',
    estimatedTime: '20-45 min',
    skills: ['Vocabulary'],
    features: ['Translation', 'Multiple choice', 'Audio spelling', 'Detailed analytics', 'Progress tracking']
  },
  {
    id: 'four-skills',
    name: 'Four Skills Assessment',
    description: 'Comprehensive assessment covering reading, writing, listening, and speaking',
    icon: <Target className="h-6 w-6" />,
    color: 'from-teal-500 to-teal-600',
    estimatedTime: '60-90 min',
    skills: ['Reading', 'Writing', 'Listening', 'Speaking'],
    features: ['Complete assessment', 'All four skills', 'Comprehensive scoring', 'Detailed feedback']
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
// ENHANCED ASSIGNMENT CREATOR COMPONENT (Re-structured)
// =====================================================

export default function EnhancedAssignmentCreator({
  classId,
  onAssignmentCreated,
  onCancel,
  templateId
}: {
  classId?: string;
  onAssignmentCreated?: (assignmentId: string) => void;
  onCancel?: () => void;
  templateId?: string;
}) {
  console.log('🎯 [ENHANCED ASSIGNMENT CREATOR] Component loaded');

  const { user } = useAuth();
  const [assignmentService] = useState(() => new EnhancedAssignmentService(supabaseBrowser));

  // --- Main Assignment Data State ---
  const [assignmentDetails, setAssignmentDetails] = useState<Partial<AssignmentCreationData>>({
    title: '',
    description: '',
    due_date: '',
    class_id: classId || '',
    curriculum_level: 'KS3', // Global curriculum level for the assignment
  });

  // --- Assignment Settings State ---
  const [assignmentSettings, setAssignmentSettings] = useState({
    allowLateSubmissions: false,
    maxAttempts: 1,
    showResults: true,
    randomizeOrder: false,
    estimatedTime: 30,
    instructions: ''
  });

  // --- Activity-Specific Configurations ---
  const [gameConfig, setGameConfig] = useState<UnifiedGameConfig>({
    selectedGames: [],
    vocabularyConfig: { source: '', wordCount: 10, difficulty: 'intermediate', curriculumLevel: 'KS3' },
    sentenceConfig: { source: '', theme: '', topic: '', sentenceCount: 10, difficulty: 'intermediate' },
    grammarConfig: { language: 'spanish', verbTypes: ['regular'], tenses: ['present'], persons: ['yo', 'tu', 'el_ella_usted'], difficulty: 'beginner', verbCount: 10 },
    difficulty: 'intermediate',
    timeLimit: 15,
    maxAttempts: 3,
    powerUpsEnabled: true,
    hintsAllowed: true,
    autoGrade: true,
    feedbackEnabled: true,
  });

  const [assessmentConfig, setAssessmentConfig] = useState<AssessmentConfig>({
    selectedAssessments: [],
    generalLanguage: 'spanish',
    generalLevel: 'KS3',
    generalDifficulty: 'foundation',
    generalExamBoard: 'General',
    generalTimeLimit: 30,
    generalMaxAttempts: 1,
    generalAutoGrade: true,
    generalFeedbackEnabled: true,
    assessmentCategory: '',
    assessmentSubcategory: '',
  });

  const [skillsConfig, setSkillsConfig] = useState<SkillsConfig>({
    selectedSkills: [],
    generalLanguage: 'spanish',
    generalLevel: 'KS3',
    generalTimeLimit: 20,
    generalMaxAttempts: 3,
    generalShowHints: true,
    generalRandomizeQuestions: false,
  });

  // --- New Unified Content Configuration State ---
  const [contentConfig, setContentConfig] = useState<ContentConfig>({
    type: 'KS3',
    language: 'spanish',
    categories: [],
    subcategories: []
  });

  // --- UI States ---
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(classId ? [classId] : []);
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // =====================================================
  // EFFECTS & DATA LOADING
  // =====================================================

  useEffect(() => {
    loadAvailableClasses();
    if (templateId) {
      loadTemplate();
    }
  }, [templateId, user]);

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

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const templates = await assignmentService.getAssignmentTemplates(user?.id || '', true);
      const template = templates.find(t => t.id === templateId);

      if (template) {
        // Populate assignmentDetails
        setAssignmentDetails({
          title: `${template.name} (Copy)`,
          description: template.description || '',
          due_date: '', // Templates don't typically have due dates
          class_id: classId,
          curriculum_level: (template as any).curriculum_level || 'KS3',
        });

        // Populate gameConfig if template has game data
        if (template.game_type !== 'assessment' && template.default_config?.selectedGames) {
          setGameConfig({
            selectedGames: template.default_config.selectedGames,
            vocabularyConfig: template.default_config.vocabularyConfig || gameConfig.vocabularyConfig,
            sentenceConfig: template.default_config.sentenceConfig || gameConfig.sentenceConfig,
            grammarConfig: template.default_config.grammarConfig || gameConfig.grammarConfig,
            difficulty: (template as any).difficulty_level || gameConfig.difficulty,
            timeLimit: (template as any).estimated_duration || gameConfig.timeLimit,
            maxAttempts: (template as any).max_attempts || gameConfig.maxAttempts,
            powerUpsEnabled: template.default_config.powerUpsEnabled ?? gameConfig.powerUpsEnabled,
            hintsAllowed: template.default_config.hintsAllowed ?? gameConfig.hintsAllowed,
            autoGrade: template.default_config.autoGrade ?? gameConfig.autoGrade,
            feedbackEnabled: template.default_config.feedbackEnabled ?? gameConfig.feedbackEnabled,
          });
          // Ensure curriculum level from template flows to vocab config
          setGameConfig(prev => ({
            ...prev,
            vocabularyConfig: {
              ...prev.vocabularyConfig,
              curriculumLevel: (template as any).curriculum_level || 'KS3'
            }
          }));
        }

        // Populate assessmentConfig if template has assessment data
        if (template.game_type === 'assessment' && template.default_config?.selectedAssessments) {
          setAssessmentConfig({
            selectedAssessments: template.default_config.selectedAssessments,
            generalLanguage: template.default_config.generalLanguage || assessmentConfig.generalLanguage,
            generalLevel: (template as any).curriculum_level || assessmentConfig.generalLevel,
            generalDifficulty: ((template as any).difficulty_level as 'foundation' | 'higher') || assessmentConfig.generalDifficulty,
            generalExamBoard: template.default_config.generalExamBoard || assessmentConfig.generalExamBoard,
            generalTimeLimit: (template as any).estimated_duration || assessmentConfig.generalTimeLimit,
            generalMaxAttempts: (template as any).max_attempts || assessmentConfig.generalMaxAttempts,
            generalAutoGrade: template.default_config.generalAutoGrade ?? assessmentConfig.generalAutoGrade,
            generalFeedbackEnabled: template.default_config.generalFeedbackEnabled ?? assessmentConfig.generalFeedbackEnabled,
            assessmentCategory: template.default_config.assessmentCategory || assessmentConfig.assessmentCategory,
            assessmentSubcategory: template.default_config.assessmentSubcategory || assessmentConfig.assessmentSubcategory,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load template:', error);
      setError('Failed to load template');
    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // STEP DEFINITIONS (Dynamic Completion)
  // =====================================================

  const assignmentSteps: AssignmentStep[] = [
    {
      id: 'basic',
      title: 'Assignment Details',
      description: 'Title, description, and due date',
      icon: <BookOpen className="h-5 w-5" />,
      completed: !!assignmentDetails.title && !!assignmentDetails.description && !!assignmentDetails.due_date && selectedClasses.length > 0
    },
    {
      id: 'activities',
      title: 'Choose Activities',
      description: 'Select games, assessments, or skills',
      icon: <Gamepad2 className="h-5 w-5" />,
      completed: gameConfig.selectedGames.length > 0 || assessmentConfig.selectedAssessments.length > 0 || skillsConfig.selectedSkills.length > 0
    },
    {
      id: 'content',
      title: 'Configure Content',
      description: 'Set up content sources and settings',
      icon: <Gem className="h-5 w-5" />,
      completed: (() => {
        // Check game content completeness
  const needsVocabulary = gameConfig.selectedGames.some(gameId => ['memory-game', 'hangman', 'word-blast', 'noughts-and-crosses', 'word-scramble', 'vocab-blast', 'detective-listening', 'vocab-master', 'word-towers'].includes(gameId));
  const needsSentences = gameConfig.selectedGames.some(gameId => ['speed-builder', 'case-file-translator', 'lava-temple-word-restore', 'sentence-towers'].includes(gameId));
  const needsGrammar = gameConfig.selectedGames.some(gameId => ['conjugation-duel'].includes(gameId));

        // Vocabulary completeness: require additional fields when using custom sources
        const vocabSource = gameConfig.vocabularyConfig.source;
        const isVocabComplete = !needsVocabulary || (
          vocabSource === 'create'
            ? !!gameConfig.vocabularyConfig.customVocabulary && gameConfig.vocabularyConfig.customVocabulary.trim().length > 0
            : vocabSource === 'custom'
              ? !!gameConfig.vocabularyConfig.customListId && gameConfig.vocabularyConfig.customListId !== ''
              : !!vocabSource
        );

        const gamesContentComplete =
          isVocabComplete &&
          (!needsSentences || !!gameConfig.sentenceConfig.source) &&
          (!needsGrammar || (gameConfig.grammarConfig.verbTypes.length > 0 && gameConfig.grammarConfig.tenses.length > 0 && gameConfig.grammarConfig.persons.length > 0));

        // Assessments always require a language and difficulty set, and possibly categories
        const assessmentsContentComplete = assessmentConfig.selectedAssessments.length === 0 ||
          (!!assessmentConfig.generalLanguage && !!assessmentConfig.generalDifficulty);

        // Skills require language, category, and topics
        const skillsContentComplete = skillsConfig.selectedSkills.length === 0 ||
          skillsConfig.selectedSkills.every(skill => {
            const config = skill.instanceConfig;
            return config?.language && config?.category && config?.topicIds && config?.topicIds.length > 0;
          });

        return (gameConfig.selectedGames.length > 0 || assessmentConfig.selectedAssessments.length > 0 || skillsConfig.selectedSkills.length > 0) &&
          gamesContentComplete &&
          assessmentsContentComplete &&
          skillsContentComplete;
      })()
    },
    {
      id: 'review',
      title: 'Review & Launch',
      description: 'Confirm settings and create',
      icon: <Trophy className="h-5 w-5" />,
      completed: true // Review step is completed when reached
    }
  ];

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const handleNext = () => {
    // Basic validation before moving to the next step
    if (!assignmentSteps[currentStep].completed && currentStep !== assignmentSteps.length - 1) { // Review step is completed by default if prior steps are
      setError(`Please complete all required fields for "${assignmentSteps[currentStep].title}" before proceeding.`);
      return;
    }
    setError(null); // Clear any previous errors
    if (currentStep < assignmentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    setError(null); // Clear any errors when going back
  };

  // Handlers for game config
  const handleGameSelectionChange = (selectedGames: string[]) => {
    setGameConfig(prev => ({ ...prev, selectedGames }));
  };
  const handleVocabularyConfigChange = (vocabConfig: VocabularyConfig) => {
    setGameConfig(prev => ({ ...prev, vocabularyConfig: vocabConfig }));
  };
  const handleSentenceConfigChange = (sentenceConfig: SentenceConfig) => {
    setGameConfig(prev => ({ ...prev, sentenceConfig }));
  };
  const handleGrammarConfigChange = (grammarConfig: GrammarConfig) => {
    setGameConfig(prev => ({ ...prev, grammarConfig }));
  };

  // Handlers for assessment config
  const addAssessmentToBasket = (assessmentType: typeof ASSESSMENT_TYPES[0]) => {
    const newAssessmentInstance = {
      id: `${assessmentType.id}-${Date.now()}`, // Unique ID for this instance
      type: assessmentType.id,
      name: assessmentType.name,
      estimatedTime: assessmentType.estimatedTime,
      skills: assessmentType.skills,
      instanceConfig: { // Inherit general settings for this instance
        language: assessmentConfig.generalLanguage,
        level: assessmentConfig.generalLevel,
        difficulty: assessmentConfig.generalDifficulty,
        examBoard: assessmentConfig.generalExamBoard,
        timeLimit: assessmentConfig.generalTimeLimit,
        maxAttempts: assessmentConfig.generalMaxAttempts,
        autoGrade: assessmentConfig.generalAutoGrade,
        feedbackEnabled: assessmentConfig.generalFeedbackEnabled,
      }
    };
    setAssessmentConfig(prev => ({
      ...prev,
      selectedAssessments: [...prev.selectedAssessments, newAssessmentInstance]
    }));
  };

  const removeAssessmentFromBasket = (instanceId: string) => {
    setAssessmentConfig(prev => ({
      ...prev,
      selectedAssessments: prev.selectedAssessments.filter(a => a.id !== instanceId)
    }));
  };

  // Handler for creating the final assignment
  const handleCreateAssignment = async () => {
    // Prevent multiple simultaneous assignment creations
    if (loading) {
      console.warn('Assignment creation already in progress, ignoring duplicate request');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!user) throw new Error('User not authenticated');
      if (selectedClasses.length === 0) throw new Error('Please select at least one class.');
      if (gameConfig.selectedGames.length === 0 && assessmentConfig.selectedAssessments.length === 0 && skillsConfig.selectedSkills.length === 0) {
        throw new Error('Please select at least one game, assessment, or skills activity.');
      }
      if (!assignmentDetails.title || !assignmentDetails.description || !assignmentDetails.due_date) {
        throw new Error('Please fill in all basic assignment details.');
      }

      // Consolidate all configuration into the final object
      const fullAssignmentConfig: AssignmentCreationData['config'] = {
        curriculumLevel: assignmentDetails.curriculum_level, // Global curriculum level
        gameConfig: gameConfig.selectedGames.length > 0 ? gameConfig : undefined, // Only include if games are selected
        assessmentConfig: assessmentConfig.selectedAssessments.length > 0 ? assessmentConfig : undefined, // Only include if assessments are selected
        skillsConfig: skillsConfig.selectedSkills.length > 0 ? skillsConfig : undefined, // Only include if skills are selected
        // Add any other global assignment configs here
      };

      console.log('🎯 [UI] Final gameConfig before assignment creation:', gameConfig);
      console.log('🎯 [UI] vocabularyConfig in gameConfig:', gameConfig.vocabularyConfig);

      const finalAssignmentData: AssignmentCreationData = {
        title: assignmentDetails.title!,
        description: assignmentDetails.description!,
        due_date: assignmentDetails.due_date!,
        class_id: assignmentDetails.class_id || '',
        curriculum_level: assignmentDetails.curriculum_level,
        game_type: (() => {
          const hasGames = gameConfig.selectedGames.length > 0;
          const hasAssessments = assessmentConfig.selectedAssessments.length > 0;
          const hasSkills = skillsConfig.selectedSkills.length > 0;

          if ((hasGames && hasAssessments) || (hasGames && hasSkills) || (hasAssessments && hasSkills) || (hasGames && hasAssessments && hasSkills)) {
            return 'mixed-mode';
          } else if (hasGames) {
            return 'multi-game';
          } else if (hasAssessments) {
            return 'assessment';
          } else if (hasSkills) {
            return 'skills';
          }
          return 'multi-game'; // fallback
        })(),
        config: fullAssignmentConfig,
        time_limit: (() => {
          if (gameConfig.selectedGames.length > 0) return gameConfig.timeLimit;
          if (assessmentConfig.selectedAssessments.length > 0) return assessmentConfig.generalTimeLimit;
          if (skillsConfig.selectedSkills.length > 0) return skillsConfig.generalTimeLimit;
          return 20; // fallback
        })(),
        max_attempts: (() => {
          if (gameConfig.selectedGames.length > 0) return gameConfig.maxAttempts;
          if (assessmentConfig.selectedAssessments.length > 0) return assessmentConfig.generalMaxAttempts;
          if (skillsConfig.selectedSkills.length > 0) return skillsConfig.generalMaxAttempts;
          return 3; // fallback
        })(),
        auto_grade: gameConfig.selectedGames.length > 0 ? gameConfig.autoGrade : assessmentConfig.generalAutoGrade,
        feedback_enabled: gameConfig.selectedGames.length > 0 ? gameConfig.feedbackEnabled : assessmentConfig.generalFeedbackEnabled,
        hints_allowed: gameConfig.selectedGames.length > 0 ? gameConfig.hintsAllowed : false, // Hints usually only for games
        power_ups_enabled: gameConfig.selectedGames.length > 0 ? gameConfig.powerUpsEnabled : false, // Power-ups usually only for games
      };

      const createdAssignments: string[] = [];
      for (const selectedClassId of selectedClasses) {
        const assignmentForClass = {
          ...finalAssignmentData,
          class_id: selectedClassId,
        } as AssignmentCreationData;
        const assignmentId = await assignmentService.createEnhancedAssignment(user.id, assignmentForClass);
        createdAssignments.push(assignmentId);
      }

      if (onAssignmentCreated) {
        onAssignmentCreated(createdAssignments[0]);
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
                value={assignmentDetails.title || ''}
                onChange={(e) => setAssignmentDetails(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Enter a descriptive title for your assignment..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Description *
              </label>
              <textarea
                value={assignmentDetails.description || ''}
                onChange={(e) => setAssignmentDetails(prev => ({ ...prev, description: e.target.value }))}
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
                    value={assignmentDetails.due_date?.split('T')[0] || ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      const time = assignmentDetails.due_date?.split('T')[1] || '23:59';
                      setAssignmentDetails(prev => ({
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
                      value={assignmentDetails.due_date?.split('T')[1]?.split(':')[0] || '23'}
                      onChange={(e) => {
                        const date = assignmentDetails.due_date?.split('T')[0] || '';
                        const minutes = assignmentDetails.due_date?.split('T')[1]?.split(':')[1] || '59';
                        if (date) {
                          setAssignmentDetails(prev => ({
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
                      value={assignmentDetails.due_date?.split('T')[1]?.split(':')[1] || '59'}
                      onChange={(e) => {
                        const date = assignmentDetails.due_date?.split('T')[0] || '';
                        const hours = assignmentDetails.due_date?.split('T')[1]?.split(':')[0] || '23';
                        if (date) {
                          setAssignmentDetails(prev => ({
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
              {!assignmentDetails.due_date && (
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

      <div className="max-w-6xl mx-auto">
        {/* Games Selection Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Gamepad2 className="h-5 w-5 text-purple-600" />
            </div>
            Game-Based Practice Activities
          </h4>
          <MultiGameSelector
            selectedGames={gameConfig.selectedGames}
            onSelectionChange={handleGameSelectionChange}
            maxSelections={15}
          />
          {gameConfig.selectedGames.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h5 className="text-lg font-semibold text-gray-800 mb-3">General Game Settings</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* General Difficulty for Games */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">Difficulty</label>
                  <select
                    value={gameConfig.difficulty}
                    onChange={(e) => setGameConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                {/* General Time Limit for Games */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">Time Limit (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={gameConfig.timeLimit}
                    onChange={(e) => setGameConfig(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 15 }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  />
                </div>
                {/* General Max Attempts for Games */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">Max Attempts (per question)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={gameConfig.maxAttempts}
                    onChange={(e) => setGameConfig(prev => ({ ...prev, maxAttempts: parseInt(e.target.value) || 3 }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  />
                </div>
                {/* Other game settings */}
                <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={gameConfig.powerUpsEnabled} onChange={e => setGameConfig(prev => ({ ...prev, powerUpsEnabled: e.target.checked }))} className="h-5 w-5 text-purple-600 rounded" />
                    <span className="text-gray-800">Enable Power-ups</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={gameConfig.hintsAllowed} onChange={e => setGameConfig(prev => ({ ...prev, hintsAllowed: e.target.checked }))} className="h-5 w-5 text-purple-600 rounded" />
                    <span className="text-gray-800">Allow Hints</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={gameConfig.feedbackEnabled} onChange={e => setGameConfig(prev => ({ ...prev, feedbackEnabled: e.target.checked }))} className="h-5 w-5 text-purple-600 rounded" />
                    <span className="text-gray-800">Instant Feedback</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Assessment Selection Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
            </div>
            Formal Assessments
          </h4>
          {/* Disclaimer Notice */}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-3 flex items-start text-sm mb-6">
            <Info className="h-5 w-5 flex-shrink-0 mr-3 text-blue-500" />
            <div>
              <p className="font-medium mb-1">Important: Our Assessment Content</p>
              <p>Our exam-style questions and assessments are original content designed to reflect UK exam board formats for practice purposes. LanguageGems is not affiliated with any official examination board. <a href="/legal/disclaimer" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-900">Read our full disclaimer.</a></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ASSESSMENT_TYPES.map((assessment) => {
              const isSelected = assessmentConfig.selectedAssessments.some(a => a.type === assessment.id); // Check against instance type

              return (
                <motion.div
                  key={assessment.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  onClick={() => {
                    // Always add a new instance when clicked, even if already selected
                    // This allows adding the same assessment type multiple times if desired (e.g., 2 reading comprehensions)
                    addAssessmentToBasket(assessment);
                  }}
                >
                  {/* Visual feedback if this type is *in the basket* */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 flex items-center justify-center h-6 w-6 bg-indigo-600 text-white rounded-full">
                      <CheckCircle className="h-4 w-4" />
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

          {/* Selected Assessments Display (the basket) with individual configuration */}
          {assessmentConfig.selectedAssessments.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Selected Assessments ({assessmentConfig.selectedAssessments.length})</h4>
              <div className="space-y-4">
                {assessmentConfig.selectedAssessments.map((item, index) => (
                  <div key={item.id} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{item.name}</h5>
                          <p className="text-sm text-gray-600">{item.estimatedTime} • {item.skills.join(', ')}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAssessmentFromBasket(item.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                        title="Remove assessment"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Individual Assessment Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Language</label>
                        <select
                          value={item.instanceConfig?.language || assessmentConfig.generalLanguage}
                          onChange={(e) => {
                            const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                              a.id === item.id
                                ? { ...a, instanceConfig: { ...a.instanceConfig, language: e.target.value as 'spanish' | 'french' | 'german' } }
                                : a
                            );
                            setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Difficulty</label>
                        <select
                          value={item.instanceConfig?.difficulty || assessmentConfig.generalDifficulty}
                          onChange={(e) => {
                            const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                              a.id === item.id
                                ? { ...a, instanceConfig: { ...a.instanceConfig, difficulty: e.target.value as 'foundation' | 'higher' } }
                                : a
                            );
                            setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="foundation">Foundation</option>
                          <option value="higher">Higher</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Time Limit (min)</label>
                        <input
                          type="number"
                          min="5"
                          max="120"
                          value={item.instanceConfig?.timeLimit || assessmentConfig.generalTimeLimit}
                          onChange={(e) => {
                            const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                              a.id === item.id
                                ? { ...a, instanceConfig: { ...a.instanceConfig, timeLimit: parseInt(e.target.value) || 30 } }
                                : a
                            );
                            setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Max Attempts</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={item.instanceConfig?.maxAttempts || assessmentConfig.generalMaxAttempts}
                          onChange={(e) => {
                            const updatedAssessments = assessmentConfig.selectedAssessments.map(a =>
                              a.id === item.id
                                ? { ...a, instanceConfig: { ...a.instanceConfig, maxAttempts: parseInt(e.target.value) || 1 } }
                                : a
                            );
                            setAssessmentConfig(prev => ({ ...prev, selectedAssessments: updatedAssessments }));
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {assessmentConfig.selectedAssessments.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h5 className="text-lg font-semibold text-gray-800 mb-3">Default Settings for New Assessments</h5>
              <p className="text-sm text-gray-600 mb-4">These settings will be applied to newly added assessments. You can customize each assessment individually above.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Language */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Default Language</label>
                  <select
                    value={assessmentConfig.generalLanguage}
                    onChange={(e) => setAssessmentConfig(prev => ({
                      ...prev,
                      generalLanguage: e.target.value as 'spanish' | 'french' | 'german'
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Default Difficulty</label>
                  <select
                    value={assessmentConfig.generalDifficulty}
                    onChange={(e) => setAssessmentConfig(prev => ({
                      ...prev,
                      generalDifficulty: e.target.value as 'foundation' | 'higher'
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="foundation">Foundation</option>
                    <option value="higher">Higher</option>
                  </select>
                </div>

                {/* Exam Board */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Default Exam Board</label>
                  <select
                    value={assessmentConfig.generalExamBoard}
                    onChange={(e) => setAssessmentConfig(prev => ({
                      ...prev,
                      generalExamBoard: e.target.value as 'AQA' | 'Edexcel' | 'Eduqas' | 'General'
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="General">General</option>
                    <option value="AQA">AQA</option>
                    <option value="Edexcel">Edexcel</option>
                    <option value="Eduqas">Eduqas</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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

      {/* Curriculum Level Selection - Global for Assignment */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Curriculum Level *
          </h4>
          <div className="flex bg-gray-100 rounded-xl p-2">
            <button
              type="button"
              onClick={() => {
                setAssignmentDetails(prev => ({ ...prev, curriculum_level: 'KS3' }));
                setGameConfig(prev => ({
                  ...prev,
                  vocabularyConfig: { ...prev.vocabularyConfig, curriculumLevel: 'KS3' }
                }));
                setAssessmentConfig(prev => ({
                  ...prev,
                  generalLevel: 'KS3'
                }));
              }}
              className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${assignmentDetails.curriculum_level === 'KS3'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              KS3 (Year 7-9)
            </button>
            <button
              type="button"
              onClick={() => {
                setAssignmentDetails(prev => ({ ...prev, curriculum_level: 'KS4' }));
                setGameConfig(prev => ({
                  ...prev,
                  vocabularyConfig: { ...prev.vocabularyConfig, curriculumLevel: 'KS4' }
                }));
                setAssessmentConfig(prev => ({
                  ...prev,
                  generalLevel: 'KS4'
                }));
              }}
              className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${assignmentDetails.curriculum_level === 'KS4'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              KS4 (GCSE)
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3 text-center">
            {assignmentDetails.curriculum_level === 'KS3'
              ? 'Foundation level vocabulary and topics for Years 7-9'
              : 'Advanced GCSE-level vocabulary and exam topics'
            }
          </p>
        </div>

        {/* KS4 Exam Board and Tier Selection */}
        {assignmentDetails.curriculum_level === 'KS4' && gameConfig.selectedGames.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center mr-2">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
              </div>
              GCSE Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Exam Board Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Exam Board</label>
                <select
                  value={gameConfig.vocabularyConfig.examBoard || 'AQA'}
                  // @ts-ignore - Temporarily disable TypeScript checking
                  onChange={(e) => setGameConfig(prev => ({
                    ...prev,
                    vocabularyConfig: {
                      ...prev.vocabularyConfig,
                      examBoard: e.target.value as 'AQA' | 'edexcel'
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="AQA">AQA</option>
                  <option value="edexcel">Edexcel</option>
                </select>
              </div>

              {/* Tier Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Tier</label>
                <select
                  value={gameConfig.vocabularyConfig.tier || 'foundation'}
                  onChange={(e) => setGameConfig(prev => ({
                    ...prev,
                    vocabularyConfig: {
                      ...prev.vocabularyConfig,
                      tier: e.target.value as 'foundation' | 'higher'
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                >
                  <option value="foundation">Foundation Tier (Grades 1-5)</option>
                  <option value="higher">Higher Tier (Grades 4-9)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Unified Content Configuration */}
      {(gameConfig.selectedGames.length > 0 || assessmentConfig.selectedAssessments.length > 0) && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              Content Configuration
            </h4>
            <p className="text-gray-600 mb-8">
              Configure the vocabulary and content for your assignment based on curriculum level
            </p>

            {/* Word Count Configuration */}
            {gameConfig.selectedGames.length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center mr-2">
                    <Target className="h-4 w-4 text-amber-600" />
                  </div>
                  Vocabulary Settings
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Total Words in Assignment
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={gameConfig.vocabularyConfig.wordCount || 20}
                      onChange={(e) => {
                        const wordCount = parseInt(e.target.value) || 20;
                        setGameConfig(prev => ({
                          ...prev,
                          vocabularyConfig: {
                            ...prev.vocabularyConfig,
                            wordCount
                          }
                        }));
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Recommended: 10-20 for quick practice, 30-50 for comprehensive review
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <div className="text-sm font-medium text-amber-900 mb-2">📊 Assignment Preview</div>
                    {gameConfig.vocabularyConfig.source === 'custom' && gameConfig.vocabularyConfig.customListId ? (
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>✅ Custom vocabulary list: <strong>{gameConfig.vocabularyConfig.customList?.name || 'Selected'}</strong></p>
                        <p>📝 <strong>{gameConfig.vocabularyConfig.wordCount || 20}</strong> words will be used from your list</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Using your custom vocabulary from "My Lists"
                        </p>
                      </div>
                    ) : gameConfig.vocabularyConfig.subcategories?.length > 0 ? (
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>✅ <strong>{gameConfig.vocabularyConfig.subcategories.length}</strong> subcategories selected</p>
                        <p>📝 <strong>{gameConfig.vocabularyConfig.wordCount || 20}</strong> words will be randomly sampled</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Words will be selected randomly from: {gameConfig.vocabularyConfig.subcategories.slice(0, 3).join(', ')}
                          {gameConfig.vocabularyConfig.subcategories.length > 3 && ` and ${gameConfig.vocabularyConfig.subcategories.length - 3} more`}
                        </p>
                      </div>
                    ) : gameConfig.vocabularyConfig.categories?.length > 0 ? (
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>✅ <strong>{gameConfig.vocabularyConfig.categories.length}</strong> categories selected</p>
                        <p>📝 <strong>{gameConfig.vocabularyConfig.wordCount || 20}</strong> words will be randomly sampled</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Select content source below to see preview</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <CurriculumContentSelector
              curriculumLevel={(contentConfig.type === 'custom') ? contentConfig.type : (assignmentDetails.curriculum_level || 'KS3')}
              language={gameConfig.vocabularyConfig?.language as 'spanish' | 'french' | 'german' || 'spanish'}
              onConfigChange={(config) => {
                console.log('🎯 [UI] ===== CALLBACK STARTED =====');
                console.log('🎯 [UI] Content config received:', config);
                console.log('🎯 [UI] Config type:', config.type);

                // Convert 'my-vocabulary' to 'custom' for type compatibility
                const normalizedConfig = config.type === 'my-vocabulary'
                  ? { ...config, type: 'custom' as const } as ContentConfig
                  : config as ContentConfig;

                console.log('🎯 [UI] Normalized config:', normalizedConfig);
                console.log('🎯 [UI] ===== CALLBACK ENDED =====');
                setContentConfig(normalizedConfig);

                // Auto-adjust word count based on selection
                const subcategoryCount = config.subcategories?.length || 0;
                const categoryCount = config.categories?.length || 0;
                const isMultipleSelection = subcategoryCount > 1 || categoryCount > 1;

                // Set default word count: 20 for multiple selections, 10 for single
                const defaultWordCount = isMultipleSelection ? 20 : 10;

                // Only update word count if it's still at the default value
                if (!gameConfig.vocabularyConfig.wordCount || gameConfig.vocabularyConfig.wordCount === 10 || gameConfig.vocabularyConfig.wordCount === 20) {
                  setGameConfig(prev => ({
                    ...prev,
                    vocabularyConfig: {
                      ...prev.vocabularyConfig,
                      wordCount: defaultWordCount
                    }
                  }));
                }

                // @ts-ignore - Temporarily disable TypeScript checking to test callback execution
                // Update both game and assessment configs based on the unified content config
                if (gameConfig.selectedGames.length > 0) {
                  let vocabularyConfig;

                  console.log('🎯 [UI] Content config FULL:', JSON.stringify(config, null, 2));
                  console.log('🎯 [UI] Content config type:', config.type, 'customListId:', config.customListId, 'customVocabulary:', config.customVocabulary?.substring(0, 50));
                  console.log('🎯 [UI] Checking config.type === "my-vocabulary":', config.type === 'my-vocabulary');
                  console.log('🎯 [UI] Checking config.type === "custom":', config.type === 'custom');
                  console.log('🎯 [UI] config.type exact value and type:', JSON.stringify(config.type), typeof config.type);

                  if (config.type === 'my-vocabulary') {
                    // Handle custom vocabulary lists
                    vocabularyConfig = {
                      ...gameConfig.vocabularyConfig,
                      source: 'custom' as const,
                      customListId: config.customListId,
                      customList: { name: config.customListName },
                      curriculumLevel: 'KS3' as const // Default for custom lists
                    };
                    console.log('🎯 [UI] Created custom vocabulary config:', vocabularyConfig);
                  } else if (config.type === 'custom') {
                    // Handle manual custom entry
                    vocabularyConfig = {
                      source: 'create' as const,
                      curriculumLevel: 'KS3' as const,
                      customVocabulary: config.customVocabulary,
                      wordCount: gameConfig.vocabularyConfig.wordCount || 10,
                      difficulty: gameConfig.vocabularyConfig.difficulty || 'intermediate',
                      language: gameConfig.vocabularyConfig.language || 'es'
                    };
                    console.log('🎯 [UI] Created MANUAL custom vocabulary config:', vocabularyConfig);
                  } else {
                    // Handle KS3/KS4 curriculum content
                    vocabularyConfig = {
                      ...gameConfig.vocabularyConfig,
                      source: 'category' as const,
                      categories: config.categories,
                      subcategories: config.subcategories,
                      category: config.categories?.[0] || '',
                      subcategory: config.subcategories?.[0] || '',
                      curriculumLevel: config.type as 'KS3' | 'KS4',
                      examBoard: config.examBoard,
                      tier: config.tier
                    };
                  }

                  // @ts-ignore - Temporarily disable TypeScript checking
                  setGameConfig(prev => ({
                    ...prev,
                    vocabularyConfig
                  }));
                }
                if (assessmentConfig.selectedAssessments.length > 0) {
                  // @ts-ignore - Temporarily disable TypeScript checking
                  setAssessmentConfig(prev => ({
                    ...prev,
                    assessmentCategory: config.categories?.[0] || '',
                    assessmentSubcategory: config.subcategories?.[0] || '',
                    generalLevel: config.type === 'custom' || config.type === 'my-vocabulary' ? 'KS3' : config.type as 'KS3' | 'KS4',
                    generalExamBoard: (config.examBoard === 'edexcel' ? 'Edexcel' : config.examBoard) || 'General'
                  }));
                }
              }}
              initialConfig={contentConfig}
            />

            {/* Vocabulary Preview Section */}
            {gameConfig.selectedGames.length > 0 && gameConfig.vocabularyConfig.source && gameConfig.vocabularyConfig.source !== '' && (
              <VocabularyPreviewSection
                vocabularyConfig={gameConfig.vocabularyConfig}
                onVocabularyChange={(selectedItems, wordCount) => {
                  console.log('📝 [PREVIEW] Vocabulary selection changed:', { selectedItems: selectedItems.length, wordCount });
                  setGameConfig(prev => ({
                    ...prev,
                    vocabularyConfig: {
                      ...prev.vocabularyConfig,
                      wordCount: wordCount,
                      selectedVocabularyIds: selectedItems.map(item => item.id)
                    }
                  }));
                }}
                maxWords={100}
              />
            )}
          </div>
        </div>
      )}



      {/* Show message if no activities selected */}
      {gameConfig.selectedGames.length === 0 && assessmentConfig.selectedAssessments.length === 0 && skillsConfig.selectedSkills.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Gem className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No activities selected</p>
          <p className="text-sm">Go back to select games, assessments, or skills to configure their content</p>
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
                <div className="text-lg font-medium text-gray-900">{assignmentDetails.title || 'Untitled Assignment'}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Due Date</div>
                <div className="text-lg font-medium text-gray-900">
                  {assignmentDetails.due_date
                    ? new Date(assignmentDetails.due_date).toLocaleDateString('en-GB', {
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
              <div className="text-gray-900">{assignmentDetails.description || 'No description provided'}</div>
            </div>

            {/* Curriculum Level */}
            {assignmentDetails.curriculum_level && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Curriculum Level</div>
                <div className="text-lg font-medium text-blue-900">
                  {assignmentDetails.curriculum_level === 'KS3' ? 'KS3 (Years 7-9)' : 'KS4 (GCSE)'}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="text-sm font-semibold text-purple-600 mb-1">Difficulty</div>
                    <div className="text-purple-900 capitalize">{gameConfig.difficulty}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="text-sm font-semibold text-purple-600 mb-1">Time Limit</div>
                    <div className="text-purple-900">{gameConfig.timeLimit} minutes</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="text-sm font-semibold text-purple-600 mb-1">Max Attempts</div>
                    <div className="text-purple-900">{gameConfig.maxAttempts}</div>
                  </div>
                </div>

                {/* Game Content Configuration Summary */}
                {(gameConfig.vocabularyConfig.source || gameConfig.sentenceConfig.source || gameConfig.grammarConfig.verbTypes.length > 0) && (
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="text-sm font-semibold text-purple-600 mb-2">Content Source Summary</div>
                    {gameConfig.vocabularyConfig.source && (
                      <div className="text-purple-900 mb-1">
                        <span className="font-medium">Vocabulary:</span> {gameConfig.vocabularyConfig.source.replace(/_/g, ' ')}
                        {gameConfig.vocabularyConfig.categories?.length ? ` (${gameConfig.vocabularyConfig.categories.join(', ').replace(/_/g, ' ')})` : ''}
                        {gameConfig.vocabularyConfig.wordCount ? ` (${gameConfig.vocabularyConfig.wordCount} words)` : ''}
                      </div>
                    )}
                    {gameConfig.sentenceConfig.source && (
                      <div className="text-purple-900 mb-1">
                        <span className="font-medium">Sentences:</span> {gameConfig.sentenceConfig.source.replace(/_/g, ' ')}
                        {gameConfig.sentenceConfig.sentenceCount ? ` (${gameConfig.sentenceConfig.sentenceCount} sentences)` : ''}
                      </div>
                    )}
                    {gameConfig.grammarConfig.verbTypes.length > 0 && (
                      <div className="text-purple-900 mb-1">
                        <span className="font-medium">Grammar:</span> {gameConfig.grammarConfig.language} - {gameConfig.grammarConfig.verbTypes.join(', ')} verbs, {gameConfig.grammarConfig.tenses.join(', ')} tenses, {gameConfig.grammarConfig.persons.join(', ')} persons
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Assessment Configuration */}
            {assessmentConfig.selectedAssessments.length > 0 && (
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                <div className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-4">Assessment Activities</div>
                <div className="mb-4">
                  <span className="text-lg font-semibold text-indigo-900">Selected Assessments ({assessmentConfig.selectedAssessments.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {assessmentConfig.selectedAssessments.map(assessment => (
                    <div key={assessment.id} className="bg-white rounded-lg p-3 border border-indigo-200">
                      <div className="font-medium text-indigo-900">{assessment.name}</div>
                      <div className="text-sm text-indigo-700">{assessment.estimatedTime}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm font-semibold text-indigo-600 mb-1">Language</div>
                    <div className="text-indigo-900 capitalize">{assessmentConfig.generalLanguage}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm font-semibold text-indigo-600 mb-1">Difficulty</div>
                    <div className="text-indigo-900 capitalize">{assessmentConfig.generalDifficulty}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm font-semibold text-indigo-600 mb-1">Time Limit</div>
                    <div className="text-indigo-900">{assessmentConfig.generalTimeLimit} minutes</div>
                  </div>
                </div>

                {assessmentConfig.assessmentCategory && (
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm font-semibold text-indigo-600 mb-2">Content Category:</div>
                    <div className="text-indigo-900">
                      {assessmentConfig.assessmentCategory.replace(/_/g, ' ')}
                      {assessmentConfig.assessmentSubcategory && ` / ${assessmentConfig.assessmentSubcategory.replace(/_/g, ' ')}`}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* If no activities selected */}
            {gameConfig.selectedGames.length === 0 && assessmentConfig.selectedAssessments.length === 0 && skillsConfig.selectedSkills.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <Info className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium mb-1">No activities selected for this assignment.</p>
                <p className="text-sm">Please go back to the "Choose Activities" step to add games, assessments, or skills.</p>
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
          disabled={loading || !assignmentSteps.every(step => step.completed)} // Ensure all prior steps are valid
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

  // Step completion handler
  const handleStepComplete = (stepId: string, completed: boolean) => {
    // The completion logic is already handled in the assignmentSteps array
    // This is just a placeholder for the step components
  };

  const renderStepContent = () => {
    console.log('🎯 [ENHANCED ASSIGNMENT] Rendering step content:', {
      currentStep,
      stepId: assignmentSteps[currentStep]?.id,
      assignmentDetails,
      gameConfig,
      selectedGames: gameConfig.selectedGames?.length || 0
    });

    const stepProps = {
      assignmentDetails: {
        title: assignmentDetails.title || '',
        description: assignmentDetails.description || '',
        dueDate: assignmentDetails.due_date || '',
        selectedClasses: selectedClasses,
        estimatedTime: assignmentSettings.estimatedTime,
        instructions: assignmentSettings.instructions,
        allowLateSubmissions: assignmentSettings.allowLateSubmissions,
        maxAttempts: assignmentSettings.maxAttempts,
        showResults: assignmentSettings.showResults,
        randomizeOrder: assignmentSettings.randomizeOrder
      },
      setAssignmentDetails: (updater: any) => {
        if (typeof updater === 'function') {
          const newDetails = updater({
            title: assignmentDetails.title || '',
            description: assignmentDetails.description || '',
            dueDate: assignmentDetails.due_date || '',
            selectedClasses: selectedClasses,
            estimatedTime: assignmentSettings.estimatedTime,
            instructions: assignmentSettings.instructions,
            allowLateSubmissions: assignmentSettings.allowLateSubmissions,
            maxAttempts: assignmentSettings.maxAttempts,
            showResults: assignmentSettings.showResults,
            randomizeOrder: assignmentSettings.randomizeOrder
          });
          setSelectedClasses(newDetails.selectedClasses);

          // Update assignment settings
          setAssignmentSettings(prev => ({
            ...prev,
            estimatedTime: newDetails.estimatedTime,
            instructions: newDetails.instructions,
            allowLateSubmissions: newDetails.allowLateSubmissions,
            maxAttempts: newDetails.maxAttempts,
            showResults: newDetails.showResults,
            randomizeOrder: newDetails.randomizeOrder
          }));

          // Update basic assignment details
          setAssignmentDetails(prev => ({
            ...prev,
            title: newDetails.title,
            description: newDetails.description,
            due_date: newDetails.dueDate
          }));
        }
      },
      gameConfig,
      setGameConfig,
      assessmentConfig,
      setAssessmentConfig,
      skillsConfig,
      setSkillsConfig,
      onStepComplete: handleStepComplete,
      classes: availableClasses,
      loading,
      error
    };

    switch (assignmentSteps[currentStep]?.id) {
      case 'basic':
        // @ts-ignore - Temporarily disable TypeScript checking
        return <AssignmentDetailsStep {...stepProps} />;
      case 'activities':
        // @ts-ignore - Temporarily disable TypeScript checking
        return <ActivitiesSelectionStep {...stepProps} />;
      case 'content':
        // @ts-ignore - Temporarily disable TypeScript checking
        return <ContentConfigurationStep {...stepProps} />;
      case 'review':
        // @ts-ignore - Temporarily disable TypeScript checking
        return <ReviewStep {...stepProps} />;
      default:
        return null;
    }
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Full-page loading overlay if templateId is being loaded initially */}
      {loading && templateId && !assignmentDetails.title ? ( // This condition means we're loading a template and don't have initial data yet
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50 rounded-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="ml-4 text-xl text-gray-700">Loading template...</p>
        </div>
      ) : null}

      {/* Compact Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create New Assignment</h1>
        <p className="text-sm text-gray-600">Set up activities and assessments for your students</p>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center"
        >
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </motion.div>
      )}

      {/* Compact Progress Steps */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          {assignmentSteps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 flex-shrink-0 ${index < currentStep
                    ? 'bg-green-500 border-green-500 text-white shadow-sm'
                    : index === currentStep
                      ? 'bg-purple-600 border-purple-600 text-white shadow-md scale-110'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <div className="scale-75">{step.icon}</div>
                )}
              </div>
              <div className="ml-2 flex-grow min-w-0 hidden sm:block">
                <div className={`text-xs font-semibold ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400 truncate">{step.description}</div>
              </div>
              {index < assignmentSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-colors duration-200 ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  } hidden md:block`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
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
                document.body.offsetHeight;
              }, 10);
            }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Compact Navigation */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>Step {currentStep + 1} of {assignmentSteps.length}</span>
          <div className="w-16 bg-gray-200 rounded-full h-1">
            <div
              className="bg-purple-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / assignmentSteps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex space-x-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              Cancel
            </button>
          )}

          {currentStep < assignmentSteps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!assignmentSteps[currentStep].completed}
              className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleCreateAssignment}
              disabled={loading || !assignmentSteps.every(step => step.completed)}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {loading ? 'Creating...' : 'Create Assignment'}
              {loading ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white ml-1"></div> : <CheckCircle className="h-4 w-4 ml-1" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}