'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Users, Calendar, Target, BookOpen, Clock, Award, Settings, BarChart3 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface Assignment {
  id: string;
  title: string;
  description?: string;
  game_type: string;
  type?: string; // Legacy field
  game_config: any;
  config?: any; // Legacy field
  due_date?: string;
  points: number;
  status: string;
}

export default function AssignmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const assignmentId = params?.assignmentId as string;

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      console.log('Fetching assignment with ID:', assignmentId);
      
      // Use Supabase client directly with a simpler query first
      const { data: assignment, error } = await supabase
        .from('assignments')
        .select(`
          *,
          classes!inner(name)
        `)
        .eq('id', assignmentId)
        .single();

      if (error) {
        console.error('Assignment fetch error:', error);
        setError('Failed to load assignment details');
      } else if (assignment) {
        console.log('Assignment loaded successfully:', assignment);
        console.log('Assignment game_type:', assignment.game_type);
        console.log('Assignment game_config:', assignment.game_config);
        setAssignment(assignment);
      } else {
        console.log('No assignment data returned');
        setError('Assignment not found');
      }
    } catch (err) {
      console.error('Assignment fetch error:', err);
      setError('Error loading assignment');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = async () => {
    if (assignment) {
      console.log('Starting game for assignment:', assignment);
      
      // Check if this is a multi-game assignment
      const isMultiGame = assignment.game_type === 'multi-game' ||
                         assignment.game_type === 'mixed-mode' ||
                         assignment.game_config?.multiGame ||
                         assignment.config?.multiGame ||
                         (assignment.config?.gameConfig?.selectedGames && assignment.config.gameConfig.selectedGames.length > 1);
      console.log('Is multi-game assignment:', isMultiGame, 'game_type:', assignment.game_type);

      if (isMultiGame) {
        // For multi-game assignments, redirect to student assignment view with teacher preview mode
        const url = `/student-dashboard/assignments/${assignmentId}?preview=true`;
        console.log('Redirecting to multi-game view:', url);
        router.push(url);
      } else if (assignment.game_type === 'assessment') {
        // For assessment assignments, redirect to assessment assignment view with teacher preview mode
        const url = `/assessments/assignment/${assignmentId}?preview=true`;
        console.log('Redirecting to assessment assignment view:', url);
        router.push(url);
      } else {
        // For single game assignments, navigate directly to the game with preview mode
        const gameType = assignment.game_type || assignment.type;
        console.log('Game type determined:', gameType);
        
        if (gameType && gameType !== 'undefined') {
          try {
            // Fetch assignment vocabulary criteria
            const response = await fetch(`/api/assignments/${assignmentId}/vocabulary`);
            if (!response.ok) {
              throw new Error('Failed to fetch assignment details');
            }

            const data = await response.json();
            const assignmentData = data.assignment;
            const config = assignmentData.config || {};

            // Extract vocabulary criteria from assignment config
            const vocabularyConfig = config.vocabularyConfig || config;

            // Map game types to actual game paths
            const gamePathMap: Record<string, string> = {
              'memory-game': 'memory-game',
              'memory-match': 'memory-game', // Standardize to memory-game
              'vocab-blast': 'vocab-blast',
              'vocab-master': 'vocab-master', // ✅ VocabMaster assignment support
              'word-blast': 'word-blast', // Keep separate - different games
              'hangman': 'hangman',
              'noughts-and-crosses': 'noughts-and-crosses',
              'speed-builder': 'speed-builder',
              'vocabulary-mining': 'vocabulary-mining',
              'gem-collector': 'vocabulary-mining', // Legacy mapping
              'translation-tycoon': 'speed-builder', // Legacy mapping
              'conjugation-duel': 'conjugation-duel',
              'detective-listening': 'detective-listening',
              'verb-quest': 'verb-quest',
              'word-scramble': 'word-scramble',
              'word-guesser': 'word-scramble', // Word guesser uses word scramble logic
              'memory-game': 'memory-game', // ✅ Memory Game assignment support
              'hangman': 'hangman', // ✅ Hangman assignment support
              'word-blast': 'word-blast', // ✅ Word Blast assignment support
              'speed-builder': 'speed-builder', // ✅ Speed Builder assignment support
              'word-towers': 'word-towers', // ✅ Word Towers assignment support
              'sentence-towers': 'sentence-towers', // ✅ Sentence Towers assignment support
              'conjugation-duel': 'conjugation-duel', // ✅ Conjugation Duel assignment support
              'case-file-translator': 'case-file-translator', // ✅ Case File Translator assignment support
              'lava-temple-word-restore': 'lava-temple-word-restore', // ✅ Lava Temple assignment support
              'sentence-builder': 'speed-builder', // Legacy mapping
            };

            const gamePath = gamePathMap[gameType] || 'memory-game';

            // Build URL parameters from assignment vocabulary criteria
            const params = new URLSearchParams();

            // Language mapping (default to Spanish if not specified)
            const language = vocabularyConfig.language || 'es';
            params.set('lang', language);

            // Level (curriculum level)
            const level = assignmentData.curriculum_level || assignment?.curriculum_level || 'KS3';
            params.set('level', level);

            // Category and subcategory
            const category = vocabularyConfig.category || vocabularyConfig.theme || 'basics_core_language';
            const subcategory = vocabularyConfig.subcategory || vocabularyConfig.topic || 'greetings_introductions';
            params.set('cat', category);
            params.set('subcat', subcategory);

            // Theme (default to 'default')
            const theme = vocabularyConfig.theme || 'default';
            params.set('theme', theme);

            // Add assignment mode parameters
            params.set('assignment', assignmentId);
            params.set('mode', 'assignment');
            params.set('preview', 'true');

            const gameUrl = `/games/${gamePath}?${params.toString()}`;
            console.log('🚀 Redirecting to assignment game with new URL structure:', gameUrl);
            router.push(gameUrl);

          } catch (error) {
            console.error('Error building assignment URL:', error);
            // Fallback to old method
            const gamePathMap: Record<string, string> = {
              'memory-game': 'memory-game',
              'memory-match': 'memory-game',
              'vocab-blast': 'vocab-blast',
              'vocab-master': 'vocab-master', // ✅ VocabMaster assignment support
              'word-blast': 'word-blast',
              'hangman': 'hangman',
              'noughts-and-crosses': 'noughts-and-crosses',
              'speed-builder': 'speed-builder',
              'vocabulary-mining': 'vocabulary-mining',
              'gem-collector': 'vocabulary-mining',
              'translation-tycoon': 'speed-builder',
              'conjugation-duel': 'conjugation-duel',
              'detective-listening': 'detective-listening',
              'verb-quest': 'verb-quest',
              'word-scramble': 'word-scramble',
              'word-guesser': 'word-scramble',
              'word-towers': 'word-towers',
              'sentence-towers': 'sentence-towers',
              'sentence-builder': 'speed-builder',
              'memory-game': 'memory-game', // ✅ Memory Game assignment support
              'hangman': 'hangman', // ✅ Hangman assignment support
              'word-blast': 'word-blast', // ✅ Word Blast assignment support
              'speed-builder': 'speed-builder', // ✅ Speed Builder assignment support
              'conjugation-duel': 'conjugation-duel', // ✅ Conjugation Duel assignment support
              'case-file-translator': 'case-file-translator', // ✅ Case File Translator assignment support
              'lava-temple-word-restore': 'lava-temple-word-restore', // ✅ Lava Temple assignment support
            };

            const gamePath = gamePathMap[gameType] || 'memory-game';
            const gameUrl = `/games/${gamePath}?assignment=${assignmentId}&mode=assignment&preview=true`;
            console.log('Fallback: Redirecting to single game:', gameUrl);
            router.push(gameUrl);
          }
        } else {
          console.error('Game type is undefined for assignment:', assignment);
          alert(`Unable to determine game type for this assignment. Game type found: ${gameType}`);
        }
      }
    } else {
      console.error('No assignment data available');
      alert('Assignment data not loaded yet. Please try again.');
    }
  };

  const handleViewAnalytics = () => {
    router.push(`/dashboard/assignments/${assignmentId}/analytics`);
  };

  const handleEditAssignment = () => {
    router.push(`/dashboard/assignments/${assignmentId}/edit`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-white text-center">Loading assignment...</div>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-4">Assignment Not Found</h1>
            <p className="mb-4">{error || 'The requested assignment could not be found.'}</p>
            <button
              onClick={() => router.push('/dashboard/assignments')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Back to Assignments
            </button>
          </div>
        </div>
      </div>
    );
  }

  const gameConfig = assignment.game_config || {};
  const formattedDueDate = assignment.due_date 
    ? new Date(assignment.due_date).toLocaleDateString()
    : 'No due date';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/assignments')}
            className="text-blue-300 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Assignments
          </button>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{assignment.title}</h1>
                {assignment.description && (
                  <p className="text-blue-200 text-lg">{assignment.description}</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleEditAssignment}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Edit
                </button>
                
                <button
                  onClick={handleViewAnalytics}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </button>
              </div>
            </div>

            {/* Assignment Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-semibold">Game Type</span>
                </div>
                <p className="text-blue-200 capitalize">
                  {(() => {
                    const isMultiGame = assignment.game_type === 'multi-game' ||
                                       assignment.game_type === 'mixed-mode' ||
                                       assignment.game_config?.multiGame ||
                                       assignment.config?.multiGame ||
                                       (assignment.config?.gameConfig?.selectedGames && assignment.config.gameConfig.selectedGames.length > 1);

                    const selectedGames = assignment.config?.gameConfig?.selectedGames ||
                                         assignment.game_config?.selectedGames ||
                                         assignment.config?.selectedGames;

                    const selectedAssessments = assignment.config?.assessmentConfig?.selectedAssessments || [];

                    if (assignment.game_type === 'mixed-mode') {
                      return `Mixed Mode (${selectedGames?.length || 0} games, ${selectedAssessments?.length || 0} assessments)`;
                    } else if (isMultiGame && selectedGames?.length > 1) {
                      return `Multi-Game (${selectedGames.length} games)`;
                    } else if (assignment.game_type === 'assessment' && selectedAssessments?.length > 0) {
                      return `Assessment (${selectedAssessments.length} assessments)`;
                    } else {
                      const gameType = assignment.game_type || assignment.type;
                      return gameType?.replace('-', ' ') || 'Unknown';
                    }
                  })()}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold">Due Date</span>
                </div>
                <p className="text-blue-200">{formattedDueDate}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">Points</span>
                </div>
                <p className="text-blue-200">{assignment.points} points</p>
              </div>
            </div>

            {/* Game Configuration */}
            {Object.keys(gameConfig).length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Game Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gameConfig.theme && (
                    <div>
                      <span className="text-blue-300 font-medium">Theme:</span>
                      <span className="text-white ml-2">{gameConfig.theme}</span>
                    </div>
                  )}
                  {gameConfig.topic && (
                    <div>
                      <span className="text-blue-300 font-medium">Topic:</span>
                      <span className="text-white ml-2">{gameConfig.topic}</span>
                    </div>
                  )}
                  {gameConfig.difficulty && (
                    <div>
                      <span className="text-blue-300 font-medium">Difficulty:</span>
                      <span className="text-white ml-2 capitalize">{gameConfig.difficulty}</span>
                    </div>
                  )}
                  {gameConfig.timeLimit && (
                    <div>
                      <span className="text-blue-300 font-medium">Time Limit:</span>
                      <span className="text-white ml-2">{Math.floor(gameConfig.timeLimit / 60)} minutes</span>
                    </div>
                  )}
                  {gameConfig.sentenceCount && (
                    <div>
                      <span className="text-blue-300 font-medium">Sentences:</span>
                      <span className="text-white ml-2">{gameConfig.sentenceCount}</span>
                    </div>
                  )}
                  {gameConfig.tier && (
                    <div>
                      <span className="text-blue-300 font-medium">Tier:</span>
                      <span className="text-white ml-2">{gameConfig.tier}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handlePlayGame}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg"
              >
                <Play className="w-6 h-6" />
                Play Assignment
              </button>
              
              <button
                onClick={() => {/* TODO: Add share functionality */}}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all border border-white/20"
              >
                <Users className="w-5 h-5" />
                Share with Students
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 