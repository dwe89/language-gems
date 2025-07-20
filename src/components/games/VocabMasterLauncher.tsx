'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Target, Brain, Clock, Trophy,
  BarChart3, Calendar, Zap, Settings, Home
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import VocabMasterGame from './VocabMasterGame';
import SimpleVocabularySelector from '../vocabulary/SimpleVocabularySelector';
import { SpacedRepetitionService } from '../../services/spacedRepetitionService';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface LearningMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  estimatedTime: string;
}

interface VocabMasterLauncherProps {
  assignmentId?: string;
  mode?: 'free_play' | 'assignment' | 'review' | 'spaced_repetition';
  onGameComplete?: (results: GameResults) => void;
  onExit?: () => void;
  preselectedVocabulary?: any[];
  gameConfig?: Record<string, any>;
}

interface GameResults {
  score: number;
  accuracy: number;
  wordsLearned: number;
  wordsReviewed: number;
  timeSpent: number;
  strengthsGained: string[];
  weaknessesIdentified: string[];
  spacedRepetitionUpdates: any[];
}

interface UserProgress {
  totalWordsLearned: number;
  currentStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  masteryLevels: Record<string, number>;
  recentActivity: any[];
}

// =====================================================
// LEARNING MODES CONFIGURATION
// =====================================================

const LEARNING_MODES: LearningMode[] = [
  {
    id: 'learn_new',
    name: 'Learn New Words',
    description: 'Discover and learn new vocabulary with spaced repetition',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'blue',
    features: ['Introduction to new words', 'Audio pronunciation', 'Example sentences', 'Spaced repetition'],
    estimatedTime: '10-15 min',
  },
  {
    id: 'review_weak',
    name: 'Review Weak Words',
    description: 'Focus on words you struggle with most',
    icon: <Target className="h-6 w-6" />,
    color: 'orange',
    features: ['Adaptive difficulty', 'Personalized review', 'Weakness targeting'],
    estimatedTime: '5-10 min',
  },
  {
    id: 'spaced_repetition',
    name: 'Spaced Review',
    description: 'Review words at optimal intervals for long-term retention',
    icon: <Brain className="h-6 w-6" />,
    color: 'purple',
    features: ['Science-based intervals', 'Long-term retention', 'Automated scheduling'],
    estimatedTime: '5-20 min',
  },
  {
    id: 'speed_review',
    name: 'Speed Challenge',
    description: 'Quick-fire review to improve recall speed',
    icon: <Zap className="h-6 w-6" />,
    color: 'yellow',
    features: ['Timed challenges', 'Speed improvement', 'Reaction time training'],
    estimatedTime: '3-5 min',
  }
];

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function VocabMasterLauncher({
  assignmentId,
  mode = 'free_play',
  onGameComplete,
  onExit,
  preselectedVocabulary = [],
  gameConfig = {}
}: VocabMasterLauncherProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const spacedRepetitionService = new SpacedRepetitionService(supabase);

  // State
  const [selectedMode, setSelectedMode] = useState<string>('learn_new');
  const [selectedVocabulary, setSelectedVocabulary] = useState<any[]>(preselectedVocabulary);
  const [currentScreen, setCurrentScreen] = useState<'mode_select' | 'vocabulary_select' | 'game'>('mode_select');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalWordsLearned: 0,
    currentStreak: 0,
    weeklyGoal: 50,
    weeklyProgress: 0,
    masteryLevels: {},
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  // =====================================================
  // INITIALIZATION
  // =====================================================

  useEffect(() => {
    loadUserProgress();
    
    // Handle different entry modes
    if (mode === 'assignment' && assignmentId) {
      loadAssignmentVocabulary();
    } else if (preselectedVocabulary.length > 0) {
      setCurrentScreen('game');
    } else if (mode === 'spaced_repetition') {
      loadSpacedRepetitionWords();
    } else {
      setCurrentScreen('mode_select');
    }
  }, []);

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      // Use the spaced repetition service to get user stats
      const stats = await spacedRepetitionService.getUserStats(user.id);
      
      setUserProgress(prev => ({
        ...prev,
        totalWordsLearned: stats.learnedWords,
        currentStreak: stats.currentStreak,
        weeklyProgress: stats.weeklyProgress,
        recentActivity: []
      }));
    } catch (error) {
      console.error('Failed to load user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAssignmentVocabulary = async () => {
    if (!assignmentId) return;

    try {
      // This would load assignment-specific vocabulary
      // Implementation depends on your assignment system
      setCurrentScreen('game');
    } catch (error) {
      console.error('Failed to load assignment vocabulary:', error);
    }
  };

  const loadSpacedRepetitionWords = async () => {
    if (!user) return;

    try {
      const wordsForReview = await spacedRepetitionService.getWordsForReview(user.id, 20);
      
      if (wordsForReview.length > 0) {
        const vocabWords = wordsForReview.map(item => item.vocabulary_items);
        setSelectedVocabulary(vocabWords);
        setSelectedMode('spaced_repetition');
        setCurrentScreen('game');
      } else {
        // No words due for review, show regular mode selection
        setCurrentScreen('mode_select');
      }
    } catch (error) {
      console.error('Failed to load spaced repetition words:', error);
      setCurrentScreen('mode_select');
    }
  };

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const handleModeSelect = async (modeId: string) => {
    setSelectedMode(modeId);
    
    if (!user) return;
    
    try {
      let vocabWords: any[] = [];
      
      switch (modeId) {
        case 'spaced_repetition':
          vocabWords = (await spacedRepetitionService.getWordsForReview(user.id, 20))
            .map(item => item.vocabulary_items);
          break;
          
        case 'review_weak':
          vocabWords = (await spacedRepetitionService.getWeakWords(user.id, 15))
            .map(item => item.vocabulary_items);
          break;
          
        case 'learn_new':
          vocabWords = await spacedRepetitionService.getNewWords(user.id, 10);
          break;
          
        default:
          setCurrentScreen('vocabulary_select');
          return;
      }
      
      if (vocabWords.length > 0) {
        setSelectedVocabulary(vocabWords);
        setCurrentScreen('game');
      } else {
        // No words available for this mode, let user select manually
        setCurrentScreen('vocabulary_select');
      }
    } catch (error) {
      console.error('Failed to load words for mode:', modeId, error);
      setCurrentScreen('vocabulary_select');
    }
  };

  const handleVocabularySelected = (vocabulary: any[]) => {
    setSelectedVocabulary(vocabulary);
    setCurrentScreen('game');
  };

  const handleGameComplete = (results: GameResults) => {
    onGameComplete?.(results);
  };

  // =====================================================
  // RENDER SCREENS
  // =====================================================

  const renderModeSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            VocabMaster
          </motion.h1>
          <p className="text-xl text-white/80">
            Master vocabulary with intelligent spaced repetition
          </p>
        </div>

        {/* User Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {userProgress.totalWordsLearned}
              </div>
              <div className="text-white/70 text-sm">Words Learned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {userProgress.currentStreak}
              </div>
              <div className="text-white/70 text-sm">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {Math.round((userProgress.weeklyProgress / userProgress.weeklyGoal) * 100)}%
              </div>
              <div className="text-white/70 text-sm">Weekly Goal</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {userProgress.weeklyProgress}
              </div>
              <div className="text-white/70 text-sm">This Week</div>
            </div>
          </div>
        </motion.div>

        {/* Learning Modes */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {LEARNING_MODES.map((learningMode, index) => (
            <motion.div
              key={learningMode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300"
              onClick={() => handleModeSelect(learningMode.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`bg-${learningMode.color}-500 p-3 rounded-xl text-white`}>
                  {learningMode.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {learningMode.name}
                  </h3>
                  <p className="text-white/70 mb-3">
                    {learningMode.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-white/60 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{learningMode.estimatedTime}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {learningMode.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-white/70">
                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div className="fixed bottom-6 right-6 space-x-4">
          {onExit && (
            <button
              onClick={onExit}
              className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Home className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderVocabularySelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Choose Your Vocabulary
            </h1>
            <p className="text-white/80">
              Select the words you want to practice
            </p>
          </div>

          <SimpleVocabularySelector
            onSelectionChange={handleVocabularySelected}
            maxItems={20}
            onStartGame={() => setCurrentScreen('game')}
          />
          
          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentScreen('mode_select')}
              className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-colors"
            >
              ← Back to Modes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGame = () => (
    <VocabMasterGame
      mode={selectedMode}
      vocabulary={selectedVocabulary}
      config={gameConfig}
      onComplete={handleGameComplete}
      onExit={onExit}
    />
  );

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading your vocabulary progress...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'mode_select' && renderModeSelection()}
      {currentScreen === 'vocabulary_select' && renderVocabularySelection()}
      {currentScreen === 'game' && renderGame()}
    </AnimatePresence>
  );
}
