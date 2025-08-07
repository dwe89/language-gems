// FSRS-Powered Game Recommendations Component
// Suggests optimal games based on student's memory states and learning needs

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Clock,
  Target,
  Zap,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Play,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';
import { FSRSRecommendationService, WordRecommendation } from '../../services/fsrsRecommendationService';

interface GameRecommendation {
  gameId: string;
  gameName: string;
  gameIcon: React.ReactNode;
  priority: number;
  reason: string;
  estimatedTime: number;
  wordsToReview: number;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  learningObjective: string;
  wordSample: string[];
}

interface FSRSGameRecommendationsProps {
  onGameSelect: (gameId: string, recommendedWords?: WordRecommendation[]) => void;
  timeAvailable?: number; // minutes
  maxRecommendations?: number;
}

export default function FSRSGameRecommendations({
  onGameSelect,
  timeAvailable = 30,
  maxRecommendations = 6
}: FSRSGameRecommendationsProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const [recommendationService] = useState(() => new FSRSRecommendationService(supabase));
  const [gameRecommendations, setGameRecommendations] = useState<GameRecommendation[]>([]);
  const [wordRecommendations, setWordRecommendations] = useState<WordRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Game metadata
  const gameMetadata = {
    'vocab-master': {
      name: 'Vocab Master',
      icon: <Target className="w-6 h-6" />,
      objective: 'Master vocabulary through multiple practice modes'
    },
    'hangman': {
      name: 'Hangman',
      icon: <Star className="w-6 h-6" />,
      objective: 'Reinforce spelling and word recognition'
    },
    'memory-game': {
      name: 'Memory Game',
      icon: <Brain className="w-6 h-6" />,
      objective: 'Build word-translation associations'
    },
    'detective-listening': {
      name: 'Detective Listening',
      icon: <AlertCircle className="w-6 h-6" />,
      objective: 'Improve audio comprehension skills'
    },
    'speed-builder': {
      name: 'Speed Builder',
      icon: <Zap className="w-6 h-6" />,
      objective: 'Practice quick sentence construction'
    },
    'conjugation-duel': {
      name: 'Conjugation Duel',
      icon: <TrendingUp className="w-6 h-6" />,
      objective: 'Master verb conjugations in context'
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadRecommendations();
    }
  }, [user?.id, timeAvailable]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get word recommendations
      const words = await recommendationService.getWordRecommendations(user!.id, {
        maxWords: 50,
        timeAvailable,
        includeNewWords: true,
        includeReviews: true,
        includeStrugglingWords: true
      });

      setWordRecommendations(words);

      // Generate game recommendations based on word recommendations
      const gameRecs = await generateGameRecommendations(words);
      setGameRecommendations(gameRecs.slice(0, maxRecommendations));

    } catch (err) {
      console.error('Error loading FSRS recommendations:', err);
      setError('Failed to load personalized recommendations');
    } finally {
      setLoading(false);
    }
  };

  const generateGameRecommendations = async (words: WordRecommendation[]): Promise<GameRecommendation[]> => {
    // Group words by recommended game types
    const gameWordMap = new Map<string, WordRecommendation[]>();
    
    words.forEach(word => {
      word.recommendedGameTypes.forEach(gameType => {
        if (!gameWordMap.has(gameType)) {
          gameWordMap.set(gameType, []);
        }
        gameWordMap.get(gameType)!.push(word);
      });
    });

    // Generate recommendations for each game
    const recommendations: GameRecommendation[] = [];

    for (const [gameId, gameWords] of gameWordMap.entries()) {
      if (gameWords.length === 0 || !gameMetadata[gameId as keyof typeof gameMetadata]) continue;

      const metadata = gameMetadata[gameId as keyof typeof gameMetadata];
      const avgPriority = gameWords.reduce((sum, w) => sum + w.priority, 0) / gameWords.length;
      const totalTime = gameWords.reduce((sum, w) => sum + w.estimatedStudyTime, 0);
      
      // Determine primary reason for recommendation
      const reasonCounts = gameWords.reduce((acc, w) => {
        acc[w.reason] = (acc[w.reason] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const primaryReason = Object.entries(reasonCounts)
        .sort(([,a], [,b]) => b - a)[0][0];

      const reasonMessages = {
        'due_review': 'Words are due for review',
        'struggling': 'Focus on challenging words',
        'new_learning': 'Learn new vocabulary',
        'reinforcement': 'Strengthen word knowledge',
        'mastery_check': 'Verify mastery level'
      };

      // Determine difficulty level
      const avgDifficulty = gameWords.reduce((sum, w) => sum + w.memoryState.difficulty, 0) / gameWords.length;
      const difficultyLevel = avgDifficulty < 4 ? 'Easy' : avgDifficulty < 7 ? 'Medium' : 'Hard';

      recommendations.push({
        gameId,
        gameName: metadata.name,
        gameIcon: metadata.icon,
        priority: avgPriority,
        reason: reasonMessages[primaryReason as keyof typeof reasonMessages],
        estimatedTime: Math.min(totalTime, timeAvailable),
        wordsToReview: gameWords.length,
        difficultyLevel,
        learningObjective: metadata.objective,
        wordSample: gameWords.slice(0, 3).map(w => w.word)
      });
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  };

  const handleGameSelect = (gameId: string) => {
    // Get words recommended for this specific game
    const gameWords = wordRecommendations.filter(word => 
      word.recommendedGameTypes.includes(gameId)
    );
    
    onGameSelect(gameId, gameWords);
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600 bg-red-50 border-red-200';
    if (priority >= 6) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (priority >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 8) return 'High Priority';
    if (priority >= 6) return 'Medium Priority';
    if (priority >= 4) return 'Low Priority';
    return 'Optional';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Analyzing your learning patterns...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <button
          onClick={loadRecommendations}
          className="mt-3 text-red-600 hover:text-red-800 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Personalized Game Recommendations</h2>
            <p className="text-blue-100">
              Based on your memory patterns and learning needs
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Words to Review</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {wordRecommendations.length}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-600" />
            <span className="font-medium">Estimated Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {Math.round(wordRecommendations.reduce((sum, w) => sum + w.estimatedStudyTime, 0))} min
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Games Available</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {gameRecommendations.length}
          </div>
        </div>
      </div>

      {/* Game Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {gameRecommendations.map((game, index) => (
            <motion.div
              key={game.gameId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleGameSelect(game.gameId)}
            >
              <div className="p-6">
                {/* Game Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600">
                      {game.gameIcon}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {game.gameName}
                    </h3>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(game.priority)}`}>
                    {getPriorityLabel(game.priority)}
                  </div>
                </div>

                {/* Game Details */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    {game.reason}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Words:</span>
                    <span className="font-medium">{game.wordsToReview}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium">{game.estimatedTime} min</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Difficulty:</span>
                    <span className={`font-medium ${
                      game.difficultyLevel === 'Hard' ? 'text-red-600' :
                      game.difficultyLevel === 'Medium' ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {game.difficultyLevel}
                    </span>
                  </div>

                  {/* Word Sample */}
                  {game.wordSample.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Sample words:</p>
                      <div className="flex flex-wrap gap-1">
                        {game.wordSample.map((word, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Play Button */}
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Start Game</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {gameRecommendations.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Great job! No urgent reviews needed.
          </h3>
          <p className="text-gray-600">
            Your vocabulary is well-maintained. Try any game to continue learning!
          </p>
        </div>
      )}
    </div>
  );
}
