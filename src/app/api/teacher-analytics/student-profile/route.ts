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

    const { data: sessions } = await supabase.from('enhanced_game_sessions').select('*').eq('student_id', studentId).gte('created_at', dateFilter.toISOString()).order('created_at', { ascending: false });
    const studentSessions = sessions || [];

    const avgScore = studentSessions.length > 0 ? studentSessions.reduce((sum, s) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / studentSessions.length : 0;
    const lastActive = studentSessions.length > 0 ? new Date(studentSessions[0].created_at) : null;
    const currentStreak = new Set(studentSessions.map(s => new Date(s.created_at).toDateString())).size;

    const midpoint = Math.floor(studentSessions.length / 2);
    const firstHalfAvg = studentSessions.slice(0, midpoint).reduce((sum, s) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / (midpoint || 1);
    const secondHalfAvg = studentSessions.slice(midpoint).reduce((sum, s) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / (studentSessions.length - midpoint || 1);
    const trendPercentage = firstHalfAvg > 0 ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) : 0;
    const trendDirection: 'up' | 'down' | 'stable' = Math.abs(trendPercentage) < 5 ? 'stable' : trendPercentage > 0 ? 'up' : 'down';

    const lowAccuracy = avgScore < 60 ? (60 - avgScore) / 60 : 0;
    const lowEngagement = studentSessions.length < 5 ? (5 - studentSessions.length) / 5 : 0;
    const daysSinceActive = lastActive ? (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24) : 30;
    const inactivity = daysSinceActive > 7 ? Math.min(daysSinceActive / 30, 1) : 0;
    const decliningTrend = trendDirection === 'down' ? Math.abs(trendPercentage) / 100 : 0;
    const riskScore = lowAccuracy * 0.25 + lowEngagement * 0.25 + decliningTrend * 0.2 + inactivity * 0.2;
    const riskLevel: 'critical' | 'high' | 'medium' | 'low' = riskScore >= 0.7 ? 'critical' : riskScore >= 0.5 ? 'high' : riskScore >= 0.3 ? 'medium' : 'low';

    const vocabularyMap = new Map<string, { total: number; correct: number }>();
    studentSessions.forEach(s => { if (s.category) { if (!vocabularyMap.has(s.category)) vocabularyMap.set(s.category, { total: 0, correct: 0 }); const v = vocabularyMap.get(s.category)!; v.total++; if (parseFloat(s.accuracy_percentage) >= 60) v.correct++; } });

    const vocabularyMastery = Array.from(vocabularyMap.entries()).map(([category, stats]) => ({ category, categoryName: category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), masteryPercentage: Math.round((stats.correct / stats.total) * 100), classAverage: 75, wordsLearned: stats.correct, totalWords: stats.total }));

    const weakSkills = Array.from(vocabularyMap.entries()).map(([category, stats]) => ({ skillName: category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), accuracy: Math.round((stats.correct / stats.total) * 100), attempts: stats.total })).filter(s => s.accuracy < 60).sort((a, b) => a.accuracy - b.accuracy).slice(0, 5);

    const engagementLog = studentSessions.slice(0, 10).map(s => ({ timestamp: new Date(s.created_at), activityType: s.game_type || 'Game Session', description: `${s.category || 'Practice'} - ${s.subcategory || 'General'}`, score: Math.round(parseFloat(s.accuracy_percentage) || 0) }));

    const data: StudentProfileData = { studentId, studentName: profile.display_name, averageScore: Math.round(avgScore), totalSessions: studentSessions.length, currentStreak, lastActive, riskScore, riskLevel, performanceTrend: { direction: trendDirection, percentage: trendPercentage }, vocabularyMastery, grammarMastery: [], weakSkills, weakWords: [], engagementLog };

    console.timeEnd('⏱️ [API] student-profile');
    return NextResponse.json({ success: true, data, timeRange, generatedAt: new Date() });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
