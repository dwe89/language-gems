'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Target, Trophy, BookOpen } from 'lucide-react';
import Link from 'next/link';
import VerbQuestGame from './VerbQuestGame';
import { Character } from './Character';
import { QuestSystem } from './QuestSystem';

interface VerbQuestAssignmentWrapperProps {
  assignmentId: string;
}

interface AssignmentData {
  id: string;
  title: string;
  description: string;
  game_config: {
    grammarConfig?: {
      language: string;
      verbTypes: string[];
      tenses: string[];
      difficulty: string;
      verbCount: number;
    };
    difficulty: string;
    timeLimit: number;
    maxAttempts: number;
  };
}

export default function VerbQuestAssignmentWrapper({ assignmentId }: VerbQuestAssignmentWrapperProps) {
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);
  const [questSystem, setQuestSystem] = useState<QuestSystem | null>(null);

  // Load assignment data
  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const response = await fetch(`/api/assignments/${assignmentId}`);
        if (!response.ok) {
          throw new Error('Failed to load assignment');
        }
        const data = await response.json();
        setAssignment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [assignmentId]);

  // Create default character for assignment mode
  useEffect(() => {
    if (assignment && !character) {
      const defaultCharacter = new Character('Hero', 'warrior');
      setCharacter(defaultCharacter);
      
      const defaultQuestSystem = new QuestSystem();
      setQuestSystem(defaultQuestSystem);
    }
  }, [assignment, character]);

  const handleGameComplete = async (results: any) => {
    try {
      // Record completion in database using standardized API
      await fetch('/api/assignments/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId: assignmentId,
          gameId: 'verb-quest',
          completed: true,
          score: results.score || 0,
          accuracy: results.accuracy || 0,
          timeSpent: results.timeSpent || 0,
          wordsCompleted: results.questsCompleted || 0,
          totalWords: results.totalQuests || 10,
          sessionData: results
        }),
      });

      // Show completion message or redirect
      alert('Quest completed! Your progress has been saved.');
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your quest...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-red-400/30"
        >
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Quest Loading Failed</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <Link
            href="/student-dashboard/assignments"
            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Assignments
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  if (gameStarted && character && questSystem) {
    return (
      <VerbQuestGame
        character={character}
        questSystem={questSystem}
        onGameComplete={handleGameComplete}
        assignmentMode={true}
        assignmentConfig={assignment.game_config}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/student-dashboard/assignments"
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Assignments</span>
            </Link>
            <div className="text-white/60 text-sm">
              Assignment Mode
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Info */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">⚔️</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {assignment.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {assignment.description}
          </p>

          {/* Assignment Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Clock className="text-blue-400 mx-auto mb-3" size={32} />
              <h3 className="text-lg font-semibold text-white mb-2">Time Limit</h3>
              <p className="text-gray-300">
                {assignment.game_config.timeLimit ? `${assignment.game_config.timeLimit} minutes` : 'No limit'}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Target className="text-green-400 mx-auto mb-3" size={32} />
              <h3 className="text-lg font-semibold text-white mb-2">Difficulty</h3>
              <p className="text-gray-300 capitalize">
                {assignment.game_config.grammarConfig?.difficulty || assignment.game_config.difficulty}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <BookOpen className="text-purple-400 mx-auto mb-3" size={32} />
              <h3 className="text-lg font-semibold text-white mb-2">Focus</h3>
              <p className="text-gray-300">
                {assignment.game_config.grammarConfig?.language || 'Grammar'} Verbs
              </p>
            </div>
          </div>

          {/* Grammar Configuration Display */}
          {assignment.game_config.grammarConfig && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Quest Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <span className="text-gray-400">Language:</span>
                  <span className="text-white ml-2 capitalize">
                    {assignment.game_config.grammarConfig.language}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Verb Types:</span>
                  <span className="text-white ml-2">
                    {assignment.game_config.grammarConfig.verbTypes.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Tenses:</span>
                  <span className="text-white ml-2">
                    {assignment.game_config.grammarConfig.tenses.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Verb Count:</span>
                  <span className="text-white ml-2">
                    {assignment.game_config.grammarConfig.verbCount}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameStarted(true)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200"
          >
            <Trophy className="inline mr-2" size={24} />
            Begin Quest
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
