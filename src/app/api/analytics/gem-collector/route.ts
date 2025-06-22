import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsQuery {
  classId?: string;
  assignmentId?: string;
  studentId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // For now, we'll use a test UUID for development
    const user = { id: '00000000-0000-0000-0000-000000000001' };

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query: AnalyticsQuery = {
      classId: searchParams.get('classId') || undefined,
      assignmentId: searchParams.get('assignmentId') || undefined,
      studentId: searchParams.get('studentId') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      limit: parseInt(searchParams.get('limit') || '50')
    };

    // Verify teacher has access to the requested data
    if (query.classId) {
      const { data: classAccess } = await supabase
        .from('classes')
        .select('id')
        .eq('id', query.classId)
        .eq('teacher_id', user.id)
        .single();

      if (!classAccess) {
        return NextResponse.json({ error: 'Access denied to this class' }, { status: 403 });
      }
    }

    if (query.assignmentId) {
      const { data: assignmentAccess } = await supabase
        .from('assignments')
        .select('id, class_id')
        .eq('id', query.assignmentId)
        .eq('created_by', user.id)
        .single();

      if (!assignmentAccess) {
        return NextResponse.json({ error: 'Access denied to this assignment' }, { status: 403 });
      }
    }

    // Build the main query for gem collector sessions
    let sessionsQuery = supabase
      .from('gem_collector_sessions')
      .select(`
        *,
        auth_users:student_id (
          id,
          email,
          user_metadata
        ),
        assignments:assignment_id (
          id,
          title,
          class_id
        )
      `)
      .order('created_at', { ascending: false })
      .limit(query.limit || 50);

    // Apply filters
    if (query.assignmentId) {
      sessionsQuery = sessionsQuery.eq('assignment_id', query.assignmentId);
    }

    if (query.studentId) {
      sessionsQuery = sessionsQuery.eq('student_id', query.studentId);
    }

    if (query.dateFrom) {
      sessionsQuery = sessionsQuery.gte('created_at', query.dateFrom);
    }

    if (query.dateTo) {
      sessionsQuery = sessionsQuery.lte('created_at', query.dateTo);
    }

    // If classId is specified, filter by assignments in that class
    if (query.classId) {
      const { data: classAssignments } = await supabase
        .from('assignments')
        .select('id')
        .eq('class_id', query.classId)
        .eq('type', 'gem-collector');

      if (classAssignments && classAssignments.length > 0) {
        const assignmentIds = classAssignments.map(a => a.id);
        sessionsQuery = sessionsQuery.in('assignment_id', assignmentIds);
      } else {
        // No gem collector assignments in this class
        return NextResponse.json({
          sessions: [],
          analytics: {
            totalSessions: 0,
            averageScore: 0,
            averageAccuracy: 0,
            totalStudents: 0,
            completionRate: 0,
            averageTimeSpent: 0
          },
          studentPerformance: [],
          difficultyBreakdown: {},
          topPerformers: []
        });
      }
    }

    const { data: sessions, error: sessionsError } = await sessionsQuery;

    if (sessionsError) {
      console.error('Sessions fetch error:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch session data' }, { status: 500 });
    }

    // Calculate analytics
    const analytics = calculateAnalytics(sessions || []);

    // Get student performance breakdown
    const studentPerformance = calculateStudentPerformance(sessions || []);

    // Get difficulty level breakdown
    const difficultyBreakdown = calculateDifficultyBreakdown(sessions || []);

    // Get top performers
    const topPerformers = getTopPerformers(sessions || [], 5);

    // Get detailed segment attempts if specific session is requested
    let segmentAttempts = [];
    if (searchParams.get('includeSegments') === 'true' && sessions && sessions.length > 0) {
      const sessionIds = sessions.map(s => s.id);
      const { data: attempts } = await supabase
        .from('gem_collector_segment_attempts')
        .select(`
          *,
          sentence_segments (
            english_segment,
            target_segment,
            grammar_note
          )
        `)
        .in('session_id', sessionIds)
        .order('created_at', { ascending: false })
        .limit(100);

      segmentAttempts = attempts || [];
    }

    return NextResponse.json({
      sessions: sessions || [],
      analytics,
      studentPerformance,
      difficultyBreakdown,
      topPerformers,
      segmentAttempts
    });

  } catch (error) {
    console.error('Error fetching gem collector analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateAnalytics(sessions: any[]) {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      averageAccuracy: 0,
      totalStudents: 0,
      completionRate: 0,
      averageTimeSpent: 0,
      totalSentencesCompleted: 0,
      totalSegmentsAttempted: 0,
      speedBoostUsage: 0
    };
  }

  const totalSessions = sessions.length;
  const uniqueStudents = new Set(sessions.map(s => s.student_id)).size;
  const completedSessions = sessions.filter(s => s.ended_at).length;
  
  const totalScore = sessions.reduce((sum, s) => sum + (s.final_score || 0), 0);
  const totalCorrectSegments = sessions.reduce((sum, s) => sum + (s.correct_segments || 0), 0);
  const totalSegments = sessions.reduce((sum, s) => sum + (s.total_segments || 0), 0);
  const totalSentencesCompleted = sessions.reduce((sum, s) => sum + (s.completed_sentences || 0), 0);
  const totalSpeedBoosts = sessions.reduce((sum, s) => sum + (s.speed_boosts_used || 0), 0);
  
  // Calculate average time spent (in minutes)
  const sessionsWithTime = sessions.filter(s => s.started_at && s.ended_at);
  const totalTimeSpent = sessionsWithTime.reduce((sum, s) => {
    const start = new Date(s.started_at);
    const end = new Date(s.ended_at);
    return sum + (end.getTime() - start.getTime()) / (1000 * 60); // Convert to minutes
  }, 0);

  return {
    totalSessions,
    averageScore: totalSessions > 0 ? Math.round(totalScore / totalSessions) : 0,
    averageAccuracy: totalSegments > 0 ? Math.round((totalCorrectSegments / totalSegments) * 100) : 0,
    totalStudents: uniqueStudents,
    completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
    averageTimeSpent: sessionsWithTime.length > 0 ? Math.round(totalTimeSpent / sessionsWithTime.length) : 0,
    totalSentencesCompleted,
    totalSegmentsAttempted: totalSegments,
    speedBoostUsage: totalSessions > 0 ? Math.round((totalSpeedBoosts / totalSessions) * 100) / 100 : 0
  };
}

function calculateStudentPerformance(sessions: any[]) {
  const studentMap = new Map();

  sessions.forEach(session => {
    const studentId = session.student_id;
    const student = session.auth_users;
    
    if (!studentMap.has(studentId)) {
      studentMap.set(studentId, {
        studentId,
        studentName: student?.user_metadata?.full_name || student?.email || 'Unknown',
        totalSessions: 0,
        totalScore: 0,
        totalCorrectSegments: 0,
        totalSegments: 0,
        completedSessions: 0,
        averageScore: 0,
        accuracy: 0,
        lastPlayed: null
      });
    }

    const studentData = studentMap.get(studentId);
    studentData.totalSessions += 1;
    studentData.totalScore += session.final_score || 0;
    studentData.totalCorrectSegments += session.correct_segments || 0;
    studentData.totalSegments += session.total_segments || 0;
    
    if (session.ended_at) {
      studentData.completedSessions += 1;
    }

    if (!studentData.lastPlayed || new Date(session.created_at) > new Date(studentData.lastPlayed)) {
      studentData.lastPlayed = session.created_at;
    }
  });

  // Calculate averages and sort by performance
  const studentPerformance = Array.from(studentMap.values()).map(student => ({
    ...student,
    averageScore: student.totalSessions > 0 ? Math.round(student.totalScore / student.totalSessions) : 0,
    accuracy: student.totalSegments > 0 ? Math.round((student.totalCorrectSegments / student.totalSegments) * 100) : 0
  })).sort((a, b) => b.averageScore - a.averageScore);

  return studentPerformance;
}

function calculateDifficultyBreakdown(sessions: any[]) {
  const breakdown: Record<string, any> = {};

  sessions.forEach(session => {
    const difficulty = session.difficulty_level || 'unknown';
    
    if (!breakdown[difficulty]) {
      breakdown[difficulty] = {
        totalSessions: 0,
        averageScore: 0,
        averageAccuracy: 0,
        totalScore: 0,
        totalCorrectSegments: 0,
        totalSegments: 0
      };
    }

    const diff = breakdown[difficulty];
    diff.totalSessions += 1;
    diff.totalScore += session.final_score || 0;
    diff.totalCorrectSegments += session.correct_segments || 0;
    diff.totalSegments += session.total_segments || 0;
  });

  // Calculate averages
  Object.keys(breakdown).forEach(difficulty => {
    const diff = breakdown[difficulty];
    diff.averageScore = diff.totalSessions > 0 ? Math.round(diff.totalScore / diff.totalSessions) : 0;
    diff.averageAccuracy = diff.totalSegments > 0 ? Math.round((diff.totalCorrectSegments / diff.totalSegments) * 100) : 0;
  });

  return breakdown;
}

function getTopPerformers(sessions: any[], limit: number) {
  const studentPerformance = calculateStudentPerformance(sessions);
  return studentPerformance.slice(0, limit);
}
