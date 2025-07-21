'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Settings, Trophy, Target, BookOpen,
  Users, Clock, Award, Brain, Heart, Eye,
  ArrowRight, ChevronDown, Info, Gamepad2
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import SimpleVocabularySelector from '../vocabulary/SimpleVocabularySelector';

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
    name: 'Free Practice',
    description: 'Choose your own vocabulary and practice at your own pace',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'blue',
    features: ['Choose vocabulary', 'Unlimited time', 'Progress tracking'],
    estimatedTime: '5-30 min',
    difficulty: 'Any level',
    unlocked: true
  },
  {
    id: 'assignment',
    name: 'Assigned Practice',
    description: 'Complete teacher-assigned vocabulary practice',
    icon: <Target className="h-6 w-6" />,
    color: 'green',
    features: ['Teacher selected', 'Progress tracked', 'Submit results'],
    estimatedTime: '10-20 min',
    difficulty: 'Variable',
    unlocked: true
  }
];

// =====================================================
// MAIN COMPONENT
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
  const [selectedGameMode, setSelectedGameMode] = useState<string>(mode);
  const [selectedVocabulary, setSelectedVocabulary] = useState<any[]>(preselectedVocabulary);
  const [currentScreen, setCurrentScreen] = useState<'mode_select' | 'vocabulary_select' | 'game'>('mode_select');
  const [finalGameConfig, setFinalGameConfig] = useState<Record<string, any>>(gameConfig);
  const [userStats, setUserStats] = useState({
    level: 1,
    totalScore: 0,
    streak: 0,
    wordsLearned: 0
  });

  // =====================================================
  // INITIALIZATION
  // =====================================================

  useEffect(() => {
    loadUserStats();
    
    // If vocabulary is preselected, skip to game
    if (preselectedVocabulary.length > 0) {
      setCurrentScreen('game');
      setFinalGameConfig((prev: any) => ({
        ...prev,
        vocabulary: preselectedVocabulary
      }));
    } else if (mode === 'assignment' && assignmentId) {
      loadAssignmentVocabulary();
    } else {
      setCurrentScreen('vocabulary_select');
    }
  }, []);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_vocabulary_progress')
        .select('*')
        .eq('user_id', user.id);

      if (data) {
        const stats = data.reduce(
          (acc, record) => ({
            totalScore: acc.totalScore + (record.times_correct * 100),
            wordsLearned: acc.wordsLearned + (record.is_learned ? 1 : 0),
            streak: Math.max(acc.streak, record.times_correct)
          }),
          { totalScore: 0, wordsLearned: 0, streak: 0 }
        );
        
        setUserStats(prev => ({
          ...prev,
          ...stats,
          level: Math.floor(stats.wordsLearned / 10) + 1
        }));
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const loadAssignmentVocabulary = async () => {
    if (!assignmentId) return;

    try {
      // Load assignment vocabulary (placeholder - adjust based on your schema)
      const { data } = await supabase
        .from('assignment_vocabulary')
        .select('vocabulary(*)')
        .eq('assignment_id', assignmentId);

      if (data) {
        const vocabList = data.map(item => item.vocabulary);
        setSelectedVocabulary(vocabList);
        setFinalGameConfig((prev: any) => ({
          ...prev,
          vocabulary: vocabList,
          assignmentId
        }));
        setCurrentScreen('game');
      }
    } catch (error) {
      console.error('Failed to load assignment vocabulary:', error);
    }
  };

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const handleGameModeSelect = (modeId: string) => {
    setSelectedGameMode(modeId);
    if (modeId === 'free_play') {
      setCurrentScreen('vocabulary_select');
    } else {
      setCurrentScreen('game');
    }
  };

  const handleVocabularySelected = (vocabulary: any[]) => {
    setSelectedVocabulary(vocabulary);
    setFinalGameConfig((prev: any) => ({
      ...prev,
      vocabulary
    }));
  };

  const handleStartGame = () => {
    setCurrentScreen('game');
  };

  const handleGameComplete = (results: any) => {
    onGameComplete?.(results);
  };

  const handleGameExit = () => {
    setCurrentScreen('vocabulary_select');
  };

  // =====================================================
  // RENDER SCREENS
  // =====================================================

  const renderModeSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl mb-6">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Language Learning</h1>
          <p className="text-xl text-white/80">Choose your practice mode</p>
          
          {/* User Stats */}
          <div className="flex justify-center space-x-6 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2">
              <div className="text-white text-sm opacity-80">Level</div>
              <div className="text-white font-bold">{userStats.level}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2">
              <div className="text-white text-sm opacity-80">Score</div>
              <div className="text-white font-bold">{userStats.totalScore.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2">
              <div className="text-white text-sm opacity-80">Streak</div>
              <div className="text-white font-bold">{userStats.streak}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2">
              <div className="text-white text-sm opacity-80">Words Learned</div>
              <div className="text-white font-bold">{userStats.wordsLearned}</div>
            </div>
          </div>
        </div>

        {/* Game Modes */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Select Practice Mode</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {GAME_MODES.map((gameMode) => (
              <motion.div
                key={gameMode.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-lg cursor-pointer transition-all"
                onClick={() => handleGameModeSelect(gameMode.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-${gameMode.color}-100 rounded-lg flex items-center justify-center`}>
                    <div className={`text-${gameMode.color}-600`}>
                      {gameMode.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{gameMode.name}</h3>
                    <p className="text-gray-600 mb-4">{gameMode.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {gameMode.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{gameMode.estimatedTime}</span>
                      <span>{gameMode.difficulty}</span>
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                    <span>Select</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVocabularySelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-xl mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Vocabulary</h1>
          <p className="text-white/80">Select the words you want to practice</p>
        </div>

        {/* Vocabulary Selector */}
        <SimpleVocabularySelector
          onSelectionChange={handleVocabularySelected}
          onStartGame={handleStartGame}
          maxItems={50}
        />

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => setCurrentScreen('mode_select')}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            ← Back to Mode Selection
          </button>
        </div>
      </div>
    </div>
  );

  const renderGame = () => {
    // Redirect to VocabMaster page
    window.location.href = '/games/vocab-master';
    return null;
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentScreen}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {currentScreen === 'mode_select' && renderModeSelection()}
        {currentScreen === 'vocabulary_select' && renderVocabularySelection()}
        {currentScreen === 'game' && renderGame()}
      </motion.div>
    </AnimatePresence>
  );
}
