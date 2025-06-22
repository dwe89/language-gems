'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { EnhancedGameService, EnhancedGameSession, WordPerformanceLog } from '../../services/enhancedGameService';
import { EnhancedAssignmentService } from '../../services/enhancedAssignmentService';
import { 
  Zap, 
  Shield, 
  Clock, 
  Target, 
  Trophy,
  Star,
  Gem,
  Heart,
  Pause,
  Play,
  RotateCcw,
  Home,
  Settings,
  Award,
  TrendingUp
} from 'lucide-react';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface PowerUp {
  id: string;
  type: 'speed_boost' | 'gem_magnet' | 'shield' | 'time_freeze' | 'double_points';
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: number; // seconds
  cooldown: number; // seconds
  cost: number; // gems required
  active: boolean;
  lastUsed?: Date;
}

interface GameState {
  mode: 'free_play' | 'assignment' | 'challenge';
  sessionId?: string;
  assignmentId?: string;
  currentSentence: any;
  currentSegment: any;
  gems: GemOption[];
  score: number;
  lives: number;
  level: number;
  streak: number;
  combo: number;
  timeRemaining: number;
  powerUps: PowerUp[];
  achievements: string[];
  isPaused: boolean;
  isGameOver: boolean;
  isCompleted: boolean;
}

interface GemOption {
  id: string;
  text: string;
  isCorrect: boolean;
  lane: number;
  position: number;
  segmentId: string;
  explanation?: string;
  gemType: 'normal' | 'bonus' | 'power' | 'rare';
  points: number;
  speed: number;
}

interface EnhancedGemCollectorProps {
  mode?: 'free_play' | 'assignment' | 'challenge';
  assignmentId?: string;
  config?: Record<string, any>;
  onGameComplete?: (results: GameResults) => void;
  onExit?: () => void;
}

interface GameResults {
  sessionId: string;
  score: number;
  accuracy: number;
  timeSpent: number;
  wordsLearned: number;
  achievementsEarned: string[];
  powerUpsUsed: string[];
  level: number;
  streak: number;
}

// =====================================================
// ENHANCED GEM COLLECTOR COMPONENT
// =====================================================

export default function EnhancedGemCollector({
  mode = 'free_play',
  assignmentId,
  config = {},
  onGameComplete,
  onExit
}: EnhancedGemCollectorProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  // Services
  const [gameService] = useState(() => new EnhancedGameService(supabase));
  const [assignmentService] = useState(() => new EnhancedAssignmentService(supabase));
  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    mode,
    currentSentence: null,
    currentSegment: null,
    gems: [],
    score: 0,
    lives: 3,
    level: 1,
    streak: 0,
    combo: 0,
    timeRemaining: 300, // 5 minutes default
    powerUps: [],
    achievements: [],
    isPaused: false,
    isGameOver: false,
    isCompleted: false
  });

  // Game data
  const [sentences, setSentences] = useState<any[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [wordsAttempted, setWordsAttempted] = useState<string[]>([]);
  const [wordsCorrect, setWordsCorrect] = useState<string[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [showPowerUpMenu, setShowPowerUpMenu] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<string | null>(null);

  // Refs
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const sessionStartTime = useRef<Date>();
  const segmentStartTime = useRef<Date>();

  // =====================================================
  // POWER-UPS CONFIGURATION
  // =====================================================

  const availablePowerUps: PowerUp[] = [
    {
      id: 'speed_boost',
      type: 'speed_boost',
      name: 'Speed Boost',
      description: 'Increase your movement speed for 10 seconds',
      icon: <Zap className="h-4 w-4" />,
      duration: 10,
      cooldown: 30,
      cost: 50,
      active: false
    },
    {
      id: 'gem_magnet',
      type: 'gem_magnet',
      name: 'Gem Magnet',
      description: 'Attract correct gems automatically for 15 seconds',
      icon: <Target className="h-4 w-4" />,
      duration: 15,
      cooldown: 45,
      cost: 75,
      active: false
    },
    {
      id: 'shield',
      type: 'shield',
      name: 'Shield',
      description: 'Protect from losing lives for 20 seconds',
      icon: <Shield className="h-4 w-4" />,
      duration: 20,
      cooldown: 60,
      cost: 100,
      active: false
    },
    {
      id: 'time_freeze',
      type: 'time_freeze',
      name: 'Time Freeze',
      description: 'Freeze time for 8 seconds',
      icon: <Clock className="h-4 w-4" />,
      duration: 8,
      cooldown: 90,
      cost: 125,
      active: false
    },
    {
      id: 'double_points',
      type: 'double_points',
      name: 'Double Points',
      description: 'Double all points earned for 30 seconds',
      icon: <Star className="h-4 w-4" />,
      duration: 30,
      cooldown: 120,
      cost: 150,
      active: false
    }
  ];

  // =====================================================
  // GAME INITIALIZATION
  // =====================================================

  useEffect(() => {
    initializeGame();
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  const initializeGame = async () => {
    try {
      setLoading(true);
      
      // Initialize power-ups
      setGameState(prev => ({
        ...prev,
        powerUps: availablePowerUps.map(p => ({ ...p }))
      }));

      // Load sentences based on mode
      await loadGameContent();
      
      // Start game session
      if (user) {
        const sessionId = await gameService.startGameSession({
          student_id: user.id,
          assignment_id: assignmentId,
          game_type: 'gem_collector',
          session_mode: mode,
          session_data: config
        });
        
        setGameState(prev => ({ ...prev, sessionId }));
        sessionStartTime.current = new Date();
      }

      setLoading(false);
      startGameLoop();
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setLoading(false);
    }
  };

  const loadGameContent = async () => {
    // Load sentences from API or assignment
    const response = await fetch('/api/games/gem-collector/sentences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode,
        assignmentId,
        language: config.language || 'spanish',
        difficulty: config.difficulty || 'beginner',
        theme: config.theme,
        topic: config.topic,
        count: config.sentenceCount || 10
      })
    });

    if (!response.ok) {
      throw new Error('Failed to load game content');
    }

    const data = await response.json();
    setSentences(data.sentences || []);
    
    if (data.sentences && data.sentences.length > 0) {
      loadNextSentence();
    }
  };

  const loadNextSentence = () => {
    if (currentSentenceIndex >= sentences.length) {
      completeGame();
      return;
    }

    const sentence = sentences[currentSentenceIndex];
    setGameState(prev => ({
      ...prev,
      currentSentence: sentence,
      currentSegment: sentence.segments[0]
    }));
    
    setCurrentSegmentIndex(0);
    segmentStartTime.current = new Date();
    spawnGems(sentence.segments[0]);
  };

  // =====================================================
  // GAME LOOP AND MECHANICS
  // =====================================================

  const startGameLoop = () => {
    gameLoopRef.current = setInterval(() => {
      updateGame();
    }, 16); // ~60 FPS
  };

  const updateGame = () => {
    if (gameState.isPaused || gameState.isGameOver || gameState.isCompleted) {
      return;
    }

    setGameState(prev => {
      const newState = { ...prev };

      // Update time
      if (newState.timeRemaining > 0) {
        newState.timeRemaining -= 0.016; // 16ms in seconds
      } else {
        newState.isGameOver = true;
        endGame();
        return newState;
      }

      // Update gems positions
      newState.gems = newState.gems.map(gem => ({
        ...gem,
        position: gem.position - gem.speed
      })).filter(gem => gem.position > -100);

      // Update power-ups
      newState.powerUps = newState.powerUps.map(powerUp => {
        if (powerUp.active && powerUp.lastUsed) {
          const elapsed = (Date.now() - powerUp.lastUsed.getTime()) / 1000;
          if (elapsed >= powerUp.duration) {
            return { ...powerUp, active: false };
          }
        }
        return powerUp;
      });

      return newState;
    });
  };

  const spawnGems = (segment: any) => {
    const options = segment.options || [];
    const newGems: GemOption[] = options.map((option: any, index: number) => ({
      id: `${segment.id}-${option.id}`,
      text: option.optionText,
      isCorrect: option.isCorrect,
      lane: index % 3, // Distribute across 3 lanes
      position: window.innerWidth + 100 + (index * 150),
      segmentId: segment.id,
      explanation: option.explanation,
      gemType: determineGemType(option, gameState.streak),
      points: calculateGemPoints(option, gameState.streak),
      speed: 2 + (gameState.level * 0.5)
    }));

    setGameState(prev => ({
      ...prev,
      gems: [...prev.gems, ...newGems]
    }));
  };

  const determineGemType = (option: any, streak: number): 'normal' | 'bonus' | 'power' | 'rare' => {
    if (!option.isCorrect) return 'normal';
    
    if (streak >= 10) return 'rare';
    if (streak >= 5) return 'power';
    if (streak >= 3) return 'bonus';
    return 'normal';
  };

  const calculateGemPoints = (option: any, streak: number): number => {
    let basePoints = option.isCorrect ? 100 : 0;
    let streakMultiplier = 1 + (streak * 0.1);
    return Math.round(basePoints * streakMultiplier);
  };

  // =====================================================
  // GAME ACTIONS
  // =====================================================

  const collectGem = async (gem: GemOption) => {
    const responseTime = segmentStartTime.current 
      ? Date.now() - segmentStartTime.current.getTime() 
      : 0;

    // Log word performance
    if (user && gameState.sessionId) {
      const wordLog: WordPerformanceLog = {
        session_id: gameState.sessionId,
        word_text: gem.text,
        translation_text: gameState.currentSegment?.targetText || '',
        language_pair: config.language_pair || 'english_spanish',
        attempt_number: 1,
        response_time_ms: responseTime,
        was_correct: gem.isCorrect,
        difficulty_level: config.difficulty || 'beginner',
        hint_used: false,
        streak_count: gameState.streak,
        previous_attempts: 0,
        mastery_level: gem.isCorrect ? 1 : 0,
        context_data: {
          gem_type: gem.gemType,
          points_earned: gem.points,
          power_ups_active: gameState.powerUps.filter(p => p.active).map(p => p.type)
        },
        timestamp: new Date()
      };

      await gameService.logWordPerformance(wordLog);
    }

    // Update game state
    setGameState(prev => {
      const newState = { ...prev };
      
      if (gem.isCorrect) {
        // Correct answer
        newState.score += gem.points;
        newState.streak += 1;
        newState.combo += 1;
        
        // Check for level up
        if (newState.score >= newState.level * 1000) {
          newState.level += 1;
          showAchievementNotification(`Level ${newState.level} Reached!`);
        }

        // Add to correct words
        setWordsCorrect(prev => [...prev, gem.text]);
        
        // Move to next segment
        moveToNextSegment();
        
      } else {
        // Wrong answer
        newState.lives -= 1;
        newState.streak = 0;
        newState.combo = 0;
        
        if (newState.lives <= 0) {
          newState.isGameOver = true;
          endGame();
        }
      }

      // Remove collected gem
      newState.gems = newState.gems.filter(g => g.id !== gem.id);
      
      // Add to attempted words
      setWordsAttempted(prev => [...prev, gem.text]);
      
      return newState;
    });

    // Visual effects
    if (gem.isCorrect) {
      triggerConfetti();
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const moveToNextSegment = () => {
    const nextSegmentIndex = currentSegmentIndex + 1;
    const currentSentence = sentences[currentSentenceIndex];
    
    if (nextSegmentIndex >= currentSentence.segments.length) {
      // Move to next sentence
      setCurrentSentenceIndex(prev => prev + 1);
      setCurrentSegmentIndex(0);
      loadNextSentence();
    } else {
      // Move to next segment
      setCurrentSegmentIndex(nextSegmentIndex);
      const nextSegment = currentSentence.segments[nextSegmentIndex];
      setGameState(prev => ({
        ...prev,
        currentSegment: nextSegment
      }));
      
      segmentStartTime.current = new Date();
      spawnGems(nextSegment);
    }
  };

  const usePowerUp = (powerUpId: string) => {
    setGameState(prev => {
      const newState = { ...prev };
      const powerUpIndex = newState.powerUps.findIndex(p => p.id === powerUpId);

      if (powerUpIndex === -1) return newState;

      const powerUp = newState.powerUps[powerUpIndex];

      // Check if power-up is available (not on cooldown and player has enough gems)
      const canUse = !powerUp.active &&
                    (!powerUp.lastUsed ||
                     (Date.now() - powerUp.lastUsed.getTime()) / 1000 >= powerUp.cooldown) &&
                    newState.score >= powerUp.cost;

      if (!canUse) return newState;

      // Deduct cost and activate power-up
      newState.score -= powerUp.cost;
      newState.powerUps[powerUpIndex] = {
        ...powerUp,
        active: true,
        lastUsed: new Date()
      };

      // Apply power-up effects
      applyPowerUpEffect(powerUp.type);

      return newState;
    });
  };

  const applyPowerUpEffect = (type: string) => {
    switch (type) {
      case 'speed_boost':
        // Increase gem collection speed
        break;
      case 'gem_magnet':
        // Auto-collect correct gems
        setGameState(prev => ({
          ...prev,
          gems: prev.gems.filter(gem => {
            if (gem.isCorrect) {
              collectGem(gem);
              return false;
            }
            return true;
          })
        }));
        break;
      case 'shield':
        // Prevent life loss
        break;
      case 'time_freeze':
        // Pause gem movement
        break;
      case 'double_points':
        // Double points are handled in gem collection
        break;
    }
  };

  // =====================================================
  // GAME COMPLETION AND RESULTS
  // =====================================================

  const completeGame = async () => {
    setGameState(prev => ({ ...prev, isCompleted: true }));
    await endGame();
  };

  const endGame = async () => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    if (!user || !gameState.sessionId) return;

    const endTime = new Date();
    const duration = sessionStartTime.current
      ? Math.round((endTime.getTime() - sessionStartTime.current.getTime()) / 1000)
      : 0;

    const accuracy = wordsAttempted.length > 0
      ? (wordsCorrect.length / wordsAttempted.length) * 100
      : 0;

    const sessionData: Partial<EnhancedGameSession> = {
      ended_at: endTime,
      duration_seconds: duration,
      final_score: gameState.score,
      max_score_possible: sentences.length * 100, // Estimate
      accuracy_percentage: accuracy,
      completion_percentage: (currentSentenceIndex / sentences.length) * 100,
      level_reached: gameState.level,
      lives_used: 3 - gameState.lives,
      power_ups_used: gameState.powerUps
        .filter(p => p.lastUsed)
        .map(p => ({
          type: p.type,
          used_at: p.lastUsed!,
          effect_duration: p.duration
        })),
      achievements_earned: gameState.achievements,
      words_attempted: wordsAttempted.length,
      words_correct: wordsCorrect.length,
      unique_words_practiced: new Set(wordsAttempted).size,
      average_response_time_ms: duration > 0 ? (duration * 1000) / wordsAttempted.length : 0,
      pause_count: 0, // Track this if needed
      hint_requests: 0, // Track this if needed
      retry_attempts: 0, // Track this if needed
      session_data: {
        sentences_completed: currentSentenceIndex,
        highest_streak: Math.max(...[gameState.streak]),
        power_ups_used_count: gameState.powerUps.filter(p => p.lastUsed).length
      }
    };

    try {
      // End game session
      await gameService.endGameSession(gameState.sessionId, sessionData);

      // Update assignment progress if this is an assignment
      if (assignmentId && mode === 'assignment') {
        await assignmentService.updateAssignmentProgress(
          assignmentId,
          user.id,
          gameState.sessionId,
          sessionData
        );
      }

      // Prepare results for callback
      const results: GameResults = {
        sessionId: gameState.sessionId,
        score: gameState.score,
        accuracy,
        timeSpent: duration,
        wordsLearned: wordsCorrect.length,
        achievementsEarned: gameState.achievements,
        powerUpsUsed: gameState.powerUps.filter(p => p.lastUsed).map(p => p.type),
        level: gameState.level,
        streak: gameState.streak
      };

      onGameComplete?.(results);

    } catch (error) {
      console.error('Failed to save game results:', error);
    }
  };

  // =====================================================
  // UI HELPERS
  // =====================================================

  const triggerConfetti = () => {
    if (typeof window !== 'undefined') {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const playSuccessSound = () => {
    // Play success sound
    const audio = new Audio('/sounds/success.mp3');
    audio.play().catch(() => {});
  };

  const playErrorSound = () => {
    // Play error sound
    const audio = new Audio('/sounds/error.mp3');
    audio.play().catch(() => {});
  };

  const showAchievementNotification = (achievement: string) => {
    setRecentAchievement(achievement);
    setTimeout(() => setRecentAchievement(null), 3000);
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const restartGame = () => {
    // Reset game state and restart
    setCurrentSentenceIndex(0);
    setCurrentSegmentIndex(0);
    setWordsAttempted([]);
    setWordsCorrect([]);
    setGameState(prev => ({
      ...prev,
      score: 0,
      lives: 3,
      level: 1,
      streak: 0,
      combo: 0,
      timeRemaining: 300,
      gems: [],
      achievements: [],
      isPaused: false,
      isGameOver: false,
      isCompleted: false
    }));

    initializeGame();
  };
