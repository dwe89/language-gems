'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gem, Diamond, Sparkles, Crown, Star, Zap,
  Play, Settings, Trophy, Target, BookOpen,
  Users, Clock, Award, Brain, Heart, Eye,
  ArrowRight, ChevronDown, Info, Gamepad2
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { GemThemeProvider, GemCard, GemButton, GemIcon, GemBadge } from '../ui/GemTheme';
import EnhancedGemCollector from './EnhancedGemCollector';
import EnhancedVocabularySelector from '../vocabulary/EnhancedVocabularySelector';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  estimatedTime: string;
  difficulty: string;
  unlocked: boolean;
  gemReward: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface GameLauncherProps {
  assignmentId?: string;
  mode?: 'free_play' | 'assignment' | 'practice' | 'challenge';
  onGameComplete?: (results: any) => void;
  onExit?: () => void;
  preselectedVocabulary?: any[];
  gameConfig?: Record<string, any>;
}

// =====================================================
// GAME MODES CONFIGURATION
// =====================================================

const GAME_MODES: GameMode[] = [
  {
    id: 'free_play',
    name: 'Free Exploration',
    description: 'Explore the gem mines at your own pace',
    icon: <Gem className="h-6 w-6" />,
    color: 'from-blue-500 to-cyan-500',
    features: ['Choose your vocabulary', 'No time pressure', 'Practice mode'],
    estimatedTime: '10-20 minutes',
    difficulty: 'All levels',
    unlocked: true,
    gemReward: 'common'
  },
  {
    id: 'assignment',
    name: 'Assigned Quest',
    description: 'Complete teacher-assigned vocabulary missions',
    icon: <Target className="h-6 w-6" />,
    color: 'from-purple-500 to-pink-500',
    features: ['Structured learning', 'Progress tracking', 'Graded results'],
    estimatedTime: '15-25 minutes',
    difficulty: 'Teacher set',
    unlocked: true,
    gemReward: 'rare'
  },
  {
    id: 'challenge',
    name: 'Daily Challenge',
    description: 'Take on today\'s special gem hunting challenge',
    icon: <Crown className="h-6 w-6" />,
    color: 'from-yellow-500 to-orange-500',
    features: ['Daily rewards', 'Leaderboards', 'Special achievements'],
    estimatedTime: '5-15 minutes',
    difficulty: 'Varies daily',
    unlocked: true,
    gemReward: 'epic'
  },
  {
    id: 'speed_run',
    name: 'Speed Mining',
    description: 'Race against time to collect as many gems as possible',
    icon: <Zap className="h-6 w-6" />,
    color: 'from-red-500 to-pink-500',
    features: ['Time pressure', 'Speed bonuses', 'Quick thinking'],
    estimatedTime: '3-8 minutes',
    difficulty: 'Advanced',
    unlocked: false, // Unlock after completing 10 games
    gemReward: 'legendary'
  }
];

// =====================================================
// GAME LAUNCHER COMPONENT
// =====================================================

export default function GameLauncher({
  assignmentId,
  mode = 'free_play',
  onGameComplete,
  onExit,
  preselectedVocabulary = [],
  gameConfig = {}
}: GameLauncherProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  // State
  const [currentView, setCurrentView] = useState<'mode_select' | 'vocabulary_select' | 'game_config' | 'playing'>('mode_select');
  const [selectedMode, setSelectedMode] = useState<string>(mode);
  const [selectedVocabulary, setSelectedVocabulary] = useState<any[]>(preselectedVocabulary);
  const [vocabularyConfig, setVocabularyConfig] = useState<any>({});
  const [finalGameConfig, setFinalGameConfig] = useState<any>(gameConfig);
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    loadPlayerStats();
    
    // If assignment mode or vocabulary is preselected, skip to game
    if (assignmentId || preselectedVocabulary.length > 0) {
      setCurrentView('playing');
    }
  }, []);

  useEffect(() => {
    // Update final config when vocabulary changes
    setFinalGameConfig(prev => ({
      ...prev,
      ...vocabularyConfig,
      vocabulary: selectedVocabulary,
      mode: selectedMode
    }));
  }, [selectedVocabulary, vocabularyConfig, selectedMode]);

  // =====================================================
  // DATA LOADING
  // =====================================================

  const loadPlayerStats = async () => {
    if (!user) return;
    
    try {
      // Load player profile and stats
      const { data: profile } = await supabase
        .from('student_game_profiles')
        .select('*')
        .eq('student_id', user.id)
        .single();

      if (profile) {
        setPlayerStats(profile);
      }
    } catch (error) {
      console.error('Failed to load player stats:', error);
    }
  };

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const handleModeSelect = (modeId: string) => {
    setSelectedMode(modeId);
    
    // If assignment mode, go directly to game
    if (modeId === 'assignment' && assignmentId) {
      setCurrentView('playing');
    } else {
      setCurrentView('vocabulary_select');
    }
  };

  const handleVocabularySelected = (vocabulary: any[]) => {
    setSelectedVocabulary(vocabulary);
    if (vocabulary.length > 0) {
      setCurrentView('playing');
    }
  };

  const handleGameComplete = (results: any) => {
    // Update player stats
    loadPlayerStats();
    
    // Call parent callback
    onGameComplete?.(results);
    
    // Return to mode selection
    setCurrentView('mode_select');
  };

  // =====================================================
  // RENDER METHODS
  // =====================================================

  const renderModeSelection = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Diamond className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Gem Mining Adventures</h1>
        <p className="text-xl text-gray-600 mb-2">Choose your vocabulary learning adventure</p>
        
        {playerStats && (
          <div className="flex items-center justify-center space-x-6 mt-6">
            <GemBadge type="level" variant="primary">
              Level {playerStats.current_level}
            </GemBadge>
            <GemBadge type="score" variant="success">
              {playerStats.total_xp} XP
            </GemBadge>
            <GemBadge type="streak" variant="warning">
              {playerStats.current_streak} day streak
            </GemBadge>
            <GemBadge type="achievement" variant="secondary">
              {playerStats.total_achievements} achievements
            </GemBadge>
          </div>
        )}
      </div>

      {/* Game Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {GAME_MODES.map((gameMode) => (
          <GemCard
            key={gameMode.id}
            title={gameMode.name}
            subtitle={gameMode.description}
            icon={gameMode.icon}
            onClick={() => gameMode.unlocked && handleModeSelect(gameMode.id)}
            selected={selectedMode === gameMode.id}
            className={`${!gameMode.unlocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'}`}
          >
            <div className="space-y-4">
              {/* Features */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Features:</div>
                <div className="flex flex-wrap gap-2">
                  {gameMode.features.map((feature) => (
                    <span key={feature} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Duration</div>
                  <div className="font-medium">{gameMode.estimatedTime}</div>
                </div>
                <div>
                  <div className="text-gray-500">Difficulty</div>
                  <div className="font-medium">{gameMode.difficulty}</div>
                </div>
              </div>

              {/* Gem Reward */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">Gem Reward:</span>
                <div className="flex items-center space-x-2">
                  <GemIcon type={gameMode.gemReward} size="sm" />
                  <span className="text-sm font-medium capitalize">{gameMode.gemReward}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {gameMode.unlocked ? (
                  <GemButton
                    variant="gem"
                    gemType={gameMode.gemReward}
                    size="md"
                    onClick={() => handleModeSelect(gameMode.id)}
                    className="w-full"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Start Adventure</span>
                    </div>
                  </GemButton>
                ) : (
                  <div className="text-center py-2">
                    <div className="text-sm text-gray-500 mb-1">🔒 Locked</div>
                    <div className="text-xs text-gray-400">Complete 10 games to unlock</div>
                  </div>
                )}
              </div>
            </div>
          </GemCard>
        ))}
      </div>

      {/* Quick Stats */}
      {playerStats && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Your Mining Progress
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{playerStats.total_games_played}</div>
              <div className="text-sm text-gray-600">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{playerStats.words_learned}</div>
              <div className="text-sm text-gray-600">Words Learned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(playerStats.accuracy_average)}%</div>
              <div className="text-sm text-gray-600">Avg Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{Math.round(playerStats.total_time_played / 60)}</div>
              <div className="text-sm text-gray-600">Hours Played</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVocabularySelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gem className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Vocabulary Gems</h2>
        <p className="text-gray-600">Select the words you want to practice in your adventure</p>
      </div>

      <EnhancedVocabularySelector
        onSelectionChange={handleVocabularySelected}
        onConfigChange={setVocabularyConfig}
        maxItems={50}
        defaultSelection="theme"
        showPreview={true}
        gameType="gem_collector"
        assignmentMode={selectedMode === 'assignment'}
        difficulty="intermediate"
      />

      <div className="flex justify-center space-x-4">
        <GemButton
          variant="secondary"
          onClick={() => setCurrentView('mode_select')}
        >
          Back to Modes
        </GemButton>
      </div>
    </div>
  );

  const renderGame = () => (
    <EnhancedGemCollector
      mode={selectedMode as any}
      assignmentId={assignmentId}
      config={finalGameConfig}
      onGameComplete={handleGameComplete}
      onExit={() => {
        onExit?.();
        setCurrentView('mode_select');
      }}
    />
  );

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <GemThemeProvider theme="crystal">
      <div className="min-h-screen">
        <AnimatePresence mode="wait">
          {currentView === 'mode_select' && (
            <motion.div
              key="mode_select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4 py-8"
            >
              {renderModeSelection()}
            </motion.div>
          )}

          {currentView === 'vocabulary_select' && (
            <motion.div
              key="vocabulary_select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4 py-8"
            >
              {renderVocabularySelection()}
            </motion.div>
          )}

          {currentView === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderGame()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GemThemeProvider>
  );
}
