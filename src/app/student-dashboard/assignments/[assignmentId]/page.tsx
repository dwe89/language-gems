'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, CheckCircle, Clock, Gamepad2, Target, Star, Gem, TrendingUp, Activity, Award, Zap, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import { AssignmentProgressTrackingService, GameActivityMetrics } from '../../../../services/AssignmentProgressTrackingService';
import { MasteryScoreService, MasteryScoreBreakdown } from '../../../../services/MasteryScoreService';
import { calculateRemainingTime, getTimeCategory } from '../../../../utils/assignmentTimeEstimation';
import { assignmentExposureService } from '../../../../services/assignments/AssignmentExposureService';
import AssessmentAssignmentView from '../../../../components/student-dashboard/AssessmentAssignmentView';

// Map game types to actual game directory paths
const mapGameTypeToPath = (gameType: string | null): string => {
  if (!gameType) return 'memory-game';

  const gameTypeMap: Record<string, string> = {
    // Direct mappings for existing games
    'memory-game': 'memory-game',
    'vocab-blast': 'vocab-blast',
    'vocab-master': 'vocab-master', // ✅ VocabMaster assignment support
    'hangman': 'hangman',
    'noughts-and-crosses': 'noughts-and-crosses',
    'speed-builder': 'speed-builder',
    'vocabulary-mining': 'vocabulary-mining',
    'detective-listening': 'detective-listening',
    'word-scramble': 'word-scramble', // ✅ Word Scramble assignment support
    'memory-game': 'memory-game', // ✅ Memory Game assignment support
    'hangman': 'hangman', // ✅ Hangman assignment support
    'word-blast': 'word-blast', // ✅ Word Blast assignment support
    'speed-builder': 'speed-builder', // ✅ Speed Builder assignment support
    'word-towers': 'word-towers', // ✅ Word Towers assignment support
    'sentence-towers': 'sentence-towers', // ✅ Sentence Towers assignment support
    'conjugation-duel': 'conjugation-duel', // ✅ Conjugation Duel assignment support
    'case-file-translator': 'case-file-translator', // ✅ Case File Translator assignment support
    'lava-temple-word-restore': 'lava-temple-word-restore', // ✅ Lava Temple assignment support
    'vocabulary_test': 'vocabulary-test', // ✅ Vocabulary Test assignment support

    // Legacy mappings for potential mismatches
    'quiz': 'memory-game', // Fallback for quiz to memory game
    'word-blast': 'vocab-blast', // Map word-blast to vocab-blast
    'tic-tac-toe': 'noughts-and-crosses', // Alternative name
    'tictactoe': 'noughts-and-crosses', // Alternative name
    'gem-collector': 'vocabulary-mining', // Map gem collector to vocabulary mining
    'translation-tycoon': 'speed-builder', // Map to closest equivalent
    'conjugation-duel': 'conjugation-duel',
    'word-scramble': 'word-scramble',
    'word-guesser': 'hangman', // Map to closest equivalent
    'sentence-towers': 'sentence-towers',
    'sentence-builder': 'speed-builder', // Map to closest equivalent
    'word-association': 'memory-game', // Map to closest equivalent
  };

  return gameTypeMap[gameType] || 'memory-game'; // Default fallback
};

export default function StudentAssignmentDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const assignmentId = params?.assignmentId as string;
  
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [masteryScore, setMasteryScore] = useState<MasteryScoreBreakdown | null>(null);
  
  // Grammar skills expansion state
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());
  const [skillTopicsData, setSkillTopicsData] = useState<Map<string, any[]>>(new Map());

  // Check if this is a preview mode (teacher viewing the assignment)
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  useEffect(() => {
    // Check if preview mode is enabled from URL params
    const urlParams = new URLSearchParams(window.location.search);
    setIsPreviewMode(urlParams.get('preview') === 'true');
  }, []);

  useEffect(() => {
    if (!user || !assignmentId) return;

    const fetchAssignmentDetail = async () => {
      try {
        setLoading(true);
        const supabase = supabaseBrowser;

        // Get assignment details
        const { data: assignmentData, error: assignmentError } = await supabase
          .from('assignments')
          .select(`
            id,
            title,
            description,
            due_date,
            game_type,
            assignment_mode,
            game_config,
            vocabulary_count,
            repetitions_required
          `)
          .eq('id', assignmentId)
          .single();

        if (assignmentError) {
          console.error('Error fetching assignment:', assignmentError);
          setError('Failed to load assignment details');
          return;
        }

        if (!assignmentData) {
          setError('Assignment not found');
          return;
        }

        // Check if this is an assessment-only assignment
        const isAssessmentOnly = assignmentData.game_type === 'assessment' &&
                                 assignmentData.assignment_mode === 'single_game';

        // If it's an assessment-only assignment, use the dedicated component
        if (isAssessmentOnly) {
          setAssignment({
            id: assignmentData.id,
            title: assignmentData.title,
            description: assignmentData.description,
            dueDate: assignmentData.due_date ? new Date(assignmentData.due_date).toLocaleDateString() : undefined,
            isAssessmentOnly: true
          });
          setLoading(false);
          return;
        }

        // Get assignment completion status for this student
        const { data: assignmentProgress, error: progressError } = await supabase
          .from('enhanced_assignment_progress')
          .select('status, best_score, best_accuracy, total_time_spent, completed_at')
          .eq('assignment_id', assignmentId)
          .eq('student_id', user.id)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          console.error('Error fetching assignment progress:', progressError);
          // Continue without progress data
        }

        // Get individual game progress for multi-game assignments
        const { data: gameProgressData, error: gameProgressError } = await supabase
          .from('assignment_game_progress')
          .select('game_id, status, score, accuracy, time_spent, completed_at')
          .eq('assignment_id', assignmentId)
          .eq('student_id', user.id);

        if (gameProgressError) {
          console.error('Error fetching game progress:', gameProgressError);
          // Continue without game progress data
        }

        // Get grammar assignment sessions for skills (grammar topics)
        const { data: grammarSessionsData, error: grammarSessionsError } = await supabase
          .from('grammar_assignment_sessions')
          .select(`
            topic_id,
            completion_status,
            final_score,
            accuracy_percentage,
            duration_seconds,
            ended_at,
            grammar_topics (
              title
            )
          `)
          .eq('assignment_id', assignmentId)
          .eq('student_id', user.id);

        if (grammarSessionsError) {
          console.error('Error fetching grammar sessions:', grammarSessionsError);
        }

        // Check if this is a multi-activity assignment (games, assessments, or skills)
        const isMultiGame = assignmentData.game_type === 'multi-game' ||
                           assignmentData.game_type === 'mixed-mode' ||
                           assignmentData.game_type === 'skills' ||
                           (assignmentData.game_type === 'assessment' && !isAssessmentOnly) ||
                           (assignmentData.game_config?.multiGame && assignmentData.game_config?.selectedGames?.length > 1) ||
                           (assignmentData.game_config?.gameConfig?.selectedGames && assignmentData.game_config.gameConfig.selectedGames.length > 1);
        
        const gameNameMap: Record<string, { name: string; description: string }> = {
          'vocabulary-mining': { name: 'Vocabulary Mining', description: 'Mine vocabulary gems to build your collection' },
          'memory-game': { name: 'Memory Match', description: 'Match vocabulary pairs to improve recall' },
          'memory-match': { name: 'Memory Match', description: 'Match vocabulary pairs to improve recall' },
          'word-blast': { name: 'Word Blast', description: 'Fast-paced sentence building with falling words' },
          'vocab-blast': { name: 'Vocab Blast', description: 'Click vocabulary objects in themed environments' },
          'speed-builder': { name: 'Speed Builder', description: 'Build sentences quickly and accurately' },
          'translation-tycoon': { name: 'Translation Tycoon', description: 'Build your business empire with vocabulary' },
          'conjugation-duel': { name: 'Conjugation Duel', description: 'Epic verb battles in different arenas' },
          'word-scramble': { name: 'Word Scramble', description: 'Unscramble letters to form words' },
          'gem-collector': { name: 'Gem Collector', description: 'Collect gems by translating words correctly' },
          'hangman': { name: 'Hangman', description: 'Guess the word before the drawing is complete' },
          'word-guesser': { name: 'Word Guesser', description: 'Guess words based on definitions and clues' },
          'sentence-towers': { name: 'Sentence Towers', description: 'Build towers by constructing sentences' },
          'sentence-builder': { name: 'Sentence Builder', description: 'Drag and drop words to build sentences' },
          'word-association': { name: 'Word Association', description: 'Connect related words and concepts' },
          'detective-listening': { name: 'Detective Listening', description: 'Listen and translate audio clues' }, 
          'case-file-translator': { name: 'Case File Translator', description: 'Translate words to solve mysteries' },
          'lava-temple-word-restore': { name: 'Lava Temple Word Restore', description: 'Restore words in a temple setting' },
          'verb-quest': { name: 'Verb Quest', description: 'Embark on quests to master verb conjugations' },
          'vocab-master': { name: 'Vocab Master', description: 'Master vocabulary through spaced repetition' },
          'noughts-and-crosses': { name: 'Noughts & Crosses', description: 'Strategic gameplay with vocabulary questions' },
          'vocabulary_test': { name: 'Vocabulary Test', description: 'Complete a vocabulary assessment' }
      
    
          
        };

        let games: any[] = [];
        let assessments: any[] = [];
        let skills: any[] = [];

        if (isMultiGame) {
          // Multi-game assignment - handle both old and new config structures
          const selectedGames = assignmentData.game_config?.selectedGames ||
                               assignmentData.game_config?.gameConfig?.selectedGames ||
                               [];

          // Load enhanced progress for each game
          const progressService = new AssignmentProgressTrackingService(supabase);

          games = await Promise.all(selectedGames.map(async (gameId: string) => {
            const gameInfo = gameNameMap[gameId] || { name: gameId, description: 'Language learning game' };

            // Get enhanced progress metrics
            const metrics = await progressService.getGameProgress(assignmentId, user.id, gameId);

            return {
              id: gameId,
              name: gameInfo.name,
              description: gameInfo.description,
              type: 'game',
              completed: metrics.completed,
              score: metrics.bestScore,
              accuracy: metrics.accuracy,
              timeSpent: metrics.totalTimeSpent,
              completedAt: metrics.completedAt,
              // Enhanced metrics
              progressPercentage: metrics.progressPercentage,
              status: metrics.status,
              sessionsStarted: metrics.sessionsStarted,
              wordsAttempted: metrics.wordsAttempted,
              wordsCorrect: metrics.wordsCorrect,
              gemsEarned: metrics.gemsEarned,
              lastPlayedAt: metrics.lastPlayedAt
            };
          }));

          // Extract assessments from the assignment config
          const selectedAssessments = assignmentData.game_config?.assessmentConfig?.selectedAssessments || [];

          assessments = selectedAssessments.map((assessment: any) => {
            // Find individual assessment progress
            const assessmentProgress = gameProgressData?.find(gp => gp.game_id === assessment.id);
            const isCompleted = assessmentProgress?.status === 'completed';

            return {
              id: assessment.id,
              name: assessment.name,
              description: `${assessment.estimatedTime} • ${assessment.skills?.join(', ') || 'Assessment'}`,
              type: 'assessment',
              assessmentType: assessment.type,
              completed: isCompleted,
              score: assessmentProgress?.score || 0,
              accuracy: assessmentProgress?.accuracy || 0,
              timeSpent: assessmentProgress?.time_spent || 0,
              completedAt: assessmentProgress?.completed_at
            };
          });

          // Extract skills from the assignment config
          const selectedSkills = assignmentData.game_config?.skillsConfig?.selectedSkills || [];

          skills = selectedSkills.map((skill: any) => {
            // Find grammar session progress for this skill's topics
            const topicIds = skill.instanceConfig?.topicIds || [];
            const topicSessions = grammarSessionsData?.filter(session =>
              topicIds.includes(session.topic_id)
            ) || [];

            console.log('🔍 [SKILL MAPPING]', {
              skillName: skill.name,
              topicIds,
              totalGrammarSessions: grammarSessionsData?.length,
              filteredSessions: topicSessions.length,
              sessionTopicIds: topicSessions.map(s => s.topic_id)
            });

            // Calculate aggregate stats from all topic sessions
            const totalSessions = topicSessions.length;
            const completedSessions = topicSessions.filter(s => s.completion_status === 'completed').length;

            // Count unique topics that have at least one completed session
            const completedTopicIds = new Set(
              topicSessions
                .filter(s => s.completion_status === 'completed')
                .map(s => s.topic_id)
            );
            const uniqueTopicsCompleted = completedTopicIds.size;
            const avgScore = totalSessions > 0
              ? topicSessions.reduce((sum, s) => sum + (s.final_score || 0), 0) / totalSessions
              : 0;
            const avgAccuracy = totalSessions > 0
              ? topicSessions.reduce((sum, s) => sum + (s.accuracy_percentage || 0), 0) / totalSessions
              : 0;
            const totalTime = topicSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
            const lastCompleted = topicSessions
              .filter(s => s.ended_at)
              .sort((a, b) => new Date(b.ended_at!).getTime() - new Date(a.ended_at!).getTime())[0]?.ended_at;

            // Consider skill completed if at least one session per topic is completed
            const isCompleted = topicIds.length > 0 && completedSessions >= topicIds.length;

            return {
              id: skill.id,
              name: skill.name,
              description: `${skill.estimatedTime} • ${skill.skills?.join(', ') || 'Grammar'}`,
              type: 'skill',
              skillType: skill.type, // lesson, practice, quiz
              category: skill.instanceConfig?.category,
              topicIds: skill.instanceConfig?.topicIds,
              language: skill.instanceConfig?.language,
              instanceConfig: skill.instanceConfig, // Pass full config for content types
              completed: isCompleted,
              score: Math.round(avgScore),
              accuracy: Math.round(avgAccuracy),
              timeSpent: totalTime,
              completedAt: lastCompleted,
              sessionsCompleted: uniqueTopicsCompleted,  // Use unique topics instead of total sessions
              totalTopics: topicIds.length
            };
          });
        } else {
          // Single game assignment - use overall assignment progress
          const gameInfo = gameNameMap[assignmentData.game_type] || { name: assignmentData.game_type, description: 'Language learning game' };
          const isCompleted = assignmentProgress?.status === 'completed';
          games = [{
            id: assignmentData.game_type,
            name: gameInfo.name,
            description: gameInfo.description,
            type: 'game',
            completed: isCompleted,
            score: assignmentProgress?.best_score || 0,
            accuracy: assignmentProgress?.best_accuracy || 0,
            timeSpent: assignmentProgress?.total_time_spent || 0,
            completedAt: assignmentProgress?.completed_at
          }];
        }

        const allActivities = [...games, ...assessments, ...skills];

        const completedActivities = allActivities.filter(a => a.completed).length;
        const inProgressActivities = allActivities.filter(a =>
          a.status === 'in_progress' || (a.progressPercentage > 0 && !a.completed)
        ).length;
        const notStartedActivities = allActivities.filter(a =>
          a.status === 'not_started' || (a.progressPercentage === 0 && !a.completed)
        ).length;

        // For assessment-only assignments, use different progress calculation
        let overallProgress = 0;
        let masteryData: any = null;
        let timeEstimation: any = null;
        let timeCategory: any = null;
        let vocabularyCount = 0;
        let repetitionsRequired = 0;
        let totalRequiredExposures = 0;
        let completedExposures = 0;
        let exposureProgress: any = null;
        let assessmentData: any = null;

        if (isAssessmentOnly) {
          // For assessments, progress is based on completion status
          const assessmentProgress = gameProgressData?.find(gp => gp.game_id === 'reading-comprehension');
          overallProgress = assessmentProgress?.status === 'completed' ? 100 :
                           assessmentProgress?.status === 'in_progress' ? 50 : 0;

          // Get the latest session data for detailed assessment info
          const { data: latestSession } = await supabase
            .from('enhanced_game_sessions')
            .select('session_data, final_score, accuracy_percentage, duration_seconds')
            .eq('assignment_id', assignmentId)
            .eq('student_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get all sessions to count attempts
          const { data: allSessions } = await supabase
            .from('enhanced_game_sessions')
            .select('id')
            .eq('assignment_id', assignmentId)
            .eq('student_id', user.id);

          // Store assessment-specific data
          if (latestSession) {
            const sessionData = latestSession.session_data as any;
            assessmentData = {
              score: latestSession.final_score || 0,
              accuracy: parseFloat(latestSession.accuracy_percentage || '0'),
              timeSpent: latestSession.duration_seconds || 0,
              status: assessmentProgress?.status || 'not_started',
              questionsCorrect: sessionData?.correctAnswers || 0,
              totalQuestions: sessionData?.totalQuestions || 10,
              maxAttempts: assignmentData.game_config?.assessmentConfig?.generalMaxAttempts || 3,
              attemptsUsed: allSessions?.length || 0
            };
            vocabularyCount = sessionData?.totalQuestions || 10;
            completedExposures = sessionData?.correctAnswers || 0;
          }

          // Don't calculate mastery score for assessments
          setMasteryScore(null);
        } else {
          // Calculate mastery score for vocabulary-based assignments
          const masteryService = new MasteryScoreService(supabase);
          masteryData = await masteryService.calculateAssignmentMasteryScore(assignmentId, user.id);
          setMasteryScore(masteryData);

          // Calculate time estimation
          vocabularyCount = assignmentData.vocabulary_count || 10;
          repetitionsRequired = assignmentData.repetitions_required || 5;
          totalRequiredExposures = vocabularyCount * repetitionsRequired;
          completedExposures = masteryData.wordsAttempted;
          timeEstimation = calculateRemainingTime(totalRequiredExposures, completedExposures);
          timeCategory = getTimeCategory(timeEstimation.estimatedMinutes);

          // Get assignment-level exposure progress (Layer 2)
          exposureProgress = await assignmentExposureService.getAssignmentProgress(
            assignmentId,
            user.id
          );

          // Overall progress is based on EXPOSURE, not average of game progress
          // This shows: "How many words have been exposed out of the total?"
          overallProgress = vocabularyCount > 0
            ? Math.round((exposureProgress.exposedWords / vocabularyCount) * 100)
            : 0;
        }

        console.log('📊 [ASSIGNMENT PROGRESS] Exposure-based calculation:', {
          vocabularyCount,
          exposedWords: exposureProgress.exposedWords,
          exposurePercentage: overallProgress,
          totalGames: games.length,
          totalAssessments: assessments.length,
          totalSkills: skills.length,
          totalActivities: allActivities.length,
          completedActivities,
          inProgressActivities,
          notStartedActivities,
          games: games.map(g => ({
            id: g.id,
            name: g.name,
            status: g.status,
            gameProgress: g.progressPercentage,
            sessions: g.sessionsStarted,
            words: g.wordsAttempted
          }))
        });

        setAssignment({
          id: assignmentData.id,
          title: assignmentData.title,
          description: assignmentData.description,
          dueDate: assignmentData.due_date ? new Date(assignmentData.due_date).toLocaleDateString() : undefined,
          isMultiGame,
          isAssessmentOnly,
          games,
          assessments,
          skills,
          allActivities,
          totalGames: games.length,
          totalAssessments: assessments.length,
          totalSkills: skills.length,
          totalActivities: allActivities.length,
          completedGames: games.filter(g => g.completed).length,
          completedAssessments: assessments.filter(a => a.completed).length,
          completedSkills: skills.filter(s => s.completed).length,
          completedActivities,
          inProgressActivities,
          notStartedActivities,
          overallProgress,
          vocabularyCount,
          repetitionsRequired,
          totalRequiredExposures,
          completedExposures,
          timeEstimation,
          timeCategory,
          // Assessment-specific data
          assessmentData
        });

      } catch (err) {
        console.error('Error in fetchAssignmentDetail:', err);
        setError('Failed to load assignment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetail();
  }, [user, assignmentId, refreshKey]);

  // Function to refresh assignment data (called when returning from games)
  const refreshAssignmentData = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    // Reset refreshing state after a delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // REMOVED: Auto-refresh on focus was causing constant page refreshes
  // Games now update progress in real-time, so this is unnecessary

  const handlePlayGame = async (gameId: string) => {
    const previewParam = isPreviewMode ? '&preview=true' : '';

    // Filter to outstanding words only (exclude mastered words)
    const filterParam = '&filterOutstanding=true';

    console.log('🎮 Launching game with outstanding words filter:', {
      gameId,
      assignmentId,
      filterOutstanding: true
    });

    router.push(`/games/${mapGameTypeToPath(gameId)}?assignment=${assignmentId}&mode=assignment${previewParam}${filterParam}`);
  };

  const handlePlayAssessment = (assessment: any) => {
    const previewParam = isPreviewMode ? '&preview=true' : '';
    let assessmentUrl = '';

    switch (assessment.assessmentType) {
      case 'reading-comprehension':
        assessmentUrl = `/assessments/reading-comprehension?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'aqa-reading':
        assessmentUrl = `/assessments/aqa-reading?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'aqa-listening':
        assessmentUrl = `/assessments/aqa-listening?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'dictation':
        assessmentUrl = `/assessments/dictation?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'four-skills':
        assessmentUrl = `/assessments/four-skills?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'listening-comprehension':
        assessmentUrl = `/assessments/listening-comprehension?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      case 'exam-style-questions':
        assessmentUrl = `/assessments/exam-style-questions?assignment=${assignmentId}&mode=assignment${previewParam}`;
        break;
      default:
        alert(`Assessment type "${assessment.assessmentType}" is not yet supported.`);
        return;
    }

    router.push(assessmentUrl);
  };

  const handlePlaySkill = async (skill: any, specificTopicId?: string) => {
    const previewParam = isPreviewMode ? '&preview=true' : '';

    // Map incoming language identifiers (ISO codes or names) to the
    // route-friendly language slug used by the grammar pages.
    // Examples: 'es' -> 'spanish', 'spanish' -> 'spanish', 'fr' -> 'french'
    const mapLanguageToRoute = (lang: string) => {
      const map: Record<string, string> = {
        'es': 'spanish',
        'spanish': 'spanish',
        'fr': 'french',
        'french': 'french',
        'de': 'german',
        'german': 'german',
        'it': 'italian',
        'italian': 'italian'
      };

      return map[lang] || lang; // fallback to the original value if unknown
    };

    // Use specific topic ID if provided, otherwise use the first topic
    const topicId = specificTopicId || skill.topicIds?.[0];
    if (!topicId) {
      alert('No topic configured for this skill activity.');
      return;
    }

    try {
      // Fetch the topic slug, category, and language from the database
      const { data: topicData, error } = await supabaseBrowser
        .from('grammar_topics')
        .select('slug, category, language')
        .eq('id', topicId)
        .single();

      if (error || !topicData) {
        console.error('Error fetching topic:', error);
        alert('Topic not found. Please contact your teacher.');
        return;
      }

      const topicSlug = topicData.slug;
      const categorySlug = topicData.category; // Already a slug (e.g., "verbs", "adjectives")

      // Map the language from ISO code to full name for the route
      const languageSlug = mapLanguageToRoute(topicData.language);

      let skillUrl = '';

      switch (skill.skillType) {
        case 'lesson':
          // Lesson pages - go to main grammar page with assignment tracking
          skillUrl = `/grammar/${languageSlug}/${categorySlug}/${topicSlug}?assignment=${assignmentId}&mode=assignment${previewParam}`;
          break;
        case 'practice':
          skillUrl = `/grammar/${languageSlug}/${categorySlug}/${topicSlug}/practice?assignment=${assignmentId}&mode=assignment${previewParam}`;
          break;
        case 'quiz':
        case 'test':
          // Both quiz and test should go to /test route
          skillUrl = `/grammar/${languageSlug}/${categorySlug}/${topicSlug}/test?assignment=${assignmentId}&mode=assignment${previewParam}`;
          break;
        default:
          alert(`Skill type "${skill.skillType}" is not yet supported.`);
          return;
      }

      console.log('🔗 [GRAMMAR ASSIGNMENT] Navigating to:', skillUrl);
      router.push(skillUrl);
    } catch (error) {
      console.error('Error in handlePlaySkill:', error);
      alert('Failed to load skill activity. Please try again.');
    }
  };

  const toggleSkillExpansion = async (skillId: string, topicIds: string[]) => {
    const newExpanded = new Set(expandedSkills);
    
    if (expandedSkills.has(skillId)) {
      // Collapse
      newExpanded.delete(skillId);
      setExpandedSkills(newExpanded);
    } else {
      // Expand and fetch topic details if not already fetched
      newExpanded.add(skillId);
      setExpandedSkills(newExpanded);
      
      if (!skillTopicsData.has(skillId) && topicIds.length > 0) {
        try {
          const { data: topicsData, error } = await supabaseBrowser
            .from('grammar_topics')
            .select('id, title, description, difficulty_level')
            .in('id', topicIds);
          
          if (!error && topicsData) {
            const newMap = new Map(skillTopicsData);
            newMap.set(skillId, topicsData);
            setSkillTopicsData(newMap);
          }
        } catch (error) {
          console.error('Error fetching topic details:', error);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="space-y-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Assignment not found'}
        </div>
        <Link
          href="/student-dashboard/assignments"
          className="inline-flex items-center text-white hover:text-indigo-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assignments
        </Link>
      </div>
    );
  }

  // If this is an assessment-only assignment, use the dedicated component
  if (assignment.isAssessmentOnly) {
    return (
      <AssessmentAssignmentView
        assignmentId={assignmentId as string}
        studentId={user!.id}
        assignmentTitle={assignment.title}
        assignmentDescription={assignment.description}
        dueDate={assignment.dueDate}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        {isPreviewMode ? (
          <Link
            href="/dashboard/assignments"
            className="inline-flex items-center text-white hover:text-indigo-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teacher Dashboard
          </Link>
        ) : (
          <Link
            href="/student-dashboard/assignments"
            className="inline-flex items-center text-white hover:text-indigo-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignments
          </Link>
        )}
        
        {isPreviewMode && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="w-5 h-5 text-yellow-600 mr-2">ℹ️</div>
              <div>
                <p className="font-medium">Teacher Preview Mode</p>
                <p className="text-sm">You are viewing this assignment as your students would see it.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
              {assignment.description && (
                <p className="text-gray-600 text-lg mb-4">{assignment.description}</p>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                {assignment.dueDate && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                )}
                {assignment.totalGames > 0 && (
                  <div className="flex items-center">
                    <Gamepad2 className="h-4 w-4 mr-1" />
                    <span>{assignment.totalGames} game{assignment.totalGames !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {assignment.totalAssessments > 0 && (
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    <span>{assignment.totalAssessments} assessment{assignment.totalAssessments !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {/* Enhanced Status Breakdown */}
                <div className="flex items-center gap-4 flex-wrap">
                  {assignment.completedActivities > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">{assignment.completedActivities} completed</span>
                    </div>
                  )}
                  {assignment.inProgressActivities > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm font-medium">{assignment.inProgressActivities} in progress</span>
                    </div>
                  )}
                  {assignment.notStartedActivities > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm font-medium">{assignment.notStartedActivities} not started</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-3xl font-bold ${assignment.overallProgress === 100 ? 'text-green-600' : 'text-indigo-600'}`}>
                {Math.round(assignment.overallProgress)}%
              </div>
              <div className="text-sm text-gray-500">
                Overall Progress
                {isRefreshing && (
                  <span className="ml-2 text-xs text-blue-600 animate-pulse">Updating...</span>
                )}
              </div>
              {/* Time Estimation */}
              {assignment.timeEstimation && assignment.timeEstimation.totalExposures > 0 && (
                <div className="mt-2 flex items-center justify-end gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className={`text-xs font-medium ${assignment.timeCategory.color}`}>
                    {assignment.timeEstimation.displayText}
                  </span>
                </div>
              )}
              {assignment.overallProgress === 100 ? (
                <div className="flex items-center justify-end mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-xs font-medium text-green-700">Complete!</span>
                </div>
              ) : assignment.inProgressActivities > 0 ? (
                <div className="flex items-center justify-end mt-1">
                  <Activity className="h-4 w-4 text-yellow-600 mr-1" />
                  <span className="text-xs font-medium text-yellow-700">Keep going!</span>
                </div>
              ) : null}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 shadow-inner">
            <div
              className={`h-4 rounded-full transition-all duration-700 ${
                assignment.overallProgress === 100
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${assignment.overallProgress}%` }}
            ></div>
          </div>

          {assignment.overallProgress === 100 && !assignment.isAssessmentOnly && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                🎉 Congratulations! You've completed all games in this assignment.
              </p>
            </div>
          )}

          {/* Assessment Results Card - For Assessment-Only Assignments */}
          {assignment.isAssessmentOnly && assignment.assessmentData && assignment.assessmentData.status !== 'not_started' && (
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Assessment Results</h3>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${
                    assignment.assessmentData.score >= 70 ? 'text-green-600' :
                    assignment.assessmentData.score >= 50 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {assignment.assessmentData.score}%
                  </div>
                  <div className="text-sm font-medium text-gray-600">Final Score</div>
                </div>
              </div>

              {/* Score Breakdown - Assessment Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-600">Correct Answers</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {assignment.assessmentData.questionsCorrect}/{assignment.assessmentData.totalQuestions}
                  </div>
                  <div className="text-xs text-gray-500">{assignment.assessmentData.accuracy}% accuracy</div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-gray-600">Time Spent</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {Math.floor(assignment.assessmentData.timeSpent / 60)}:{String(assignment.assessmentData.timeSpent % 60).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500">minutes</div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-gray-600">Attempts</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {assignment.assessmentData.attemptsUsed}/{assignment.assessmentData.maxAttempts}
                  </div>
                  <div className="text-xs text-gray-500">
                    {assignment.assessmentData.attemptsUsed < assignment.assessmentData.maxAttempts ?
                      `${assignment.assessmentData.maxAttempts - assignment.assessmentData.attemptsUsed} remaining` :
                      'All used'}
                  </div>
                </div>
              </div>

              {/* Performance Feedback */}
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="text-sm font-semibold text-gray-700 mb-2">Performance Summary</div>
                <div className="text-sm text-gray-600">
                  {assignment.assessmentData.score >= 70 ? (
                    <>
                      <span className="text-green-600 font-medium">Excellent work!</span> You demonstrated strong comprehension skills.
                      {assignment.assessmentData.attemptsUsed < assignment.assessmentData.maxAttempts &&
                        ' You can retake this assessment to improve your score further.'}
                    </>
                  ) : assignment.assessmentData.score >= 50 ? (
                    <>
                      <span className="text-yellow-600 font-medium">Good effort!</span> You're making progress.
                      {assignment.assessmentData.attemptsUsed < assignment.assessmentData.maxAttempts &&
                        ' Consider reviewing the material and trying again to improve your score.'}
                    </>
                  ) : (
                    <>
                      <span className="text-red-600 font-medium">Keep practicing!</span> This material needs more review.
                      {assignment.assessmentData.attemptsUsed < assignment.assessmentData.maxAttempts &&
                        ' Take some time to study the content and try again.'}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mastery Score Card - NEW HYBRID MODEL (Only for vocabulary assignments) */}
          {!assignment.isAssessmentOnly && masteryScore && masteryScore.wordsAttempted > 0 && (
            <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Mastery Score</h3>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${masteryScore.totalScore >= 90 ? 'text-green-600' : masteryScore.totalScore >= 70 ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {masteryScore.totalScore}%
                  </div>
                  <div className="text-sm font-medium text-gray-600">Grade: {masteryScore.grade}</div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4">{masteryScore.gradeDescription}</p>

              {/* Score Breakdown - Three Components */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-600">Accuracy</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{Math.round(masteryScore.accuracyScore)}/70</div>
                  <div className="text-xs text-gray-500">{masteryScore.overallAccuracy}% correct</div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-gray-600">Activity</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{Math.round(masteryScore.activityScore)}/20</div>
                  <div className="text-xs text-gray-500">
                    {masteryScore.totalRequiredGames > 0
                      ? `${masteryScore.requiredSessionsMet}/${masteryScore.totalRequiredGames} required`
                      : 'No requirements'}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-gray-600">Completion</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{masteryScore.completionBonus}/10</div>
                  <div className="text-xs text-gray-500">
                    {masteryScore.isCompleted ? 'Complete!' : `${masteryScore.exposedWords}/${masteryScore.totalWords} words`}
                  </div>
                </div>
              </div>

              {/* Actionable Feedback */}
              {masteryScore.feedback && (
                <div className="space-y-3">
                  {/* Accuracy Feedback */}
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-700 mb-1">Quality of Learning</div>
                        <div className="text-sm text-gray-600">{masteryScore.feedback.accuracyFeedback}</div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Feedback */}
                  {masteryScore.totalRequiredGames > 0 && (
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-700 mb-1">Meeting Requirements</div>
                          <div className="text-sm text-gray-600">{masteryScore.feedback.activityFeedback}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Completion Feedback */}
                  {!masteryScore.isCompleted && (
                    <div className="bg-white rounded-lg p-3 border border-yellow-100">
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-700 mb-1">Finish the Assignment</div>
                          <div className="text-sm text-gray-600">{masteryScore.feedback.completionFeedback}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next Steps */}
                  {masteryScore.feedback.nextSteps && masteryScore.feedback.nextSteps.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 border border-purple-200">
                      <div className="text-xs font-bold text-purple-900 mb-2">📋 Next Steps to Improve Your Grade:</div>
                      <ul className="space-y-1">
                        {masteryScore.feedback.nextSteps.map((step, index) => (
                          <li key={index} className="text-sm text-purple-800 flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {assignment.isMultiGame && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-blue-900">Multi-Game Assignment</p>
                  <p className="text-sm text-blue-700">Complete all games to finish this assignment. You can play them in any order!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {assignment.isMultiGame ? 'Activities to Complete' : 'Assignment Activity'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignment.allActivities.map((activity: any, index: number) => {
            // Determine status badge
            const getStatusBadge = () => {
              if (activity.completed) {
                return { text: 'COMPLETED', color: 'bg-green-500 text-white', icon: CheckCircle };
              } else if (activity.status === 'in_progress' || activity.progressPercentage > 0) {
                return { text: 'IN PROGRESS', color: 'bg-yellow-500 text-white', icon: Activity };
              } else {
                return { text: 'NOT STARTED', color: 'bg-gray-400 text-white', icon: Play };
              }
            };

            const statusBadge = getStatusBadge();
            const StatusIcon = statusBadge.icon;

            // Format last played time
            const getLastPlayedText = () => {
              if (!activity.lastPlayedAt) return null;
              const now = new Date();
              const lastPlayed = new Date(activity.lastPlayedAt);
              const diffMs = now.getTime() - lastPlayed.getTime();
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMins / 60);
              const diffDays = Math.floor(diffHours / 24);

              if (diffMins < 60) return `${diffMins}m ago`;
              if (diffHours < 24) return `${diffHours}h ago`;
              return `${diffDays}d ago`;
            };

            return (
            <div
              key={activity.id}
              className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                activity.completed
                  ? 'border-green-400 bg-gradient-to-br from-green-50 to-green-100'
                  : activity.status === 'in_progress'
                  ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100'
                  : 'border-gray-300 bg-white hover:border-indigo-400'
              }`}
            >
              {/* Header with title and status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{activity.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      activity.type === 'game'
                        ? 'bg-blue-100 text-blue-700'
                        : activity.type === 'assessment'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {activity.type === 'game' ? 'GAME' : activity.type === 'assessment' ? 'ASSESSMENT' : 'SKILL'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{activity.description}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                <StatusIcon className="h-4 w-4 text-white" />
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusBadge.color}`}>
                  {statusBadge.text}
                </span>
                {activity.lastPlayedAt && (
                  <span className="text-xs text-gray-500 ml-auto">
                    {getLastPlayedText()}
                  </span>
                )}
              </div>

              {/* Activity Metrics - Show for all activities with data */}
              {(activity.sessionsStarted > 0 || activity.completed) && (
                <div className="bg-white/50 rounded-lg p-4 mb-4 border border-gray-200">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {/* Sessions */}
                    {activity.sessionsStarted > 0 && (
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4 text-indigo-500" />
                        <div>
                          <span className="text-gray-600 text-xs">Sessions</span>
                          <p className="font-bold text-gray-900">{activity.sessionsStarted}</p>
                        </div>
                      </div>
                    )}

                    {/* Words Practiced */}
                    {activity.wordsAttempted > 0 && (
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <div>
                          <span className="text-gray-600 text-xs">Words</span>
                          <p className="font-bold text-gray-900">{activity.wordsAttempted}</p>
                        </div>
                      </div>
                    )}

                    {/* Gems Earned */}
                    {activity.gemsEarned > 0 && (
                      <div className="flex items-center gap-2">
                        <Gem className="h-4 w-4 text-purple-500" />
                        <div>
                          <span className="text-gray-600 text-xs">Gems</span>
                          <p className="font-bold text-gray-900">{activity.gemsEarned}</p>
                        </div>
                      </div>
                    )}

                    {/* Time Spent */}
                    {activity.timeSpent > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <div>
                          <span className="text-gray-600 text-xs">Time</span>
                          <p className="font-bold text-gray-900">{Math.round(activity.timeSpent / 60)}m</p>
                        </div>
                      </div>
                    )}

                    {/* Accuracy */}
                    {activity.accuracy > 0 && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <div>
                          <span className="text-gray-600 text-xs">Accuracy</span>
                          <p className="font-bold text-gray-900">{activity.accuracy}%</p>
                        </div>
                      </div>
                    )}

                    {/* Score */}
                    {activity.score > 0 && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <div>
                          <span className="text-gray-600 text-xs">Score</span>
                          <p className="font-bold text-gray-900">{activity.score}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Grammar-specific progress for skills */}
                  {activity.type === 'skill' && activity.sessionsCompleted !== undefined && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">
                        Topics Progress: {activity.sessionsCompleted}/{activity.totalTopics} completed
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${activity.totalTopics > 0 ? (activity.sessionsCompleted / activity.totalTopics) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Progress bars removed - redundant with top-level assignment progress */}

              {/* Action Button or Topic Expansion for Skills */}
              {activity.type === 'skill' && activity.topicIds && activity.topicIds.length > 1 ? (
                <div className="space-y-2">
                  {/* Expand/Collapse Topics Button */}
                  <button
                    onClick={() => toggleSkillExpansion(activity.id, activity.topicIds)}
                    className="w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center transform hover:scale-105 shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
                  >
                    {expandedSkills.has(activity.id) ? (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Hide Topics ({activity.topicIds.length})
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Show All Topics ({activity.topicIds.length})
                      </>
                    )}
                  </button>

                  {/* Expanded Topics List */}
                  {expandedSkills.has(activity.id) && (
                    <div className="mt-3 space-y-2 pl-4 border-l-4 border-purple-300">
                      {skillTopicsData.get(activity.id)?.map((topic, topicIndex) => {
                        // Check if this specific topic has been completed
                        // This would require session data per topic, which we'll implement
                        const topicCompleted = false; // TODO: Check session data per topic
                        
                        return (
                          <div key={topic.id} className="bg-white/70 border border-purple-200 rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full">
                                    {topicIndex + 1}
                                  </span>
                                  <h4 className="font-bold text-gray-900">{topic.title}</h4>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    topic.difficulty_level === 'beginner' ? 'bg-green-100 text-green-700' :
                                    topic.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {topic.difficulty_level}
                                  </span>
                                </div>
                                {topic.description && (
                                  <p className="text-xs text-gray-600 mt-1 ml-8">{topic.description}</p>
                                )}
                              </div>
                            </div>
                            
                            {/* Content Type Buttons for Each Topic */}
                            <div className="flex gap-2 ml-8">
                              {activity.instanceConfig?.contentTypes?.includes('lesson') && (
                                <button
                                  onClick={() => handlePlaySkill({ ...activity, skillType: 'lesson' }, topic.id)}
                                  className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                                >
                                  <BookOpen className="h-3 w-3" />
                                  Lesson
                                </button>
                              )}
                              {activity.instanceConfig?.contentTypes?.includes('practice') && (
                                <button
                                  onClick={() => handlePlaySkill({ ...activity, skillType: 'practice' }, topic.id)}
                                  className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
                                >
                                  <Target className="h-3 w-3" />
                                  Practice
                                </button>
                              )}
                              {activity.instanceConfig?.contentTypes?.includes('quiz') && (
                                <button
                                  onClick={() => handlePlaySkill({ ...activity, skillType: 'quiz' }, topic.id)}
                                  className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors flex items-center justify-center gap-1"
                                >
                                  <Award className="h-3 w-3" />
                                  Quiz
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      }) || (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                          <p className="text-xs text-gray-500 mt-2">Loading topics...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Regular Action Button for single-topic skills, games, and assessments */
                <button
                  onClick={() => {
                    if (activity.type === 'game') {
                      handlePlayGame(activity.id);
                    } else if (activity.type === 'assessment') {
                      handlePlayAssessment(activity);
                    } else if (activity.type === 'skill') {
                      handlePlaySkill(activity);
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center transform hover:scale-105 shadow-lg ${
                    activity.completed
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                      : activity.status === 'in_progress'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                  }`}
                >
                  <Play className="h-5 w-5 mr-2" />
                  {activity.completed
                    ? 'Play Again'
                    : activity.status === 'in_progress'
                      ? 'Continue'
                      : 'Start'}
                </button>
              )}
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}