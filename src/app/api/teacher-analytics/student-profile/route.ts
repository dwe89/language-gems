// API ROUTE: STUDENT PROFILE (TIER 2)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { TimeRange, StudentProfileData } from '@/types/teacherAnalytics';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getDateFilter(timeRange: TimeRange): Date {
  const now = new Date();
  switch (timeRange) {
    case 'last_7_days': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'last_30_days': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'current_term': return new Date(now.getTime() - 84 * 24 * 60 * 60 * 1000);
    case 'all_time': return new Date(0);
    default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

export async function GET(request: NextRequest) {
  console.time('⏱️ [API] student-profile');
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const timeRange = (searchParams.get('timeRange') as TimeRange) || 'last_30_days';

    if (!studentId) {
      return NextResponse.json({ success: false, error: 'studentId is required' }, { status: 400 });
    }

    const dateFilter = getDateFilter(timeRange);

    const { data: profile } = await supabase.from('user_profiles').select('display_name').eq('user_id', studentId).single();
    if (!profile) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });

    // Get game sessions
    const { data: sessions } = await supabase.from('enhanced_game_sessions').select('*').eq('student_id', studentId).gte('created_at', dateFilter.toISOString()).order('created_at', { ascending: false });

    // Also get assignment vocabulary progress as a fallback data source
    const { data: vocabProgress } = await supabase
      .from('assignment_vocabulary_progress')
      .select('assignment_id, seen_count, correct_count, incorrect_count, last_seen_at, created_at')
      .eq('student_id', studentId)
      .gte('created_at', dateFilter.toISOString());

    // Filter out abandoned sessions and memory-game (luck-based)
    const studentSessions = (sessions || []).filter(s =>
      (s.accuracy_percentage > 0 || s.words_attempted > 0) &&
      s.game_type !== 'memory-game'
    );

    // Calculate total activity from vocab progress
    const vocabProgressItems = vocabProgress || [];
    const totalVocabExposures = vocabProgressItems.reduce((sum, v) => sum + (v.seen_count || 0), 0);
    const totalVocabCorrect = vocabProgressItems.reduce((sum, v) => sum + (v.correct_count || 0), 0);
    const lastVocabActivity = vocabProgressItems.length > 0 
      ? new Date(Math.max(...vocabProgressItems.map(v => new Date(v.last_seen_at || v.created_at).getTime())))
      : null;

    // Determine the true last active date (from either game sessions or vocab progress)
    const sessionLastActive = studentSessions.length > 0 ? new Date(studentSessions[0].created_at) : null;
    const lastActive = sessionLastActive && lastVocabActivity 
      ? (sessionLastActive > lastVocabActivity ? sessionLastActive : lastVocabActivity)
      : sessionLastActive || lastVocabActivity;

    // Calculate average score - prefer session data, fallback to vocab progress
    let avgScore = 0;
    let totalSessions = studentSessions.length;
    
    if (studentSessions.length > 0) {
      avgScore = studentSessions.reduce((sum, s) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / studentSessions.length;
    } else if (totalVocabExposures > 0) {
      // Use vocab progress accuracy as fallback
      avgScore = (totalVocabCorrect / totalVocabExposures) * 100;
      // Count unique assignments as "sessions"
      totalSessions = new Set(vocabProgressItems.map(v => v.assignment_id)).size;
    }

    const currentStreak = new Set([
      ...studentSessions.map(s => new Date(s.created_at).toDateString()),
      ...vocabProgressItems.map(v => new Date(v.last_seen_at || v.created_at).toDateString())
    ]).size;

    // Only calculate trend if student has 4+ sessions
    let trendPercentage = 0;
    if (studentSessions.length >= 4) {
      const midpoint = Math.floor(studentSessions.length / 2);
      const firstHalfAvg = studentSessions.slice(0, midpoint).reduce((sum, s) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / (midpoint || 1);
      const secondHalfAvg = studentSessions.slice(midpoint).reduce((sum, s) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / (studentSessions.length - midpoint || 1);
      trendPercentage = firstHalfAvg > 0 ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) : 0;
    }
    const trendDirection: 'up' | 'down' | 'stable' = Math.abs(trendPercentage) < 5 ? 'stable' : trendPercentage > 0 ? 'up' : 'down';

    // Calculate risk score with consideration for vocab progress activity
    const hasAnyActivity = studentSessions.length > 0 || totalVocabExposures > 0;
    const lowAccuracy = avgScore < 60 ? (60 - avgScore) / 60 : 0;
    const lowEngagement = hasAnyActivity ? (totalSessions < 5 ? (5 - totalSessions) / 5 : 0) : 1;
    const daysSinceActive = lastActive ? (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24) : 30;
    const inactivity = daysSinceActive > 7 ? Math.min(daysSinceActive / 30, 1) : 0;
    const decliningTrend = trendDirection === 'down' ? Math.abs(trendPercentage) / 100 : 0;
    const riskScore = lowAccuracy * 0.25 + lowEngagement * 0.25 + decliningTrend * 0.2 + inactivity * 0.2;
    const riskLevel: 'critical' | 'high' | 'medium' | 'low' = riskScore >= 0.7 ? 'critical' : riskScore >= 0.5 ? 'high' : riskScore >= 0.3 ? 'medium' : 'low';

    // Get vocabulary data from vocabulary_gem_collection
    const { data: vocabData } = await supabase
      .from('vocabulary_gem_collection')
      .select(`
        vocabulary_item_id,
        total_encounters,
        correct_encounters,
        incorrect_encounters,
        centralized_vocabulary:vocabulary_item_id (
          word,
          translation,
          category,
          subcategory
        )
      `)
      .eq('student_id', studentId);

    const vocabularyMap = new Map<string, { total: number; correct: number }>();
    const wordMap = new Map<string, { word: string; translation: string; total: number; correct: number }>();

    vocabData?.forEach(v => {
      const vocab = v.centralized_vocabulary as any;
      if (vocab?.category) {
        if (!vocabularyMap.has(vocab.category)) {
          vocabularyMap.set(vocab.category, { total: 0, correct: 0 });
        }
        const catStats = vocabularyMap.get(vocab.category)!;
        catStats.total += v.total_encounters;
        catStats.correct += v.correct_encounters;
      }

      if (vocab?.word) {
        wordMap.set(vocab.word, {
          word: vocab.word,
          translation: vocab.translation,
          total: v.total_encounters,
          correct: v.correct_encounters
        });
      }
    });

    const vocabularyMastery = Array.from(vocabularyMap.entries()).map(([category, stats]) => ({
      category,
      categoryName: category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      masteryPercentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      classAverage: 75,
      wordsLearned: stats.correct,
      totalWords: stats.total
    }));

    const weakSkills = Array.from(vocabularyMap.entries())
      .map(([category, stats]) => ({
        skillName: category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        attempts: stats.total
      }))
      .filter(s => s.accuracy < 60 && s.attempts >= 3)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    const weakWords = Array.from(wordMap.values())
      .filter(w => w.total >= 3 && (w.correct / w.total) < 0.6)
      .sort((a, b) => (a.correct / a.total) - (b.correct / b.total))
      .slice(0, 10)
      .map(w => ({
        word: w.word,
        translation: w.translation,
        attempts: w.total,
        successRate: Math.round((w.correct / w.total) * 100)
      }));

    const engagementLog = studentSessions.slice(0, 10).map(s => ({
      timestamp: new Date(s.created_at),
      activityType: s.game_type || 'Game Session',
      description: `${s.game_type || 'Practice'}`,
      score: Math.round(parseFloat(s.accuracy_percentage) || 0)
    }));

    // If no game sessions, show vocab progress activity
    if (engagementLog.length === 0 && vocabProgressItems.length > 0) {
      // Group vocab progress by day and show most recent activity
      const recentVocabActivity = vocabProgressItems
        .sort((a, b) => new Date(b.last_seen_at || b.created_at).getTime() - new Date(a.last_seen_at || a.created_at).getTime())
        .slice(0, 10)
        .map(v => ({
          timestamp: new Date(v.last_seen_at || v.created_at),
          activityType: 'Vocabulary Practice',
          description: `Assignment practice: ${v.correct_count}/${v.seen_count} correct`,
          score: v.seen_count > 0 ? Math.round((v.correct_count / v.seen_count) * 100) : 0
        }));
      engagementLog.push(...recentVocabActivity);
    }

    const data: StudentProfileData = {
      studentId,
      studentName: profile.display_name,
      averageScore: Math.round(avgScore),
      totalSessions,
      currentStreak,
      lastActive,
      riskScore,
      riskLevel,
      performanceTrend: { direction: trendDirection, percentage: trendPercentage },
      vocabularyMastery,
      grammarMastery: [],
      weakSkills,
      weakWords,
      engagementLog
    };

    console.timeEnd('⏱️ [API] student-profile');
    return NextResponse.json({ success: true, data, timeRange, generatedAt: new Date() });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
