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
  // Added optional fields used on this page
  vocabulary_assignment_list_id?: string | null;
  vocabulary_count?: number;
  vocabulary_criteria?: any;
  curriculum_level?: string;
  classes?: { name: string };
}

export default function AssignmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showWordList, setShowWordList] = useState(false);
  const [wordListLoading, setWordListLoading] = useState(false);
  const [wordList, setWordList] = useState<any[] | null>(null);
  const [backfilledCount, setBackfilledCount] = useState<number | null>(null);
  const [vocabularyDetails, setVocabularyDetails] = useState<any>(null);
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});
  const [studentProgress, setStudentProgress] = useState<any[]>([]);

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

        // Fetch vocabulary details if available
        if (assignment.game_config?.vocabularyConfig) {
          await fetchVocabularyDetails(assignment.game_config.vocabularyConfig);
        }

        // Fetch student progress
        await fetchStudentProgress(assignmentId);
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

  const fetchVocabularyDetails = async (vocabConfig: any) => {
    try {
      const langCode = (vocabConfig.language || 'es').toLowerCase();
      const languageCode = langCode === 'es' || langCode === 'spanish' ? 'es'
        : langCode === 'fr' || langCode === 'french' ? 'fr'
        : langCode === 'de' || langCode === 'german' ? 'de'
        : 'es';

      let words: any[] = [];
      const counts: Record<string, number> = {};

      if (vocabConfig.subcategories && vocabConfig.subcategories.length > 0) {
        const { data } = await supabase
          .from('centralized_vocabulary')
          .select(`word, translation, subcategory, category`)
          .in('subcategory', vocabConfig.subcategories)
          .eq('language', languageCode)
          .limit(75);
        words = (data || []).map((r: any) => ({ term: r.word, translation: r.translation, subcategory: r.subcategory, category: r.category }));

        // Get per-topic counts
        for (const subcat of vocabConfig.subcategories) {
          const { count } = await supabase
            .from('centralized_vocabulary')
            .select('id', { count: 'exact', head: true })
            .eq('subcategory', subcat);
          counts[subcat] = count || 0;
        }
      } else if (vocabConfig.categories && vocabConfig.categories.length > 0) {
        const { data } = await supabase
          .from('centralized_vocabulary')
          .select(`word, translation, category`)
          .in('category', vocabConfig.categories)
          .eq('language', languageCode)
          .limit(75);
        words = (data || []).map((r: any) => ({ term: r.word, translation: r.translation, category: r.category }));

        for (const cat of vocabConfig.categories) {
          const { count } = await supabase
            .from('centralized_vocabulary')
            .select('id', { count: 'exact', head: true })
            .eq('category', cat);
          counts[cat] = count || 0;
        }
      }

      const languageMap: Record<string, string> = {
        es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese',
        spanish: 'Spanish', french: 'French', german: 'German'
      };
      const languageName = languageMap[langCode] || vocabConfig.language || 'Spanish';

      setVocabularyDetails({
        words,
        language: languageName,
        wordCount: words.length,
        estimatedSessions: Math.ceil(words.length / 10),
        subcategories: vocabConfig.subcategories || [],
        categories: vocabConfig.categories || [],
        pinnedIds: vocabConfig.pinnedVocabularyIds || []
      });
      setTopicCounts(counts);
    } catch (error) {
      console.error('Error fetching vocabulary details:', error);
    }
  };

  const fetchStudentProgress = async (assignmentId: string) => {
    try {
      const { data } = await supabase
        .from('enhanced_assignment_progress')
        .select('student_id, words_seen, total_words, sessions_completed')
        .eq('assignment_id', assignmentId);
      setStudentProgress(data || []);
    } catch (error) {
      console.error('Error fetching student progress:', error);
    }
  };

  // Backfill vocabulary_count from actual list size if mismatched
  useEffect(() => {
    const backfill = async () => {
      if (!assignment?.vocabulary_assignment_list_id) return;
      const { count, error } = await supabase
        .from('vocabulary_assignment_items')
        .select('id', { count: 'exact', head: true })
        .eq('assignment_list_id', assignment.vocabulary_assignment_list_id);
      if (!error && typeof count === 'number' && count >= 0 && count !== (assignment.vocabulary_count ?? 0)) {
        await supabase
          .from('assignments')
          .update({ vocabulary_count: count })
          .eq('id', assignment.id);
        // Reflect immediately in UI
        setAssignment({ ...assignment, vocabulary_count: count });
        setBackfilledCount(count);
      }
    };
    backfill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment?.vocabulary_assignment_list_id]);

  // Lazy-load all words when expanded
  const handleToggleWordList = async () => {
    if (!assignment) return;
    const listId = assignment.vocabulary_assignment_list_id;
    if (!listId) return setShowWordList((v) => !v);

    // If already loaded, just toggle
    if (wordList && wordList.length > 0) {
      setShowWordList((v) => !v);
      return;
    }

    setWordListLoading(true);
    const { data, error } = await supabase
      .from('vocabulary_assignment_items')
      .select('order_position, centralized_vocabulary:centralized_vocabulary_id (id, word, translation, category, subcategory)')
      .eq('assignment_list_id', listId)
      .order('order_position', { ascending: true });
    if (!error) {
      setWordList(data || []);
      setShowWordList(true);
    }
    setWordListLoading(false);
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

                {/* Learning Content - Enhanced */}
                {vocabularyDetails ? (
                  <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl p-6 border-2 border-purple-400/30 mb-8 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        <BookOpen className="w-6 h-6 mr-3 text-purple-300" />
                        Learning Content
                      </h3>
                      <button
                        onClick={() => setShowWordList(!showWordList)}
                        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg border border-purple-400/30 transition-all text-sm font-medium"
                      >
                        {showWordList ? 'Hide' : 'Show'} Word List
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="text-xs font-medium text-purple-300 uppercase tracking-wide mb-1">Language</div>
                        <div className="text-xl font-bold text-white">{vocabularyDetails.language}</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="text-xs font-medium text-purple-300 uppercase tracking-wide mb-1">Pool Size</div>
                        <div className="text-xl font-bold text-white">{vocabularyDetails.wordCount} words</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg p-4 border border-blue-400/30">
                        <div className="text-xs font-medium text-blue-300 uppercase tracking-wide mb-1">Est. Sessions</div>
                        <div className="text-xl font-bold text-blue-100">~{vocabularyDetails.estimatedSessions}</div>
                      </div>
                    </div>

                    {/* Topics with counts */}
                    {vocabularyDetails.subcategories.length > 0 && (
                      <div className="mb-6">
                        <div className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-3">
                          Topics ({vocabularyDetails.subcategories.length})
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {vocabularyDetails.subcategories.map((topic: string, idx: number) => (
                            <div key={idx} className="inline-flex items-center bg-indigo-500/20 text-indigo-200 px-4 py-2 rounded-lg border border-indigo-400/30">
                              <span className="font-medium">{topic}</span>
                              {topicCounts[topic] && (
                                <span className="ml-2 bg-indigo-400/30 text-indigo-100 px-2 py-0.5 rounded-full text-xs font-bold">
                                  {topicCounts[topic]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Word List */}
                    {showWordList && vocabularyDetails.words.length > 0 && (
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-bold text-white flex items-center">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Vocabulary Preview ({vocabularyDetails.words.length} words)
                          </div>
                          {vocabularyDetails.pinnedIds.length > 0 && (
                            <div className="text-xs bg-amber-500/20 text-amber-200 px-3 py-1 rounded-full font-medium border border-amber-400/30">
                              {vocabularyDetails.pinnedIds.length} pinned
                            </div>
                          )}
                        </div>
                        <div className="max-h-96 overflow-y-auto bg-black/20 rounded-lg p-3">
                          <ul className="text-sm space-y-1">
                            {vocabularyDetails.words.map((w: any, idx: number) => {
                              const isPinned = vocabularyDetails.pinnedIds.includes(w.term);
                              return (
                                <li key={idx} className={`py-2 px-3 rounded hover:bg-white/5 transition-colors ${isPinned ? 'bg-amber-500/10 border-l-2 border-amber-400' : 'border-l-2 border-transparent'}`}>
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center">
                                        {isPinned && <span className="text-amber-400 mr-2">📌</span>}
                                        <span className="font-semibold text-white">{w.term}</span>
                                        <span className="mx-2 text-gray-400">—</span>
                                        <span className="text-blue-200">{w.translation}</span>
                                      </div>
                                      {w.subcategory && (
                                        <div className="text-xs text-gray-400 mt-1 ml-6">
                                          {w.category || ''}{w.category ? ' / ' : ''}{w.subcategory}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="mt-3 text-xs text-purple-300 flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          Students see ~10 words per session with Progressive Coverage rotation
                        </div>
                      </div>
                    )}

                    {/* Student Progress Overview */}
                    {studentProgress.length > 0 && (
                      <div className="mt-6 bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="text-sm font-bold text-white mb-3 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Student Progress Overview
                        </div>
                        <div className="space-y-2">
                          {studentProgress.slice(0, 5).map((progress: any, idx: number) => {
                            const percentage = progress.total_words > 0 ? Math.round((progress.words_seen / progress.total_words) * 100) : 0;
                            return (
                              <div key={idx} className="bg-black/20 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-white">Student {idx + 1}</span>
                                  <span className="text-xs text-blue-300">{progress.sessions_completed} sessions</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <div className="text-xs text-blue-200 mt-1">
                                  {progress.words_seen}/{progress.total_words} words seen ({percentage}%)
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Learning Content</h3>
                    {(() => {
                      const vc: any = (assignment as any).vocabulary_criteria
                        || assignment.game_config?.gameConfig?.vocabularyConfig
                        || assignment.game_config?.vocabularyConfig
                        || assignment.config?.vocabularyConfig
                        || assignment.game_config
                        || assignment.config
                        || {};

                      const langCode: string = vc.language
                        || assignment.game_config?.gameConfig?.vocabularyConfig?.language
                        || assignment.game_config?.vocabularyConfig?.language
                        || assignment.config?.vocabularyConfig?.language
                        || 'es';
                      const langMap: Record<string, string> = { es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ar: 'Arabic', ru: 'Russian' };
                      const language = langMap[langCode] || langCode;

                      const topics: string[] = Array.isArray(vc.subcategories) && vc.subcategories.length
                        ? vc.subcategories
                        : (vc.subcategory ? [vc.subcategory]
                          : (Array.isArray(vc.categories) && vc.categories.length ? vc.categories
                            : (Array.isArray(vc.themes) && vc.themes.length ? vc.themes
                              : (vc.theme ? [vc.theme] : []))));

                      const items = assignment.vocabulary_count ?? 0;
                      return (
                        <div className="space-y-2 text-blue-100">
                          <div>
                            <span className="text-blue-300 font-medium">Vocabulary List:</span>
                            <span className="ml-2 text-white">{topics.length > 0 ? 'Configured' : 'Not configured'}</span>
                            {backfilledCount !== null && (
                              <span className="ml-3 text-xs text-emerald-300">(updated to {backfilledCount} words)</span>
                            )}
                          </div>
                          <div>
                            <span className="text-blue-300 font-medium">Language:</span>
                            <span className="ml-2 text-white lowercase">{language}</span>
                          </div>
                          <div>
                          <span className="text-blue-300 font-medium">Items:</span>
                          <span className="ml-2 text-white">{items} {items === 1 ? 'word' : 'words'}</span>
                        </div>
                        {topics.length > 0 && (
                          <div>
                            <span className="text-blue-300 font-medium">Topics:</span>
                            <span className="ml-2 text-white">{topics.join(', ')}</span>
                          </div>
                        )}
                        <div className="pt-2">
                          <button
                            onClick={handleToggleWordList}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm border border-white/20"
                          >
                            {showWordList ? 'Hide all words' : 'View all words'}
                          </button>
                        </div>
                        {showWordList && (
                          <div className="mt-3 bg-black/20 border border-white/10 rounded-lg max-h-64 overflow-y-auto">
                            {wordListLoading ? (
                              <div className="p-3 text-blue-200">Loading words…</div>
                            ) : (
                              <ul className="divide-y divide-white/10">
                                {(wordList || []).map((row: any, idx: number) => (
                                  <li key={idx} className="px-3 py-2 text-white/90 flex justify-between">
                                    <span>
                                      {row?.centralized_vocabulary?.word}
                                      <span className="text-white/50 ml-2">— {row?.centralized_vocabulary?.translation}</span>
                                    </span>
                                    <span className="text-xs text-white/50">
                                      {row?.centralized_vocabulary?.category}{row?.centralized_vocabulary?.subcategory ? ` / ${row.centralized_vocabulary.subcategory}` : ''}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                      );
                    })()}
                  </div>
                )}


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