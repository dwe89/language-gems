'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { createClient } from '../../lib/supabase-client';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Target,
  Clock,
  Trophy,
  Star,
  ArrowLeft,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import Link from 'next/link';

interface LearnerGameWrapperProps {
  gameType: string;
  language: string;
  children: React.ReactNode;
  onGameComplete?: (results: GameResults) => void;
}

interface GameResults {
  score: number;
  accuracy: number;
  wordsLearned: number;
  timeSpent: number;
  xpEarned: number;
}

export default function LearnerGameWrapper({ 
  gameType, 
  language, 
  children, 
  onGameComplete 
}: LearnerGameWrapperProps) {
  const { user } = useAuth();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    soundEnabled: true,
    difficulty: 'medium',
    timeLimit: null as number | null
  });
  const [sessionData, setSessionData] = useState({
    startTime: null as Date | null,
    wordsEncountered: 0,
    correctAnswers: 0,
    totalAnswers: 0
  });

  // Start game session
  const startGame = async () => {
    setGameStarted(true);
    setSessionData({
      startTime: new Date(),
      wordsEncountered: 0,
      correctAnswers: 0,
      totalAnswers: 0
    });

    // Record session start in database
    if (user) {
      try {
        const supabase = createClient();
        await supabase
          .from('learner_study_sessions')
          .insert({
            user_id: user.id,
            session_type: 'game',
            game_type: gameType,
            language: language,
            started_at: new Date().toISOString(),
            session_data: {
              settings: gameSettings
            }
          });
      } catch (error) {
        console.error('Error recording session start:', error);
      }
    }
  };

  // Complete game session
  const completeGame = async (results: GameResults) => {
    if (!user || !sessionData.startTime) return;

    try {
      const supabase = createClient();
      const duration = Math.round((new Date().getTime() - sessionData.startTime.getTime()) / 1000 / 60);

      // Update session in database
      await supabase
        .from('learner_study_sessions')
        .update({
          completed_at: new Date().toISOString(),
          duration_minutes: duration,
          words_practiced: results.wordsLearned,
          words_learned: results.wordsLearned,
          accuracy_percentage: results.accuracy,
          xp_earned: results.xpEarned,
          session_data: {
            settings: gameSettings,
            results: results
          }
        })
        .eq('user_id', user.id)
        .eq('started_at', sessionData.startTime.toISOString());

      // Update learner progress
      const { data: currentProgress } = await supabase
        .from('learner_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (currentProgress) {
        await supabase
          .from('learner_progress')
          .update({
            total_xp: currentProgress.total_xp + results.xpEarned,
            words_learned: currentProgress.words_learned + results.wordsLearned,
            games_played: currentProgress.games_played + 1,
            total_study_time: currentProgress.total_study_time + duration,
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user.id);
      }

      // Check for achievements and daily challenges
      await checkAchievements(results);
      await updateDailyChallenges(results);

      if (onGameComplete) {
        onGameComplete(results);
      }
    } catch (error) {
      console.error('Error completing game session:', error);
    }
  };

  // Check for achievement progress
  const checkAchievements = async (results: GameResults) => {
    if (!user) return;

    try {
      const supabase = createClient();
      
      // Get current progress
      const { data: progress } = await supabase
        .from('learner_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!progress) return;

      // Check vocabulary achievements
      const newWordsTotal = progress.words_learned + results.wordsLearned;
      const achievementChecks = [
        { requirement: 10, achievement: 'First Steps' },
        { requirement: 100, achievement: 'Vocabulary Builder' },
        { requirement: 500, achievement: 'Word Master' },
        { requirement: 1000, achievement: 'Vocabulary Expert' }
      ];

      for (const check of achievementChecks) {
        if (progress.words_learned < check.requirement && newWordsTotal >= check.requirement) {
          // Award achievement
          const { data: achievement } = await supabase
            .from('learner_achievements')
            .select('*')
            .eq('name', check.achievement)
            .single();

          if (achievement) {
            await supabase
              .from('learner_achievement_progress')
              .upsert({
                user_id: user.id,
                achievement_id: achievement.id,
                current_progress: check.requirement,
                completed: true,
                completed_at: new Date().toISOString(),
                xp_earned: achievement.xp_reward
              });
          }
        }
      }

      // Check accuracy achievement
      if (results.accuracy === 100) {
        const { data: achievement } = await supabase
          .from('learner_achievements')
          .select('*')
          .eq('name', 'Perfect Score')
          .single();

        if (achievement) {
          await supabase
            .from('learner_achievement_progress')
            .upsert({
              user_id: user.id,
              achievement_id: achievement.id,
              current_progress: 100,
              completed: true,
              completed_at: new Date().toISOString(),
              xp_earned: achievement.xp_reward
            });
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  // Update daily challenge progress
  const updateDailyChallenges = async (results: GameResults) => {
    if (!user) return;

    try {
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];

      // Get today's challenges
      const { data: challenges } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('challenge_date', today)
        .eq('is_active', true);

      for (const challenge of challenges || []) {
        let progressValue = 0;

        switch (challenge.challenge_type) {
          case 'vocabulary':
            progressValue = results.wordsLearned;
            break;
          case 'accuracy':
            progressValue = results.accuracy;
            break;
          case 'games':
            progressValue = 1;
            break;
        }

        if (progressValue > 0) {
          // Update challenge progress
          const { data: currentProgress } = await supabase
            .from('learner_challenge_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('challenge_id', challenge.id)
            .single();

          const newProgress = (currentProgress?.current_progress || 0) + progressValue;
          const completed = newProgress >= challenge.target_value;

          await supabase
            .from('learner_challenge_progress')
            .upsert({
              user_id: user.id,
              challenge_id: challenge.id,
              current_progress: Math.min(newProgress, challenge.target_value),
              completed: completed,
              completed_at: completed ? new Date().toISOString() : null,
              xp_earned: completed ? challenge.xp_reward : 0
            });
        }
      }
    } catch (error) {
      console.error('Error updating daily challenges:', error);
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {gameType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h2>
            <p className="text-gray-600">
              {language.charAt(0).toUpperCase() + language.slice(1)} Practice Session
            </p>
          </div>

          {/* Game Settings */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Sound Effects</span>
              <button
                onClick={() => setGameSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                className={`p-2 rounded-lg ${gameSettings.soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
              >
                {gameSettings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Difficulty</label>
              <select
                value={gameSettings.difficulty}
                onChange={(e) => setGameSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/learner-dashboard"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors text-center"
            >
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              Back
            </Link>
            <button
              onClick={startGame}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
            >
              Start Game
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Game Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/learner-dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {gameType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h1>
                <p className="text-sm text-gray-600">
                  {language.charAt(0).toUpperCase() + language.slice(1)} Practice
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {sessionData.startTime && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    {Math.floor((new Date().getTime() - sessionData.startTime.getTime()) / 1000 / 60)}m
                  </span>
                </div>
              )}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
